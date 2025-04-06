import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  // Redirect to role-specific dashboard
  if (user) {
    if (user.role === "student") {
      return <Redirect to="/student/dashboard" />;
    } else if (user.role === "instructor") {
      return <Redirect to="/instructor/dashboard" />;
    } else if (user.role === "admin") {
      return <Redirect to="/admin/dashboard" />;
    }
  }

  // Fallback to auth page if no user or role not recognized
  return <Redirect to="/auth" />;
}
