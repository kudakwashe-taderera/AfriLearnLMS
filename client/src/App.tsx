import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute, RoleProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

// Main pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";

// Role-specific dashboards
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import UniversityAdminDashboard from "@/pages/university-admin-dashboard";
import MinistryDashboard from "@/pages/ministry-dashboard";

// Course management
import CoursesPage from "@/pages/courses-page";
import CourseDetail from "@/pages/course-detail";
import CourseCreatePage from "@/pages/course-create-page";

// Assignment management
import AssignmentsPage from "@/pages/assignments-page";
import AssignmentDetail from "@/pages/assignment-detail";
import AssignmentCreatePage from "@/pages/assignment-create-page";

// Discussion forums
import DiscussionsPage from "@/pages/discussions-page";
import DiscussionDetailPage from "@/pages/discussion-detail-page";

// Grade management
import GradesPage from "@/pages/grades-page";

// Calendar and scheduling
import CalendarPage from "@/pages/calendar-page";

// User management
import UserManagementPage from "@/pages/user-management-page";
import ProfilePage from "@/pages/profile-page";

// Messaging
import MessagesPage from "@/pages/messages-page";

// University applications
import ApplicationsPage from "@/pages/applications-page";

// Career development
import JobsPage from "@/pages/jobs-page";
import CareerGuidancePage from "@/pages/career-guidance-page";
import InternshipsPage from "@/pages/internships-page";
import MentorshipPage from "@/pages/mentorship-page";

// Inter-university collaboration
import UniversityCollaborationsPage from "@/pages/university-collaborations-page";

// Education-level specific pages
import OLevelSubjectSelection from "@/pages/olevel-subject-selection";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Role-specific dashboards */}
      <RoleProtectedRoute path="/student-dashboard" component={StudentDashboard} allowedRoles={["student"]} />
      <RoleProtectedRoute path="/instructor-dashboard" component={InstructorDashboard} allowedRoles={["instructor"]} />
      <RoleProtectedRoute path="/admin-dashboard" component={AdminDashboard} allowedRoles={["admin"]} />
      
      {/* AfriLearnHub specific dashboards - new roles */}
      <RoleProtectedRoute 
        path="/employer-dashboard" 
        component={EmployerDashboard}
        allowedRoles={["employer"]} 
      />
      <RoleProtectedRoute 
        path="/university-admin-dashboard" 
        component={UniversityAdminDashboard}
        allowedRoles={["university_admin"]} 
      />
      <RoleProtectedRoute 
        path="/ministry-dashboard" 
        component={MinistryDashboard}
        allowedRoles={["ministry_official"]} 
      />
      
      {/* Course routes */}
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/courses/:id" component={CourseDetail} />
      <ProtectedRoute path="/course-create" component={CourseCreatePage} />
      
      {/* Assignment routes */}
      <ProtectedRoute path="/assignments" component={AssignmentsPage} />
      <ProtectedRoute path="/assignments/:id" component={AssignmentDetail} />
      <ProtectedRoute path="/assignment-create" component={AssignmentCreatePage} />
      
      {/* Discussion routes */}
      <ProtectedRoute path="/discussions" component={DiscussionsPage} />
      <ProtectedRoute path="/discussions/:id" component={DiscussionDetailPage} />
      
      {/* Grade management */}
      <ProtectedRoute path="/grades" component={GradesPage} />
      
      {/* Calendar and scheduling */}
      <ProtectedRoute path="/calendar" component={CalendarPage} />
      
      {/* User management */}
      <ProtectedRoute path="/users" component={UserManagementPage} />
      
      {/* Messaging */}
      <ProtectedRoute path="/messages" component={MessagesPage} />
      
      {/* User profile */}
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* University application system */}
      <ProtectedRoute path="/applications" component={ApplicationsPage} />
      
      {/* Job portal and career services */}
      <ProtectedRoute path="/jobs" component={JobsPage} />
      <ProtectedRoute path="/career-guidance" component={CareerGuidancePage} />
      <ProtectedRoute path="/internships" component={InternshipsPage} />
      <ProtectedRoute path="/mentorship" component={MentorshipPage} />
      
      {/* Inter-university collaboration */}
      <ProtectedRoute path="/university-collaborations" component={UniversityCollaborationsPage} />
      
      {/* Education level specific pages */}
      <RoleProtectedRoute 
        path="/olevel-subject-selection" 
        component={OLevelSubjectSelection} 
        allowedRoles={["student"]} 
      />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
