import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, LayoutDashboard, BookMarked, CalendarCheck, Users, BarChartBig, Calendar, MessageSquare, FileText, HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const mainNavItems: NavItem[] = [
    {
      name: "Dashboard",
      href: user?.role === "student" 
        ? "/student/dashboard" 
        : user?.role === "instructor" 
          ? "/instructor/dashboard" 
          : "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookMarked className="h-5 w-5" />,
      roles: ["student", "instructor", "admin"],
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: <CalendarCheck className="h-5 w-5" />,
      roles: ["student", "instructor"],
    },
    {
      name: "Discussions",
      href: "/discussions",
      icon: <Users className="h-5 w-5" />,
      roles: ["student", "instructor"],
    },
    {
      name: "Grades",
      href: "/grades",
      icon: <BarChartBig className="h-5 w-5" />,
      roles: ["student"],
    },
    {
      name: "User Management",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  const toolsNavItems: NavItem[] = [
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Files",
      href: "/files",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  // Filter nav items based on user role
  const filteredMainNavItems = mainNavItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg z-10 h-screen">
      <div className="p-4 border-b border-neutral-300">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-primary-400 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold font-sans text-umber-900">AfriLearn</h1>
        </div>
      </div>
      
      <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="font-sans font-semibold text-xs uppercase text-umber-700 mb-3">Main</h3>
            <ul className="space-y-2">
              {filteredMainNavItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center space-x-3 py-2 px-2 rounded-md ${
                      location === item.href
                        ? "bg-primary-50 text-primary-400"
                        : "text-umber-800 hover:bg-neutral-100"
                    } transition-colors relative`}
                  >
                    {location === item.href && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-primary-400 rounded-r-md"></span>
                    )}
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-xs uppercase text-umber-700 mb-3">Tools</h3>
            <ul className="space-y-2">
              {toolsNavItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center space-x-3 py-2 px-2 rounded-md ${
                      location === item.href
                        ? "bg-primary-50 text-primary-400"
                        : "text-umber-800 hover:bg-neutral-100"
                    } transition-colors relative`}
                  >
                    {location === item.href && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-primary-400 rounded-r-md"></span>
                    )}
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <div className="p-4 bg-primary-50 rounded-lg mb-4">
            <h4 className="font-sans font-semibold text-sm text-primary-500 mb-2">Need help?</h4>
            <p className="text-sm text-umber-800 mb-3">Access learning resources and support</p>
            <Link href="/help" className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-500">
              Visit help center
              <HelpCircle className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Separator className="my-4" />
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-status-error hover:text-status-error/90 py-2 rounded-md transition-colors"
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
