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
  Search,
  MapPin,
  Briefcase,
  Building,
  Clock,
  Calendar,
  Star,
  Filter,
  ChevronRight,
  BookmarkPlus,
  PlusCircle,
  FileText,
  Bookmark,
  BookOpen,
  GraduationCap,
  CheckCircle,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for job listings
const jobListings = [
  {
    id: 1,
    title: "Software Engineer",
    company: {
      id: 101,
      name: "Tech Innovate Africa",
      logo: "https://placehold.co/40?text=TIA",
      location: "Nairobi, Kenya",
    },
    type: "Full-time",
    location: "Nairobi, Kenya (On-site)",
    salary: "$45,000 - $65,000",
    posted: "2025-04-01",
    deadline: "2025-05-15",
    description: "We're looking for a talented Software Engineer to join our growing team. You'll work on developing innovative solutions for African businesses and consumers.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "2+ years of experience in software development",
      "Proficiency in at least one modern programming language (Python, JavaScript, etc.)",
      "Experience with web development frameworks",
      "Strong problem-solving skills",
    ],
    tags: ["Software Development", "Web Development", "Backend", "Frontend"],
    matchScore: 92,
  },
  {
    id: 2,
    title: "Marketing Specialist",
    company: {
      id: 102,
      name: "AfriMarket Solutions",
      logo: "https://placehold.co/40?text=AMS",
      location: "Lagos, Nigeria",
    },
    type: "Full-time",
    location: "Lagos, Nigeria (Hybrid)",
    salary: "$35,000 - $50,000",
    posted: "2025-03-25",
    deadline: "2025-05-01",
    description: "Join our dynamic marketing team to help African businesses reach their target audiences through innovative marketing strategies.",
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related field",
      "1-3 years of experience in digital marketing",
      "Knowledge of SEO, social media marketing, and content creation",
      "Strong analytical and communication skills",
      "Experience with marketing analytics tools",
    ],
    tags: ["Marketing", "Digital Marketing", "Social Media", "Content Strategy"],
    matchScore: 78,
  },
  {
    id: 3,
    title: "Data Scientist",
    company: {
      id: 103,
      name: "AfriData Analytics",
      logo: "https://placehold.co/40?text=ADA",
      location: "Cape Town, South Africa",
    },
    type: "Full-time",
    location: "Cape Town, South Africa (On-site)",
    salary: "$55,000 - $75,000",
    posted: "2025-04-05",
    deadline: "2025-05-20",
    description: "We're seeking a skilled Data Scientist to help extract insights from complex datasets and develop machine learning models for various industry applications.",
    requirements: [
      "Master's or PhD in Computer Science, Statistics, or related field",
      "3+ years of experience in data science or machine learning",
      "Proficiency in Python, R, or similar programming languages",
      "Experience with machine learning frameworks and big data technologies",
      "Strong statistical analysis skills",
    ],
    tags: ["Data Science", "Machine Learning", "AI", "Big Data"],
    matchScore: 85,
  },
  {
    id: 4,
    title: "Environmental Engineer",
    company: {
      id: 104,
      name: "GreenAfrica Solutions",
      logo: "https://placehold.co/40?text=GAS",
      location: "Accra, Ghana",
    },
    type: "Full-time",
    location: "Accra, Ghana (On-site)",
    salary: "$40,000 - $60,000",
    posted: "2025-03-30",
    deadline: "2025-05-10",
    description: "Join our team of environmental engineers working on sustainable solutions for African communities and businesses.",
    requirements: [
      "Bachelor's or Master's degree in Environmental Engineering",
      "2+ years of experience in environmental consulting or related field",
      "Knowledge of environmental regulations and sustainability practices",
      "Experience with environmental impact assessments",
      "Strong analytical and problem-solving skills",
    ],
    tags: ["Environmental Engineering", "Sustainability", "Clean Energy", "Conservation"],
    matchScore: 72,
  },
  {
    id: 5,
    title: "Finance Analyst",
    company: {
      id: 105,
      name: "Pan-African Banking Group",
      logo: "https://placehold.co/40?text=PABG",
      location: "Cairo, Egypt",
    },
    type: "Full-time",
    location: "Cairo, Egypt (On-site)",
    salary: "$40,000 - $55,000",
    posted: "2025-04-03",
    deadline: "2025-05-17",
    description: "We're looking for a Finance Analyst to join our growing team and help analyze financial data, prepare reports, and support strategic decision-making.",
    requirements: [
      "Bachelor's degree in Finance, Accounting, or Business Administration",
      "2+ years of experience in financial analysis or related role",
      "Strong Excel and financial modeling skills",
      "Knowledge of financial reporting and analysis",
      "Excellent attention to detail",
    ],
    tags: ["Finance", "Banking", "Financial Analysis", "Investment"],
    matchScore: 68,
  },
];

