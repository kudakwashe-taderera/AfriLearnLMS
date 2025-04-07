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
  Users,
  Building,
  GraduationCap,
  Globe,
  BookOpen,
  Clock,
  Calendar,
  PlusCircle,
  FileText,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for collaborations
const activeCollaborations = [
  {
    id: 1,
    title: "Pan-African AI Research Initiative",
    universities: [
      { id: 101, name: "University of Cape Town", country: "South Africa", logo: "https://placehold.co/40?text=UCT" },
      { id: 102, name: "University of Nairobi", country: "Kenya", logo: "https://placehold.co/40?text=UON" },
      { id: 103, name: "Cairo University", country: "Egypt", logo: "https://placehold.co/40?text=CU" },
    ],
    department: "Computer Science",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2026-12-31",
    description: "A collaborative research initiative focused on developing AI solutions for African challenges.",
    nextMeeting: "2025-04-20T14:00:00Z",
    recentUpdate: "Added new research paper to shared repository - 'Machine Learning Applications in African Agriculture'",
    updatedAt: "2025-04-03T09:30:00Z",
  },
  {
    id: 2,
    title: "African Clean Energy Consortium",
    universities: [
      { id: 104, name: "University of Ghana", country: "Ghana", logo: "https://placehold.co/40?text=UG" },
      { id: 105, name: "University of Lagos", country: "Nigeria", logo: "https://placehold.co/40?text=UNILAG" },
      { id: 106, name: "Addis Ababa University", country: "Ethiopia", logo: "https://placehold.co/40?text=AAU" },
    ],
    department: "Environmental Engineering",
    status: "active",
    startDate: "2024-09-01",
    endDate: "2027-08-31",
    description: "Developing sustainable energy solutions adapted to the African context through shared research.",
    nextMeeting: "2025-04-15T10:00:00Z",
    recentUpdate: "Research grant approved for joint solar panel efficiency study",
    updatedAt: "2025-04-05T14:45:00Z",
  },
  {
    id: 3,
    title: "African Languages Preservation Project",
    universities: [
      { id: 107, name: "University of Ibadan", country: "Nigeria", logo: "https://placehold.co/40?text=UI" },
      { id: 108, name: "University of Botswana", country: "Botswana", logo: "https://placehold.co/40?text=UB" },
      { id: 109, name: "University of Dar es Salaam", country: "Tanzania", logo: "https://placehold.co/40?text=UDSM" },
    ],
    department: "Linguistics",
    status: "active",
    startDate: "2024-11-01",
    endDate: "2026-10-31",
    description: "Documenting and preserving endangered African languages through collaborative research and technology.",
    nextMeeting: "2025-04-22T13:00:00Z",
    recentUpdate: "Digital dictionary for Yoruba dialects completed and deployed to testing",
    updatedAt: "2025-04-01T11:20:00Z",
  },
];

// Sample data for collaboration opportunities
const collaborationOpportunities = [
  {
    id: 101,
    title: "Pan-African Medical Research Network",
    leadUniversity: { id: 110, name: "University of Witwatersrand", country: "South Africa", logo: "https://placehold.co/40?text=WITS" },
    department: "Medical Sciences",
    deadline: "2025-05-30",
    startDate: "2025-07-01",
    duration: "3 years",
    fundingAmount: "$1.2M",
    description: "Seeking university partners across Africa to establish a collaborative network for tropical disease research.",
    requirements: ["Medical research capabilities", "Laboratory facilities", "Experience in epidemiology"],
  },
  {
    id: 102,
    title: "African Cultural Heritage Digitization Initiative",
    leadUniversity: { id: 111, name: "University of Dakar", country: "Senegal", logo: "https://placehold.co/40?text=UD" },
    department: "African Studies & Digital Humanities",
    deadline: "2025-06-15",
    startDate: "2025-08-01",
    duration: "2 years",
    fundingAmount: "$850K",
    description: "Project to digitize and preserve cultural artifacts and oral histories through inter-university collaboration.",
    requirements: ["Digital preservation expertise", "Cultural anthropology background", "Connection to local communities"],
  },
  {
    id: 103,
    title: "Sustainable Cities Research Consortium",
    leadUniversity: { id: 112, name: "University of Rabat", country: "Morocco", logo: "https://placehold.co/40?text=UR" },
    department: "Urban Planning",
    deadline: "2025-07-10",
    startDate: "2025-09-01",
    duration: "4 years",
    fundingAmount: "$2.5M",
    description: "Research collaboration focused on developing sustainable urban planning solutions for rapidly growing African cities.",
    requirements: ["Urban planning expertise", "Environmental engineering capabilities", "Community engagement experience"],
  },
];

