import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Search, Bell, MessageSquare, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/ui/sidebar";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userInitials = user ? getInitials(user.firstName, user.lastName) : "U";

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Assignments", href: "/assignments" },
    { name: "Grades", href: "/grades" },
    { name: "Calendar", href: "/calendar" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3 md:py-2">
          <div className="flex items-center space-x-3">
            <button className="md:hidden text-umber-800 focus:outline-none" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary-400 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <h1 className="text-lg font-bold font-sans text-umber-900">AfriLearn</h1>
            </div>
            <div className="hidden md:block relative w-64">
              <input 
                type="text" 
                placeholder="Search courses, assignments..." 
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-umber-600 hover:text-umber-800 focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-400 rounded-full"></span>
            </button>
            <button className="relative text-umber-600 hover:text-umber-800 focus:outline-none">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-400 rounded-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 border-2 border-primary-400">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="bg-secondary-100 text-primary-700">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-umber-800 hidden md:inline">{user?.firstName} {user?.lastName}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-status-error">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 px-4 py-2 flex items-center space-x-4 overflow-x-auto md:hidden">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <button className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full ${
                index === 0 
                  ? "bg-primary-400 text-white" 
                  : "bg-white text-umber-700 border border-neutral-300"
              }`}>
                {item.name}
              </button>
            </Link>
          ))}
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-umber-900 bg-opacity-50 z-20 md:hidden">
          <div className="h-full w-64 bg-white shadow-lg animate-in slide-in-from-left">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
