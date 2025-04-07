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
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  Star,
  MessageCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Award,
  Users,
  FileText,
  Settings,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for mentors
const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Kimani",
    avatar: "https://placehold.co/100?text=SK",
    title: "Professor of Computer Science",
    organization: "University of Nairobi",
    bio: "Experienced educator with 15+ years in computer science research and teaching. Specializes in AI and machine learning.",
    areas: ["Computer Science", "Artificial Intelligence", "Machine Learning", "Academic Mentoring"],
    experience: "15+ years",
    rating: 4.9,
    reviews: 45,
    available: true,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      times: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"]
    }
  },
  {
    id: 2,
    name: "Michael Okonkwo",
    avatar: "https://placehold.co/100?text=MO",
    title: "Senior Software Engineer",
    organization: "Tech Innovate Africa",
    bio: "Tech industry professional with expertise in software development and tech entrepreneurship. Passionate about mentoring the next generation of African developers.",
    areas: ["Software Development", "Entrepreneurship", "Career Development", "Technical Skills"],
    experience: "8+ years",
    rating: 4.7,
    reviews: 38,
    available: true,
    availability: {
      days: ["Tuesday", "Thursday"],
      times: ["6:00 PM - 8:00 PM"]
    }
  },
  {
    id: 3,
    name: "Dr. Amina Diallo",
    avatar: "https://placehold.co/100?text=AD",
    title: "Research Scientist",
    organization: "African Institute for Health Research",
    bio: "Public health researcher specializing in tropical diseases and community health initiatives. Passionate about guiding students in health sciences.",
    areas: ["Health Sciences", "Public Health", "Medical Research", "Academic Guidance"],
    experience: "12+ years",
    rating: 4.8,
    reviews: 29,
    available: true,
    availability: {
      days: ["Monday", "Wednesday", "Thursday"],
      times: ["11:00 AM - 1:00 PM", "3:00 PM - 5:00 PM"]
    }
  },
  {
    id: 4,
    name: "Kwame Mensah",
    avatar: "https://placehold.co/100?text=KM",
    title: "Finance Director",
    organization: "Pan-African Banking Group",
    bio: "Finance professional with extensive experience in banking, investment, and financial analysis. Specializes in mentoring students interested in finance careers.",
    areas: ["Finance", "Banking", "Investment", "Career Planning"],
    experience: "10+ years",
    rating: 4.6,
    reviews: 32,
    available: true,
    availability: {
      days: ["Tuesday", "Friday"],
      times: ["4:00 PM - 6:00 PM"]
    }
  },
  {
    id: 5,
    name: "Fatima Nkosi",
    avatar: "https://placehold.co/100?text=FN",
    title: "Marketing Director",
    organization: "AfriMarket Solutions",
    bio: "Marketing professional with expertise in digital marketing, brand development, and market research in African markets. Enjoys mentoring future marketers.",
    areas: ["Marketing", "Digital Marketing", "Communications", "Brand Strategy"],
    experience: "9+ years",
    rating: 4.7,
    reviews: 25,
    available: false,
    availability: {
      days: ["Wednesday", "Thursday"],
      times: ["1:00 PM - 3:00 PM", "5:00 PM - 7:00 PM"]
    }
  },
  {
    id: 6,
    name: "Dr. Ahmed El-Sayed",
    avatar: "https://placehold.co/100?text=AE",
    title: "Professor of Environmental Engineering",
    organization: "Cairo University",
    bio: "Environmental engineer focused on sustainable development and clean energy solutions. Passionate about guiding students in engineering disciplines.",
    areas: ["Environmental Engineering", "Sustainability", "Clean Energy", "Academic Research"],
    experience: "14+ years",
    rating: 4.8,
    reviews: 41,
    available: true,
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      times: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"]
    }
  },
];

// Sample data for my mentors
const myMentors = [
  {
    id: 1,
    mentor: {
      id: 1,
      name: "Dr. Sarah Kimani",
      avatar: "https://placehold.co/100?text=SK",
      title: "Professor of Computer Science",
      organization: "University of Nairobi",
    },
    status: "active",
    startDate: "2025-02-15",
    nextSession: "2025-04-15T14:00:00Z",
    goalsProgress: 65,
    recentActivity: "Discussed career opportunities in AI research",
    lastActivity: "2025-04-01",
    goals: [
      { title: "Develop machine learning portfolio", completed: true },
      { title: "Prepare for graduate school applications", completed: false },
      { title: "Complete research project", completed: false },
    ]
  },
  {
    id: 2,
    mentor: {
      id: 3,
      name: "Dr. Amina Diallo",
      avatar: "https://placehold.co/100?text=AD",
      title: "Research Scientist",
      organization: "African Institute for Health Research",
    },
    status: "inactive",
    startDate: "2024-09-10",
    endDate: "2025-02-28",
    goalsProgress: 100,
    recentActivity: "Completed mentorship program with final career guidance session",
    lastActivity: "2025-02-28",
    goals: [
      { title: "Explore research opportunities in public health", completed: true },
      { title: "Develop research methodology skills", completed: true },
      { title: "Draft research paper outline", completed: true },
    ]
  }
];