// Sample data for research exchange opportunities
const researchExchanges = [
  {
    id: 201,
    university: { id: 113, name: "University of Johannesburg", country: "South Africa", logo: "https://placehold.co/40?text=UJ" },
    department: "Quantum Computing",
    positions: 3,
    duration: "6 months",
    startDate: "2025-09-01",
    stipend: "$1,500/month",
    description: "Research exchange opportunity focused on quantum computing applications for data security.",
    deadline: "2025-06-30",
  },
  {
    id: 202,
    university: { id: 114, name: "University of Khartoum", country: "Sudan", logo: "https://placehold.co/40?text=UK" },
    department: "Agricultural Sciences",
    positions: 2,
    duration: "1 year",
    startDate: "2025-07-15",
    stipend: "$1,200/month",
    description: "Exchange program for researchers working on drought-resistant crop development.",
    deadline: "2025-05-31",
  },
  {
    id: 203,
    university: { id: 115, name: "University of Tunis", country: "Tunisia", logo: "https://placehold.co/40?text=UT" },
    department: "Computer Vision & AI",
    positions: 4,
    duration: "9 months",
    startDate: "2025-10-01",
    stipend: "$1,800/month",
    description: "Research exchange in computer vision and AI applications for healthcare diagnostics.",
    deadline: "2025-07-15",
  },
];

