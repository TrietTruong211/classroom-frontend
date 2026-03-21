import * as z from "zod";

export const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  emailVerified: z.boolean().optional().default(true),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
  departmentId: z.coerce.number().optional(),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(2, "Subject code must be at least 2 characters"),
  description: z
    .string()
    .min(5, "Subject description must be at least 5 characters"),
  departmentId: z.coerce
    .number({
      required_error: "Department is required",
      invalid_type_error: "Department is required",
    })
    .min(1, "Department is required"),
});

const scheduleSchema = z.object({
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const classSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(255, "Class name must be at most 255 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must be at least 5 characters"),
  subjectId: z.coerce
    .number({
      required_error: "Subject is required",
      invalid_type_error: "Subject is required",
    })
    .min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  capacity: z.coerce
    .number({
      required_error: "Capacity is required",
      invalid_type_error: "Capacity is required",
    })
    .min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "inactive", "archived"]),
  bannerUrl: z.string().optional(),
  bannerCldPubId: z.string().optional(),
  inviteCode: z.string().min(1, "Invite code is required"),
  schedules: z.array(scheduleSchema).min(1, "At least one schedule is required"),
});

export const departmentSchema = z.object({
  code: z.string().min(2, "Department code must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
});

export const enrollmentSchema = z.object({
  classId: z.coerce
    .number({
      required_error: "Class ID is required",
      invalid_type_error: "Class ID is required",
    })
    .min(1, "Class ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
});