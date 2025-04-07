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
  BarChart4,
  Building2,
  GraduationCap,
  FileText,
  Globe,
  Users,
  Briefcase,
  Landmark,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MinistryDashboard() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.firstName}!`}
        description="National Education System Oversight Dashboard"
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Institutions</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No registered institutions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No registered students
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employment Rate</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">
                  Not enough data
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graduation Rate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">
                  Not enough data
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Key Actions</CardTitle>
                <CardDescription>
                  Ministry of Education oversight tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Approve New Institution
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Review Education Standards
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  International Benchmarking
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  National education system health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Landmark className="h-16 w-16 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Ministry Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Department: {user?.ministryDepartment || "Not Set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      System Status: Initial Setup
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Update Ministry Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="institutions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Educational Institutions</CardTitle>
              <CardDescription>
                Manage and oversee all registered educational institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <Building2 className="mr-2 h-4 w-4" />
                    Register New Institution
                  </Button>
                </div>
                <div className="text-center py-12 border rounded-md">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Institutions Registered</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    There are no educational institutions registered in the system yet. Use the button above to register the first institution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>National Student Database</CardTitle>
              <CardDescription>
                Aggregate student data and educational outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-md">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Student Data Available</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  The national student database is empty. Student data will be populated as institutions register students in the system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>National Employment Outcomes</CardTitle>
              <CardDescription>
                Track graduate employment rates and workforce development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-md">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Employment Data Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Employment tracking features are under development. Soon you'll be able to analyze employment outcomes by institution, program, and demographics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Educational Policies</CardTitle>
              <CardDescription>
                Manage and publish national education policies and standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Create New Policy
                  </Button>
                </div>
                <div className="text-center py-12 border rounded-md">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Policies Created</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    No educational policies have been created yet. Use the button above to create your first policy document.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Education System Reports</CardTitle>
              <CardDescription>
                Generate comprehensive reports on the national education system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart4 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Reports Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Advanced reporting features are under development. Soon you'll be able to generate comprehensive reports on educational outcomes and system performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}