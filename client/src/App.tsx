import { Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ProfilePage from "@/pages/profile-page";
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CourseDetail from "@/pages/course-detail";
import CoursesPage from "@/pages/courses-page";
import CourseCreatePage from "@/pages/course-create-page";
import AssignmentDetail from "@/pages/assignment-detail";
import AssignmentsPage from "@/pages/assignments-page";
import AssignmentCreatePage from "@/pages/assignment-create-page";
import GradesPage from "@/pages/grades-page";
import UserManagementPage from "@/pages/user-management-page";
import CalendarPage from "@/pages/calendar-page";
import MessagesPage from "@/pages/messages-page";
import MessageDetailPage from "@/pages/message-detail-page";
import NotificationsPage from "@/pages/notifications-page";
import DiscussionsPage from "@/pages/discussions-page";
import DiscussionDetailPage from "@/pages/discussion-detail-page";
import FilesPage from "@/pages/files-page";
import HelpPage from "@/pages/help-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import { Route } from "wouter";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/help" component={HelpPage} />
      
      {/* Protected routes - available to all authenticated users */}
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/calendar" component={CalendarPage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/messages/:id" component={MessageDetailPage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      <ProtectedRoute path="/files" component={FilesPage} />
      <ProtectedRoute path="/discussions" component={DiscussionsPage} />
      <ProtectedRoute path="/discussions/:id" component={DiscussionDetailPage} />
      
      {/* Role-specific dashboards */}
      <ProtectedRoute path="/student/dashboard" component={StudentDashboard} roles={["student"]} />
      <ProtectedRoute path="/instructor/dashboard" component={InstructorDashboard} roles={["instructor"]} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} roles={["admin"]} />
      
      {/* Course related routes */}
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/courses/create" component={CourseCreatePage} roles={["instructor", "admin"]} />
      <ProtectedRoute path="/courses/:id" component={CourseDetail} />
      
      {/* Assignment related routes */}
      <ProtectedRoute path="/assignments" component={AssignmentsPage} />
      <ProtectedRoute path="/assignments/create" component={AssignmentCreatePage} roles={["instructor", "admin"]} />
      <ProtectedRoute path="/assignments/:id" component={AssignmentDetail} />
      
      {/* Other protected routes with role restrictions */}
      <ProtectedRoute path="/grades" component={GradesPage} roles={["student", "instructor"]} />
      <ProtectedRoute path="/users" component={UserManagementPage} roles={["admin"]} />
      
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
