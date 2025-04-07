import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Enrollment, Course, Assignment, Announcement } from "@shared/schema";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  BookOpen, 
  FileText, 
  Bell, 
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Building,
  Award,
  BookMarked,
  BriefcaseIcon,
  ArrowUpRight,
  GraduationCap,
  Clock,
  AlertCircle
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DashboardStats from "@/components/dashboard-stats";
import CourseList from "@/components/course-list";
import AssignmentItem from "@/components/assignment-item";
import AnnouncementItem from "@/components/announcement-item";

export default function UniversityStudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [_, navigate] = useLocation();
  
  // Define types for API responses
  type EnrollmentWithCourse = Enrollment & { course: Course };
  type AssignmentWithDetails = Assignment & { 
    course: { id: number; title: string; code: string; };
    status: string;
    submittedAt: Date | null;
  };
  type AnnouncementWithCourse = Announcement & { 
    course: { id: number; title: string; code: string; };
  };

  // Fetch enrollments
  const { 
    data: enrollments = [] as EnrollmentWithCourse[], 
    isLoading: enrollmentsLoading 
  } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user && user.role === "student",
  });
  
  // Fetch assignments
  const { 
    data: assignments = [] as AssignmentWithDetails[], 
    isLoading: assignmentsLoading 
  } = useQuery<AssignmentWithDetails[]>({
    queryKey: ["/api/student/assignments"],
    enabled: !!user && user.role === "student",
  });
  
  // Fetch announcements
  const { 
    data: announcements = [] as AnnouncementWithCourse[], 
    isLoading: announcementsLoading 
  } = useQuery<AnnouncementWithCourse[]>({
    queryKey: ["/api/student/announcements"],
    enabled: !!user && user.role === "student",
  });
  
  // Calculate upcoming assignments
  const upcomingAssignments = assignments
    .filter((a) => a.status !== "submitted" && a.status !== "graded")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  // Calculate recent announcements
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Learning time this week (in hours)
  const learningTimeWeek = 15;
  // Target time per week (in hours)
  const targetTimeWeek = 20;
  // Learning time percentage
  const learningTimePercentage = Math.round((learningTimeWeek / targetTimeWeek) * 100);
  
  // Course completion percentage
  const overallCompletion = enrollments.length > 0
    ? Math.round(
        enrollments.reduce((sum: number, e) => sum + e.progress, 0) / enrollments.length
      )
    : 0;
  
  // Define progress steps
  const progressSteps = [
    { id: 'course-enrollment', label: 'Course Enrollment', complete: enrollments.length > 0, href: '/courses' },
    { id: 'assignments', label: 'Assignments', complete: false, href: '/assignments' },
    { id: 'internships', label: 'Internships', complete: false, href: '/internships' },
    { id: 'career-development', label: 'Career Development', complete: false, href: '/career-guidance?focus=professional' },
  ];
  
  // Current step (find the first incomplete step)
  const currentStep = progressSteps.find(step => !step.complete)?.id || progressSteps[0].id;
  
  // Render loading state
  if (enrollmentsLoading || assignmentsLoading || announcementsLoading) {
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
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-umber-600">
              Focus on your university degree and career preparation. Here's your progress overview.
            </p>
          </div>
          
          {/* User Progress Bar */}
          <div className="mb-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your University Journey</h3>
                <div className="space-y-4">
                  <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                    {progressSteps.map((step, index) => (
                      <li key={step.id} className={`flex md:w-full items-center ${index === progressSteps.length - 1 ? '' : 'after:content-[""] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10'} ${step.complete ? 'text-primary-600' : currentStep === step.id ? 'text-primary-500' : 'text-gray-500'}`}>
                        <Link href={step.href}>
                          <span className="flex items-center cursor-pointer group">
                            <span className={`flex items-center justify-center w-8 h-8 ${step.complete ? 'bg-primary-600' : currentStep === step.id ? 'bg-primary-500' : 'bg-gray-200'} rounded-full lg:h-10 lg:w-10 flex-shrink-0`}>
                              {step.complete ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-white">{index + 1}</span>
                              )}
                            </span>
                            <span className={`hidden sm:inline-flex sm:ml-2 ${step.complete ? 'text-primary-600' : currentStep === step.id ? 'text-primary-500' : 'text-gray-500'} group-hover:underline`}>
                              {step.label}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Widgets */}
              <DashboardStats 
                overallCompletion={overallCompletion}
                upcomingAssignments={upcomingAssignments.length}
                learningTimeWeek={learningTimeWeek}
                learningTimePercentage={learningTimePercentage}
              />
              
              {/* Career Guidance & Internship Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Internships */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold">Internship Opportunities</CardTitle>
                    <CardDescription>Find internships to gain practical experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Industry placements aligned with your degree</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Build your professional portfolio</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Gain practical skills and experience</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full gap-2" size="sm">
                      <Link href="/internships">
                        <Building className="h-4 w-4" />
                        <span>Browse Internships</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* View Jobs Card */}
                <Card className="border-border bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold">Job Opportunities</CardTitle>
                    <CardDescription>Explore current job listings and career paths</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <BriefcaseIcon className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Discover entry-level positions in your field</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookMarked className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Connect with employers and recruiters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary-500" />
                        <span className="text-umber-700">Prepare for your career after graduation</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full gap-2 bg-primary-600 hover:bg-primary-700" size="sm">
                      <Link href="/jobs">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>View Jobs</span>
                        <ArrowUpRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Upcoming Assignments and Recent Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Upcoming Assignments */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Upcoming Assignments</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {upcomingAssignments.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-4">
                      {upcomingAssignments.length > 0 ? (
                        upcomingAssignments.map((assignment) => (
                          <AssignmentItem key={assignment.id} assignment={assignment} />
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 text-umber-500">
                          <p>No upcoming assignments</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full" size="sm">
                      <Link href="/assignments">
                        View all assignments
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recent Announcements */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Recent Announcements</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {recentAnnouncements.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-4">
                      {recentAnnouncements.length > 0 ? (
                        recentAnnouncements.map((announcement) => (
                          <AnnouncementItem key={announcement.id} announcement={announcement} />
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 text-umber-500">
                          <p>No recent announcements</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Time Management and Overall Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Management */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Learning Time</CardTitle>
                    <CardDescription>Track your study habits and time management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-umber-700">This Week</span>
                          <span className="text-sm font-medium text-umber-900">
                            {learningTimeWeek} hrs / {targetTimeWeek} hrs
                          </span>
                        </div>
                        <Progress value={learningTimePercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-umber-500" />
                          <span className="text-sm text-umber-700">Daily Average: 3 hrs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-umber-700">Target: 25% more</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Overall Progress */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Overall Completion</CardTitle>
                    <CardDescription>Your progress across all enrolled courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-umber-700">All Courses</span>
                          <span className="text-sm font-medium text-umber-900">{overallCompletion}%</span>
                        </div>
                        <Progress value={overallCompletion} className="h-2" />
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" asChild className="w-full" size="sm">
                          <Link href="/courses">
                            View all courses
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses">
              <CourseList enrollments={enrollments} />
            </TabsContent>
            
            {/* Assignments Tab */}
            <TabsContent value="assignments">
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>
                    View all your assignments across all courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {assignments.length > 0 ? (
                      assignments.map((assignment) => (
                        <AssignmentItem key={assignment.id} assignment={assignment} />
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-8 text-umber-500">
                        <p>No assignments found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Grades Tab */}
            <TabsContent value="grades">
              <Card>
                <CardHeader>
                  <CardTitle>Grades</CardTitle>
                  <CardDescription>
                    View your grades for all courses and assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-umber-500">
                    <p>No grade data available yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}