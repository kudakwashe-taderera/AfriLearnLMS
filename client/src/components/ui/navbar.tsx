import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Bell, MessageSquare, Search, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="border-b bg-white shadow-sm z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                placeholder="Search courses, assignments, and more..."
                className="w-full pl-10 h-9"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-umber-600 hover:text-umber-900 lg:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <div className="hidden lg:block relative">
            <Input
              placeholder="Search courses, assignments, and more..."
              className="w-full pl-10 h-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-auto mr-4">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="relative" aria-label="Messages">
              <MessageSquare className="h-5 w-5 text-umber-700" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
            </Button>
          </Link>
          
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-umber-700" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">5</Badge>
            </Button>
          </Link>
          
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-umber-700 bg-transparent hover:bg-neutral-100">Quick Access</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-primary-100 p-4 no-underline outline-none focus:shadow-md"
                          href={user?.role === "student" ? "/student/dashboard" : user?.role === "instructor" ? "/instructor/dashboard" : "/admin/dashboard"}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-primary-900">
                            Your Dashboard
                          </div>
                          <p className="text-sm leading-tight text-primary-700">
                            View your personalized {user?.role} dashboard with important information and quick actions.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100" href="/courses">
                          <div className="text-sm font-medium text-umber-900 mb-1">My Courses</div>
                          <div className="line-clamp-2 text-xs text-umber-500">View all your enrolled courses and materials</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100" href="/assignments">
                          <div className="text-sm font-medium text-umber-900 mb-1">Assignments</div>
                          <div className="line-clamp-2 text-xs text-umber-500">Check your upcoming and past assignments</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100" href="/calendar">
                          <div className="text-sm font-medium text-umber-900 mb-1">Calendar</div>
                          <div className="line-clamp-2 text-xs text-umber-500">View your schedule and important dates</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100" href="/grades">
                          <div className="text-sm font-medium text-umber-900 mb-1">Grades</div>
                          <div className="line-clamp-2 text-xs text-umber-500">Check your academic performance</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
                {user?.profileImage && <AvatarImage src={user.profileImage} />}
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-umber-500">{user?.email}</p>
                <Badge
                  variant="outline"
                  className={
                    user?.role === "admin"
                      ? "mt-1 bg-red-50 text-red-700 border-red-200 w-fit"
                      : user?.role === "instructor"
                      ? "mt-1 bg-blue-50 text-blue-700 border-blue-200 w-fit"
                      : "mt-1 bg-green-50 text-green-700 border-green-200 w-fit"
                  }
                >
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(
                  user?.role === "student"
                  ? "/student/dashboard"
                  : user?.role === "instructor"
                  ? "/instructor/dashboard"
                  : "/admin/dashboard"
                )}>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};