// Sample data for internships
const internships = [
  {
    id: 101,
    title: "Software Development Intern",
    company: {
      id: 101,
      name: "Tech Innovate Africa",
      logo: "https://placehold.co/40?text=TIA",
      location: "Nairobi, Kenya",
    },
    duration: "3 months",
    startDate: "2025-06-01",
    stipend: "$800/month",
    posted: "2025-04-02",
    deadline: "2025-05-15",
    description: "Gain hands-on experience in software development working alongside our engineering team on real-world projects.",
    requirements: [
      "Currently pursuing a degree in Computer Science or related field",
      "Basic knowledge of programming languages (Python, JavaScript, etc.)",
      "Eagerness to learn and problem-solve",
      "Good communication skills",
    ],
    tags: ["Software Development", "Programming", "Web Development"],
  },
  {
    id: 102,
    title: "Marketing Intern",
    company: {
      id: 102,
      name: "AfriMarket Solutions",
      logo: "https://placehold.co/40?text=AMS",
      location: "Lagos, Nigeria",
    },
    duration: "6 months",
    startDate: "2025-07-01",
    stipend: "$600/month",
    posted: "2025-03-28",
    deadline: "2025-05-30",
    description: "Join our marketing team to learn about digital marketing strategies, content creation, and market analysis for African businesses.",
    requirements: [
      "Currently pursuing a degree in Marketing, Communications, or related field",
      "Interest in digital marketing and social media",
      "Creative thinking and good writing skills",
      "Basic knowledge of marketing concepts",
    ],
    tags: ["Marketing", "Social Media", "Content Creation"],
  },
  {
    id: 103,
    title: "Data Analysis Intern",
    company: {
      id: 103,
      name: "AfriData Analytics",
      logo: "https://placehold.co/40?text=ADA",
      location: "Cape Town, South Africa",
    },
    duration: "4 months",
    startDate: "2025-06-15",
    stipend: "$750/month",
    posted: "2025-04-05",
    deadline: "2025-05-25",
    description: "Work with our data science team to analyze data, develop visualizations, and contribute to machine learning projects.",
    requirements: [
      "Currently pursuing a degree in Computer Science, Statistics, or related field",
      "Basic knowledge of data analysis and programming",
      "Familiarity with Python or R",
      "Interest in machine learning and AI",
    ],
    tags: ["Data Analysis", "Statistics", "Programming"],
  },
];

// Sample data for saved jobs
const savedJobs = [
  {
    id: 2,
    title: "Marketing Specialist",
    company: {
      id: 102,
      name: "AfriMarket Solutions",
      logo: "https://placehold.co/40?text=AMS",
      location: "Lagos, Nigeria",
    },
    type: "Full-time",
    location: "Lagos, Nigeria (Hybrid)",
    salary: "$35,000 - $50,000",
    posted: "2025-03-25",
    deadline: "2025-05-01",
    savedDate: "2025-04-01",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: {
      id: 103,
      name: "AfriData Analytics",
      logo: "https://placehold.co/40?text=ADA",
      location: "Cape Town, South Africa",
    },
    type: "Full-time",
    location: "Cape Town, South Africa (On-site)",
    salary: "$55,000 - $75,000",
    posted: "2025-04-05",
    deadline: "2025-05-20",
    savedDate: "2025-04-06",
  },
];

// Sample data for applications
const applications = [
  {
    id: 1001,
    job: {
      id: 1,
      title: "Software Engineer",
      company: {
        id: 101,
        name: "Tech Innovate Africa",
        logo: "https://placehold.co/40?text=TIA",
        location: "Nairobi, Kenya",
      },
    },
    status: "in_review",
    appliedDate: "2025-04-02",
    lastUpdated: "2025-04-05",
    notes: "Initial screening call scheduled for April 10, 2025",
  },
  {
    id: 1002,
    job: {
      id: 4,
      title: "Environmental Engineer",
      company: {
        id: 104,
        name: "GreenAfrica Solutions",
        logo: "https://placehold.co/40?text=GAS",
        location: "Accra, Ghana",
      },
    },
    status: "submitted",
    appliedDate: "2025-04-04",
    lastUpdated: "2025-04-04",
    notes: "",
  },
];

