import { users, courses, enrollments, assignments, submissions, grades, announcements, studentSubjects } from "@shared/schema";
import type { User, Course, Enrollment, Assignment, Submission, Grade, Announcement, StudentSubjects } from "@shared/schema";
import type { InsertUser, InsertCourse, InsertEnrollment, InsertAssignment, InsertSubmission, InsertGrade, InsertAnnouncement, InsertStudentSubjects } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// CRUD interface for application storage
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByInstructor(instructorId: number): Promise<Course[]>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined>;
  updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: number): Promise<boolean>;
  
  // Assignment operations
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAssignmentsByCourse(courseId: number): Promise<Assignment[]>;
  updateAssignment(id: number, assignmentData: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;
  
  // Submission operations
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: number): Promise<Submission[]>;
  getSubmission(assignmentId: number, studentId: number): Promise<Submission | undefined>;
  updateSubmission(id: number, submissionData: Partial<Submission>): Promise<Submission | undefined>;
  
  // Grade operations
  createGrade(grade: InsertGrade): Promise<Grade>;
  getGrade(id: number): Promise<Grade | undefined>;
  getGradeBySubmission(submissionId: number): Promise<Grade | undefined>;
  getGradesByStudent(studentId: number): Promise<Grade[]>;
  updateGrade(id: number, gradeData: Partial<Grade>): Promise<Grade | undefined>;
  
  // Announcement operations
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncementsByCourse(courseId: number): Promise<Announcement[]>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Student Subjects operations
  createStudentSubjects(studentSubjects: InsertStudentSubjects): Promise<StudentSubjects>;
  getStudentSubjects(id: number): Promise<StudentSubjects | undefined>;
  getStudentSubjectsByStudent(studentId: number): Promise<StudentSubjects[]>;
  getActiveStudentSubjectsByStudent(studentId: number): Promise<StudentSubjects | undefined>;
  updateStudentSubjects(id: number, data: Partial<StudentSubjects>): Promise<StudentSubjects | undefined>;
  deleteStudentSubjects(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private assignments: Map<number, Assignment>;
  private submissions: Map<number, Submission>;
  private grades: Map<number, Grade>;
  private announcements: Map<number, Announcement>;
  private studentSubjects: Map<number, StudentSubjects>;
  
  currentUserId: number;
  currentCourseId: number;
  currentEnrollmentId: number;
  currentAssignmentId: number;
  currentSubmissionId: number;
  currentGradeId: number;
  currentAnnouncementId: number;
  currentStudentSubjectsId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.grades = new Map();
    this.announcements = new Map();
    this.studentSubjects = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentEnrollmentId = 1;
    this.currentAssignmentId = 1;
    this.currentSubmissionId = 1;
    this.currentGradeId = 1;
    this.currentAnnouncementId = 1;
    this.currentStudentSubjectsId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course operations
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { 
      ...insertCourse, 
      id, 
      createdAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getCoursesByInstructor(instructorId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.instructorId === instructorId,
    );
  }
  
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const existingCourse = this.courses.get(id);
    if (!existingCourse) return undefined;
    
    const updatedCourse = { ...existingCourse, ...courseData };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  
  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Enrollment operations
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      enrolledAt: new Date(),
      progress: 0,
      lastAccessed: new Date()
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }
  
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }
  
  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
  }
  
  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.courseId === courseId,
    );
  }
  
  async getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId,
    );
  }
  
  async updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const existingEnrollment = this.enrollments.get(id);
    if (!existingEnrollment) return undefined;
    
    const updatedEnrollment = { ...existingEnrollment, ...enrollmentData };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }
  
  async deleteEnrollment(id: number): Promise<boolean> {
    return this.enrollments.delete(id);
  }
  
  // Assignment operations
  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = this.currentAssignmentId++;
    const assignment: Assignment = { 
      ...insertAssignment, 
      id, 
      createdAt: new Date()
    };
    this.assignments.set(id, assignment);
    return assignment;
  }
  
  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }
  
  async getAssignmentsByCourse(courseId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.courseId === courseId,
    );
  }
  
  async updateAssignment(id: number, assignmentData: Partial<Assignment>): Promise<Assignment | undefined> {
    const existingAssignment = this.assignments.get(id);
    if (!existingAssignment) return undefined;
    
    const updatedAssignment = { ...existingAssignment, ...assignmentData };
    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }
  
  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }
  
  // Submission operations
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = { 
      ...insertSubmission, 
      id, 
      submittedAt: new Date(),
      status: 'submitted'
    };
    this.submissions.set(id, submission);
    return submission;
  }
  
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }
  
  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.assignmentId === assignmentId,
    );
  }
  
  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.studentId === studentId,
    );
  }
  
  async getSubmission(assignmentId: number, studentId: number): Promise<Submission | undefined> {
    return Array.from(this.submissions.values()).find(
      (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId,
    );
  }
  
  async updateSubmission(id: number, submissionData: Partial<Submission>): Promise<Submission | undefined> {
    const existingSubmission = this.submissions.get(id);
    if (!existingSubmission) return undefined;
    
    const updatedSubmission = { ...existingSubmission, ...submissionData };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
  
  // Grade operations
  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const id = this.currentGradeId++;
    const grade: Grade = { 
      ...insertGrade, 
      id, 
      gradedAt: new Date()
    };
    this.grades.set(id, grade);
    return grade;
  }
  
  async getGrade(id: number): Promise<Grade | undefined> {
    return this.grades.get(id);
  }
  
  async getGradeBySubmission(submissionId: number): Promise<Grade | undefined> {
    return Array.from(this.grades.values()).find(
      (grade) => grade.submissionId === submissionId,
    );
  }
  
  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    // Get all submissions by the student
    const studentSubmissions = await this.getSubmissionsByStudent(studentId);
    const submissionIds = studentSubmissions.map(submission => submission.id);
    
    // Get all grades for those submissions
    return Array.from(this.grades.values()).filter(
      (grade) => submissionIds.includes(grade.submissionId),
    );
  }
  
  async updateGrade(id: number, gradeData: Partial<Grade>): Promise<Grade | undefined> {
    const existingGrade = this.grades.get(id);
    if (!existingGrade) return undefined;
    
    const updatedGrade = { ...existingGrade, ...gradeData };
    this.grades.set(id, updatedGrade);
    return updatedGrade;
  }
  
  // Announcement operations
  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentAnnouncementId++;
    const announcement: Announcement = { 
      ...insertAnnouncement, 
      id, 
      createdAt: new Date()
    };
    this.announcements.set(id, announcement);
    return announcement;
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async getAnnouncementsByCourse(courseId: number): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).filter(
      (announcement) => announcement.courseId === courseId,
    );
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Student Subjects operations
  async createStudentSubjects(insertStudentSubjects: InsertStudentSubjects): Promise<StudentSubjects> {
    const id = this.currentStudentSubjectsId++;
    const studentSubjects: StudentSubjects = { 
      ...insertStudentSubjects, 
      id, 
      registeredAt: new Date(),
      updatedAt: new Date()
    };
    this.studentSubjects.set(id, studentSubjects);
    return studentSubjects;
  }
  
  async getStudentSubjects(id: number): Promise<StudentSubjects | undefined> {
    return this.studentSubjects.get(id);
  }
  
  async getStudentSubjectsByStudent(studentId: number): Promise<StudentSubjects[]> {
    return Array.from(this.studentSubjects.values()).filter(
      (subjects) => subjects.studentId === studentId
    );
  }
  
  async getActiveStudentSubjectsByStudent(studentId: number): Promise<StudentSubjects | undefined> {
    return Array.from(this.studentSubjects.values()).find(
      (subjects) => subjects.studentId === studentId && subjects.isActive === true
    );
  }
  
  async updateStudentSubjects(id: number, data: Partial<StudentSubjects>): Promise<StudentSubjects | undefined> {
    const existingSubjects = this.studentSubjects.get(id);
    if (!existingSubjects) return undefined;
    
    const updatedSubjects = { 
      ...existingSubjects, 
      ...data,
      updatedAt: new Date()
    };
    this.studentSubjects.set(id, updatedSubjects);
    return updatedSubjects;
  }
  
  async deleteStudentSubjects(id: number): Promise<boolean> {
    return this.studentSubjects.delete(id);
  }
}

export const storage = new MemStorage();
