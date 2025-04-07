import { Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute, RoleProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import UniversityAdminDashboard from "@/pages/university-admin-dashboard";
import MinistryDashboard from "@/pages/ministry-dashboard";
import { Route } from "wouter";

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
      
      {/* EduVerse specific dashboards - new roles */}
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
      <ProtectedRoute path="/courses" component={NotFound} /> {/* Need to create this component */}
      <ProtectedRoute path="/courses/:id" component={NotFound} /> {/* Need to create this component */}
      
      {/* Other protected routes */}
      <ProtectedRoute path="/profile" component={NotFound} /> {/* Need to create this component */}
      <ProtectedRoute path="/applications" component={NotFound} /> {/* Need to create this component */}
      <ProtectedRoute path="/jobs" component={NotFound} /> {/* Need to create this component */}
      <ProtectedRoute path="/career-guidance" component={NotFound} /> {/* Need to create this component */}
      
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