// Format date function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Application status badge component
function ApplicationStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "submitted":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Submitted</Badge>;
    case "in_review":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">In Review</Badge>;
    case "interview":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Interview</Badge>;
    case "offered":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Offered</Badge>;
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case "accepted":
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Accepted</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function JobsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationType, setLocationType] = useState("all");
  const [jobType, setJobType] = useState("all");
  
  // Filter jobs based on search term and filters
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocationType = locationType === "all" || 
                               (locationType === "onsite" && job.location.includes("On-site")) ||
                               (locationType === "remote" && job.location.includes("Remote")) ||
                               (locationType === "hybrid" && job.location.includes("Hybrid"));
    
    const matchesJobType = jobType === "all" || job.type.toLowerCase().includes(jobType.toLowerCase());
    
    return matchesSearch && matchesLocationType && matchesJobType;
  });
  
  // Filter internships based on search term
  const filteredInternships = internships.filter(internship => 
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Jobs & Internships"
        description="Find career opportunities and internships aligned with your skills and interests"
      />

      <div className="mb-6">
        <Input
          placeholder="Search jobs, companies, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="profile">Career Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold">Job Opportunities ({filteredJobs.length})</h2>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Select value={locationType} onValueChange={setLocationType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Location Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="relative overflow-hidden">
                {job.matchScore >= 90 && (
                  <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 text-xs font-medium">
                    Top Match
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={job.company.logo} alt={job.company.name} />
                        <AvatarFallback>{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.company.name}</CardDescription>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{job.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline">{job.salary}</Badge>
                      <div className="text-sm text-muted-foreground">
                        Posted: {formatDate(job.posted)}
                      </div>
                      {job.matchScore && (
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">Match: {job.matchScore}%</div>
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${job.matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Application Deadline: <span className="font-medium">{formatDate(job.deadline)}</span></span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <BookmarkPlus className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button>
                    Apply Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internships" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Internship Opportunities ({filteredInternships.length})</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredInternships.map((internship) => (
              <Card key={internship.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 rounded-md">
                      <AvatarImage src={internship.company.logo} alt={internship.company.name} />
                      <AvatarFallback>{internship.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{internship.title}</CardTitle>
                      <CardDescription>{internship.company.name}</CardDescription>
                      <div className="flex items-center mt-1 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        <span className="text-muted-foreground">{internship.company.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{internship.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Starts: {formatDate(internship.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Duration: {internship.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">{internship.stipend}</Badge>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Deadline: {formatDate(internship.deadline)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {internship.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <BookmarkPlus className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button>
                    Apply Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Applications ({applications.length})</h2>
          </div>

          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={application.job.company.logo} alt={application.job.company.name} />
                        <AvatarFallback>{application.job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{application.job.title}</CardTitle>
                        <CardDescription>{application.job.company.name}</CardDescription>
                        <div className="flex items-center mt-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{application.job.company.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <ApplicationStatusBadge status={application.status} />
                      <div className="text-sm text-muted-foreground">
                        Applied: {formatDate(application.appliedDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {formatDate(application.lastUpdated)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {application.notes && (
                    <div className="bg-muted/50 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <p className="text-sm">{application.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-muted-foreground">
                      {application.status === "submitted" && "Application is awaiting review"}
                      {application.status === "in_review" && "Your application is being reviewed"}
                      {application.status === "interview" && "You've been selected for an interview"}
                      {application.status === "offered" && "You've received an offer"}
                      {application.status === "rejected" && "Application was not selected"}
                      {application.status === "accepted" && "You've accepted the offer"}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button>
                    View Application <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Saved Jobs ({savedJobs.length})</h2>
          </div>

          <div className="grid gap-4">
            {savedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={job.company.logo} alt={job.company.name} />
                        <AvatarFallback>{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.company.name}</CardDescription>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{job.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline">{job.salary}</Badge>
                      <div className="text-sm text-muted-foreground">
                        Saved: {formatDate(job.savedDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Deadline: {formatDate(job.deadline)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" /> Remove
                  </Button>
                  <Button>
                    Apply Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Profile</CardTitle>
              <CardDescription>Your professional profile visible to employers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Computer Science Student • University of Cape Town</p>
                  </div>
                </div>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Education</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Bachelor of Science in Computer Science</h4>
                      <p className="text-sm">University of Cape Town • 2022 - 2026 (Expected)</p>
                      <p className="text-sm text-muted-foreground">GPA: 3.8/4.0</p>
                      <p className="text-sm text-muted-foreground mt-1">Relevant coursework: Data Structures, Algorithms, Database Systems, Operating Systems, Machine Learning</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Python</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">JavaScript</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">React</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">SQL</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Data Analysis</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Git</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Machine Learning</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Problem Solving</Badge>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Communication</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Projects</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">E-commerce Platform</h4>
                      <p className="text-sm text-muted-foreground">A full-stack e-commerce application built using React, Node.js, and MongoDB</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">React</Badge>
                        <Badge variant="outline" className="text-xs">Node.js</Badge>
                        <Badge variant="outline" className="text-xs">MongoDB</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Machine Learning for Crop Yield Prediction</h4>
                      <p className="text-sm text-muted-foreground">Developed a model to predict crop yields based on weather and soil data</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">Python</Badge>
                        <Badge variant="outline" className="text-xs">Scikit-Learn</Badge>
                        <Badge variant="outline" className="text-xs">Pandas</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Courses & Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Introduction to Programming (CS101)</h4>
                      <p className="text-sm text-muted-foreground">Grade: A (98%)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Structures and Algorithms (CS201)</h4>
                      <p className="text-sm text-muted-foreground">Grade: A- (92%)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Dean's List</h4>
                      <p className="text-sm text-muted-foreground">2023-2024 Academic Year</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" /> Update Resume
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}