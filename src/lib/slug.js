/**
 * Helper to generate clean, human-readable unique slugs.
 * Removes ugly timestamps like Date.now() and handles collisions with -2, -3, etc.
 * 
 * @param {import("mongoose").Model} Model - Mongoose model to check uniqueness against
 * @param {string} title - Title string to slugify
 * @param {string|null} currentId - Document ID to exclude during collision checks (for updates)
 * @returns {Promise<string>}
 */
export async function generateUniqueSlug(Model, title, currentId = null) {
  if (!title) return "item";

  // Clean title into base slug (supports English, Arabic, and other Unicode characters)
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // match unicode letters, numbers, spaces, hyphens
    .replace(/[\s_-]+/g, "-")          // replace whitespace & underscores with single hyphen
    .replace(/^-+|-+$/g, "");          // trim leading & trailing hyphens

  if (!baseSlug) {
    baseSlug = "item";
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }

    const existing = await Model.findOne(query).select("_id").lean();
    if (!existing) {
      break;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}
