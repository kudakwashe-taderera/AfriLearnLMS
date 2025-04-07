import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  Calendar, 
  BookOpen, 
  FileText, 
  Bell, 
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  Compass,
  GraduationCap,
  BadgeInfo,
  Building,
  Award,
  School,
  Lightbulb,
  BriefcaseBusiness,
  ArrowUpRight
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
import CalendarWidget from "@/components/calendar-widget";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [_, params] = useLocation();
  
  // Extract education level from URL or user object
  const educationLevel = new URLSearchParams(params).get('level') || user?.currentEducationLevel || '';
  
  // Fetch enrollments
  const { 
    data: enrollments = [], 
    isLoading: enrollmentsLoading 
  } = useQuery({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user && user.role === "student",
  });
  
  // Fetch assignments
  const { 
    data: assignments = [], 
    isLoading: assignmentsLoading 
  } = useQuery({
    queryKey: ["/api/student/assignments"],
    enabled: !!user && user.role === "student",
  });
  
  // Fetch announcements
  const { 
    data: announcements = [], 
    isLoading: announcementsLoading 
  } = useQuery({
    queryKey: ["/api/student/announcements"],
    enabled: !!user && user.role === "student",
  });
  
  // Calculate upcoming assignments
  const upcomingAssignments = assignments
    .filter((a: any) => a.status !== "submitted" && a.status !== "graded")
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  // Calculate recent announcements
  const recentAnnouncements = announcements
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Learning time this week (in hours)
  const learningTimeWeek = 12.5;
  // Target time per week (in hours)
  const targetTimeWeek = 20;
  // Learning time percentage
  const learningTimePercentage = Math.round((learningTimeWeek / targetTimeWeek) * 100);
  
  // Course completion percentage
  const overallCompletion = enrollments.length > 0
    ? Math.round(
        enrollments.reduce((sum: number, e: any) => sum + e.progress, 0) / enrollments.length
      )
    : 0;
    
  // Generate education level specific content
  const getEducationLevelContent = () => {
    switch(educationLevel) {
      case 'o_level':
        return {
          title: "O-Level Student Dashboard",
          welcomeMessage: "Focus on building your core academic foundation.",
          pathways: [
            { title: "Subject Selection Guidance", icon: <BookOpen className="h-5 w-5" />, link: "/career-guidance?focus=subjects" },
            { title: "Career Exploration", icon: <Compass className="h-5 w-5" />, link: "/career-guidance?focus=exploration" },
            { title: "Study Skills Development", icon: <Lightbulb className="h-5 w-5" />, link: "/career-guidance?focus=study-skills" },
          ],
          nextLevelPrep: "A-Level Preparation",
          recommendedActions: [
            "Complete core subject assessments",
            "Attend virtual career exploration sessions",
            "Practice exam techniques",
            "Join study groups"
          ]
        };
      case 'a_level':
        return {
          title: "A-Level Student Dashboard", 
          welcomeMessage: "Prepare for university entry and specialization.",
          pathways: [
            { title: "University Application Guide", icon: <School className="h-5 w-5" />, link: "/applications" },
            { title: "Subject Specialization", icon: <BadgeInfo className="h-5 w-5" />, link: "/career-guidance?focus=specialization" },
            { title: "University Preparation", icon: <GraduationCap className="h-5 w-5" />, link: "/career-guidance?focus=university-prep" },
          ],
          nextLevelPrep: "University Preparation",
          recommendedActions: [
            "Submit university applications",
            "Attend subject specialization webinars",
            "Develop research and writing skills",
            "Begin scholarship applications"
          ]
        };
      case 'undergraduate':
        return {
          title: "Undergraduate Dashboard",
          welcomeMessage: "Focus on your degree and career preparation.",
          pathways: [
            { title: "Internship Opportunities", icon: <Building className="h-5 w-5" />, link: "/internships" },
            { title: "Career Networking", icon: <Users className="h-5 w-5" />, link: "/mentorship" },
            { title: "Skill Development", icon: <Award className="h-5 w-5" />, link: "/career-guidance?focus=skills" },
          ],
          nextLevelPrep: "Graduate Studies or Career Entry",
          recommendedActions: [
            "Apply for internships",
            "Build your professional portfolio",
            "Join industry-specific organizations",
            "Attend career fairs"
          ]
        };
      case 'graduate':
        return {
          title: "Graduate Student Dashboard",
          welcomeMessage: "Develop research expertise and professional networks.",
          pathways: [
            { title: "Research Opportunities", icon: <BadgeInfo className="h-5 w-5" />, link: "/career-guidance?focus=research" },
            { title: "Job Placement", icon: <BriefcaseBusiness className="h-5 w-5" />, link: "/jobs" },
            { title: "Professional Development", icon: <Award className="h-5 w-5" />, link: "/career-guidance?focus=professional" },
          ],
          nextLevelPrep: "Professional Career or PhD",
          recommendedActions: [
            "Publish research papers",
            "Apply for research grants",
            "Build industry partnerships",
            "Present at conferences"
          ]
        };
      default:
        return {
          title: "Student Dashboard",
          welcomeMessage: "Track your academic progress and career development.",
          pathways: [
            { title: "Career Exploration", icon: <Compass className="h-5 w-5" />, link: "/career-guidance" },
            { title: "Skills Development", icon: <Award className="h-5 w-5" />, link: "/career-guidance?focus=skills" },
            { title: "Academic Planning", icon: <BookOpen className="h-5 w-5" />, link: "/career-guidance?focus=planning" },
          ],
          nextLevelPrep: "Educational Advancement",
          recommendedActions: [
            "Set academic goals",
            "Explore career options",
            "Develop study skills",
            "Connect with mentors"
          ]
        };
    }
  };
  
  const levelContent = getEducationLevelContent();
  
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
              {levelContent.welcomeMessage} Here's an overview of your progress.
            </p>
          </div>
          
          {/* Career Guidance & Education Pathway Card */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                      Career Guidance & Education Pathway
                    </h3>
                    <p className="text-primary-800 mb-4">
                      Prepare for your {levelContent.nextLevelPrep} with personalized guidance and resources.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {levelContent.pathways.map((pathway, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={pathway.link}>
                                <Button 
                                  variant="outline" 
                                  className="bg-white border-primary-200 text-primary-800 hover:bg-primary-50 gap-2"
                                >
                                  {pathway.icon}
                                  {pathway.title}
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Explore {pathway.title.toLowerCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 lg:w-1/4">
                    <Link href="/career-guidance">
                      <Button 
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-md gap-2 py-6 px-4 h-auto border-none"
                      >
                        <div className="flex flex-col items-center text-center">
                          <Compass className="h-8 w-8 mb-2" />
                          <div className="font-semibold">Explore Career Guidance</div>
                          <div className="text-xs opacity-90 mt-1">Get personalized advice tailored to your goals</div>
                          <ArrowUpRight className="h-4 w-4 absolute top-3 right-3" />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-primary-200 pt-4">
                  <h4 className="text-sm font-medium text-primary-800 mb-2">Recommended next steps:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {levelContent.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-primary-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
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
                value="progress" 
                className="data-[state=active]:border-primary-500 data-[state=active]:bg-transparent text-base data-[state=active]:shadow-none px-1 py-3 border-b-2 border-transparent rounded-none"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Stats Cards */}
                  <DashboardStats enrollments={enrollments} />
                  
                  {/* Upcoming Assignments */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Upcoming Assignments</CardTitle>
                        <Link href="/assignments">
                          <Button variant="ghost" size="sm" className="gap-1 h-8 text-umber-600">
                            View all
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <div className="space-y-4">
                        {upcomingAssignments.length === 0 ? (
                          <div className="text-center py-6">
                            <CheckCircle2 className="h-12 w-12 text-primary-200 mx-auto mb-3" />
                            <p className="text-umber-600 mb-1">All caught up!</p>
                            <p className="text-umber-500 text-sm">You don't have any pending assignments.</p>
                          </div>
                        ) : (
                          upcomingAssignments.map((assignment: any) => (
                            <AssignmentItem key={assignment.id} assignment={assignment} />
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Announcements */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Recent Announcements</CardTitle>
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
                          <p className="text-umber-600 mb-1">No recent announcements</p>
                          <p className="text-umber-500 text-sm">Check back later for updates from your instructors.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {recentAnnouncements.map((announcement: any) => (
                            <AnnouncementItem key={announcement.id} announcement={announcement} />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
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
                  
                  {/* Learning Time */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Learning Time</CardTitle>
                      <CardDescription>This week's learning activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-umber-600">Weekly total</div>
                        <div className="text-umber-900 font-medium">{learningTimeWeek} hrs</div>
                      </div>
                      <Progress value={learningTimePercentage} className="h-2.5 mb-1" />
                      <div className="flex justify-between text-xs text-umber-500">
                        <div>{learningTimePercentage}% of target</div>
                        <div>{targetTimeWeek} hrs target</div>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                          <Clock className="h-5 w-5 text-primary-500 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-umber-900">34</div>
                          <div className="text-xs text-umber-600">Active days</div>
                        </div>
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                          <BookMarked className="h-5 w-5 text-primary-500 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-umber-900">87</div>
                          <div className="text-xs text-umber-600">Resources viewed</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Link href="/analytics">
                          <Button variant="outline" className="w-full gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Detailed Analytics
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="pt-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">My Courses</CardTitle>
                      <CardDescription>
                        You are enrolled in {enrollments.length} course{enrollments.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Link href="/courses">
                      <Button className="gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                        <BookOpen className="h-4 w-4" />
                        Explore More Courses
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-umber-900 font-medium">Overall completion</div>
                      <Badge 
                        variant="outline" 
                        className="border-umber-200 text-umber-700 font-medium"
                      >
                        {overallCompletion}%
                      </Badge>
                    </div>
                    <Progress value={overallCompletion} className="h-2.5" />
                    
                    <div className="pt-4">
                      <CourseList enrollments={enrollments} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="progress" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Learning Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Learning Patterns</CardTitle>
                    <CardDescription>Your activity throughout the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-2 mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                        // Random heights for the bars
                        const heights = [65, 85, 45, 90, 70, 30, 50];
                        return (
                          <div key={day} className="flex flex-col items-center w-full">
                            <div 
                              className={`w-full rounded-t-sm bg-primary-${300 + (i % 3) * 100}`} 
                              style={{ height: `${heights[i]}%` }}
                            ></div>
                            <div className="text-xs text-umber-600 mt-2">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Course Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Course Breakdown</CardTitle>
                    <CardDescription>Time spent per course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {enrollments.slice(0, 4).map((enrollment: any, i: number) => (
                        <div key={enrollment.id || i}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-umber-700 truncate pr-2">
                              {enrollment.course?.name || `Course ${i + 1}`}
                            </div>
                            <div className="text-xs text-umber-500">
                              {Math.round(Math.random() * 12 + 3)}h
                            </div>
                          </div>
                          <Progress 
                            value={enrollment.progress || Math.round(Math.random() * 100)} 
                            className="h-2" 
                            indicatorClassName={`bg-primary-${400 + (i % 3) * 100}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Performance</CardTitle>
                    <CardDescription>Your academic metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Average Grade</div>
                        <div className="text-2xl font-bold text-umber-900">88%</div>
                        <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          +4.2%
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Completion Rate</div>
                        <div className="text-2xl font-bold text-umber-900">93%</div>
                        <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          +2.5%
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">On-time Submissions</div>
                        <div className="text-2xl font-bold text-umber-900">85%</div>
                        <div className="text-xs text-red-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          -1.8%
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-umber-600 mb-1">Participation</div>
                        <div className="text-2xl font-bold text-umber-900">78%</div>
                        <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          +5.7%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link href="/grades">
                        <Button variant="outline" className="w-full gap-2">
                          <FileText className="h-4 w-4" />
                          View Detailed Grade Report
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Learning Goals */}
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Learning Goals</CardTitle>
                    <CardDescription>Track your personal educational objectives</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-primary-50 rounded-lg flex items-center gap-3">
                        <div className="min-w-[24px]">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-umber-900">Complete Data Analysis Course</div>
                          <div className="text-xs text-umber-500">Achieved on Mar 12, 2025</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-primary-50 rounded-lg flex items-center gap-3">
                        <div className="min-w-[24px]">
                          <div className="h-6 w-6 rounded-full border-2 border-primary-400 bg-white flex items-center justify-center text-xs font-medium text-primary-400">
                            75%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-umber-900">Improve Programming Skills</div>
                          <div className="text-xs text-umber-500">3 of 4 courses completed</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-primary-50 rounded-lg flex items-center gap-3">
                        <div className="min-w-[24px]">
                          <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-umber-900">Earn Advanced Biology Certificate</div>
                          <div className="text-xs text-umber-500">Due May 15, 2025</div>
                        </div>
                      </div>
                      
                      <div className="p-3 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center py-6">
                        <Button variant="ghost" className="h-auto py-2 gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Add New Goal</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Suggestions for Improvement */}
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">AI-Powered Learning Insights</CardTitle>
                    <CardDescription>Personalized suggestions based on your learning patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <div className="text-primary-500 mb-2">
                          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21.5L17.5 13L13 8.5L15.5 2.5L7 11L11.5 15.5L9 21.5Z" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="font-medium text-umber-900 mb-1">Study Pattern Insight</h4>
                        <p className="text-sm text-umber-600">Your focus peaks in the evening. Consider scheduling complex topics between 7-9 PM for optimal retention.</p>
                      </div>
                      
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <div className="text-primary-500 mb-2">
                          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11.08V8L14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V16.08" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18 14.5V11.5M16.5 13H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="font-medium text-umber-900 mb-1">Content Recommendation</h4>
                        <p className="text-sm text-umber-600">Based on your interests, "Advanced Data Visualization" would complement your current studies.</p>
                      </div>
                      
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <div className="text-primary-500 mb-2">
                          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.2218 11.12C18.1101 10.8454 18.0009 10.5683 17.8942 10.29C17.4419 9.21873 17.0306 8.13206 16.6609 7.03998C16.3541 6.17003 15.7088 5.46253 14.8564 5.11323C14.0041 4.76392 13.0421 4.80619 12.223 5.23198C11.4039 5.65777 10.8016 6.42919 10.5848 7.33998C10.3679 8.25076 10.5584 9.20743 11.1009 9.97998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 9H16.4C16.6761 9 16.9478 9.05268 17.2 9.15224C17.4522 9.2518 17.6782 9.39699 17.8641 9.58289C18.05 9.76878 18.1952 9.99478 18.2948 10.247C18.3943 10.4992 18.447 10.7709 18.447 11.047C18.447 11.3231 18.3943 11.5948 18.2948 11.847C18.1952 12.0992 18.05 12.3252 17.8641 12.5111C17.6782 12.697 17.4522 12.8422 17.2 12.9418C16.9478 13.0413 16.6761 13.094 16.4 13.094H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.2451 6.04999C18.6651 4.59399 16.6451 3.74999 14.4451 3.74999C9.24513 3.74999 5.04513 7.94999 5.04513 13.15C5.04513 18.35 9.24513 22.55 14.4451 22.55C19.6451 22.55 23.8451 18.35 23.8451 13.15C23.8451 11.95 23.6051 10.76 23.1451 9.67999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="font-medium text-umber-900 mb-1">Learning Style Match</h4>
                        <p className="text-sm text-umber-600">Your engagement increases with visual content. Try using more diagrams and videos in your study routine.</p>
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