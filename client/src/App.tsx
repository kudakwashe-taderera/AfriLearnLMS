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
