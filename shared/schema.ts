import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, real, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ======== ENUMS ========
// Enhanced role enum to support additional user types
export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor', 
  'admin', 
  'employer',
  'university_admin',
  'ministry_official'
]);

// Educational level enum
export const educationLevelEnum = pgEnum('education_level', [
  'o_level',
  'a_level',
  'undergraduate',
  'graduate',
  'phd',
  'professional'
]);

// Course level enum
export const courseLevelEnum = pgEnum('course_level', [
  'o_level',
  'a_level',
  'undergraduate',
  'graduate',
  'phd',
  'professional',
  'certification'
]);

// Application status enum
export const applicationStatusEnum = pgEnum('application_status', [
  'submitted',
  'reviewing',
  'accepted',
  'rejected',
  'waitlisted',
  'deferred'
]);

// Job application status enum
export const jobApplicationStatusEnum = pgEnum('job_application_status', [
  'submitted',
  'reviewing',
  'interview_scheduled',
  'offer_extended',
  'accepted',
  'rejected'
]);

// ======== TABLE DECLARATIONS ========

// First, we declare all table variables to avoid circular references
export let users: any;
export let studentProfiles: any;
export let instructorProfiles: any;
export let employers: any;
export let universities: any;
export let courses: any;
export let enrollments: any;
export let courseModules: any;
export let learningResources: any;
export let assignments: any;
export let quizQuestions: any;
export let submissions: any;
export let grades: any;
export let announcements: any;
export let discussionForums: any;
export let discussionPosts: any;
export let academicPrograms: any;
export let programRequirements: any;
export let universityApplications: any;
export let jobs: any;
export let jobApplications: any;
export let careerPathways: any;
export let academicRecords: any;
export let educationalResults: any;
export let careerAssessments: any;
export let systemLogs: any;
export let notifications: any;

// ======== TABLE DEFINITIONS ========

// Base tables with no dependencies
employers = pgTable("employers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  industry: text("industry").notNull(),
  logo: text("logo"),
  description: text("description"),
  website: text("website"),
  location: text("location"),
  country: text("country"),
  foundedYear: integer("founded_year"),
  size: text("size"), // small, medium, large
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
});

universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  acronym: text("acronym"),
  logo: text("logo"),
  description: text("description"),
  website: text("website"),
  location: text("location"),
  country: text("country"),
  foundedYear: integer("founded_year"),
  type: text("type"), // public, private, etc.
  accreditation: text("accreditation"),
  totalStudents: integer("total_students"),
  internationalStudents: integer("international_students"),
  ranking: integer("ranking"),
  acceptanceRate: real("acceptance_rate"),
  costOfAttendance: real("cost_of_attendance"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
});

// Tables that depend on employers or universities
users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default('student'),
  profileImage: text("profile_image"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  bio: text("bio"),
  currentEducationLevel: educationLevelEnum("current_education_level"),
  joinDate: timestamp("join_date").defaultNow(),
  lastActive: timestamp("last_active"),
  verified: boolean("verified").default(false),
  employerId: integer("employer_id").references(() => employers.id),
  universityId: integer("university_id").references(() => universities.id),
  ministryDepartment: text("ministry_department"),
});

// Tables that depend on users
studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  studentId: text("student_id").unique(),
  educationalLevel: educationLevelEnum("educational_level").notNull(),
  institution: text("institution"),
  major: text("major"),
  graduationYear: integer("graduation_year"),
  gpa: real("gpa"),
  credits: integer("credits").default(0),
  academicStanding: text("academic_standing"),
  resumeUrl: text("resume_url"),
  achievements: text("achievements").array(),
  skills: text("skills").array(),
  careerGoals: text("career_goals"),
});

instructorProfiles = pgTable("instructor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  staffId: text("staff_id").unique(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  specialization: text("specialization"),
  qualifications: text("qualifications").array(),
  yearsOfExperience: integer("years_of_experience"),
  officeLocation: text("office_location"),
  officeHours: text("office_hours"),
  publications: text("publications").array(),
  researchInterests: text("research_interests").array(),
});

