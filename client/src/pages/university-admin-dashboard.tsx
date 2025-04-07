import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  BookOpen,
  School,
  Users,
  FileCheck,
  BarChart4,
  Award,
  Building,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function UniversityAdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.firstName}!`}
        description="Manage your institution on EduVerse"
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Academic Programs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Programs</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No academic programs yet
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No applications received
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No enrolled students
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instructors</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No instructors registered
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common university administration tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button className="w-full justify-start" variant="outline">
                  <Award className="mr-2 h-4 w-4" />
                  Create Academic Program
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Review Applications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Courses
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <School className="mr-2 h-4 w-4" />
                  Add Instructors
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Institution Profile</CardTitle>
                <CardDescription>
                  Your institution's information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Building className="h-16 w-16 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{user?.universityId ? "Your University" : "University Not Set"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.universityId ? "University details" : "Please complete your institution profile"}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {user?.universityId ? "Edit Profile" : "Set Up Institution Profile"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Programs</CardTitle>
              <CardDescription>
                Manage the academic programs offered by your institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <Award className="mr-2 h-4 w-4" />
                    Create New Program
                  </Button>
                </div>
                <div className="text-center py-12 border rounded-md">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Programs Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Your institution hasn't created any academic programs yet. Add your first program to attract students.
                  </p>
                  <Button className="mt-4">Add First Program</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Applications</CardTitle>
              <CardDescription>
                Review and manage student applications to your programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-md">
                <FileCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Applications Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven't received any program applications yet. Applications will appear here once students apply to your programs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Manage students enrolled in your institution's programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-md">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Students Enrolled</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  There are no students enrolled in your institution's programs yet. Students will appear here after successful enrollment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Management</CardTitle>
              <CardDescription>
                Manage instructors and faculty at your institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <School className="mr-2 h-4 w-4" />
                    Add Instructor
                  </Button>
                </div>
                <div className="text-center py-12 border rounded-md">
                  <School className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Instructors Added</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Your institution hasn't added any instructors yet. Add instructors to create and manage courses.
                  </p>
                  <Button className="mt-4">Add First Instructor</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institution Analytics</CardTitle>
              <CardDescription>
                Track key metrics and performance indicators for your institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart4 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Analytics Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Detailed analytics for your institution will be available soon. Track enrollment rates, student performance, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}