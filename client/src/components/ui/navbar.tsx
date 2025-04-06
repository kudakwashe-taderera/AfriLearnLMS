import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bell, 
  Search,
  ChevronDown,
  MessageSquare,
  Calendar,
  User,
  Settings,
  LogOut,
  HelpCircle,
  FileText,
  Bookmark,
  Moon,
  Sun,
  X,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  if (!user) return null;

  // Notifications for demo
  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "A new assignment 'Data Analysis Project' has been posted in Data Science Fundamentals.",
      time: "2 hours ago",
      read: false,
      type: "assignment"
    },
    {
      id: 2,
      title: "Grades Posted",
      message: "Your grades for 'Cultural Analysis Paper' have been posted.",
      time: "Yesterday",
      read: false,
      type: "grade"
    },
    {
      id: 3,
      title: "New Discussion Reply",
      message: "Dr. Kofi Annan replied to your post in 'Cultural Dynamics in West Africa'.",
      time: "2 days ago",
      read: true,
      type: "discussion"
    },
    {
      id: 4,
      title: "Course Announcement",
      message: "Important information about the midterm exam schedule has been posted.",
      time: "3 days ago",
      read: true,
      type: "announcement"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
    // Reset search
    setSearchQuery("");
    setShowSearch(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-4 w-4 text-primary-400" />;
      case "grade":
        return <FileText className="h-4 w-4 text-secondary-400" />;
      case "discussion":
        return <MessageSquare className="h-4 w-4 text-accent-400" />;
      case "announcement":
        return <Bell className="h-4 w-4 text-status-warning" />;
      default:
        return <Bell className="h-4 w-4 text-umber-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-neutral-200 px-4">
      <div className="flex h-full items-center justify-between">
        {/* Left section - Title */}
        <div className="flex items-center">
          <div className="lg:hidden mr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0"
              onClick={() => document.documentElement.classList.toggle('sidebar-open')}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold text-umber-900 hidden md:block">
            AfriLearn
          </h1>
        </div>

        {/* Center section - Search */}
        <div className={cn(
          "absolute inset-0 bg-white z-20 flex items-center px-4 transition-opacity lg:relative lg:inset-auto lg:bg-transparent lg:opacity-100",
          showSearch ? "opacity-100" : "opacity-0 pointer-events-none lg:pointer-events-auto"
        )}>
          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative">
            <Input
              type="search"
              placeholder="Search courses, assignments, or discussions..."
              className="w-full pl-10 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 lg:hidden"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4 text-umber-400" />
            </button>
          </form>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-umber-700"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 text-umber-700 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-status-error"></span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-3 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <Link href="/notifications">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm text-umber-600">No notifications yet</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50",
                          !notification.read && "bg-primary-50"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <span className="text-xs text-umber-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-umber-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-umber-700 md:hidden"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 h-9 pl-1 pr-2 text-umber-700 hover:bg-neutral-100"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.profileImage || undefined} />
                  <AvatarFallback className="bg-primary-100 text-primary-500 text-xs">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user.firstName}
                </span>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.firstName} {user.lastName}</span>
                  <span className="text-xs font-normal text-umber-500">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/messages" className="flex items-center w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/calendar" className="flex items-center w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/grades" className="flex items-center w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Grades</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/bookmarks" className="flex items-center w-full">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Bookmarks</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/help" className="flex items-center w-full">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-status-error" onClick={() => logoutMutation.mutate()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}