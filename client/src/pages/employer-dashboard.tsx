import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  FileText,
  BarChart4,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
  BadgeCheck,
  Filter,
  Clock,
  ChevronRight,
  GraduationCap as School,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Mock data for demonstration purposes
const mockJobs = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "TechCorp Ltd.",
    location: "Harare, Zimbabwe",
    type: "Internship",
    salary: "$800-$1,200/month",
    postedDate: "2025-04-01",
    applicationCount: 12,
    status: "active",
    requirements: [
      "Currently pursuing a degree in Computer Science or related field",
      "Knowledge of JavaScript and React",
      "Good problem-solving skills"
    ],
    description: "We're looking for talented software engineering interns to join our development team...",
  },
  {
    id: 2,
    title: "Marketing Assistant",
    company: "GlobalMarketing Inc.",
    location: "Remote",
    type: "Part-time",
    salary: "$15-$20/hour",
    postedDate: "2025-03-28",
    applicationCount: 8,
    status: "active",
    requirements: [
      "Currently pursuing a degree in Marketing or Communications",
      "Excellent written and verbal communication skills",
      "Experience with social media platforms"
    ],
    description: "Join our marketing team to help create and implement marketing strategies...",
  },
];

const mockApplicants = [
  {
    id: 101,
    name: "David Mukwekwe",
    email: "david.m@example.com",
    university: "University of Zimbabwe",
    program: "Computer Science",
    year: "3rd Year",
    gpa: 3.8,
    skills: ["JavaScript", "React", "Node.js", "Python"],
    appliedFor: "Software Engineer Intern",
    appliedDate: "2025-04-02",
    status: "under_review",
    grades: [
      { course: "Data Structures", grade: "A", year: "2024" },
      { course: "Algorithms", grade: "A-", year: "2024" },
      { course: "Web Development", grade: "A", year: "2023" },
      { course: "Database Systems", grade: "B+", year: "2023" },
    ],
    coverLetter: "I am excited to apply for the Software Engineer Intern position at TechCorp Ltd..."
  },
  {
    id: 102,
    name: "Chido Makunike",
    email: "chido.m@example.com",
    university: "University of Zambia",
    program: "Computer Engineering",
    year: "4th Year",
    gpa: 3.6,
    skills: ["Java", "C++", "Android Development", "IoT"],
    appliedFor: "Software Engineer Intern",
    appliedDate: "2025-04-03",
    status: "interviewing",
    grades: [
      { course: "Object-Oriented Programming", grade: "A-", year: "2023" },
      { course: "Computer Architecture", grade: "B+", year: "2023" },
      { course: "Mobile Development", grade: "A", year: "2024" },
      { course: "Operating Systems", grade: "B", year: "2022" },
    ],
    coverLetter: "With my background in Computer Engineering and experience in mobile development..."
  },
];