academicPrograms = pgTable("academic_programs", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").notNull().references(() => universities.id),
  title: text("title").notNull(),
  code: text("code"),
  description: text("description").notNull(),
  level: educationLevelEnum("level").notNull(),
  department: text("department"),
  duration: integer("duration"), // in months
  credits: integer("credits"),
  degreeAwarded: text("degree_awarded"),
  accreditation: text("accreditation"),
  learningOutcomes: text("learning_outcomes").array(),
  careerOpportunities: text("career_opportunities").array(),
  admissionRequirements: text("admission_requirements"),
  tuitionFees: real("tuition_fees"),
  scholarshipsAvailable: boolean("scholarships_available").default(false),
  applicationDeadline: date("application_deadline"),
  startDate: date("start_date"),
  isActive: boolean("is_active").default(true),
  contactEmail: text("contact_email"),
});

courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code"), // Course code like CS101
  description: text("description").notNull(),
  instructorId: integer("instructor_id").notNull().references(() => users.id),
  universityId: integer("university_id").references(() => universities.id),
  department: text("department"),
  level: courseLevelEnum("level").notNull(),
  credits: integer("credits").default(3),
  capacity: integer("capacity"),
  prerequisites: text("prerequisites").array(),
  objectives: text("objectives").array(),
  syllabus: text("syllabus"),
  schedule: text("schedule"), // JSON string with days and times
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  startDate: date("start_date"),
  endDate: date("end_date"),
  enrollmentDeadline: date("enrollment_deadline"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  allowCrossInstitution: boolean("allow_cross_institution").default(false),
});

enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  progress: integer("progress").notNull().default(0),
  lastAccessed: timestamp("last_accessed"),
  grade: text("grade"),
  status: text("status").default("active"), // active, completed, withdrawn
  completionDate: timestamp("completion_date"),
  certificateUrl: text("certificate_url"),
  feedback: text("feedback"),
  homeUniversityId: integer("home_university_id").references(() => universities.id),
});

courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isPublished: boolean("is_published").default(false),
});

learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleId: integer("module_id").references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // video, document, link, etc.
  url: text("url"),
  fileUrl: text("file_url"),
  order: integer("order"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
});

assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleId: integer("module_id").references(() => courseModules.id),
  dueDate: timestamp("due_date").notNull(),
  availableFrom: timestamp("available_from"),
  totalPoints: integer("total_points").notNull().default(100),
  type: text("type").default("assignment"), // assignment, quiz, exam, project
  instructions: text("instructions"),
  resources: text("resources").array(),
  isGroupWork: boolean("is_group_work").default(false),
  allowLateSubmissions: boolean("allow_late_submissions").default(false),
  latePenalty: integer("late_penalty").default(0),
  gradeRubric: text("grade_rubric"),
  createdAt: timestamp("created_at").defaultNow(),
  isPublished: boolean("is_published").default(false),
});

quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  question: text("question").notNull(),
  options: text("options").array(),
  correctAnswer: text("correct_answer"),
  points: integer("points").default(1),
  type: text("type").notNull(), // multiple-choice, short-answer, essay, etc.
  order: integer("order"),
});

submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  content: text("content"),
  fileUrl: text("file_url"),
  answers: jsonb("answers"), // JSON structure for quiz/exam answers
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").notNull().default('not_started'), // not_started, in_progress, submitted, late
  attemptsUsed: integer("attempts_used").default(1),
  timeSpent: integer("time_spent"), // Time spent in minutes
  ipAddress: text("ip_address"),
  isLate: boolean("is_late").default(false),
});

grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull().references(() => submissions.id),
  points: integer("points").notNull(),
  percentage: real("percentage"),
  letterGrade: text("letter_grade"),
  feedback: text("feedback"),
  rubricAssessment: jsonb("rubric_assessment"),
  gradedBy: integer("graded_by").notNull().references(() => users.id),
  gradedAt: timestamp("graded_at").defaultNow(),
  appealStatus: text("appeal_status"),
  appealReason: text("appeal_reason"),
  appealResponse: text("appeal_response"),
});

announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isPinned: boolean("is_pinned").default(false),
  expiresAt: timestamp("expires_at"),
  attachments: text("attachments").array(),
  targetAudience: text("target_audience"), // specific student groups
});

discussionForums = pgTable("discussion_forums", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  category: text("category"),
});

