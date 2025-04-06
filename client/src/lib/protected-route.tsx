import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  roles = [],
}: {
  path: string;
  component: () => React.JSX.Element;
  roles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      </Route>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check roles if specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-primary-400 mb-4">Access Denied</h1>
          <p className="text-umber-700 mb-6 text-center">
            You don't have permission to access this page. This area is restricted to {roles.join(' or ')} roles.
          </p>
          <a href="/" className="px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