// Sample data for upcoming sessions
const upcomingSessions = [
  {
    id: 1001,
    mentor: {
      id: 1,
      name: "Dr. Sarah Kimani",
      avatar: "https://placehold.co/100?text=SK",
      title: "Professor of Computer Science",
    },
    dateTime: "2025-04-15T14:00:00Z",
    duration: "60 minutes",
    type: "video",
    topic: "Machine Learning Career Paths",
    notes: "Prepare questions about graduate programs in machine learning",
  }
];

// Sample data for past sessions
const pastSessions = [
  {
    id: 2001,
    mentor: {
      id: 1,
      name: "Dr. Sarah Kimani",
      avatar: "https://placehold.co/100?text=SK",
      title: "Professor of Computer Science",
    },
    dateTime: "2025-04-01T15:00:00Z",
    duration: "45 minutes",
    type: "video",
    topic: "AI Research Opportunities",
    notes: "Discussed potential research projects and academic publishing",
    feedback: "Great session! Dr. Kimani provided excellent insights on research methodologies.",
  },
  {
    id: 2002,
    mentor: {
      id: 1,
      name: "Dr. Sarah Kimani",
      avatar: "https://placehold.co/100?text=SK",
      title: "Professor of Computer Science",
    },
    dateTime: "2025-03-15T14:00:00Z",
    duration: "60 minutes",
    type: "video",
    topic: "Machine Learning Portfolio Development",
    notes: "Reviewed my initial portfolio and discussed improvements",
    feedback: "Very helpful feedback on my project structure and documentation.",
  },
  {
    id: 2003,
    mentor: {
      id: 3,
      name: "Dr. Amina Diallo",
      avatar: "https://placehold.co/100?text=AD",
      title: "Research Scientist",
    },
    dateTime: "2025-02-28T11:00:00Z",
    duration: "60 minutes",
    type: "in-person",
    topic: "Final Mentorship Review",
    notes: "Concluded our mentorship with a review of achieved goals and future plans",
    feedback: "An excellent conclusion to our mentorship. Dr. Diallo provided comprehensive career guidance.",
  },
];

