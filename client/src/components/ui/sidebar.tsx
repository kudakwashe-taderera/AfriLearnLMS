import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  BookOpen, 
  Home, 
  User, 
  Book, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users, 
  Bell, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  
  if (!user) return null;
  
  const isAdmin = user.role === "admin";
  const isInstructor = user.role === "instructor";
  const isStudent = user.role === "student";
  
  // Navigation items based on user role
  const mainNavItems = [
    {
      href: isAdmin ? "/admin/dashboard" : 
            isInstructor ? "/instructor/dashboard" : 
            "/student/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      active: location === "/admin/dashboard" || 
              location === "/instructor/dashboard" || 
              location === "/student/dashboard"
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      active: location.startsWith("/messages")
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
      active: location === "/calendar"
    },
  ];
  
  const courseNavItems = [
    {
      href: "/courses",
      label: "All Courses",
      icon: <Book className="h-5 w-5" />,
      active: location === "/courses"
    },
    {
      href: "/assignments",
      label: "Assignments",
      icon: <FileText className="h-5 w-5" />,
      active: location.startsWith("/assignments")
    },
    {
      href: "/discussions",
      label: "Discussions",
      icon: <MessageSquare className="h-5 w-5" />,
      active: location.startsWith("/discussions")
    },
    ...(isStudent ? [
      {
        href: "/grades",
        label: "Grades",
        icon: <GraduationCap className="h-5 w-5" />,
        active: location === "/grades"
      }
    ] : []),
    ...(isInstructor ? [
      {
        href: "/grades",
        label: "Grade Center",
        icon: <GraduationCap className="h-5 w-5" />,
        active: location === "/grades"
      },
      {
        href: "/courses/create",
        label: "Create Course",
        icon: <Plus className="h-5 w-5" />,
        active: location === "/courses/create"
      }
    ] : [])
  ];
  
  const resourceNavItems = [
    {
      href: "/files",
      label: "Files",
      icon: <Folder className="h-5 w-5" />,
      active: location === "/files"
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      active: location === "/notifications"
    },
    ...(isAdmin ? [
      {
        href: "/users",
        label: "User Management",
        icon: <Users className="h-5 w-5" />,
        active: location === "/users"
      }
    ] : [])
  ];
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-full bg-white shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-10 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed lg:sticky top-0 left-0 z-20 h-screen w-64 bg-white border-r border-neutral-200 overflow-y-auto transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo and Title */}
        <div className="flex items-center h-16 px-4 border-b border-neutral-200">
          <BookOpen className="h-8 w-8 text-primary-400 mr-2" />
          <h1 className="text-xl font-bold text-umber-900">AfriLearn</h1>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.profileImage || undefined} />
              <AvatarFallback className="bg-primary-100 text-primary-500">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-umber-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-umber-500 capitalize truncate">
                {user.role}
              </p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs"
              >
                <User className="h-3.5 w-3.5 mr-1" />
                Profile
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs text-status-error border-status-error hover:bg-status-error/10"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-2">
          {/* Main Navigation */}
          <div className="mb-2">
            <p className="px-4 py-1 text-xs uppercase tracking-wider text-umber-500 font-semibold">
              Main
            </p>
            <ul className="space-y-1">
              {mainNavItems.map((item, i) => (
                <li key={i}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <a className={cn(
                      "flex items-center px-4 py-2 text-sm rounded-md",
                      item.active
                        ? "bg-primary-50 text-primary-500 font-medium"
                        : "text-umber-700 hover:bg-neutral-100"
                    )}>
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Courses Section */}
          <div className="mb-2">
            <Collapsible open={coursesOpen} onOpenChange={setCoursesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-1 text-xs uppercase tracking-wider text-umber-500 font-semibold">
                <span>Courses</span>
                {coursesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-1 space-y-1">
                  {courseNavItems.map((item, i) => (
                    <li key={i}>
                      <Link 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <a className={cn(
                          "flex items-center px-4 py-2 text-sm rounded-md",
                          item.active
                            ? "bg-primary-50 text-primary-500 font-medium"
                            : "text-umber-700 hover:bg-neutral-100"
                        )}>
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Resources Section */}
          <div className="mb-2">
            <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-1 text-xs uppercase tracking-wider text-umber-500 font-semibold">
                <span>Resources</span>
                {resourcesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-1 space-y-1">
                  {resourceNavItems.map((item, i) => (
                    <li key={i}>
                      <Link 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <a className={cn(
                          "flex items-center px-4 py-2 text-sm rounded-md",
                          item.active
                            ? "bg-primary-50 text-primary-500 font-medium"
                            : "text-umber-700 hover:bg-neutral-100"
                        )}>
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Help & Support */}
          <div className="mt-4">
            <Link href="/help" onClick={() => setIsOpen(false)}>
              <a className="flex items-center px-4 py-2 text-sm rounded-md text-umber-700 hover:bg-neutral-100">
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91894 12.4272 7.03872C13.1255 7.15851 13.7588 7.52154 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Help & Support
              </a>
            </Link>
          </div>
        </nav>
        
        {/* Version Info */}
        <div className="p-4 absolute bottom-0 left-0 right-0 text-center text-xs text-umber-500">
          AfriLearn v1.0
        </div>
      </div>
    </>
  );
}