export default function UniversityCollaborationsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter collaborations based on search term
  const filteredCollaborations = activeCollaborations.filter(collab => 
    collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.universities.some(uni => uni.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter opportunities based on search term
  const filteredOpportunities = collaborationOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.leadUniversity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter exchanges based on search term
  const filteredExchanges = researchExchanges.filter(exchange =>
    exchange.university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exchange.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exchange.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format meeting time for display
  const formatMeetingTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Inter-University Collaboration"
        description="Manage collaborations, join new initiatives, and discover research exchange opportunities"
      />

      <div className="mb-6">
        <Input
          placeholder="Search collaborations, universities, or research areas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Collaborations</TabsTrigger>
          <TabsTrigger value="opportunities">Collaboration Opportunities</TabsTrigger>
          <TabsTrigger value="exchanges">Research Exchanges</TabsTrigger>
          <TabsTrigger value="resources">Shared Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Collaborations ({filteredCollaborations.length})</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Collaboration
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredCollaborations.map((collab) => (
              <Card key={collab.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{collab.title}</CardTitle>
                      <CardDescription>{collab.department}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {collab.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{collab.description}</p>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Participating Universities</div>
                    <div className="flex flex-wrap gap-2">
                      {collab.universities.map((uni) => (
                        <div key={uni.id} className="flex items-center bg-muted rounded-md p-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={uni.logo} alt={uni.name} />
                            <AvatarFallback>{uni.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{uni.name}</div>
                            <div className="text-xs text-muted-foreground">{uni.country}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>
                        {formatDate(collab.startDate)} - {formatDate(collab.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Next meeting: {formatMeetingTime(collab.nextMeeting)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Updated {new Date(collab.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="text-sm font-medium mb-1">Recent Update</div>
                    <p className="text-sm">{collab.recentUpdate}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" /> Discussion Forum
                  </Button>
                  <Button>
                    View Collaboration <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Collaboration Opportunities ({filteredOpportunities.length})</h2>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Submit New Opportunity
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.department}</CardDescription>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Deadline: {formatDate(opportunity.deadline)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={opportunity.leadUniversity.logo} alt={opportunity.leadUniversity.name} />
                      <AvatarFallback>{opportunity.leadUniversity.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Lead University: {opportunity.leadUniversity.name}</div>
                      <div className="text-xs text-muted-foreground">{opportunity.leadUniversity.country}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Start Date</span>
                      <span className="font-medium">{formatDate(opportunity.startDate)}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="font-medium">{opportunity.duration}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Funding</span>
                      <span className="font-medium">{opportunity.fundingAmount}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Application Deadline</span>
                      <span className="font-medium">{formatDate(opportunity.deadline)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Requirements</div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" /> Learn More
                  </Button>
                  <Button>
                    Express Interest
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Research Exchange Opportunities ({filteredExchanges.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExchanges.map((exchange) => (
              <Card key={exchange.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={exchange.university.logo} alt={exchange.university.name} />
                      <AvatarFallback>{exchange.university.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{exchange.university.name}</CardTitle>
                      <CardDescription>{exchange.university.country}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">{exchange.department}</div>
                    <p className="text-sm text-muted-foreground mt-1">{exchange.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Positions</span>
                      <span className="font-medium">{exchange.positions} available</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="font-medium">{exchange.duration}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Stipend</span>
                      <span className="font-medium">{exchange.stipend}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-muted-foreground">Start Date</span>
                      <span className="font-medium">{formatDate(exchange.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">
                      Application deadline: <span className="font-medium">{formatDate(exchange.deadline)}</span>
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Apply for Exchange
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Research Resources</CardTitle>
              <CardDescription>Access collaborative research tools and shared datasets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <FileText className="h-10 w-10 text-primary mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium">Pan-African Climate Data Repository</h4>
                    <p className="text-sm text-muted-foreground">Shared climate measurement data across 25 African countries</p>
                  </div>
                  <Button variant="outline" size="sm">Access</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <BookOpen className="h-10 w-10 text-primary mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium">Inter-University Research Paper Repository</h4>
                    <p className="text-sm text-muted-foreground">Collaborative paper database with over 5,000 research publications</p>
                  </div>
                  <Button variant="outline" size="sm">Access</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <Globe className="h-10 w-10 text-primary mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium">Virtual Labs Platform</h4>
                    <p className="text-sm text-muted-foreground">Remote access to specialized laboratory equipment across partner universities</p>
                  </div>
                  <Button variant="outline" size="sm">Access</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <Users className="h-10 w-10 text-primary mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium">African Researcher Directory</h4>
                    <p className="text-sm text-muted-foreground">Network of researchers across African universities searchable by specialization</p>
                  </div>
                  <Button variant="outline" size="sm">Access</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Funding Resources</CardTitle>
              <CardDescription>Grants and funding opportunities for collaborative research</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <span className="font-bold">$</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">African Development Bank Research Grant</h4>
                    <p className="text-sm text-muted-foreground">Up to $500K for multi-university collaborative research</p>
                    <p className="text-xs mt-1">Deadline: June 30, 2025</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <span className="font-bold">$</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">UNESCO Higher Education Innovation Fund</h4>
                    <p className="text-sm text-muted-foreground">Grants for innovative educational collaboration projects</p>
                    <p className="text-xs mt-1">Deadline: July 15, 2025</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4">
                    <span className="font-bold">$</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Gates Foundation Educational Excellence Program</h4>
                    <p className="text-sm text-muted-foreground">Funding for collaborative educational research and implementation</p>
                    <p className="text-xs mt-1">Deadline: August 30, 2025</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}