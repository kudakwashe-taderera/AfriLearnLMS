import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ChevronRight, 
  BookOpen, 
  Users, 
  FileText, 
  Bell,
  GraduationCap,
  UserCheck,
  Clock,
  LineChart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Calendar
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
import AnnouncementItem from "@/components/announcement-item";
import CalendarWidget from "@/components/calendar-widget";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch courses taught by instructor
  const { 
    data: courses = [], 
    isLoading: coursesLoading 
  } = useQuery({
    queryKey: ["/api/instructor/courses"],
    enabled: !!user && user.role === "instructor",
  });
  
  // Fetch announcements
  const { 
    data: announcements = [], 
    isLoading: announcementsLoading 
  } = useQuery({
    queryKey: ["/api/instructor/announcements"],
    enabled: !!user && user.role === "instructor",
  });
  
  // Fetch recent student submissions
  const { 
    data: submissions = [], 
    isLoading: submissionsLoading 
  } = useQuery({
    queryKey: ["/api/instructor/submissions/recent"],
    enabled: !!user && user.role === "instructor",
  });
  
  // Recent announcements
  const recentAnnouncements = announcements
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Total number of students across all courses
  const totalStudents = courses.reduce((total: number, course: any) => {
    return total + (course.enrollmentCount || 0);
  }, 0);
  
  // Average course completion percentage across all courses
  const averageCompletion = courses.length > 0
    ? Math.round(
        courses.reduce((sum: number, course: any) => sum + (course.averageCompletion || 0), 0) / courses.length
      )
    : 0;
  
  // Number of assignments pending grading
  const pendingGrading = submissions.filter((s: any) => s.status === "submitted" && !s.graded).length;
  
  // Number of assignments graded this week
  const gradedThisWeek = 27;
  
  // Student engagement data
  const engagementScore = 78;
  
  // Render loading state
  if (coursesLoading || announcementsLoading || submissionsLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                <p className="text-umber-600">Loading your dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-umber-900 mb-1">
              Welcome, Professor {user?.lastName}!
            </h1>
            <p className="text-umber-600">
              Manage your courses, track student progress, and create assessments all in one place.
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
                value="courses" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                My Courses
              </TabsTrigger>
              <TabsTrigger 
                value="students" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Students
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-umber-600 text-sm">Courses</p>
                            <p className="text-2xl font-bold text-umber-900 mt-1">{courses.length}</p>
                          </div>
                          <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary-500" />
                          </div>
                        </div>
                        <div className="text-umber-500 text-xs flex items-center mt-3">
                          <Link href="/courses">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <span>View courses</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-umber-600 text-sm">Students</p>
                            <p className="text-2xl font-bold text-umber-900 mt-1">{totalStudents}</p>
                          </div>
                          <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary-500" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-3">
                          <div className="text-green-600 flex items-center">
                            <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>+5 this week</span>
                          </div>
                          <Link href="/students">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <span>View all</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-umber-600 text-sm">To Grade</p>
                            <p className="text-2xl font-bold text-umber-900 mt-1">{pendingGrading}</p>
                          </div>
                          <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-amber-500" />
                          </div>
                        </div>
                        <div className="text-umber-500 text-xs flex items-center mt-3">
                          <Link href="/grades">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <span>Grade now</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-umber-600 text-sm">Completion</p>
                            <p className="text-2xl font-bold text-umber-900 mt-1">{averageCompletion}%</p>
                          </div>
                          <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          </div>
                        </div>
                        <div className="text-umber-500 text-xs flex items-center mt-3">
                          <Link href="/analytics">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <span>View analytics</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Submissions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
                        <Link href="/grades">
                          <Button variant="ghost" size="sm" className="gap-1 h-8 text-umber-600">
                            View all
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {submissions.length === 0 ? (
                        <div className="text-center py-6">
                          <FileText className="h-12 w-12 text-primary-200 mx-auto mb-3" />
                          <p className="text-umber-600 mb-1">No submissions yet</p>
                          <p className="text-umber-500 text-sm">Your students' submissions will appear here.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {submissions.slice(0, 5).map((submission: any) => (
                                <TableRow key={submission.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={submission.student?.profileImage} />
                                        <AvatarFallback className="text-xs">
                                          {submission.student?.firstName?.[0]}{submission.student?.lastName?.[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{submission.student?.firstName} {submission.student?.lastName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{submission.assignment?.title}</TableCell>
                                  <TableCell>{submission.course?.name}</TableCell>
                                  <TableCell>
                                    {new Date(submission.submittedAt).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Link href={`/assignments/${submission.assignment?.id}/submissions/${submission.id}`}>
                                      <Button size="sm" variant="outline" className="h-8">
                                        Review
                                      </Button>
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Course Activity */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">Course Activity</CardTitle>
                          <CardDescription>Student engagement over the last 7 days</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full">
                        {/* Chart would go here */}
                        <div className="h-full w-full bg-neutral-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <LineChart className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                            <p className="text-umber-600 mb-1">Activity Analytics</p>
                            <p className="text-umber-500 text-sm">Visual engagement data would display here</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-umber-600 mb-1">Total Views</div>
                          <div className="text-xl font-bold text-umber-900">2,456</div>
                          <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            +12.5%
                          </div>
                        </div>
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-umber-600 mb-1">Discussion Posts</div>
                          <div className="text-xl font-bold text-umber-900">183</div>
                          <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            +8.3%
                          </div>
                        </div>
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-umber-600 mb-1">Quiz Attempts</div>
                          <div className="text-xl font-bold text-umber-900">78</div>
                          <div className="text-xs text-red-600 flex items-center justify-center mt-1">
                            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            -3.1%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start bg-primary-400 hover:bg-primary-500 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Post Announcement
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Create Quiz
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Discussion
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Calendar Widget */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CalendarWidget />
                      <div className="mt-4">
                        <Link href="/calendar">
                          <Button variant="outline" className="w-full gap-2">
                            <Calendar className="h-4 w-4" />
                            View Full Calendar
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Announcements */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Your Announcements</CardTitle>
                        <Link href="/announcements">
                          <Button variant="ghost" size="sm" className="gap-1 h-8 text-umber-600">
                            View all
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-1">
                      {recentAnnouncements.length === 0 ? (
                        <div className="text-center py-6">
                          <Bell className="h-12 w-12 text-primary-200 mx-auto mb-3" />
                          <p className="text-umber-600 mb-1">No announcements yet</p>
                          <p className="text-umber-500 text-sm">Your posted announcements will appear here.</p>
                          <Button 
                            variant="outline" 
                            className="mt-4 gap-2"
                            onClick={() => {
                              // Logic to open announcement creation dialog
                            }}
                          >
                            <Bell className="h-4 w-4" />
                            Create Announcement
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {recentAnnouncements.map((announcement: any) => (
                            <AnnouncementItem key={announcement.id} announcement={announcement} />
                          ))}
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              className="w-full gap-2"
                              onClick={() => {
                                // Logic to open announcement creation dialog
                              }}
                            >
                              <Bell className="h-4 w-4" />
                              Create Announcement
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="pt-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-umber-900">My Courses</h2>
                  <p className="text-umber-600">You are teaching {courses.length} course{courses.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href="/courses/create">
                  <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                    <BookOpen className="h-4 w-4" />
                    Create New Course
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                  <div className="col-span-full text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
                    <BookOpen className="h-12 w-12 text-primary-200 mx-auto mb-3" />
                    <h3 className="text-umber-900 font-medium mb-2">No courses created yet</h3>
                    <p className="text-umber-600 mb-6 max-w-md mx-auto">
                      Start by creating your first course to manage content, assignments, and student progress.
                    </p>
                    <Link href="/courses/create">
                      <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                        <BookOpen className="h-4 w-4" />
                        Create First Course
                      </Button>
                    </Link>
                  </div>
                ) : (
                  courses.map((course: any) => (
                    <Card key={course.id} className="overflow-hidden flex flex-col">
                      <div className="h-32 bg-primary-100 relative">
                        {course.coverImage ? (
                          <img
                            src={course.coverImage}
                            alt={course.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-12 w-12 text-primary-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="flex-1 flex flex-col p-5">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-500 border-primary-100"
                          >
                            {course.category || "General"}
                          </Badge>
                          <div className="flex items-center text-umber-600 text-xs gap-1">
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>{course.enrollmentCount || 0} students</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-umber-900 mb-1 line-clamp-1">
                          {course.name}
                        </h3>
                        <p className="text-umber-600 text-sm mb-4 line-clamp-2 flex-1">
                          {course.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-umber-500 mb-3">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{course.assignmentCount || 0} assignments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{course.duration || "8 weeks"}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-umber-600">
                            Avg. completion
                          </span>
                          <span className="text-xs font-medium text-umber-700">
                            {course.averageCompletion || 0}%
                          </span>
                        </div>
                        <Progress value={course.averageCompletion || 0} className="h-1.5 mb-4" />
                        <div className="flex gap-2">
                          <Link href={`/courses/${course.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Manage
                            </Button>
                          </Link>
                          <Link href={`/courses/${course.id}/assignments`} className="flex-1">
                            <Button size="sm" className="w-full bg-primary-400 hover:bg-primary-500 text-white">
                              Content
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* Students Tab */}
            <TabsContent value="students" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Student Management</CardTitle>
                  <CardDescription>View and manage your students across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400"
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
                    <select
                      className="p-2 border border-neutral-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course: any) => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                    <select
                      className="p-2 border border-neutral-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                    >
                      <option value="">All Progress</option>
                      <option value="low">Low (&lt;30%)</option>
                      <option value="medium">Medium (30-70%)</option>
                      <option value="high">High (&gt;70%)</option>
                    </select>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Avg. Grade</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => {
                          // Generate random data for demonstration
                          const progress = Math.floor(Math.random() * 100);
                          const grade = 65 + Math.floor(Math.random() * 35);
                          const lastActive = new Date();
                          lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 7));
                          
                          return (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                                    <AvatarFallback className="text-xs">
                                      {['JD', 'ML', 'SP', 'RK', 'AT'][i]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-umber-900">
                                      {['John Doe', 'Maria Lopez', 'Sam Peterson', 'Rachel Kim', 'Alex Thompson'][i]}
                                    </p>
                                    <p className="text-xs text-umber-500">
                                      {['john.doe@email.com', 'maria.l@email.com', 'samp@email.com', 'rachelk@email.com', 'alex.t@email.com'][i]}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {courses[i % courses.length]?.name || 'Introduction to African Studies'}
                              </TableCell>
                              <TableCell>
                                {lastActive.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={progress} className="h-2 w-24" />
                                  <span className="text-xs font-medium">{progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${grade >= 80 ? 'bg-green-50 text-green-700 border-green-100' : 
                                      grade >= 70 ? 'bg-primary-50 text-primary-700 border-primary-100' :
                                      'bg-amber-50 text-amber-700 border-amber-100'}
                                  `}
                                >
                                  {grade}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8">
                                    View Details
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-umber-600 text-sm">
                      Showing 5 of {totalStudents} students
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
                        3
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
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Grading Analytics */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Grading Analytics</CardTitle>
                    <CardDescription>Insights into your grading patterns and student performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Graded This Week</div>
                        <div className="text-2xl font-bold text-umber-900">{gradedThisWeek}</div>
                        <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          +9.2%
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Average Grade</div>
                        <div className="text-2xl font-bold text-umber-900">76%</div>
                        <div className="text-xs text-amber-600 flex items-center justify-center mt-1">
                          -2.1%
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Feedback Rate</div>
                        <div className="text-2xl font-bold text-umber-900">92%</div>
                        <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          +3.5%
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[250px] w-full bg-neutral-50 rounded-lg flex items-center justify-center mb-6">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                        <p className="text-umber-600 mb-1">Grade Distribution Chart</p>
                        <p className="text-umber-500 text-sm">Visual grade distribution data would display here</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">Grading Speed</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold text-umber-900 mb-1">
                            2.3 <span className="text-sm font-normal text-umber-600">days avg.</span>
                          </div>
                          <div className="text-xs text-umber-600">
                            Average time to grade assignments 
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">Top Performing Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-sm font-medium text-umber-900 mb-1 truncate">
                            Research Essay: Cultural Identity
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={92} className="h-2 flex-1" />
                            <span className="text-xs font-medium">92%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Student Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Student Engagement</CardTitle>
                    <CardDescription>Overall student interaction with your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="relative h-36 w-36 mb-4">
                        <svg className="w-full h-full" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#0ea5e9"
                            strokeWidth="12"
                            strokeDasharray="339.3"
                            strokeDashoffset={(1 - engagementScore / 100) * 339.3}
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-bold text-umber-900">{engagementScore}%</span>
                          <span className="text-xs text-umber-600">Engagement</span>
                        </div>
                      </div>
                      <div className="w-full space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-umber-600">Content Views</span>
                            <span className="font-medium text-umber-900">85%</span>
                          </div>
                          <Progress value={85} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-umber-600">Discussions</span>
                            <span className="font-medium text-umber-900">64%</span>
                          </div>
                          <Progress value={64} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-umber-600">Assignment Completion</span>
                            <span className="font-medium text-umber-900">92%</span>
                          </div>
                          <Progress value={92} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-umber-600">Video Completion</span>
                            <span className="font-medium text-umber-900">71%</span>
                          </div>
                          <Progress value={71} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-medium text-umber-900 mb-3">Engagement by Course</h4>
                      <div className="space-y-3">
                        {courses.slice(0, 3).map((course: any, i: number) => {
                          const engagementRate = 60 + Math.floor(Math.random() * 35);
                          return (
                            <div key={course.id || i}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-umber-600 truncate pr-2" title={course.name}>
                                  {course.name || `Course ${i + 1}`}
                                </span>
                                <span className="font-medium text-umber-900">{engagementRate}%</span>
                              </div>
                              <Progress value={engagementRate} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full gap-2">
                        <LineChart className="h-4 w-4" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* AI Teaching Assistant */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">AI Teaching Assistant</CardTitle>
                    <CardDescription>Personalized insights and recommendations for your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                        <h4 className="font-medium text-umber-900 mb-1">Engagement Alert</h4>
                        <p className="text-sm text-umber-600 mb-3">
                          Student activity in "African History 202" has dropped by 23% in the last week.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Recommendations
                        </Button>
                      </div>
                      
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                        <svg className="h-8 w-8 text-primary-500 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h4 className="font-medium text-umber-900 mb-1">Content Suggestion</h4>
                        <p className="text-sm text-umber-600 mb-3">
                          Based on student performance, consider adding more interactive elements to "Module 3: Cultural Exchange".
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Suggestions
                        </Button>
                      </div>
                      
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                        <GraduationCap className="h-8 w-8 text-green-500 mb-2" />
                        <h4 className="font-medium text-umber-900 mb-1">Grading Insight</h4>
                        <p className="text-sm text-umber-600 mb-3">
                          Your detailed feedback on essays has led to a 15% improvement in subsequent submissions.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 rounded-lg border border-primary-100 p-4 bg-white">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-umber-900 mb-1">Weekly Teaching Summary</h4>
                          <p className="text-sm text-umber-600 mb-3">
                            Your AI teaching assistant can generate a comprehensive weekly summary of your teaching activities, student engagement, and actionable recommendations.
                          </p>
                          <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                            Generate Weekly Summary
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
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