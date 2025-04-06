import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function ProtectedRoute({
  path,
  component: Component,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : user ? (
        <Component />
      ) : (
        <Redirect to="/auth" />
      )}
    </Route>
  );
}

type RoleProtectedRouteProps = ProtectedRouteProps & {
  allowedRoles: Array<"student" | "instructor" | "admin">;
};

export function RoleProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !user ? (
        <Redirect to="/auth" />
      ) : allowedRoles.includes(user.role as "student" | "instructor" | "admin") ? (
        <Component />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. This area is restricted to {allowedRoles.join(", ")} users.
          </p>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      )}
    </Route>
  );
}