discussionPosts = pgTable("discussion_posts", {
  id: serial("id").primaryKey(),
  forumId: integer("forum_id").notNull().references(() => discussionForums.id),
  parentPostId: integer("parent_post_id").references(() => discussionPosts.id),
  title: text("title"),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  likes: integer("likes").default(0),
  isAnonymous: boolean("is_anonymous").default(false),
  attachments: text("attachments").array(),
  isPinned: boolean("is_pinned").default(false),
});

programRequirements = pgTable("program_requirements", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => academicPrograms.id),
  courseId: integer("course_id").references(() => courses.id),
  category: text("category"), // core, elective, etc.
  credits: integer("credits"),
  minGrade: text("min_grade"),
  isRequired: boolean("is_required").default(true),
  alternatives: integer("alternatives").array(), // IDs of alternative courses
  order: integer("order"),
});

universityApplications = pgTable("university_applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  programId: integer("program_id").notNull().references(() => academicPrograms.id),
  submissionDate: timestamp("submission_date").defaultNow(),
  status: applicationStatusEnum("status").default("submitted"),
  personalStatement: text("personal_statement"),
  transcriptUrl: text("transcript_url"),
  recommendationLetters: text("recommendation_letters").array(),
  otherDocuments: text("other_documents").array(),
  reviewerId: integer("reviewer_id").references(() => users.id),
  reviewDate: timestamp("review_date"),
  reviewNotes: text("review_notes"),
  admissionDecisionDate: date("admission_decision_date"),
  decisionReason: text("decision_reason"),
  acceptanceDeadline: date("acceptance_deadline"),
  hasAccepted: boolean("has_accepted"),
  acceptanceDate: timestamp("acceptance_date"),
});

jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => employers.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  isRemote: boolean("is_remote").default(false),
  type: text("type").notNull(), // full-time, part-time, internship, etc.
  field: text("field").notNull(),
  requiredQualifications: text("required_qualifications").array(),
  preferredQualifications: text("preferred_qualifications").array(),
  responsibilities: text("responsibilities").array(),
  minimumEducation: educationLevelEnum("minimum_education"),
  minimumExperience: integer("minimum_experience"), // in years
  salaryRange: text("salary_range"),
  benefits: text("benefits").array(),
  applicationDeadline: date("application_deadline"),
  startDate: date("start_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  applicantId: integer("applicant_id").notNull().references(() => users.id),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  submissionDate: timestamp("submission_date").defaultNow(),
  status: jobApplicationStatusEnum("status").default("submitted"),
  lastStatusUpdate: timestamp("last_status_update").defaultNow(),
  reviewerId: integer("reviewer_id").references(() => users.id),
  reviewNotes: text("review_notes"),
  interviewDate: timestamp("interview_date"),
  offerDetails: text("offer_details"),
  responseDate: timestamp("response_date"),
  withdrawnReason: text("withdrawn_reason"),
});

careerPathways = pgTable("career_pathways", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  field: text("field").notNull(),
  minimumEducation: educationLevelEnum("minimum_education").notNull(),
  recommendedSubjects: text("recommended_subjects").array(),
  skillsRequired: text("skills_required").array(),
  potentialJobs: text("potential_jobs").array(),
  averageSalary: real("average_salary"),
  jobOutlook: text("job_outlook"), // growing, stable, declining
  educationPathway: text("education_pathway"), // JSON string with educational steps
  resources: text("resources").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

academicRecords = pgTable("academic_records", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  level: educationLevelEnum("level").notNull(),
  institution: text("institution").notNull(),
  program: text("program"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  gpa: real("gpa"),
  finalGrade: text("final_grade"),
  degreeAwarded: text("degree_awarded"),
  transcriptUrl: text("transcript_url"),
  verificationStatus: boolean("verification_status").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
});

educationalResults = pgTable("educational_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  level: educationLevelEnum("level").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  examBoard: text("exam_board"),
  examDate: date("exam_date"),
  certificateUrl: text("certificate_url"),
  verificationStatus: boolean("verification_status").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
});

careerAssessments = pgTable("career_assessments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  assessmentDate: timestamp("assessment_date").defaultNow(),
  interestResults: jsonb("interest_results"),
  skillResults: jsonb("skill_results"),
  personalityResults: jsonb("personality_results"),
  recommendedPathways: integer("recommended_pathways").array(), // IDs from career_pathways
  counselorNotes: text("counselor_notes"),
  counselorId: integer("counselor_id").references(() => users.id),
});

systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  detail: text("detail"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
  category: text("category"),
  severity: text("severity").default("info"),
});

notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // announcement, grade, application, etc.
  relatedId: integer("related_id"), // ID of related entity based on type
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// ======== INSERT SCHEMAS ========
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinDate: true, lastActive: true });
export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({ id: true });
export const insertInstructorProfileSchema = createInsertSchema(instructorProfiles).omit({ id: true });
export const insertUniversitySchema = createInsertSchema(universities).omit({ id: true });
export const insertEmployerSchema = createInsertSchema(employers).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrolledAt: true, progress: true, lastAccessed: true, completionDate: true });
export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({ id: true });
export const insertLearningResourceSchema = createInsertSchema(learningResources).omit({ id: true, createdAt: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, submittedAt: true, status: true, attemptsUsed: true, timeSpent: true, ipAddress: true, isLate: true });
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, gradedAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export const insertDiscussionForumSchema = createInsertSchema(discussionForums).omit({ id: true, createdAt: true });
export const insertDiscussionPostSchema = createInsertSchema(discussionPosts).omit({ id: true, createdAt: true, updatedAt: true, likes: true });
export const insertAcademicProgramSchema = createInsertSchema(academicPrograms).omit({ id: true });
export const insertProgramRequirementSchema = createInsertSchema(programRequirements).omit({ id: true });
export const insertUniversityApplicationSchema = createInsertSchema(universityApplications).omit({ id: true, submissionDate: true, reviewDate: true, acceptanceDate: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({ id: true, submissionDate: true, lastStatusUpdate: true, interviewDate: true, responseDate: true });
export const insertCareerPathwaySchema = createInsertSchema(careerPathways).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAcademicRecordSchema = createInsertSchema(academicRecords).omit({ id: true, verificationStatus: true, verifiedAt: true });
export const insertEducationalResultSchema = createInsertSchema(educationalResults).omit({ id: true, verificationStatus: true });
export const insertCareerAssessmentSchema = createInsertSchema(careerAssessments).omit({ id: true, assessmentDate: true });
export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({ id: true, timestamp: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true, isRead: true });

// ======== TYPES ========
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type InsertInstructorProfile = z.infer<typeof insertInstructorProfileSchema>;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type InsertLearningResource = z.infer<typeof insertLearningResourceSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertDiscussionForum = z.infer<typeof insertDiscussionForumSchema>;
export type InsertDiscussionPost = z.infer<typeof insertDiscussionPostSchema>;
export type InsertAcademicProgram = z.infer<typeof insertAcademicProgramSchema>;
export type InsertProgramRequirement = z.infer<typeof insertProgramRequirementSchema>;
export type InsertUniversityApplication = z.infer<typeof insertUniversityApplicationSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type InsertCareerPathway = z.infer<typeof insertCareerPathwaySchema>;
export type InsertAcademicRecord = z.infer<typeof insertAcademicRecordSchema>;
export type InsertEducationalResult = z.infer<typeof insertEducationalResultSchema>;
export type InsertCareerAssessment = z.infer<typeof insertCareerAssessmentSchema>;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type User = typeof users.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InstructorProfile = typeof instructorProfiles.$inferSelect;
export type University = typeof universities.$inferSelect;
export type Employer = typeof employers.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type CourseModule = typeof courseModules.$inferSelect;
export type LearningResource = typeof learningResources.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type DiscussionForum = typeof discussionForums.$inferSelect;
export type DiscussionPost = typeof discussionPosts.$inferSelect;
export type AcademicProgram = typeof academicPrograms.$inferSelect;
export type ProgramRequirement = typeof programRequirements.$inferSelect;
export type UniversityApplication = typeof universityApplications.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type CareerPathway = typeof careerPathways.$inferSelect;
export type AcademicRecord = typeof academicRecords.$inferSelect;
export type EducationalResult = typeof educationalResults.$inferSelect;
export type CareerAssessment = typeof careerAssessments.$inferSelect;
export type SystemLog = typeof systemLogs.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
