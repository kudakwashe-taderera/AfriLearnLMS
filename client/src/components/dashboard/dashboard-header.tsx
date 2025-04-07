import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Cog, HelpCircle } from "lucide-react";

interface DashboardHeaderProps {
  heading: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  heading,
  description,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 pb-8", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Cog className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}