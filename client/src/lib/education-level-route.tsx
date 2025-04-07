import { ReactNode } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type EducationLevelRouteProps = {
  path: string;
  component: React.ComponentType<any>;
  educationLevel: string | string[];
};

export function EducationLevelRoute({ path, component: Component, educationLevel }: EducationLevelRouteProps) {
  const { user, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          navigate("/auth");
          return null;
        }

        // Check if user has the right education level
        const allowedLevels = Array.isArray(educationLevel) ? educationLevel : [educationLevel];
        
        if (user.role === "student" && user.currentEducationLevel && allowedLevels.includes(user.currentEducationLevel)) {
          return <Component {...params} />;
        } else if (user.role === "student") {
          // If student doesn't have the right education level, redirect to career guidance
          navigate("/career-guidance");
          return null;
        } else {
          // Non-students shouldn't access education level specific routes
          navigate("/");
          return null;
        }
      }}
    </Route>
  );
}