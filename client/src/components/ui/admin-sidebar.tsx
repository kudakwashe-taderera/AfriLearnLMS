import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LucideIcon,
  Home,
  Users,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  UserCog,
  Shield,
  Folder,
  HelpCircle,
  BookOpen,
  School,
  Building2,
  Briefcase,
  FileText,
  ShieldCheck,
  Server,
  Globe,
  AlertCircle,
  Database
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
  roles?: string[];
  children?: Omit<SidebarItem, 'children'>[];
}

const adminSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/users",
    children: [
      {
        title: "All Users",
        icon: Users,
        href: "/users",
      },
      {
        title: "Students",
        icon: GraduationCap,
        href: "/users?role=student",
      },
      {
        title: "Instructors",
        icon: BookOpen,
        href: "/users?role=instructor",
      },
      {
        title: "Admins",
        icon: Shield,
        href: "/users?role=admin",
      },
    ],
  },
  {
    title: "University Management",
    icon: School,
    href: "/universities",
    children: [
      {
        title: "All Universities",
        icon: Building2,
        href: "/universities",
      },
      {
        title: "Departments",
        icon: Building2,
        href: "/departments",
      },
      {
        title: "Programs",
        icon: BookOpen,
        href: "/programs",
      },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    href: "/content",
    children: [
      {
        title: "Courses",
        icon: BookOpen,
        href: "/courses",
      },
      {
        title: "Resources",
        icon: Folder,
        href: "/resources",
      },
    ],
  },
  {
    title: "Career Portal",
    icon: Briefcase,
    href: "/career-portal",
    children: [
      {
        title: "Employers",
        icon: Building2,
        href: "/employers",
      },
      {
        title: "Jobs",
        icon: Briefcase,
        href: "/jobs",
      },
      {
        title: "Internships",
        icon: Briefcase,
        href: "/internships",
      },
    ],
  },
  {
    title: "System",
    icon: Server,
    href: "/system",
    children: [
      {
        title: "Logs",
        icon: FileText,
        href: "/system/logs",
      },
      {
        title: "Performance",
        icon: BarChart3,
        href: "/system/performance",
      },
      {
        title: "Security",
        icon: ShieldCheck,
        href: "/system/security",
      },
      {
        title: "Database",
        icon: Database,
        href: "/system/database",
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    href: "/help",
  },
];

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  isExpanded?: boolean;
  toggleExpand?: () => void;
  depth?: number;
  onClick?: () => void;
}

const SidebarItemComponent = ({ 
  item,
  isActive,
  isExpanded, 
  toggleExpand,
  depth = 0,
  onClick
}: SidebarItemProps) => {
  const hasChildren = item.children && item.children.length > 0;
  const [location] = useLocation();
  
  const isChildActive = hasChildren && 
    item.children?.some(child => location === child.href);
  
  return (
    <div>
      {hasChildren ? (
        <Collapsible
          defaultOpen={isChildActive}
          className="w-full"
        >
          <CollapsibleTrigger
            asChild
          >
            <button
              className={cn(
                "flex items-center w-full py-2 px-3 rounded-md text-sm mb-1",
                (isActive || isChildActive) ? "bg-primary-100 text-primary-700" : "text-umber-600 hover:bg-neutral-100"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">{item.title}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-5 border-l border-neutral-200 pl-2 mt-1">
            {item.children?.map((child, idx) => (
              <div 
                key={idx} 
                onClick={onClick}
                className={cn(
                  "flex items-center py-2 px-3 text-sm rounded-md mb-1 cursor-pointer",
                  location === child.href ? "bg-primary-100 text-primary-700" : "text-umber-600 hover:bg-neutral-100"
                )}
              >
                <Link href={child.href} className="flex items-center w-full">
                  <child.icon className="h-4 w-4 mr-2" />
                  <span>{child.title}</span>
                </Link>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div 
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm mb-1 cursor-pointer",
            isActive ? "bg-primary-100 text-primary-700" : "text-umber-600 hover:bg-neutral-100"
          )}
          onClick={onClick}
        >
          <Link href={item.href} className="flex items-center w-full">
            <item.icon className="h-4 w-4 mr-2" />
            <span>{item.title}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  // Close the mobile sidebar when changing location
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location, isMobile]);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-umber-700" />
        ) : (
          <Menu className="h-6 w-6 text-umber-700" />
        )}
      </button>
      
      {/* Sidebar Backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white w-64 flex-shrink-0 border-r border-neutral-200 h-screen flex flex-col transition-all duration-300 z-40",
          isMobile && (isOpen ? "fixed left-0 top-0" : "fixed -left-64 top-0")
        )}
      >
        {/* Logo and Application Name */}
        <div className="p-5 border-b border-neutral-200 flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-500 rounded-md flex items-center justify-center">
              <Shield className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-umber-900">Admin Portal</h1>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1 mb-6">
            {adminSidebarItems.map((item, idx) => (
              <SidebarItemComponent 
                key={idx}
                item={item}
                isActive={location === item.href}
                onClick={() => isMobile && setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
              {user?.profileImage && <AvatarImage src={user.profileImage} />}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-umber-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-umber-500 truncate capitalize">
                {user?.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};