// Sample data for mentorship programs
const mentorshipPrograms = [
  {
    id: 1,
    title: "Tech Leadership Program",
    organization: "Tech Innovate Africa",
    duration: "6 months",
    startDate: "2025-06-01",
    deadline: "2025-05-15",
    description: "A structured mentorship program connecting students with tech industry leaders to develop leadership and technical skills.",
    areas: ["Software Development", "Tech Leadership", "Industry Networking"],
    mentors: 12,
    spots: "20/50",
    applicationRequired: true,
  },
  {
    id: 2,
    title: "Women in STEM Mentorship",
    organization: "African Women in Science",
    duration: "8 months",
    startDate: "2025-07-01",
    deadline: "2025-06-01",
    description: "Mentorship program aimed at supporting female students pursuing careers in STEM fields through guidance and networking.",
    areas: ["STEM Careers", "Women in Tech", "Professional Development"],
    mentors: 25,
    spots: "35/100",
    applicationRequired: true,
  },
  {
    id: 3,
    title: "Academic Research Pathway",
    organization: "Pan-African University Alliance",
    duration: "9 months",
    startDate: "2025-08-15",
    deadline: "2025-07-10",
    description: "Mentorship program for students interested in academic research careers, providing guidance on research methodologies and publishing.",
    areas: ["Academic Research", "Publishing", "Graduate Studies"],
    mentors: 18,
    spots: "40/60",
    applicationRequired: true,
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

// Format session time for display
const formatSessionTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

// Render star ratings
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function MentorshipPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  
  // Filter mentors based on search term and filter
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = areaFilter === "all" || mentor.areas.some(area => area === areaFilter);
    
    return matchesSearch && matchesArea;
  });
  
  // Get unique areas for filtering
  const uniqueAreas = ["all", ...new Set(mentors.flatMap(mentor => mentor.areas))];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Mentorship"
        description="Connect with mentors, join mentorship programs, and track your progress"
      />

      <Tabs defaultValue="find" className="space-y-4">
        <TabsList>
          <TabsTrigger value="find">Find Mentors</TabsTrigger>
          <TabsTrigger value="my-mentors">My Mentors</TabsTrigger>
          <TabsTrigger value="sessions">Mentoring Sessions</TabsTrigger>
          <TabsTrigger value="programs">Mentorship Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <Input
                placeholder="Search mentors by name, title, organization, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by Area" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area === "all" ? "All Areas" : area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{mentor.name}</CardTitle>
                        <CardDescription>{mentor.title}</CardDescription>
                        <div className="flex items-center mt-1 text-sm">
                          <Building className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{mentor.organization}</span>
                        </div>
                        <div className="mt-2">
                          <StarRating rating={mentor.rating} />
                          <span className="text-xs text-muted-foreground ml-2">({mentor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={mentor.available ? "default" : "secondary"}>
                        {mentor.available ? "Available for Mentoring" : "Currently Unavailable"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Experience: {mentor.experience}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.areas.map((area, index) => (
                        <Badge key={index} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {mentor.available && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Availability</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>Days: {mentor.availability.days.join(", ")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>Times: {mentor.availability.times.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    View Profile
                  </Button>
                  <Button disabled={!mentor.available}>
                    Request Mentorship
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-mentors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Mentors ({myMentors.length})</h2>
          </div>

          <div className="grid gap-4">
            {myMentors.map((relationship) => (
              <Card key={relationship.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={relationship.mentor.avatar} alt={relationship.mentor.name} />
                        <AvatarFallback>{relationship.mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{relationship.mentor.name}</CardTitle>
                        <CardDescription>{relationship.mentor.title}</CardDescription>
                        <div className="flex items-center mt-1 text-sm">
                          <Building className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{relationship.mentor.organization}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={relationship.status === "active" ? "default" : "secondary"}>
                        {relationship.status === "active" ? "Active" : "Completed"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Started: {formatDate(relationship.startDate)}
                      </div>
                      {relationship.endDate && (
                        <div className="text-sm text-muted-foreground">
                          Completed: {formatDate(relationship.endDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Goals Progress</span>
                      <span>{relationship.goalsProgress}%</span>
                    </div>
                    <Progress value={relationship.goalsProgress} className="h-2" />
                  </div>
                  
                  {relationship.status === "active" && relationship.nextSession && (
                    <div className="bg-primary/10 p-3 rounded-md">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Next Session</span>
                      </div>
                      <p className="text-sm">{formatSessionTime(relationship.nextSession)}</p>
                    </div>
                  )}
                  
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="text-sm font-medium mb-1">Recent Activity</div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{relationship.recentActivity}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(relationship.lastActivity)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Mentorship Goals</h4>
                    <div className="space-y-2">
                      {relationship.goals.map((goal, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mt-0.5 mr-2">
                            {goal.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                            )}
                          </div>
                          <span className={`text-sm ${goal.completed ? "" : "text-muted-foreground"}`}>
                            {goal.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" /> Message
                  </Button>
                  {relationship.status === "active" ? (
                    <Button>
                      Schedule Session <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline">
                      View History
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid gap-4">
            {upcomingSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled mentoring sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                            <AvatarFallback>{session.mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{session.topic}</h3>
                            <p className="text-sm text-muted-foreground">with {session.mentor.name}</p>
                            <p className="text-sm text-muted-foreground">{session.mentor.title}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <div className="text-sm font-medium">{formatSessionTime(session.dateTime)}</div>
                          <div className="text-sm text-muted-foreground">Duration: {session.duration}</div>
                          <Badge variant="outline">
                            {session.type === "video" ? (
                              <><Video className="h-3 w-3 mr-1" /> Video Call</>
                            ) : (
                              <><Users className="h-3 w-3 mr-1" /> In-Person</>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      {session.notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">Session Notes</h4>
                          <p className="text-sm text-muted-foreground">{session.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline">
                          Reschedule
                        </Button>
                        {session.type === "video" && (
                          <Button>
                            Join Video Call
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Past Sessions</CardTitle>
                <CardDescription>Your previous mentoring sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                          <AvatarFallback>{session.mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{session.topic}</h3>
                          <p className="text-sm text-muted-foreground">with {session.mentor.name}</p>
                          <p className="text-sm text-muted-foreground">{session.mentor.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <div className="text-sm font-medium">{formatSessionTime(session.dateTime)}</div>
                        <div className="text-sm text-muted-foreground">Duration: {session.duration}</div>
                        <Badge variant="outline">
                          {session.type === "video" ? (
                            <><Video className="h-3 w-3 mr-1" /> Video Call</>
                          ) : (
                            <><Users className="h-3 w-3 mr-1" /> In-Person</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {session.notes && (
                        <div>
                          <h4 className="text-sm font-medium">Session Notes</h4>
                          <p className="text-sm text-muted-foreground">{session.notes}</p>
                        </div>
                      )}
                      
                      {session.feedback && (
                        <div>
                          <h4 className="text-sm font-medium">Your Feedback</h4>
                          <p className="text-sm text-muted-foreground">{session.feedback}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Past Sessions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Structured Mentorship Programs</h2>
          </div>

          <div className="grid gap-4">
            {mentorshipPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{program.title}</CardTitle>
                      <CardDescription>Organized by {program.organization}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Deadline: {formatDate(program.deadline)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Start Date: {formatDate(program.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Duration: {program.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Mentors: {program.mentors}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Available Spots: {program.spots}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {program.areas.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    Learn More
                  </Button>
                  <Button>
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>Share your knowledge and expertise with students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you're an industry professional, researcher, or experienced student, consider becoming a mentor to help others grow and develop in their academic and professional journeys.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Share Knowledge</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Pass on your expertise and experiences to help students navigate their educational and career paths.</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Build Your Network</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Connect with motivated students and other mentors across various disciplines and institutions.</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Develop Skills</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Enhance your leadership, communication, and coaching skills through mentoring relationships.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Apply to Become a Mentor
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}