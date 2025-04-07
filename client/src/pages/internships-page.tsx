import { useState } from "react";
import { Link } from "wouter";
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
  Calendar,
  Briefcase,
  Clock,
  Building,
  ChevronRight,
  Filter,
  BookmarkPlus,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for internships
const internships = [
  {
    id: 1,
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
    remote: false,
    paid: true,
    credits: 3,
  },
  {
    id: 2,
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
    remote: true,
    paid: true,
    credits: 3,
  },
  {
    id: 3,
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
    remote: false,
    paid: true,
    credits: 4,
  },
  {
    id: 4,
    title: "Research Assistant Intern",
    company: {
      id: 104,
      name: "African Institute for Health Research",
      logo: "https://placehold.co/40?text=AIHR",
      location: "Addis Ababa, Ethiopia",
    },
    duration: "6 months",
    startDate: "2025-06-01",
    stipend: "$500/month",
    posted: "2025-03-20",
    deadline: "2025-05-10",
    description: "Assist researchers in conducting health-related studies, literature reviews, and data collection in local communities.",
    requirements: [
      "Currently pursuing a degree in Public Health, Medicine, or related field",
      "Interest in health research and community health",
      "Strong analytical and writing skills",
      "Knowledge of research methodologies",
    ],
    tags: ["Health Research", "Public Health", "Community Engagement"],
    remote: false,
    paid: true,
    credits: 4,
  },
  {
    id: 5,
    title: "Sustainable Agriculture Intern",
    company: {
      id: 105,
      name: "GreenGrow Africa",
      logo: "https://placehold.co/40?text=GGA",
      location: "Accra, Ghana",
    },
    duration: "3 months",
    startDate: "2025-06-01",
    stipend: "Unpaid",
    posted: "2025-04-01",
    deadline: "2025-05-20",
    description: "Learn about sustainable farming practices and contribute to agricultural development projects in rural communities.",
    requirements: [
      "Currently pursuing a degree in Agriculture, Environmental Science, or related field",
      "Interest in sustainable agriculture and rural development",
      "Willingness to work in field conditions",
      "Basic understanding of agricultural principles",
    ],
    tags: ["Agriculture", "Sustainability", "Rural Development"],
    remote: false,
    paid: false,
    credits: 3,
  },
  {
    id: 6,
    title: "Financial Analysis Intern",
    company: {
      id: 106,
      name: "Pan-African Banking Group",
      logo: "https://placehold.co/40?text=PABG",
      location: "Cairo, Egypt",
    },
    duration: "4 months",
    startDate: "2025-07-01",
    stipend: "$700/month",
    posted: "2025-04-10",
    deadline: "2025-06-01",
    description: "Gain experience in financial analysis, market research, and investment strategy development in the African banking sector.",
    requirements: [
      "Currently pursuing a degree in Finance, Economics, or related field",
      "Strong analytical and quantitative skills",
      "Knowledge of financial markets and banking",
      "Proficiency in Excel and financial modeling",
    ],
    tags: ["Finance", "Banking", "Investment Analysis"],
    remote: true,
    paid: true,
    credits: 3,
  },
];

// Sample data for my applications
const myApplications = [
  {
    id: 1001,
    internship: {
      id: 1,
      title: "Software Development Intern",
      company: {
        id: 101,
        name: "Tech Innovate Africa",
        logo: "https://placehold.co/40?text=TIA",
        location: "Nairobi, Kenya",
      },
      duration: "3 months",
      startDate: "2025-06-01",
    },
    status: "in_review",
    appliedDate: "2025-04-05",
    lastUpdated: "2025-04-08",
    notes: "Phone screening scheduled for April 15, 2025",
  },
  {
    id: 1002,
    internship: {
      id: 3,
      title: "Data Analysis Intern",
      company: {
        id: 103,
        name: "AfriData Analytics",
        logo: "https://placehold.co/40?text=ADA",
        location: "Cape Town, South Africa",
      },
      duration: "4 months",
      startDate: "2025-06-15",
    },
    status: "submitted",
    appliedDate: "2025-04-10",
    lastUpdated: "2025-04-10",
    notes: "",
  },
];

// Sample data for saved internships
const savedInternships = [
  {
    id: 2,
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
    deadline: "2025-05-30",
    savedDate: "2025-04-03",
    remote: true,
  },
  {
    id: 5,
    title: "Sustainable Agriculture Intern",
    company: {
      id: 105,
      name: "GreenGrow Africa",
      logo: "https://placehold.co/40?text=GGA",
      location: "Accra, Ghana",
    },
    duration: "3 months",
    startDate: "2025-06-01",
    stipend: "Unpaid",
    deadline: "2025-05-20",
    savedDate: "2025-04-08",
    remote: false,
  },
];

// Format date for display
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

