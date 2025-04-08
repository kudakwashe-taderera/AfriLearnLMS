import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  PlusCircle,
  Search,
  Calendar,
  BookOpen,
  MapPin,
  Building,
  Users,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Sample data for university applications
const myApplications = [
  {
    id: 1,
    university: "University of Cape Town",
    program: "Bachelor of Science in Computer Science",
    deadline: "2025-06-15",
    status: "in_progress",
    progress: 75,
    requirements: [
      { name: "Personal Statement", completed: true },
      { name: "Academic Transcripts", completed: true },
      { name: "Letters of Recommendation", completed: true },
      { name: "Application Fee", completed: false },
      { name: "English Proficiency Test", completed: true },
    ],
  },
  {
    id: 2,
    university: "University of Zimbabwe",
    program: "Master of Engineering",
    deadline: "2025-05-30",
    status: "submitted",
    progress: 100,
    requirements: [
      { name: "Personal Statement", completed: true },
      { name: "CV/Resume", completed: true },
      { name: "Academic Transcripts", completed: true },
      { name: "Research Proposal", completed: true },
      { name: "Letters of Recommendation", completed: true },
      { name: "Application Fee", completed: true },
    ],
  },
  {
    id: 3,
    university: "Stellenbosch University",
    program: "Bachelor of Commerce",
    deadline: "2025-07-10",
    status: "draft",
    progress: 25,
    requirements: [
      { name: "Personal Statement", completed: true },
      { name: "Academic Transcripts", completed: false },
      { name: "Letters of Recommendation", completed: false },
      { name: "Application Fee", completed: false },
    ],
  },
];

// Sample data for university listings
const universityListings = [
  {
    id: 101,
    name: "Chinhoyi University of Technology",
    location: "Chinhoyi, Zimbabwe",
    ranking: 12,
    programs: 120,
    deadline: "2025-08-15",
    image: "https://placehold.co/100x100?text=UG",
    description: "A leading research-intensive university with a tradition of excellence",
    tags: ["Public", "Research", "STEM Focus"],
  },
  {
    id: 102,
    name: "University of Johannesburg",
    location: "Johannesburg, South Africa",
    ranking: 8,
    programs: 165,
    deadline: "2025-07-30",
    image: "https://placehold.co/100x100?text=UJ",
    description: "An international university of choice, anchored in Africa",
    tags: ["Public", "Comprehensive", "International"],
  },
  {
    id: 103,
    name: "Cairo University",
    location: "Cairo, Egypt",
    ranking: 5,
    programs: 200,
    deadline: "2025-09-01",
    image: "https://placehold.co/100x100?text=CU",
    description: "One of the oldest and most prestigious universities in Africa and the Middle East",
    tags: ["Public", "Historic", "Research"],
  },
  {
    id: 104,
    name: "University of Lagos",
    location: "Lagos, Nigeria",
    ranking: 15,
    programs: 110,
    deadline: "2025-08-10",
    image: "https://placehold.co/100x100?text=UNILAG",
    description: "A comprehensive university committed to providing quality education",
    tags: ["Public", "Comprehensive", "Urban"],
  },
];

// Status badge component for applications
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "draft":
      return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>;
    case "in_progress":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
    case "submitted":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Submitted</Badge>;
    case "under_review":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Under Review</Badge>;
    case "accepted":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case "waitlisted":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Waitlisted</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter universities based on search term
  const filteredUniversities = universityListings.filter(university => 
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="University Applications"
        description="Manage your university applications and discover new opportunities"
      />

      <Tabs defaultValue="my-applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          <TabsTrigger value="discover">Discover Universities</TabsTrigger>
          <TabsTrigger value="deadlines">Important Deadlines</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="my-applications" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Applications ({myApplications.length})</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Application
            </Button>
          </div>

          <div className="grid gap-4">
            {myApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{application.university}</CardTitle>
                      <CardDescription>{application.program}</CardDescription>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Application Progress</span>
                        <span>{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{application.requirements.length} Requirements</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Application Requirements</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {application.requirements.map((req, index) => (
                          <div key={index} className="flex items-center text-sm">
                            {req.completed ? (
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                            )}
                            <span className={req.completed ? "" : "text-muted-foreground"}>
                              {req.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Continue Application
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search universities by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4">
            {filteredUniversities.map((university) => (
              <Card key={university.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                      <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <CardTitle>{university.name}</CardTitle>
                        <Badge variant="outline" className="ml-2">Rank #{university.ranking}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {university.location}
                      </div>
                      <CardDescription className="mt-2">{university.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {university.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mt-4">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <BookOpen className="h-5 w-5 text-primary mb-1" />
                      <span className="font-medium">{university.programs}</span>
                      <span className="text-xs text-muted-foreground">Programs</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <Users className="h-5 w-5 text-primary mb-1" />
                      <span className="font-medium">25,000+</span>
                      <span className="text-xs text-muted-foreground">Students</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <Award className="h-5 w-5 text-primary mb-1" />
                      <span className="font-medium">92%</span>
                      <span className="text-xs text-muted-foreground">Graduation Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                  </Button>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" /> Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important dates for your application process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">University of Zimbabwe - Early Decision</h4>
                    <p className="text-sm text-muted-foreground">May 30, 2025 (15 days remaining)</p>
                  </div>
                  <Button size="sm">Complete</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">University of Cape Town - Regular Decision</h4>
                    <p className="text-sm text-muted-foreground">June 15, 2025 (31 days remaining)</p>
                  </div>
                  <Button size="sm">Complete</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Stellenbosch University - Regular Decision</h4>
                    <p className="text-sm text-muted-foreground">July 10, 2025 (56 days remaining)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Chinhoyi University of Technology - Regular Decision</h4>
                    <p className="text-sm text-muted-foreground">August 15, 2025 (92 days remaining)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Financial Aid Application Deadline</h4>
                    <p className="text-sm text-muted-foreground">September 1, 2025 (109 days remaining)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Deadlines</CardTitle>
              <CardDescription>Important dates for scholarship applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">National Merit Scholarship</h4>
                    <p className="text-sm text-muted-foreground">June 1, 2025 (17 days remaining)</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">African Leadership Scholarship</h4>
                    <p className="text-sm text-muted-foreground">July 15, 2025 (61 days remaining)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">STEM Excellence Scholarship</h4>
                    <p className="text-sm text-muted-foreground">August 10, 2025 (87 days remaining)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">My Documents</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </div>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Documents</CardTitle>
                <CardDescription>Transcripts, certificates, and academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">High School Transcript</h4>
                      <p className="text-sm text-muted-foreground">Uploaded on April 2, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">National Exam Results</h4>
                      <p className="text-sm text-muted-foreground">Uploaded on April 5, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">English Proficiency Certificate</h4>
                      <p className="text-sm text-muted-foreground">Uploaded on March 25, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Documents</CardTitle>
                <CardDescription>Personal statements, essays, and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Personal Statement</h4>
                      <p className="text-sm text-muted-foreground">Last edited on April 10, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Letter of Recommendation - Dr. Osei</h4>
                      <p className="text-sm text-muted-foreground">Received on April 15, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Letter of Recommendation - Prof. Nkosi</h4>
                      <p className="text-sm text-muted-foreground">Received on April 12, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-10 w-10 text-primary mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Extracurricular Activities Resume</h4>
                      <p className="text-sm text-muted-foreground">Last edited on April 8, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}