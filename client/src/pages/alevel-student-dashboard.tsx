import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { StudentSubjects } from "@shared/schema";
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
  Compass,
  GraduationCap,
  BadgeInfo,
  School,
  ArrowUpRight,
  BriefcaseIcon,
  Award,
  BookMarked
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

export default function ALevelStudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [_, navigate] = useLocation();
  
  // Fetch student subjects
  const {
    data: studentSubjects,
    isLoading: studentSubjectsLoading
  } = useQuery<StudentSubjects>({
    queryKey: ["/api/student/active-subjects"],
    enabled: !!user && user.role === "student",
  });
  
  // Define progress steps
  const progressSteps = [
    { id: 'subject-selection', label: 'Subject Selection', complete: !!studentSubjects, href: '/alevel-subject-selection' },
    { id: 'university-exploration', label: 'University Exploration', complete: false, href: '/universities' },
    { id: 'application', label: 'University Applications', complete: false, href: '/applications' },
    { id: 'course-materials', label: 'Course Materials', complete: false, href: '/courses?level=a_level' },
  ];
  
  // Current step (find the first incomplete step)
  const currentStep = progressSteps.find(step => !step.complete)?.id || progressSteps[0].id;
  
  // Render loading state
  if (studentSubjectsLoading) {
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
              Prepare for university entry and specialization as you progress through your A-Level education.
            </p>
          </div>
          
          {/* User Progress Bar */}
          <div className="mb-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Education Journey</h3>
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
          
          {/* Education Level Specific Action Card for A-Level Students */}
          <div className="mb-8">
            <Card className={`bg-gradient-to-r ${studentSubjects ? 'from-green-50 to-green-100 border-green-200' : 'from-blue-50 to-blue-100 border-blue-200'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    {studentSubjects ? (
                      <>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
                          Subjects Selected
                        </div>
                        <h3 className="text-xl font-semibold text-green-900 mb-2">
                          Your A-Level Subjects
                        </h3>
                        <p className="text-green-800 mb-4">
                          You have successfully selected your A-Level subjects. You can review or modify your selections at any time.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                          {studentSubjects.coreSubjects.map((subject: string, index: number) => (
                            <div key={index} className="bg-white rounded-md px-3 py-2 border border-green-200 text-green-800">
                              {subject}
                            </div>
                          ))}
                          {studentSubjects.electiveSubjects.map((subject: string, index: number) => (
                            <div key={index} className="bg-white rounded-md px-3 py-2 border border-green-200 text-green-800">
                              {subject}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                          Required Action
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">
                          Select Your A-Level Subjects
                        </h3>
                        <p className="text-blue-800 mb-4">
                          Choose subjects that align with your university and career aspirations.
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="md:w-1/3 lg:w-1/4">
                    <Link href="/alevel-subject-selection">
                      <Button 
                        className={`w-full ${studentSubjects 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md gap-2 py-4 px-4 h-auto border-none`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span>{studentSubjects ? 'View or Edit Subjects' : 'Start Subject Selection'}</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Career Guidance & University Cards */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Explorer */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">University Application</CardTitle>
                <CardDescription>Explore universities and prepare your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <School className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Explore university programs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BadgeInfo className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Learn admission requirements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Submit applications</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full gap-2" size="sm">
                  <Link href="/universities">
                    <School className="h-4 w-4" />
                    <span>Explore Universities</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* View Jobs Card */}
            <Card className="border-border bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Job Opportunities</CardTitle>
                <CardDescription>Explore current job listings and internships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BriefcaseIcon className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Discover entry-level positions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookMarked className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Find internships for career development</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">Learn about job requirements</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Resources */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Learning Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/courses?level=a_level" className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700 group-hover:text-primary-600">Course Materials</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-umber-500" />
                </Link>
                
                <Link href="/assignments" className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md group">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700 group-hover:text-primary-600">Assignments</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-umber-500" />
                </Link>
                
                <Link href="/discussions" className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md group">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700 group-hover:text-primary-600">Discussions</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-umber-500" />
                </Link>
              </CardContent>
            </Card>
            
            {/* Progress Tracking */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Academic Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-umber-700">A-Level Progress</span>
                    <span className="text-sm font-medium text-umber-900">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700">View detailed analytics</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-umber-500" />
                </div>
              </CardContent>
            </Card>
            
            {/* Next Level Preparation */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">University Preparation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-umber-600">
                  Prepare for university by exploring programs, scholarships, and requirements.
                </p>
                
                <Link href="/applications" className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md group">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary-500" />
                    <span className="text-umber-700 group-hover:text-primary-600">University Applications</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-umber-500" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}