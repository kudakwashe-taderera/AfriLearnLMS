import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Cog, HelpCircle, ChevronLeft, User, LogOut, Bell, Settings, UserCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  description?: string;
}

export function DashboardHeader({
  heading,
  description,
  className,
  ...props
}: DashboardHeaderProps) {
  const [location] = useLocation();

  const handleBack = () => {
    window.history.back();
  };

  // Don't show back button on main dashboard pages
  const hideBackButton = [
    '/student-dashboard',
    '/instructor-dashboard', 
    '/admin-dashboard',
    '/employer-dashboard',
    '/university-admin-dashboard',
    '/ministry-dashboard'
  ].includes(location);

  return (
    <div className={cn("flex flex-col gap-2 pb-8", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!hideBackButton && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2 h-8 w-8 rounded-full"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                <Avatar className="h-8 w-8" /> {/* Placeholder Avatar */}
              </Button>
            </DropdownMenuTrigger>
            {/* DropdownMenuContent Removed */}
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}