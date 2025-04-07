import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn("flex-1 w-full overflow-hidden", className)}>
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}