// Job posting form schema
const jobFormSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  location: z.string().min(3, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  qualifications: z.string().min(20, "Qualifications must be at least 20 characters"),
  deadline: z.string().min(1, "Application deadline is required"),
});

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeJob, setActiveJob] = useState<number | null>(null);
  const [activeApplicant, setActiveApplicant] = useState<number | null>(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  // Form for job posting
  const jobForm = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: "",
      qualifications: "",
      deadline: "",
    },
  });

  // Mock job posting mutation
  const postJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobFormSchema>) => {
      // Simulating API request
      return await new Promise(resolve => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      toast({
        title: "Job Posted Successfully",
        description: "Your job listing has been published.",
      });
      setJobDialogOpen(false);
      jobForm.reset();
    },
    onError: () => {
      toast({
        title: "Failed to Post Job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitJobForm = (data: z.infer<typeof jobFormSchema>) => {
    postJobMutation.mutate(data);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.firstName || "Employer"}!`}
        description="Manage your AfriLearnHub employer account"
      >
        <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post a New Job</DialogTitle>
              <DialogDescription>
                Create a new job listing to find talented students and graduates.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...jobForm}>
              <form onSubmit={jobForm.handleSubmit(onSubmitJobForm)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Software Engineer Intern" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Harare, Zimbabwe or Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full_time">Full-time</SelectItem>
                            <SelectItem value="part_time">Part-time</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $800-$1,200/month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the job role and responsibilities..." 
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobForm.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List the requirements for this job (one per line)..." 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Skills, experience, or attributes required for the role
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="qualifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualifications</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List the educational qualifications needed (one per line)..." 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Educational background and certifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobForm.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setJobDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={postJobMutation.isPending}
                  >
                    {postJobMutation.isPending ? "Posting..." : "Post Job"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Your Job Listings</CardTitle>
                <CardDescription>
                  Manage your current job listings and create new opportunities
                </CardDescription>
              </div>
              <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Post New Job
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search job listings" 
                      className="w-full pl-8" 
                    />
                  </div>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {mockJobs.length > 0 ? (
                  <div className="space-y-4">
                    {mockJobs.map((job) => (
                      <Card 
                        key={job.id} 
                        className={`border ${activeJob === job.id ? 'border-primary' : 'border-border'}`}
                        onClick={() => setActiveJob(job.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {job.company}
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground mx-1"></span>
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={job.status === 'active' ? 'default' : 'outline'}
                              className={job.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100 px-2 h-7' : 'px-2 h-7'}
                            >
                              {job.status === 'active' ? 'Active' : job.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-3 gap-4 py-2">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Job Type</p>
                              <p className="text-sm font-medium">{job.type}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Salary Range</p>
                              <p className="text-sm font-medium">{job.salary}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Posted Date</p>
                              <p className="text-sm font-medium">{job.postedDate}</p>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm line-clamp-2">{job.description}</p>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-2">Requirements:</p>
                            <ul className="text-xs space-y-1">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <BadgeCheck className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">{req}</span>
                                </li>
                              ))}
                              {job.requirements.length > 3 && (
                                <li className="text-xs text-muted-foreground">
                                  + {job.requirements.length - 3} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-muted-foreground mr-1.5" />
                              <span className="text-sm text-muted-foreground">
                                {job.applicationCount} applications
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="default">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No Jobs Listed</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      You haven't posted any job listings yet. Create your first job opportunity to connect with talented students.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setJobDialogOpen(true)}
                    >
                      Create Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Job Details (Optional Modal or Expanded View) */}
          {activeJob && (
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Additional information and management options for the selected job
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockJobs.map((job) => (
                  job.id === activeJob && (
                    <div key={job.id} className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold">{job.title}</h2>
                          <p className="text-muted-foreground">{job.company} • {job.location}</p>
                        </div>
                        <Badge 
                          variant={job.status === 'active' ? 'default' : 'outline'}
                          className={job.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {job.status === 'active' ? 'Active' : job.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Job Type</p>
                          <p className="font-medium">{job.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Salary Range</p>
                          <p className="font-medium">{job.salary}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Posted Date</p>
                          <p className="font-medium">{job.postedDate}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p>{job.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Requirements</h3>
                        <ul className="space-y-2 list-disc pl-5">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Applications</h3>
                        <div className="flex items-center space-x-4">
                          <div className="bg-muted p-4 rounded-md flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Total Applications</span>
                              <span className="font-bold">{job.applicationCount}</span>
                            </div>
                            <Progress value={job.applicationCount * 5} className="h-2" />
                          </div>
                          
                          <div className="bg-muted p-4 rounded-md flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Under Review</span>
                              <span className="font-bold">{Math.floor(job.applicationCount * 0.7)}</span>
                            </div>
                            <Progress value={Math.floor(job.applicationCount * 0.7) * 5} className="h-2" />
                          </div>
                          
                          <div className="bg-muted p-4 rounded-md flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Interviewing</span>
                              <span className="font-bold">{Math.floor(job.applicationCount * 0.3)}</span>
                            </div>
                            <Progress value={Math.floor(job.applicationCount * 0.3) * 5} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </CardContent>
              <CardFooter className="border-t bg-muted/50 justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Close Listing
                  </Button>
                  <Button variant="outline" size="sm">
                    Duplicate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">
                    View Applicants
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Jobs and Applicants List */}
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                  <CardDescription>
                    Review and manage applications
                  </CardDescription>
                  <div className="mt-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search applications" 
                        className="w-full pl-8" 
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {mockApplicants.length > 0 ? (
                    <ScrollArea className="h-[600px]">
                      <div className="px-4 py-2 bg-muted text-sm font-medium">
                        Software Engineer Intern (2 Applicants)
                      </div>
                      {mockApplicants.map((applicant) => (
                        <div 
                          key={applicant.id}
                          onClick={() => setActiveApplicant(applicant.id)}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${activeApplicant === applicant.id ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">{applicant.name}</h3>
                            <Badge 
                              variant={applicant.status === 'interviewing' ? 'default' : 'outline'}
                              className={applicant.status === 'interviewing' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            >
                              {applicant.status === 'interviewing' ? 'Interviewing' : 'Under Review'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex gap-2 items-center">
                            <School className="h-3 w-3" />
                            {applicant.university}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 flex gap-1 items-center">
                            <Calendar className="h-3 w-3" />
                            Applied: {applicant.appliedDate}
                          </div>
                          <div className="mt-2 text-xs">
                            <Badge variant="outline" className="mr-1 bg-blue-50">
                              GPA: {applicant.gpa}
                            </Badge>
                            <Badge variant="outline" className="mr-1">
                              {applicant.program}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Applications Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        You haven't received any job applications yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Applicant Details */}
            <div className="md:col-span-2">
              {activeApplicant ? (
                <Card className="h-full">
                  {mockApplicants.map((applicant) => (
                    applicant.id === activeApplicant && (
                      <div key={applicant.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{applicant.name}</CardTitle>
                              <CardDescription>
                                Application for {applicant.appliedFor} • Applied on {applicant.appliedDate}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <User className="h-4 w-4 mr-1" />
                                View Profile
                              </Button>
                              <Button size="sm">
                                Schedule Interview
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Applicant Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Education</p>
                              <p className="font-medium">{applicant.university}</p>
                              <p>{applicant.program}, {applicant.year}</p>
                              <p className="text-sm font-medium">GPA: {applicant.gpa}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Contact</p>
                              <p className="font-medium">{applicant.email}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge 
                                variant={applicant.status === 'interviewing' ? 'default' : 'outline'}
                                className={applicant.status === 'interviewing' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              >
                                {applicant.status === 'interviewing' ? 'Interviewing' : 'Under Review'}
                              </Badge>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {/* Academic Records */}
                          <div>
                            <h3 className="text-lg font-medium mb-4">Academic Records & Grades</h3>
                            <div className="border rounded-md">
                              <div className="grid grid-cols-3 bg-muted p-3 text-sm font-medium">
                                <div>Course</div>
                                <div>Grade</div>
                                <div>Year</div>
                              </div>
                              {applicant.grades.map((grade, index) => (
                                <div 
                                  key={index} 
                                  className={`grid grid-cols-3 p-3 border-t ${
                                    grade.grade.startsWith('A') ? 'bg-green-50' : 
                                    grade.grade.startsWith('B') ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div>{grade.course}</div>
                                  <div className="font-medium">{grade.grade}</div>
                                  <div>{grade.year}</div>
                                </div>
                              ))}
                              <div className="bg-muted p-3 text-sm border-t">
                                <div className="flex justify-between">
                                  <span>Overall GPA</span>
                                  <span className="font-semibold">{applicant.gpa}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {/* Skills */}
                          <div>
                            <h3 className="text-lg font-medium mb-3">Skills & Qualifications</h3>
                            <div className="flex flex-wrap gap-2">
                              {applicant.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Cover Letter */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Cover Letter</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{applicant.coverLetter}</p>
                            </CardContent>
                          </Card>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/50 justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button variant="outline" size="sm">
                              Email Candidate
                            </Button>
                          </div>
                          <Button size="sm" className="gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Approve & Schedule Interview
                          </Button>
                        </CardFooter>
                      </div>
                    )
                  ))}
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center p-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">Select an Applicant</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      Click on an applicant from the list to view their details, grades, and application.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
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