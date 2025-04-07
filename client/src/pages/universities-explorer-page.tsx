import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Globe, 
  MapPin, 
  GraduationCap,
  BookOpen,
  Filter,
  Star,
  BadgeInfo,
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Sample university data
const universities = [
  {
    id: 1,
    name: "University of Zimbabwe",
    location: "Harare",
    type: "Public",
    rating: 4.5,
    logo: "UZ",
    programs: 120,
    description: "The leading university in Zimbabwe, offering a wide range of undergraduate and graduate programs with a focus on research excellence.",
    specialties: ["Medicine", "Engineering", "Law", "Business"],
    applicationDeadline: "May 30, 2025"
  },
  {
    id: 2,
    name: "Midlands State University",
    location: "Gweru",
    type: "Public",
    rating: 4.2,
    logo: "MSU",
    programs: 85,
    description: "A comprehensive institution known for innovation and community engagement, with strong programs in humanities and social sciences.",
    specialties: ["Education", "Commerce", "Social Sciences", "Arts"],
    applicationDeadline: "June 15, 2025"
  },
  {
    id: 3,
    name: "Zimbabwe Open University",
    location: "Harare",
    type: "Distance",
    rating: 4.0,
    logo: "ZOU",
    programs: 65,
    description: "Specializing in distance education and online learning, making higher education accessible throughout Zimbabwe.",
    specialties: ["Education", "Business", "Agriculture", "Technology"],
    applicationDeadline: "Continuous Enrollment"
  },
  {
    id: 4,
    name: "National University of Science and Technology",
    location: "Bulawayo",
    type: "Public",
    rating: 4.3,
    logo: "NUST",
    programs: 95,
    description: "A leading institution in technological education and scientific research with modern facilities and industry partnerships.",
    specialties: ["Engineering", "Computer Science", "Applied Sciences", "Built Environment"],
    applicationDeadline: "June 30, 2025"
  },
  {
    id: 5,
    name: "Chinhoyi University of Technology",
    location: "Chinhoyi",
    type: "Public",
    rating: 4.1,
    logo: "CUT",
    programs: 72,
    description: "Focused on technological innovation and practical skills development, with strong ties to industry.",
    specialties: ["Technology", "Agriculture", "Business", "Hospitality"],
    applicationDeadline: "May 15, 2025"
  },
  {
    id: 6,
    name: "Great Zimbabwe University",
    location: "Masvingo",
    type: "Public",
    rating: 4.0,
    logo: "GZU",
    programs: 68,
    description: "Celebrating cultural heritage while providing modern education, with excellent humanities and cultural studies programs.",
    specialties: ["Cultural Studies", "Education", "Social Sciences", "Management"],
    applicationDeadline: "July 10, 2025"
  },
  {
    id: 7,
    name: "Harare Institute of Technology",
    location: "Harare",
    type: "Public",
    rating: 4.2,
    logo: "HIT",
    programs: 43,
    description: "Specializing in advanced technological education with a focus on innovation and entrepreneurship.",
    specialties: ["Engineering", "Technology", "Biotechnology", "ICT"],
    applicationDeadline: "June 20, 2025"
  },
  {
    id: 8,
    name: "Africa University",
    location: "Mutare",
    type: "Private",
    rating: 4.4,
    logo: "AU",
    programs: 55,
    description: "A pan-African institution promoting leadership development and cross-cultural understanding.",
    specialties: ["Peace Studies", "Health Sciences", "Agriculture", "Business"],
    applicationDeadline: "May 25, 2025"
  }
];

export default function UniversitiesExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Filter universities based on search and filters
  const filteredUniversities = universities.filter(university => {
    // Search filter
    const matchesSearch = university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         university.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         university.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Location filter
    const matchesLocation = locationFilter === "all" || university.location === locationFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || university.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });
  
  // Get unique locations for filter dropdown
  const locations = Array.from(new Set(universities.map(u => u.location)));
  
  // Get unique types for filter dropdown
  const types = Array.from(new Set(universities.map(u => u.type)));
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Universities Explorer"
        description="Discover, compare, and apply to universities across Zimbabwe"
      >
        <Link href="/applications">
          <Button>
            My Applications
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </DashboardHeader>
      
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Universities</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="deadlines">Application Deadlines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          {/* Search and filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search universities or programs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-40">
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-40">
                    <Select
                      value={typeFilter}
                      onValueChange={setTypeFilter}
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map(university => (
                <Card key={university.id} className="overflow-hidden">
                  <CardHeader className="pb-3 flex flex-row items-start space-x-4">
                    <div className="h-14 w-14 rounded-md bg-primary-100 flex items-center justify-center text-primary font-bold text-xl">
                      {university.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle>{university.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="ml-1 text-sm font-medium">{university.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {university.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {university.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {university.programs} Programs
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {university.description}
                    </p>
                    
                    <div className="mt-2">
                      <div className="flex items-center mb-2">
                        <BadgeInfo className="h-4 w-4 text-primary mr-2" />
                        <h4 className="text-sm font-medium">Specialties</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {university.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">Application Deadline:</span>
                      <span className="ml-1 font-medium">{university.applicationDeadline}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Programs</Button>
                    <Button>Apply Now</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 bg-muted/30 rounded-lg p-8 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No universities found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find more results.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setLocationFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Programs</CardTitle>
              <CardDescription>Compare programs across different universities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Computer Science", count: 12, icon: <BookOpen className="h-5 w-5" /> },
                  { name: "Medicine", count: 8, icon: <BookOpen className="h-5 w-5" /> },
                  { name: "Business Administration", count: 18, icon: <BookOpen className="h-5 w-5" /> },
                  { name: "Electrical Engineering", count: 11, icon: <BookOpen className="h-5 w-5" /> },
                  { name: "Agriculture", count: 14, icon: <BookOpen className="h-5 w-5" /> },
                  { name: "Education", count: 20, icon: <BookOpen className="h-5 w-5" /> },
                ].map((program, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{program.name}</CardTitle>
                        {program.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Offered at {program.count} universities</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Compare
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Application Deadlines</CardTitle>
              <CardDescription>Stay on track with important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {universities
                  .filter(u => u.applicationDeadline !== "Continuous Enrollment")
                  .sort((a, b) => {
                    const dateA = new Date(a.applicationDeadline);
                    const dateB = new Date(b.applicationDeadline);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map(university => (
                    <div key={university.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center text-primary font-bold">
                          {university.logo}
                        </div>
                        <div>
                          <h4 className="font-medium">{university.name}</h4>
                          <p className="text-sm text-muted-foreground">{university.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="font-medium">{university.applicationDeadline}</span>
                      </div>
                    </div>
                  ))
                }
                
                <Separator className="my-4" />
                
                <h3 className="font-medium mb-2">Continuous Enrollment</h3>
                {universities
                  .filter(u => u.applicationDeadline === "Continuous Enrollment")
                  .map(university => (
                    <div key={university.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center text-primary font-bold">
                          {university.logo}
                        </div>
                        <div>
                          <h4 className="font-medium">{university.name}</h4>
                          <p className="text-sm text-muted-foreground">{university.location}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Continuous Enrollment</Badge>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}