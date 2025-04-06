import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCourseSchema, insertEnrollmentSchema, insertAssignmentSchema, insertSubmissionSchema, insertGradeSchema, insertAnnouncementSchema } from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user has specific role
const hasRole = (roles: string[]) => (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (roles.includes(req.user.role)) {
    return next();
  }
  
  res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });
  
  app.post("/api/courses", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.put("/api/courses/:id", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the instructor or an admin
      if (req.user.role !== "admin" && course.instructorId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this course" });
      }
      
      const updatedCourse = await storage.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });
  
  app.delete("/api/courses/:id", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the instructor or an admin
      if (req.user.role !== "admin" && course.instructorId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this course" });
      }
      
      await storage.deleteCourse(courseId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });
  
  // Get courses by instructor
  app.get("/api/instructor/courses", isAuthenticated, hasRole(["instructor"]), async (req, res) => {
    try {
      const courses = await storage.getCoursesByInstructor(req.user.id);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  // Enrollment routes
  app.post("/api/enrollments", isAuthenticated, hasRole(["student"]), async (req, res) => {
    try {
      const validatedData = insertEnrollmentSchema.parse(req.body);
      
      // Check if course exists
      const course = await storage.getCourse(validatedData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(req.user.id, validatedData.courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      // Create enrollment with current user as student
      const enrollment = await storage.createEnrollment({
        ...validatedData,
        studentId: req.user.id
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });
  
  app.get("/api/student/enrollments", isAuthenticated, hasRole(["student"]), async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByStudent(req.user.id);
      
      // Get course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return { ...enrollment, course };
        })
      );
      
      res.json(enrollmentsWithCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });
  
  app.get("/api/courses/:courseId/enrollments", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the instructor or an admin
      if (req.user.role !== "admin" && course.instructorId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to view enrollments for this course" });
      }
      
      const enrollments = await storage.getEnrollmentsByCourse(courseId);
      
      // Get student details for each enrollment
      const enrollmentsWithStudents = await Promise.all(
        enrollments.map(async (enrollment) => {
          const student = await storage.getUser(enrollment.studentId);
          if (student) {
            const { password, ...studentWithoutPassword } = student;
            return { ...enrollment, student: studentWithoutPassword };
          }
          return enrollment;
        })
      );
      
      res.json(enrollmentsWithStudents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });
  
  app.delete("/api/enrollments/:id", isAuthenticated, async (req, res) => {
    try {
      const enrollmentId = parseInt(req.params.id);
      const enrollment = await storage.getEnrollment(enrollmentId);
      
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      // Check if user is the student, the course instructor, or an admin
      const course = await storage.getCourse(enrollment.courseId);
      
      if (
        req.user.id !== enrollment.studentId && 
        req.user.role !== "admin" && 
        (course && course.instructorId !== req.user.id)
      ) {
        return res.status(403).json({ message: "You don't have permission to delete this enrollment" });
      }
      
      await storage.deleteEnrollment(enrollmentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete enrollment" });
    }
  });
  
  // Assignment routes
  app.post("/api/assignments", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const validatedData = insertAssignmentSchema.parse(req.body);
      
      // Check if course exists
      const course = await storage.getCourse(validatedData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the instructor of the course or an admin
      if (req.user.role !== "admin" && course.instructorId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to create assignments for this course" });
      }
      
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });
  
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const assignments = await storage.getAssignmentsByCourse(courseId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });
  
  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const assignment = await storage.getAssignment(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });
  
  app.put("/api/assignments/:id", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const assignment = await storage.getAssignment(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      // Check if user is the instructor of the course or an admin
      const course = await storage.getCourse(assignment.courseId);
      
      if (req.user.role !== "admin" && (course && course.instructorId !== req.user.id)) {
        return res.status(403).json({ message: "You don't have permission to update this assignment" });
      }
      
      const updatedAssignment = await storage.updateAssignment(assignmentId, req.body);
      res.json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update assignment" });
    }
  });
  
  app.delete("/api/assignments/:id", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const assignment = await storage.getAssignment(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      // Check if user is the instructor of the course or an admin
      const course = await storage.getCourse(assignment.courseId);
      
      if (req.user.role !== "admin" && (course && course.instructorId !== req.user.id)) {
        return res.status(403).json({ message: "You don't have permission to delete this assignment" });
      }
      
      await storage.deleteAssignment(assignmentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete assignment" });
    }
  });
  
  // Submission routes
  app.post("/api/submissions", isAuthenticated, hasRole(["student"]), async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      
      // Check if assignment exists
      const assignment = await storage.getAssignment(validatedData.assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      // Check if student is enrolled in the course
      const enrollment = await storage.getEnrollment(req.user.id, assignment.courseId);
      if (!enrollment) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
      }
      
      // Check if submission already exists
      const existingSubmission = await storage.getSubmission(assignment.id, req.user.id);
      if (existingSubmission) {
        // Update existing submission
        const updatedSubmission = await storage.updateSubmission(existingSubmission.id, {
          ...validatedData,
          submittedAt: new Date(),
          status: 'submitted'
        });
        return res.json(updatedSubmission);
      }
      
      // Create new submission with current user as student
      const submission = await storage.createSubmission({
        ...validatedData,
        studentId: req.user.id
      });
      
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create submission" });
    }
  });
  
  app.get("/api/assignments/:assignmentId/submissions", isAuthenticated, async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const assignment = await storage.getAssignment(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      // Check permissions
      if (req.user.role === "student") {
        // Students can only see their own submissions
        const submission = await storage.getSubmission(assignmentId, req.user.id);
        return res.json(submission ? [submission] : []);
      } else if (req.user.role === "instructor" || req.user.role === "admin") {
        // Instructors can see all submissions for their courses
        const course = await storage.getCourse(assignment.courseId);
        
        if (req.user.role !== "admin" && (course && course.instructorId !== req.user.id)) {
          return res.status(403).json({ message: "You don't have permission to view submissions for this assignment" });
        }
        
        const submissions = await storage.getSubmissionsByAssignment(assignmentId);
        
        // Include student info
        const submissionsWithStudents = await Promise.all(
          submissions.map(async (submission) => {
            const student = await storage.getUser(submission.studentId);
            if (student) {
              const { password, ...studentWithoutPassword } = student;
              return { ...submission, student: studentWithoutPassword };
            }
            return submission;
          })
        );
        
        return res.json(submissionsWithStudents);
      }
      
      res.status(403).json({ message: "Forbidden" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });
  
  // Grade routes
  app.post("/api/grades", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const validatedData = insertGradeSchema.parse(req.body);
      
      // Check if submission exists
      const submission = await storage.getSubmission(validatedData.submissionId);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      // Get assignment and course
      const assignment = await storage.getAssignment(submission.assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      const course = await storage.getCourse(assignment.courseId);
      
      // Check if user is the instructor of the course or an admin
      if (req.user.role !== "admin" && (course && course.instructorId !== req.user.id)) {
        return res.status(403).json({ message: "You don't have permission to grade this submission" });
      }
      
      // Check if grade already exists
      const existingGrade = await storage.getGradeBySubmission(submission.id);
      if (existingGrade) {
        // Update existing grade
        const updatedGrade = await storage.updateGrade(existingGrade.id, {
          ...validatedData,
          gradedBy: req.user.id,
          gradedAt: new Date()
        });
        return res.json(updatedGrade);
      }
      
      // Create new grade
      const grade = await storage.createGrade({
        ...validatedData,
        gradedBy: req.user.id
      });
      
      res.status(201).json(grade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create grade" });
    }
  });
  
  app.get("/api/student/grades", isAuthenticated, hasRole(["student"]), async (req, res) => {
    try {
      const grades = await storage.getGradesByStudent(req.user.id);
      
      // Include submission and assignment info
      const gradesWithDetails = await Promise.all(
        grades.map(async (grade) => {
          const submission = await storage.getSubmission(grade.submissionId);
          if (submission) {
            const assignment = await storage.getAssignment(submission.assignmentId);
            if (assignment) {
              const course = await storage.getCourse(assignment.courseId);
              return { ...grade, submission, assignment, course };
            }
          }
          return grade;
        })
      );
      
      res.json(gradesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });
  
  // Announcement routes
  app.post("/api/announcements", isAuthenticated, hasRole(["instructor", "admin"]), async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      
      // Check if course exists
      const course = await storage.getCourse(validatedData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the instructor of the course or an admin
      if (req.user.role !== "admin" && course.instructorId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to create announcements for this course" });
      }
      
      // Create announcement
      const announcement = await storage.createAnnouncement({
        ...validatedData,
        createdBy: req.user.id
      });
      
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });
  
  app.get("/api/courses/:courseId/announcements", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const announcements = await storage.getAnnouncementsByCourse(courseId);
      
      // Include creator info
      const announcementsWithCreators = await Promise.all(
        announcements.map(async (announcement) => {
          const creator = await storage.getUser(announcement.createdBy);
          if (creator) {
            const { password, ...creatorWithoutPassword } = creator;
            return { ...announcement, creator: creatorWithoutPassword };
          }
          return announcement;
        })
      );
      
      res.json(announcementsWithCreators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });
  
  // User routes (for admin)
  app.get("/api/users", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.put("/api/users/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
