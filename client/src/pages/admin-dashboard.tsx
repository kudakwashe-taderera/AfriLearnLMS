import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ChevronRight, 
  BookOpen, 
  Users, 
  FileText, 
  LucideIcon,
  GraduationCap,
  BarChart3,
  UserCog,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  School,
  ShieldCheck,
  AlertCircle,
  Database,
  Server,
  HardDrive,
  Clock,
  Globe,
  Activity,
  Zap,
  Shield,
  Archive,
  FileImage
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type for the stats card component
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  iconColor?: string;
  iconBgColor?: string;
  action?: {
    label: string;
    href: string;
  };
}

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  change,
  changeLabel,
  iconColor = "text-primary-500",
  iconBgColor = "bg-primary-50",
  action,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(change)}% {changeLabel || ''}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-umber-600">{title}</p>
          <p className="text-2xl font-bold text-umber-900">{value}</p>
          {description && <p className="text-xs text-umber-500">{description}</p>}
        </div>
        {action && (
          <div className="mt-4">
            <Link href={action.href}>
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs h-8">
                {action.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch system stats
  const { 
    data: systemStats = {}, 
    isLoading: systemStatsLoading 
  } = useQuery({
    queryKey: ["/api/admin/system-stats"],
    enabled: !!user && user.role === "admin",
  });
  
  // Fetch users
  const { 
    data: users = [], 
    isLoading: usersLoading 
  } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });
  
  // Fetch courses
  const { 
    data: courses = [], 
    isLoading: coursesLoading 
  } = useQuery({
    queryKey: ["/api/admin/courses"],
    enabled: !!user && user.role === "admin",
  });
  
  // Fetch system logs
  const { 
    data: systemLogs = [], 
    isLoading: systemLogsLoading 
  } = useQuery({
    queryKey: ["/api/admin/system-logs"],
    enabled: !!user && user.role === "admin" && activeTab === "system",
  });
  
  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user: any) => user.isActive).length;
  const studentCount = users.filter((user: any) => user.role === "student").length;
  const instructorCount = users.filter((user: any) => user.role === "instructor").length;
  
  // Calculate course statistics
  const totalCourses = courses.length;
  const activeCourses = courses.filter((course: any) => !course.isArchived).length;
  const archivedCourses = courses.filter((course: any) => course.isArchived).length;
  
  // System health stats (would normally come from systemStats)
  const serverUptime = "99.98%";
  const diskUsage = 42;
  const serverLoad = 24;
  const dbConnections = 18;
  
  // Recent activities (would normally come from systemStats)
  const recentActivities = [
    { 
      id: 1, 
      type: "login", 
      user: { firstName: "Kudash", lastName: "Twakkie", role: "student" },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      details: "Logged in from 192.168.1.1"
    },
    { 
      id: 2, 
      type: "course_creation", 
      user: { firstName: "Sarah", lastName: "Johnson", role: "instructor" },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: "Created new course: Advanced Mathematics"
    },
    { 
      id: 3, 
      type: "enrollment", 
      user: { firstName: "Arther", lastName: "Muchena", role: "student" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      details: "Enrolled in course: Introduction to African Literature"
    },
    { 
      id: 4, 
      type: "assignment_submission", 
      user: { firstName: "Emma", lastName: "Super", role: "Ngoni" },
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      details: "Submitted assignment: Research Paper in African History"
    },
    { 
      id: 5, 
      type: "user_creation", 
      user: { firstName: "Admin", lastName: "System", role: "admin" },
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      details: "Created new user: Noel Madziwa (instructor)"
    }
  ];
  
  // System logs
  const logTypes = {
    info: { color: "text-blue-500", bg: "bg-blue-50" },
    warn: { color: "text-amber-500", bg: "bg-amber-50" },
    error: { color: "text-red-500", bg: "bg-red-50" },
    success: { color: "text-green-500", bg: "bg-green-50" },
  };
  
  // Convert time to relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day ago`;
  };
  
  // Render loading state
  if (systemStatsLoading || usersLoading || coursesLoading || (activeTab === "system" && systemLogsLoading)) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                <p className="text-umber-600">Loading admin dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-umber-900 mb-1">
              Admin Dashboard
            </h1>
            <p className="text-umber-600">
              Manage users, courses, and monitor system performance
            </p>
          </div>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4 bg-transparent border-b w-full justify-start rounded-none space-x-8 p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Users & Permissions
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Content Management
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                System
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    change={5.2}
                    action={{ label: "Manage users", href: "/admin/users" }}
                  />
                  <StatsCard
                    title="Active Students"
                    value={studentCount}
                    icon={GraduationCap}
                    change={8.7}
                    action={{ label: "View students", href: "/admin/users?role=student" }}
                  />
                  <StatsCard
                    title="Active Instructors"
                    value={instructorCount}
                    icon={BookOpen}
                    change={3.1}
                    action={{ label: "View instructors", href: "/admin/users?role=instructor" }}
                  />
                  <StatsCard
                    title="Total Courses"
                    value={totalCourses}
                    icon={School}
                    change={12.5}
                    action={{ label: "Manage courses", href: "/admin/courses" }}
                  />
                </div>
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">Recent Platform Activity</CardTitle>
                        <CardDescription>Latest actions across the platform</CardDescription>
                      </div>
                      <Link href="/admin/activity">
                        <Button variant="outline" size="sm" className="h-8">
                          View All Activities
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivities.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${activity.type === 'login' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                      activity.type === 'course_creation' ? 'bg-green-50 text-green-600 border-green-100' : 
                                      activity.type === 'enrollment' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                      activity.type === 'assignment_submission' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                      'bg-primary-50 text-primary-600 border-primary-100'}
                                  `}
                                >
                                  {activity.type.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className={`
                                      ${activity.user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                        activity.user.role === 'instructor' ? 'bg-blue-100 text-blue-600' : 
                                        'bg-green-100 text-green-600'}
                                    `}>
                                      {activity.user.firstName[0]}{activity.user.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-umber-900">
                                      {activity.user.firstName} {activity.user.lastName}
                                    </p>
                                    <p className="text-xs text-umber-500 capitalize">
                                      {activity.user.role}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-umber-600">
                                {activity.details}
                              </TableCell>
                              <TableCell className="text-sm text-umber-500">
                                {getRelativeTime(activity.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Stats & System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Platform Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-umber-600">Active Users Today</span>
                            <span className="font-medium text-umber-900">121</span>
                          </div>
                          <Progress value={121 / 2} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-umber-600">Content Uploaded</span>
                            <span className="font-medium text-umber-900">28 GB</span>
                          </div>
                          <Progress value={28} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-umber-600">Course Completion</span>
                            <span className="font-medium text-umber-900">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-umber-600">Active Discussions</span>
                            <span className="font-medium text-umber-900">42</span>
                          </div>
                          <Progress value={42} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-primary-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-umber-600">Total Data Processed</p>
                            <Badge variant="outline" className="bg-white text-primary-600 border-primary-100">
                              +24%
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-umber-900">1.2 TB</p>
                        </div>
                        <div className="p-4 bg-primary-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-umber-600">Peak Users Online</p>
                            <Badge variant="outline" className="bg-white text-primary-600 border-primary-100">
                              +18%
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-umber-900">342</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Link href="/admin/analytics">
                          <Button variant="outline" className="w-full gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Complete Analytics
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* System Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Server Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-umber-600">Server Uptime</span>
                            </div>
                            <span className="font-medium text-umber-900">{serverUptime}</span>
                          </div>
                          <Progress value={99.98} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${diskUsage > 80 ? 'bg-red-500' : diskUsage > 60 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              <span className="text-umber-600">Disk Usage</span>
                            </div>
                            <span className="font-medium text-umber-900">{diskUsage}%</span>
                          </div>
                          <Progress 
                            value={diskUsage} 
                            className={`h-2 ${diskUsage > 80 ? 'bg-red-100' : diskUsage > 60 ? 'bg-amber-100' : 'bg-green-100'}`} 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${serverLoad > 80 ? 'bg-red-500' : serverLoad > 60 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              <span className="text-umber-600">Server Load</span>
                            </div>
                            <span className="font-medium text-umber-900">{serverLoad}%</span>
                          </div>
                          <Progress 
                            value={serverLoad} 
                            className={`h-2 ${serverLoad > 80 ? 'bg-red-100' : serverLoad > 60 ? 'bg-amber-100' : 'bg-green-100'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${dbConnections > 80 ? 'bg-red-500' : dbConnections > 60 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              <span className="text-umber-600">DB Connections</span>
                            </div>
                            <span className="font-medium text-umber-900">{dbConnections}</span>
                          </div>
                          <Progress 
                            value={dbConnections * 2} 
                            className={`h-2 ${dbConnections > 40 ? 'bg-red-100' : dbConnections > 30 ? 'bg-amber-100' : 'bg-green-100'}`}
                          />
                        </div>
                      </div>
                      
                      {/* Recent System Events */}
                      <div>
                        <h4 className="text-sm font-medium text-umber-800 mb-3">Recent System Events</h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          <div className="flex items-start gap-3 p-2 rounded-md bg-blue-50">
                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <Server className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-umber-900">
                                Database backup completed
                              </p>
                              <p className="text-xs text-umber-500">
                                Today, 05:30 AM • Backup size: 1.2GB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 rounded-md bg-amber-50">
                            <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                              <HardDrive className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-umber-900">
                                Storage space warning
                              </p>
                              <p className="text-xs text-umber-500">
                                Yesterday, 11:45 PM • Media storage at 75% capacity
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 rounded-md bg-green-50">
                            <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <ShieldCheck className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-umber-900">
                                Security scan completed
                              </p>
                              <p className="text-xs text-umber-500">
                                Yesterday, 2:15 PM • No vulnerabilities detected
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Link href="/admin/system">
                          <Button variant="outline" className="w-full gap-2">
                            <Settings className="h-4 w-4" />
                            System Settings & Maintenance
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Users & Permissions Tab */}
            <TabsContent value="users" className="pt-2">
              <div className="space-y-6">
                {/* User Management Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-umber-900">User Management</h2>
                    <p className="text-umber-600">Manage all platform users and their permissions</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/users/new">
                      <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                        <UserCog className="h-4 w-4" />
                        Add New User
                      </Button>
                    </Link>
                    <Link href="/admin/roles">
                      <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Manage Roles
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* User Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                          <Users className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-umber-600">Students</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-umber-900">{studentCount}</p>
                            <p className="text-xs text-green-600">+15 this week</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-umber-600">Instructors</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-umber-900">{instructorCount}</p>
                            <p className="text-xs text-blue-600">+3 this week</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm text-umber-600">Admins</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-umber-900">
                              {users.filter((user: any) => user.role === "admin").length}
                            </p>
                            <p className="text-xs text-umber-500">No change</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Users Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <CardTitle>All Users</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-8 pr-4 py-2 text-sm w-full sm:w-64 rounded-md border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                          />
                          <svg
                            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <select className="pl-3 pr-8 py-2 text-sm rounded-md border border-neutral-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400">
                          <option value="">All Roles</option>
                          <option value="student">Students</option>
                          <option value="instructor">Instructors</option>
                          <option value="admin">Admins</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.slice(0, 5).map((user: any, index: number) => (
                            <TableRow key={user.id || index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.profileImage} />
                                    <AvatarFallback className={`
                                      ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                        user.role === 'instructor' ? 'bg-blue-100 text-blue-600' : 
                                        'bg-green-100 text-green-600'}
                                    `}>
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-umber-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-umber-500">ID: {user.id || `#${1000 + index}`}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-umber-600">{user.email || `user${index}@example.com`}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`
                                    ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 
                                      user.role === 'instructor' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                      'bg-green-50 text-green-600 border-green-100'}
                                  `}
                                >
                                  {user.role || 'student'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <div className={`h-2 w-2 rounded-full ${user.isActive !== false ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                  <span className="text-umber-600 text-sm">
                                    {user.isActive !== false ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-umber-600 text-sm">
                                {new Date(user.createdAt || Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link href={`/admin/users/${user.id || index + 1}`}>
                                    <Button variant="outline" size="sm" className="h-8">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="h-8">
                                    {user.isActive !== false ? 'Disable' : 'Enable'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-umber-600 text-sm">
                        Showing 5 of {totalUsers} users
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary-50 text-primary-500 border-primary-100">
                          1
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          2
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          ...
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          10
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Permissions and Access Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Permissions & Access Controls</CardTitle>
                    <CardDescription>Configure platform-wide access controls and user permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Role Management</h3>
                            <p className="text-xs text-umber-600">Configure role permissions</p>
                          </div>
                        </div>
                        <Link href="/admin/roles">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage Roles
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Security Settings</h3>
                            <p className="text-xs text-umber-600">Configure security policies</p>
                          </div>
                        </div>
                        <Link href="/admin/security">
                          <Button variant="outline" size="sm" className="w-full">
                            Security Settings
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Access Logs</h3>
                            <p className="text-xs text-umber-600">View system access logs</p>
                          </div>
                        </div>
                        <Link href="/admin/access-logs">
                          <Button variant="outline" size="sm" className="w-full">
                            View Logs
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Content Management Tab */}
            <TabsContent value="content" className="pt-2">
              <div className="space-y-6">
                {/* Content Management Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-umber-900">Content Management</h2>
                    <p className="text-umber-600">Manage courses, learning materials, and platform content</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/courses/new">
                      <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                        <BookOpen className="h-4 w-4" />
                        Add New Course
                      </Button>
                    </Link>
                    <Link href="/admin/content-templates">
                      <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Content Templates
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Content Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <StatsCard
                    title="Active Courses"
                    value={activeCourses}
                    icon={BookOpen}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-50"
                  />
                  <StatsCard
                    title="Archived Courses"
                    value={archivedCourses}
                    icon={Archive}
                    iconColor="text-amber-500"
                    iconBgColor="bg-amber-50"
                  />
                  <StatsCard
                    title="Content Size"
                    value="128 GB"
                    icon={HardDrive}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-50"
                  />
                  <StatsCard
                    title="Media Files"
                    value="2,845"
                    icon={FileImage}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-50"
                  />
                </div>
                
                {/* Courses Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <CardTitle>All Courses</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-8 pr-4 py-2 text-sm w-full sm:w-64 rounded-md border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                          />
                          <svg
                            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <select className="pl-3 pr-8 py-2 text-sm rounded-md border border-neutral-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400">
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="archived">Archived</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.slice(0, 5).map((course: any, index: number) => (
                            <TableRow key={course.id || index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-primary-600" />
                                  </div>
                                  <div>
                                    <p className="text-umber-900">{course.name || `Course ${index + 1}`}</p>
                                    <p className="text-xs text-umber-500">{course.category || 'General'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                      {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0] || 'IN'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-umber-600">
                                    {course.instructor?.firstName} {course.instructor?.lastName || `Instructor ${index + 1}`}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-umber-600">
                                {course.enrollmentCount || Math.floor(Math.random() * 50 + 10)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`
                                    ${course.isArchived ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                      course.status === 'draft' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                      'bg-green-50 text-green-600 border-green-100'}
                                  `}
                                >
                                  {course.isArchived ? 'Archived' : course.status || 'Active'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-umber-600 text-sm">
                                {new Date(course.createdAt || Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link href={`/admin/courses/${course.id || index + 1}`}>
                                    <Button variant="outline" size="sm" className="h-8">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="h-8">
                                    {course.isArchived ? 'Restore' : 'Archive'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-umber-600 text-sm">
                        Showing 5 of {totalCourses} courses
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary-50 text-primary-500 border-primary-100">
                          1
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          2
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Tools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Course Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary-400"></div>
                            <span className="text-umber-900">Computer Science</span>
                          </div>
                          <span className="text-umber-600 text-sm">18 courses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-400"></div>
                            <span className="text-umber-900">African Studies</span>
                          </div>
                          <span className="text-umber-600 text-sm">24 courses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-blue-400"></div>
                            <span className="text-umber-900">Engineering</span>
                          </div>
                          <span className="text-umber-600 text-sm">15 courses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-amber-400"></div>
                            <span className="text-umber-900">Business</span>
                          </div>
                          <span className="text-umber-600 text-sm">12 courses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-400"></div>
                            <span className="text-umber-900">Arts & Culture</span>
                          </div>
                          <span className="text-umber-600 text-sm">9 courses</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href="/admin/categories">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage Categories
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Content Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-umber-600">Documents</span>
                            <span className="text-sm font-medium text-umber-900">28.4 GB</span>
                          </div>
                          <Progress value={28.4} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-umber-600">Video Content</span>
                            <span className="text-sm font-medium text-umber-900">75.2 GB</span>
                          </div>
                          <Progress value={75.2} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-umber-600">Images</span>
                            <span className="text-sm font-medium text-umber-900">15.8 GB</span>
                          </div>
                          <Progress value={15.8} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-umber-600">Other Files</span>
                            <span className="text-sm font-medium text-umber-900">8.6 GB</span>
                          </div>
                          <Progress value={8.6} className="h-2" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href="/admin/storage">
                          <Button variant="outline" size="sm" className="w-full">
                            Storage Management
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Course Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 border border-neutral-200 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-umber-900">Standard Academic</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-umber-600 mb-3">
                          Traditional academic format with modules and assignments
                        </p>
                        <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                          Use Template
                        </Button>
                      </div>
                      
                      <div className="p-3 border border-neutral-200 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-umber-900">Interactive Workshop</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-umber-600 mb-3">
                          Focused on collaborative activities and discussions
                        </p>
                        <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                          Use Template
                        </Button>
                      </div>
                      
                      <div className="p-3 border border-neutral-200 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-umber-900">Self-Paced Learning</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-umber-600 mb-3">
                          Flexible timeline with progress checkpoints
                        </p>
                        <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                          Use Template
                        </Button>
                      </div>
                      
                      <div className="mt-2">
                        <Link href="/admin/content-templates">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage Templates
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* System Tab */}
            <TabsContent value="system" className="pt-2">
              <div className="space-y-6">
                {/* System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">System Performance</CardTitle>
                        <CardDescription>Server performance and operational metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] w-full bg-neutral-50 rounded-lg flex items-center justify-center mb-6">
                          <div className="text-center">
                            <Activity className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                            <p className="text-umber-600 mb-1">System Performance Chart</p>
                            <p className="text-umber-500 text-sm">CPU, Memory, and Network usage</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 border border-neutral-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-umber-600">CPU Usage</span>
                              <span className="text-xs font-medium text-umber-900">28%</span>
                            </div>
                            <Progress value={28} className="h-2 mb-3" />
                            <p className="text-xs text-umber-500">
                              Average: 24% | Peak: 68%
                            </p>
                          </div>
                          
                          <div className="p-4 border border-neutral-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-umber-600">Memory Usage</span>
                              <span className="text-xs font-medium text-umber-900">45%</span>
                            </div>
                            <Progress value={45} className="h-2 mb-3" />
                            <p className="text-xs text-umber-500">
                              8.6 GB of 16 GB used
                            </p>
                          </div>
                          
                          <div className="p-4 border border-neutral-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-umber-600">Disk I/O</span>
                              <span className="text-xs font-medium text-umber-900">12 MB/s</span>
                            </div>
                            <Progress value={24} className="h-2 mb-3" />
                            <p className="text-xs text-umber-500">
                              Read: 8 MB/s | Write: 4 MB/s
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Zap className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-umber-900 mb-1">System Status: Operational</h4>
                            <p className="text-xs text-umber-600">All services running normally</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-umber-700">Web Application</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Operational</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-umber-700">Database</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Operational</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-umber-700">Storage</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Operational</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-umber-700">Email Service</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Operational</span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4V9H4.582M19.938 11C19.978 11.323 20 11.659 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C13.395 4 14.705 4.344 15.85 4.952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Run System Diagnostic
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* System Logs */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg font-semibold">System Logs</CardTitle>
                        <CardDescription>Recent system events and alerts</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="pl-3 pr-8 py-2 text-sm rounded-md border border-neutral-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400">
                          <option value="all">All Logs</option>
                          <option value="error">Errors</option>
                          <option value="warn">Warnings</option>
                          <option value="info">Info</option>
                        </select>
                        <Button variant="outline" size="sm" className="h-9">
                          Export Logs
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {systemLogs.length === 0 ? (
                        Array.from({ length: 8 }).map((_, i) => {
                          const types = ["info", "warn", "error", "success"] as const;
                          const type = types[Math.floor(Math.random() * types.length)];
                          const time = new Date(Date.now() - Math.random() * 86400000);
                          const messages = [
                            "User login successful",
                            "Database backup completed",
                            "Certificate renewal warning",
                            "Disk space running low",
                            "New user registration",
                            "Failed login attempt",
                            "System update available",
                            "API rate limit reached"
                          ];
                          const message = messages[Math.floor(Math.random() * messages.length)];
                          
                          return (
                            <div 
                              key={i}
                              className={`p-3 rounded-md ${logTypes[type].bg} border border-${type}-100 flex items-start gap-3`}
                            >
                              <div className={`shrink-0 h-6 w-6 rounded-full ${type === "info" ? "bg-blue-100" : type === "warn" ? "bg-amber-100" : type === "error" ? "bg-red-100" : "bg-green-100"} flex items-center justify-center`}>
                                {type === "info" ? (
                                  <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : type === "warn" ? (
                                  <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 9V13M12 17H12.01M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : type === "error" ? (
                                  <svg className="h-3.5 w-3.5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : (
                                  <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`text-sm font-medium ${logTypes[type].color}`}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}: {message}
                                  </p>
                                  <p className="text-xs text-umber-500">
                                    {time.toLocaleTimeString()} - {time.toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-xs text-umber-600">
                                  {type === "info" 
                                    ? "System information message for administrators." 
                                    : type === "warn"
                                    ? "Warning requires attention but not immediate action."
                                    : type === "error"
                                    ? "Error detected that requires immediate attention."
                                    : "Operation completed successfully."}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        systemLogs.map((log: any) => (
                          <div 
                            key={log.id}
                            className={`p-3 rounded-md ${logTypes[log.type || "info"].bg} border border-${log.type || "info"}-100 flex items-start gap-3`}
                          >
                            {/* Log content */}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Maintenance Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">System Maintenance</CardTitle>
                    <CardDescription>Tools for system maintenance and optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Database className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Database</h3>
                            <p className="text-xs text-umber-600">Last backup: 2h ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Database Tools
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Server className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Cache</h3>
                            <p className="text-xs text-umber-600">Status: Optimized</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Clear Cache
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">Log Files</h3>
                            <p className="text-xs text-umber-600">Size: 248 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Manage Logs
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-umber-900">CDN Cache</h3>
                            <p className="text-xs text-umber-600">Last purge: 3d ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Purge CDN
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-umber-900 mb-1">System Updates</h3>
                          <p className="text-xs text-umber-600">Current version: v1.5.2</p>
                        </div>
                        <Badge className="bg-amber-50 text-amber-600 border-amber-100">
                          Update Available
                        </Badge>
                      </div>
                      <div className="text-sm text-umber-600 mb-4">
                        <p>New version v1.6.0 is available with the following improvements:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                          <li>Enhanced performance for large course libraries</li>
                          <li>New interactive assessment tools</li>
                          <li>Improved accessibility features</li>
                          <li>Security patches and bug fixes</li>
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                          Update System
                        </Button>
                        <Button variant="outline">
                          View Release Notes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}