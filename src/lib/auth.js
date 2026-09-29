import jwt from "jsonwebtoken";
import dbConnect from "./db.js";
import User from "./models/user.model.js";
import BlocklistToken from "./models/blocklist.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

/**
 * Helper to check if a user is superadmin
 */
export function isSuperAdminUser(user) {
  if (!user) return false;
  if (user.role === "superadmin") return true;
  if (ADMIN_EMAIL && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  const emailLower = (user.email || "").toLowerCase();
  if (emailLower === "admin@almukhtar.com" || emailLower === "admin@almukhtar.org") {
    return true;
  }
  return false;
}

/**
 * Generates a signed JWT authentication token for a user
 */
export function createAuthToken(user, expiresIn = "7d") {
  const isSuper = isSuperAdminUser(user);
  const effectiveRole = isSuper ? "superadmin" : user.role;
  return jwt.sign(
    { id: user._id.toString(), role: effectiveRole },
    JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Adds a token to the BlocklistToken collection so it can never be reused
 */
export async function blocklistToken(token, userId, expiresAtDate = null) {
  try {
    await dbConnect();
    let expiresAt = expiresAtDate;
    if (!expiresAt) {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.exp) {
          expiresAt = new Date(decoded.exp * 1000);
        }
      } catch {
        // default 7 days if unparseable
      }
    }
    if (!expiresAt) {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    await BlocklistToken.findOneAndUpdate(
      { token },
      { token, user: userId, expiresAt },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.warn("BlocklistToken warning:", err.message);
    return false;
  }
}

/**
 * Extracts and verifies the authenticated user from a Next.js Request or NextRequest.
 * @param {Request} req
 * @returns {Promise<{ id: string, role: string, user: any, token: string } | null>}
 */
export async function getAuthUser(req) {
  try {
    await dbConnect();

    let token = null;

    // 1. Try cookies
    if (req.cookies && typeof req.cookies.get === "function") {
      token = req.cookies.get("token")?.value;
    } else if (req.headers) {
      // Cookie header
      const cookieHeader = req.headers.get?.("cookie") || req.headers.cookie;
      if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) token = match[1];
      }

      // Authorization header fallback
      if (!token) {
        const authHeader = req.headers.get?.("authorization") || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }
    }

    if (!token) {
      return null;
    }

    // Check blocklist
    const blocked = await BlocklistToken.findOne({ token });
    if (blocked) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return null;
    }

    const userDoc = await User.findById(decoded.id);
    if (!userDoc) {
      return null;
    }

    const isSuper = isSuperAdminUser(userDoc);
    const effectiveRole = isSuper ? "superadmin" : userDoc.role;

    return {
      id: userDoc._id.toString(),
      role: effectiveRole,
      user: userDoc,
      token,
    };
  } catch {
    return null;
  }
}

/**
 * Performs atomic token rotation:
 * 1. Verifies existing token and checks blocklist.
 * 2. Immediately adds existing token to BlocklistToken collection.
 * 3. Issues a fresh token for the user.
 */
export async function rotateAuthToken(req) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return null;
  }

  // Blocklist the old token
  await blocklistToken(auth.token, auth.id);

  // Generate new token
  const newToken = createAuthToken(auth.user, "7d");

  return {
    user: auth.user,
    token: newToken,
    role: auth.role,
  };
}
