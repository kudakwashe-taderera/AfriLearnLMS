import { Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CourseDetail from "@/pages/course-detail";
import AssignmentDetail from "@/pages/assignment-detail";
import { Route } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/student/dashboard" component={StudentDashboard} roles={["student"]} />
      <ProtectedRoute path="/instructor/dashboard" component={InstructorDashboard} roles={["instructor"]} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} roles={["admin"]} />
      <ProtectedRoute path="/courses/:id" component={CourseDetail} />
      <ProtectedRoute path="/assignments/:id" component={AssignmentDetail} />
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
