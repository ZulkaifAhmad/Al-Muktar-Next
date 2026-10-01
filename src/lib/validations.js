import { z } from "zod";

// ==========================================
// COURSE SCHEMAS
// ==========================================
export const courseCreateSchema = z.object({
  title: z.string().trim().min(2, "Course title must be at least 2 characters"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Select a valid academic level" }),
  }),
  duration: z.string().trim().min(1, "Duration is required"),
  description: z.string().trim().optional().default(""),
  image: z.string().optional().nullable(),
});

export const courseUpdateSchema = courseCreateSchema.partial();

// ==========================================
// TEACHER SCHEMAS
// ==========================================
export const teacherCreateSchema = z.object({
  name: z.string().trim().min(2, "Teacher name is required"),
  role: z.string().trim().min(2, "Role/Designation is required"),
  department: z.string().trim().min(2, "Department is required"),
  experienceYears: z.string().trim().optional().default("5+ Years"),
  studentsMentored: z.string().trim().optional().default("200+"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().optional().default(""),
  image: z.string().optional().default(""),
  quote: z.string().trim().optional().default(""),
  bio: z.string().trim().optional().default(""),
  specializations: z.union([z.array(z.string()), z.string()]).optional().default([]),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  order: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional().default(0),
});

export const teacherUpdateSchema = teacherCreateSchema.partial();

// ==========================================
// STUDENT SCHEMAS
// ==========================================
export const studentCreateSchema = z.object({
  name: z.string().trim().min(2, "Student name is required"),
  program: z.string().trim().min(2, "Program is required"),
  batchYear: z.string().trim().optional().default("Class of 2024"),
  category: z.string().trim().optional().default("General"),
  currentRole: z.string().trim().min(2, "Current role/position is required"),
  currentOrganization: z.string().trim().min(2, "Organization is required"),
  location: z.string().trim().optional().default("Pakistan"),
  image: z.string().optional().default(""),
  message: z.string().trim().optional().default(""),
  keyAchievement: z.string().trim().optional().default(""),
  status: z.enum(["active", "inactive", "featured"]).optional().default("active"),
  order: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional().default(0),
});

export const studentUpdateSchema = studentCreateSchema.partial();

// ==========================================
// BLOG SCHEMAS
// ==========================================
export const blogCreateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  subject: z.string().trim().min(2, "Subject/Category is required"),
  description: z.string().trim().optional().default(""),
  content: z.string().trim().min(10, "Article content must be at least 10 characters"),
  images: z.array(z.string()).optional().default([]),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export const blogUpdateSchema = blogCreateSchema.partial();

// ==========================================
// NOTIFICATION SCHEMAS
// ==========================================
export const notificationCreateSchema = z.object({
  title: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  image: z.string().optional().default(""),
  badge: z.string().trim().optional().default("Announcement"),
  buttonText: z.string().trim().optional().default(""),
  buttonUrl: z.string().trim().optional().default(""),
  isActive: z.boolean().optional().default(true),
}).refine(
  (data) => Boolean(data.title || data.description || data.image),
  { message: "Please provide at least a title, description, or image." }
);

export const notificationUpdateSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image: z.string().optional(),
  badge: z.string().trim().optional(),
  buttonText: z.string().trim().optional(),
  buttonUrl: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// APPLICATION SCHEMAS
// ==========================================
export const applicationCreateSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  fatherName: z.string().trim().min(2, "Father's name is required"),
  whatsapp: z.string().trim().min(7, "Valid WhatsApp number is required"),
  mobile: z.string().trim().min(7, "Valid Mobile number is required"),
  course: z.string().trim().min(1, "Course selection is required"),
  shift: z.enum(["morning", "evening"], {
    errorMap: () => ({ message: "Select morning or evening shift" }),
  }),
  qualification: z.string().trim().min(1, "Qualification is required"),
  age: z.coerce.number().min(4, "Age must be at least 4").max(70, "Age must be 70 or below"),
  cnic: z.string().trim().min(5, "CNIC / B-Form is required"),
  address: z.string().trim().min(5, "Address is required"),
});

// ==========================================
// AUTH & USER SCHEMAS
// ==========================================
export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().trim().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = signupSchema;

export const resendOtpSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  otp: z.string().trim().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  otp: z.string().trim().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// ==========================================
// RESULT SCHEMAS (Course PDF Results)
// ==========================================
export const resultCreateSchema = z.object({
  courseName: z.string().trim().min(2, "Course name is required"),
  title: z.string().trim().optional().default("Official Examination Result"),
  session: z.string().trim().optional().default("2025-2026"),
  pdfUrl: z.string().trim().min(10, "Result PDF file is required"),
  pdfName: z.string().trim().optional().default("Result_Document.pdf"),
  pdfSize: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default("Official certified examination result document."),
  isReleased: z.boolean().optional().default(true),
  holdReason: z.string().trim().optional().default(""),
});

export const resultUpdateSchema = resultCreateSchema.partial();

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().optional().default(""),
  subject: z.string().trim().min(2, "Subject is required"),
  message: z.string().trim().min(5, "Message must be at least 5 characters"),
});

/**
 * Utility helper to safely validate data with a Zod schema
 * Returns { success: true, data } or { success: false, error: string }
 */
export function validatePayload(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Validation failed";
    return { success: false, error: firstError, errors: result.error.flatten() };
  }
  return { success: true, data: result.data };
}
