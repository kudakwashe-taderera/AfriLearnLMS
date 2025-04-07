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
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  FileText,
  BarChart4,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EmployerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.firstName}!`}
        description="Manage your EduVerse employer account"
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No job listings created yet
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No applications received yet
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No university partnerships yet
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common employer tasks and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Candidates
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Partner with Universities
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Create Scholarship
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Your recent employer activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No recent activities to display
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Job Listings</CardTitle>
              <CardDescription>
                Manage your current job listings and create new opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </div>
                <div className="text-center py-12 border rounded-md">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Jobs Listed</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    You haven't posted any job listings yet. Create your first job opportunity to connect with talented students.
                  </p>
                  <Button className="mt-4">Create Your First Job</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                Review and manage applications for your job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-md">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Applications Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven't received any job applications yet. Applications will appear here once students apply to your job listings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Search</CardTitle>
              <CardDescription>
                Find and connect with qualified candidates from our talent pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Candidate Search Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Our advanced candidate search feature is currently under development. Soon you'll be able to search for candidates based on skills, experience, and educational background.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Analytics</CardTitle>
              <CardDescription>
                Track performance metrics for your job listings and recruitment efforts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart4 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Analytics Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Detailed analytics for your recruitment activities will be available soon. Track application rates, candidate quality, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}