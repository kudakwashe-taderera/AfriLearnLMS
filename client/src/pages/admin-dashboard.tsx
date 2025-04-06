import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2, BarChart2, Users, BookOpen, ShieldCheck, Plus, UserPlus, UserX, PencilLine, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user && user.role === "admin",
  });

  // Platform statistics
  const stats = [
    { 
      id: 1, 
      title: "Total Users", 
      value: users?.length || 0, 
      icon: <Users className="h-6 w-6 text-primary-400" />,
      change: "+12% from last month",
      increasing: true
    },
    { 
      id: 2, 
      title: "Total Courses", 
      value: courses?.length || 0, 
      icon: <BookOpen className="h-6 w-6 text-secondary-400" />,
      change: "+5% from last month",
      increasing: true
    },
    { 
      id: 3, 
      title: "Active Students", 
      value: users?.filter(u => u.role === "student").length || 0, 
      icon: <BarChart2 className="h-6 w-6 text-accent-400" />,
      change: "+18% from last month",
      increasing: true
    },
    { 
      id: 4, 
      title: "System Status", 
      value: "Healthy", 
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      change: "All systems operational",
      increasing: null
    },
  ];

  if (usersLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  const getAvatarFallback = (userName: string) => {
    if (!userName) return "U";
    const names = userName.split(" ");
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    }
    return userName.charAt(0);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary-400">Admin</Badge>;
      case "instructor":
        return <Badge className="bg-secondary-400">Instructor</Badge>;
      case "student":
        return <Badge className="bg-accent-400">Student</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          {/* Welcome Section */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-umber-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <Card key={stat.id} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-umber-600">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-umber-900 mt-1">{stat.value}</h3>
                        {stat.change && (
                          <p className={`text-xs mt-1 flex items-center ${
                            stat.increasing === null 
                              ? 'text-umber-600' 
                              : stat.increasing 
                                ? 'text-green-500' 
                                : 'text-status-error'
                          }`}>
                            {stat.change}
                          </p>
                        )}
                      </div>
                      <div className="bg-neutral-100 p-3 rounded-full">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Management */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>User Management</CardTitle>
                    <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  <CardDescription>
                    Manage platform users, roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Users</TabsTrigger>
                      <TabsTrigger value="students">Students</TabsTrigger>
                      <TabsTrigger value="instructors">Instructors</TabsTrigger>
                      <TabsTrigger value="admins">Admins</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users && users.length > 0 ? (
                              users.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback className="bg-neutral-200 text-umber-700">
                                          {getAvatarFallback(`${user.firstName} ${user.lastName}`)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center">
                                          <PencilLine className="mr-2 h-4 w-4" />
                                          <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center text-status-error">
                                          <UserX className="mr-2 h-4 w-4" />
                                          <span>Deactivate</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-umber-600">
                                  No users found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="students">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users && users.filter(user => user.role === "student").length > 0 ? (
                              users.filter(user => user.role === "student").map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback className="bg-neutral-200 text-umber-700">
                                          {getAvatarFallback(`${user.firstName} ${user.lastName}`)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center">
                                          <PencilLine className="mr-2 h-4 w-4" />
                                          <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center text-status-error">
                                          <UserX className="mr-2 h-4 w-4" />
                                          <span>Deactivate</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-umber-600">
                                  No students found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="instructors">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users && users.filter(user => user.role === "instructor").length > 0 ? (
                              users.filter(user => user.role === "instructor").map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback className="bg-neutral-200 text-umber-700">
                                          {getAvatarFallback(`${user.firstName} ${user.lastName}`)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center">
                                          <PencilLine className="mr-2 h-4 w-4" />
                                          <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center text-status-error">
                                          <UserX className="mr-2 h-4 w-4" />
                                          <span>Deactivate</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-umber-600">
                                  No instructors found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="admins">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users && users.filter(user => user.role === "admin").length > 0 ? (
                              users.filter(user => user.role === "admin").map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback className="bg-neutral-200 text-umber-700">
                                          {getAvatarFallback(`${user.firstName} ${user.lastName}`)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center">
                                          <PencilLine className="mr-2 h-4 w-4" />
                                          <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center text-status-error">
                                          <UserX className="mr-2 h-4 w-4" />
                                          <span>Deactivate</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-umber-600">
                                  No admins found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-sm text-umber-600">
                    Showing {users?.length || 0} users
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Management */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Course Management</CardTitle>
                    <Button className="bg-accent-400 hover:bg-accent-500 text-white" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Course
                    </Button>
                  </div>
                  <CardDescription>
                    Platform courses and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses && courses.length > 0 ? (
                      courses.slice(0, 5).map((course) => (
                        <div key={course.id} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-md">
                          <div className="w-10 h-10 rounded-md bg-cover bg-center flex-shrink-0" style={{ 
                            backgroundImage: course.coverImage ? `url(${course.coverImage})` : 'none',
                            backgroundColor: course.coverImage ? 'transparent' : '#E49976'
                          }}>
                            {!course.coverImage && (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-umber-900 line-clamp-1">{course.title}</h4>
                              <Badge variant="outline" className="bg-accent-50 text-accent-600 border-accent-200">
                                Active
                              </Badge>
                            </div>
                            <p className="text-xs text-umber-600 mt-1">
                              Created {new Date(course.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-umber-700">15 students enrolled</span>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <PencilLine className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-status-error">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-umber-600">
                        No courses available
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" className="w-full text-primary-400 hover:text-primary-500 hover:bg-primary-50">
                    View all courses
                  </Button>
                </CardFooter>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-umber-700">CPU Usage</span>
                        <span className="text-sm font-medium text-umber-700">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-umber-700">Memory Usage</span>
                        <span className="text-sm font-medium text-umber-700">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-umber-700">Storage Usage</span>
                        <span className="text-sm font-medium text-umber-700">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-umber-700">Bandwidth</span>
                        <span className="text-sm font-medium text-umber-700">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
