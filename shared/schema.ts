import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define role enum
export const userRoleEnum = pgEnum('user_role', ['student', 'instructor', 'admin']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default('student'),
  profileImage: text("profile_image"),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: integer("instructor_id").notNull().references(() => users.id),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enrollment table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  progress: integer("progress").notNull().default(0),
  lastAccessed: timestamp("last_accessed"),
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  dueDate: timestamp("due_date").notNull(),
  totalPoints: integer("total_points").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  content: text("content"),
  fileUrl: text("file_url"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").notNull().default('not_started'), // not_started, in_progress, submitted
});

// Grades table
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull().references(() => submissions.id),
  points: integer("points").notNull(),
  feedback: text("feedback"),
  gradedBy: integer("graded_by").notNull().references(() => users.id),
  gradedAt: timestamp("graded_at").defaultNow(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrolledAt: true, progress: true, lastAccessed: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, submittedAt: true, status: true });
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, gradedAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