export default function InternshipsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  
  // Filter internships based on search term and filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === "all" || 
                          (locationFilter === "remote" && internship.remote) ||
                          (locationFilter === "onsite" && !internship.remote);
    
    const matchesPayment = paymentFilter === "all" || 
                         (paymentFilter === "paid" && internship.paid) ||
                         (paymentFilter === "unpaid" && !internship.paid);
    
    return matchesSearch && matchesLocation && matchesPayment;
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Internships"
        description="Find and apply for internship opportunities to gain practical experience"
      />

      <div className="mb-6">
        <Input
          placeholder="Search internships, companies, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
      </div>

      <Tabs defaultValue="explore" className="space-y-4">
        <TabsList>
          <TabsTrigger value="explore">Explore Internships</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Internships</TabsTrigger>
          <TabsTrigger value="credit">Credit Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold">Available Internships ({filteredInternships.length})</h2>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Location Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="paid">Paid Only</SelectItem>
                    <SelectItem value="unpaid">Include Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredInternships.map((internship) => (
              <Card key={internship.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={internship.company.logo} alt={internship.company.name} />
                        <AvatarFallback>{internship.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{internship.title}</CardTitle>
                        <CardDescription>{internship.company.name}</CardDescription>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">
                              {internship.company.location} {internship.remote && "(Remote)"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{internship.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={internship.paid ? "default" : "secondary"}>
                        {internship.stipend}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Posted: {formatDate(internship.posted)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Badge variant="outline" className="font-normal">
                          {internship.credits} Academic Credits
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{internship.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {internship.requirements.map((req, index) => (
                        <li key={index} className="text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {internship.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Start Date: <span className="font-medium">{formatDate(internship.startDate)}</span></span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Deadline: <span className="font-medium">{formatDate(internship.deadline)}</span></span>
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

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Applications ({myApplications.length})</h2>
          </div>

          <div className="grid gap-4">
            {myApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={application.internship.company.logo} alt={application.internship.company.name} />
                        <AvatarFallback>{application.internship.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{application.internship.title}</CardTitle>
                        <CardDescription>{application.internship.company.name}</CardDescription>
                        <div className="flex items-center mt-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{application.internship.company.location}</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Start Date: <span className="font-medium">{formatDate(application.internship.startDate)}</span></span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Duration: <span className="font-medium">{application.internship.duration}</span></span>
                    </div>
                  </div>
                  
                  {application.notes && (
                    <div className="bg-muted/50 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <p className="text-sm">{application.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 text-sm">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center">
                      {application.status === "submitted" ? (
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                      ) : application.status === "in_review" ? (
                        <Clock className="h-4 w-4 text-purple-500" />
                      ) : application.status === "interview" ? (
                        <Calendar className="h-4 w-4 text-amber-500" />
                      ) : application.status === "offered" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : application.status === "rejected" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {application.status === "submitted" && "Your application has been submitted and is awaiting review"}
                      {application.status === "in_review" && "Your application is being reviewed by the company"}
                      {application.status === "interview" && "Congratulations! You've been selected for an interview"}
                      {application.status === "offered" && "You've received an internship offer"}
                      {application.status === "rejected" && "Unfortunately, your application was not selected"}
                      {application.status === "accepted" && "You've accepted the internship offer"}
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
            <h2 className="text-xl font-semibold">Saved Internships ({savedInternships.length})</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {savedInternships.map((internship) => (
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
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">
                            {internship.company.location} {internship.remote && "(Remote)"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{internship.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Starts: {formatDate(internship.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">{internship.stipend}</Badge>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Application Deadline: {formatDate(internship.deadline)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Saved on: {formatDate(internship.savedDate)}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    Remove
                  </Button>
                  <Button>
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Credit Approval</CardTitle>
              <CardDescription>Submit internship experiences for academic credit approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Credit Approval Process</h3>
                      <p className="text-sm text-muted-foreground">Learn how to get academic credit for your internship</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> View Guidelines
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Find an Eligible Internship</h4>
                      <p className="text-sm text-muted-foreground">Look for internships with the "Academic Credit" badge</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Submit Pre-Approval Form</h4>
                      <p className="text-sm text-muted-foreground">Complete the form before starting your internship</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Complete Required Hours</h4>
                      <p className="text-sm text-muted-foreground">Work the minimum required hours based on credit amount</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Submit Final Documentation</h4>
                      <p className="text-sm text-muted-foreground">Submit your experience report and employer evaluation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Internship Pre-Approval Form</h3>
                      <p className="text-sm text-muted-foreground">Required before starting an internship for credit</p>
                    </div>
                  </div>
                  <Button>Start Form</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Experience Verification</h3>
                      <p className="text-sm text-muted-foreground">Submit documentation of completed internship hours</p>
                    </div>
                  </div>
                  <Button variant="outline">Submit</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Final Reflection Report</h3>
                      <p className="text-sm text-muted-foreground">Submit your final internship experience report</p>
                    </div>
                  </div>
                  <Button variant="outline">Submit</Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Credit Requirements</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-sm">
                    <div className="font-medium">Credits</div>
                    <div className="font-medium">Required Hours</div>
                    <div className="font-medium">Documentation</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 text-sm">
                    <div>1 Credit</div>
                    <div>45 Hours</div>
                    <div>Basic Report</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div>2 Credits</div>
                    <div>90 Hours</div>
                    <div>Standard Report</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div>3 Credits</div>
                    <div>135 Hours</div>
                    <div>Detailed Report + Presentation</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div>4 Credits</div>
                    <div>180 Hours</div>
                    <div>Comprehensive Report + Presentation</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                For additional information about internship credits, please contact your academic advisor or the career services office.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}