import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2, Plus, Users, BookOpen, CalendarCheck, Clock, BarChart, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import CourseCard from "@/components/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarWidget from "@/components/calendar-widget";

export default function InstructorDashboard() {
  const { user } = useAuth();

  // Fetch instructor courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/instructor/courses"],
    enabled: !!user,
  });

  // For demo purposes, we'll create some statistics placeholders
  const stats = [
    { id: 1, title: "Total Courses", value: courses?.length || 0, icon: <BookOpen className="h-6 w-6 text-primary-400" /> },
    { id: 2, title: "Total Students", value: 158, icon: <Users className="h-6 w-6 text-accent-400" /> },
    { id: 3, title: "Active Assignments", value: 23, icon: <CalendarCheck className="h-6 w-6 text-secondary-400" /> },
    { id: 4, title: "Pending Grades", value: 18, icon: <Clock className="h-6 w-6 text-umber-600" /> },
  ];

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

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
                  Welcome, Professor {user?.lastName}!
                </h1>
                <p className="text-sm text-umber-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <Card key={stat.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-umber-600">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-umber-900">{stat.value}</h3>
                    </div>
                    <div className="bg-neutral-100 p-3 rounded-full">
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>My Courses</CardTitle>
                    <Link href="/courses/create">
                      <Button variant="outline" size="sm">Manage Courses</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="draft">Draft</TabsTrigger>
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                      {courses && courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courses.map((course) => (
                            <CourseCard key={course.id} course={course} isInstructor={true} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-neutral-50 rounded-lg p-6 text-center">
                          <Book className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                          <h3 className="text-lg font-semibold text-umber-800 mb-2">No active courses</h3>
                          <p className="text-sm text-umber-600 mb-4">Create your first course to get started</p>
                          <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Course
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="draft">
                      <div className="bg-neutral-50 rounded-lg p-6 text-center">
                        <p className="text-umber-600">No draft courses</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="archived">
                      <div className="bg-neutral-50 rounded-lg p-6 text-center">
                        <p className="text-umber-600">No archived courses</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Grading Tasks */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Pending Grading Tasks</CardTitle>
                    <Link href="/grading">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-neutral-50 p-4 rounded-lg flex items-start gap-4">
                      <div className="bg-primary-100 p-2 rounded-md text-primary-500">
                        <BarChart className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="font-semibold text-umber-900">Data Analysis Final Project</h4>
                            <p className="text-sm text-umber-700">Data Science Fundamentals</p>
                          </div>
                          <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 whitespace-nowrap">
                            8 submissions
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-xs text-umber-600 mb-1">
                            <span>Grading progress</span>
                            <span>3/8</span>
                          </div>
                          <Progress value={37.5} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg flex items-start gap-4">
                      <div className="bg-secondary-100 p-2 rounded-md text-secondary-500">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="font-semibold text-umber-900">Historical Analysis Essay</h4>
                            <p className="text-sm text-umber-700">Introduction to African History</p>
                          </div>
                          <Badge variant="outline" className="bg-secondary-50 text-secondary-600 border-secondary-200 whitespace-nowrap">
                            12 submissions
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-xs text-umber-600 mb-1">
                            <span>Grading progress</span>
                            <span>5/12</span>
                          </div>
                          <Progress value={41.6} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2">
                  <Button variant="ghost" className="w-full text-primary-400 hover:text-primary-500 hover:bg-primary-50">
                    View all grading tasks
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Calendar Widget */}
              <CalendarWidget />

              {/* Student Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Activity</CardTitle>
                  <CardDescription>Recent student engagement across your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                          alt="Student" 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent-400 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-umber-900">Fatima M. submitted an assignment</p>
                        <p className="text-xs text-umber-600">Data Science Fundamentals • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                          alt="Student" 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent-400 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-umber-900">John D. asked a question</p>
                        <p className="text-xs text-umber-600">Introduction to African History • 3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                          alt="Student" 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-neutral-400 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-umber-900">Amara K. enrolled in your course</p>
                        <p className="text-xs text-umber-600">Business Administration • Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2">
                  <Button variant="ghost" className="w-full text-primary-400 hover:text-primary-500 hover:bg-primary-50">
                    View all activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
