import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { StudentSubjects } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, CheckCircle2, ChevronRight, Info, School, ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Zimbabwe A Level subjects
const aLevelSubjects = {
  arts: [
    { id: "english_literature", name: "English Literature" },
    { id: "history", name: "History" },
    { id: "religious_studies", name: "Religious Studies" },
    { id: "geography", name: "Geography" },
    { id: "sociology", name: "Sociology" },
    { id: "law", name: "Law" },
    { id: "theatre_studies", name: "Theatre Studies" },
    { id: "art", name: "Art and Design" },
    { id: "music", name: "Music" },
  ],
  sciences: [
    { id: "mathematics", name: "Mathematics" },
    { id: "further_mathematics", name: "Further Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "biology", name: "Biology" },
    { id: "computer_science", name: "Computer Science" },
    { id: "environmental_science", name: "Environmental Science" },
  ],
  commercials: [
    { id: "economics", name: "Economics" },
    { id: "accounting", name: "Accounting" },
    { id: "business_studies", name: "Business Studies" },
    { id: "finance", name: "Finance" },
    { id: "management", name: "Management of Business" },
  ],
  technical: [
    { id: "design_technology", name: "Design and Technology" },
    { id: "technical_drawing", name: "Technical Drawing" },
    { id: "woodwork", name: "Wood Technology and Design" },
    { id: "metalwork", name: "Metal Technology and Design" },
    { id: "food_technology", name: "Food Technology" },
    { id: "textile_design", name: "Textile Design and Technology" },
  ],
  languages: [
    { id: "shona", name: "Shona" },
    { id: "ndebele", name: "Ndebele" },
    { id: "french", name: "French" },
    { id: "portuguese", name: "Portuguese" },
    { id: "german", name: "German" },
    { id: "chinese", name: "Chinese" },
  ]
};

// University degree programs based on A-Level combinations
const universityDegreePrograms = {
  medicine: {
    title: "Medicine & Health Sciences",
    requiredSubjects: ["biology", "chemistry"],
    recommendedSubjects: ["mathematics", "physics"],
    degrees: [
      { name: "Bachelor of Medicine & Surgery (MBChB)", university: "University of Zimbabwe", duration: "5 years", description: "The MBChB program is designed to prepare graduates to practice medicine at the primary care level in both rural and urban settings." },
      { name: "Bachelor of Pharmacy", university: "Harare Institute of Technology", duration: "4 years", description: "The program focuses on the scientific, clinical, and professional knowledge of drugs and medicines." },
      { name: "Bachelor of Nursing Science", university: "University of Zimbabwe", duration: "4 years", description: "A comprehensive program that prepares students for professional nursing practice in various healthcare settings." }
    ],
    careers: ["Medical Doctor", "Surgeon", "Pharmacist", "Clinical Researcher", "Nurse Practitioner"]
  },
  engineering: {
    title: "Engineering & Technology",
    requiredSubjects: ["mathematics", "physics"],
    recommendedSubjects: ["further_mathematics", "chemistry", "computer_science"],
    degrees: [
      { name: "Bachelor of Engineering (Civil)", university: "National University of Science and Technology", duration: "4 years", description: "Focuses on the design, construction, and maintenance of physical and natural built environments." },
      { name: "Bachelor of Engineering (Electrical)", university: "University of Zimbabwe", duration: "4 years", description: "Covers the study and application of electricity, electronics, and electromagnetism." },
      { name: "Bachelor of Engineering (Mechanical)", university: "Harare Institute of Technology", duration: "4 years", description: "Focuses on the design, analysis, and manufacturing of mechanical systems." }
    ],
    careers: ["Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "Aerospace Engineer", "Telecommunications Engineer"]
  },
  business: {
    title: "Business & Economics",
    requiredSubjects: ["economics", "mathematics"],
    recommendedSubjects: ["accounting", "business_studies", "statistics"],
    degrees: [
      { name: "Bachelor of Business Administration", university: "Midlands State University", duration: "4 years", description: "Provides a strong foundation in business principles and management practices." },
      { name: "Bachelor of Commerce in Accounting", university: "University of Zimbabwe", duration: "4 years", description: "Focuses on accounting principles, financial management, and business law." },
      { name: "Bachelor of Economics", university: "Bindura University", duration: "4 years", description: "Studies the production, distribution, and consumption of goods and services." }
    ],
    careers: ["Business Analyst", "Accountant", "Economist", "Financial Advisor", "Investment Banker"]
  },
  computerScience: {
    title: "Computer Science & IT",
    requiredSubjects: ["mathematics", "computer_science"],
    recommendedSubjects: ["further_mathematics", "physics"],
    degrees: [
      { name: "Bachelor of Science in Computer Science", university: "University of Zimbabwe", duration: "4 years", description: "Focuses on programming, algorithms, data structures, and software engineering." },
      { name: "Bachelor of Information Technology", university: "Harare Institute of Technology", duration: "4 years", description: "Covers IT infrastructure, systems analysis, and application development." },
      { name: "Bachelor of Science in Software Engineering", university: "National University of Science and Technology", duration: "4 years", description: "Specializes in software development methodologies and practices." }
    ],
    careers: ["Software Developer", "Systems Analyst", "Database Administrator", "Cybersecurity Specialist", "Data Scientist"]
  },
  law: {
    title: "Law & Legal Studies",
    requiredSubjects: ["english_literature"],
    recommendedSubjects: ["history", "religious_studies", "sociology"],
    degrees: [
      { name: "Bachelor of Laws (LLB)", university: "University of Zimbabwe", duration: "4 years", description: "Prepares students for legal practice and covers various aspects of civil and criminal law." },
      { name: "Bachelor of Arts in Legal Studies", university: "Midlands State University", duration: "4 years", description: "Focuses on the philosophical, social, and historical context of law." }
    ],
    careers: ["Lawyer", "Legal Advisor", "Magistrate", "Legal Researcher", "Corporate Counsel"]
  },
  arts: {
    title: "Arts & Humanities",
    requiredSubjects: ["english_literature"],
    recommendedSubjects: ["history", "religious_studies", "art", "music", "sociology"],
    degrees: [
      { name: "Bachelor of Arts in English", university: "University of Zimbabwe", duration: "3 years", description: "Focuses on literature, language analysis, and critical thinking." },
      { name: "Bachelor of Arts in History", university: "Great Zimbabwe University", duration: "3 years", description: "Studies historical events, processes, and their impact on society." },
      { name: "Bachelor of Fine Arts", university: "Chinhoyi University of Technology", duration: "4 years", description: "Develops artistic skills in various media and explores art theory." }
    ],
    careers: ["Writer", "Journalist", "Curator", "Public Relations Specialist", "Teacher"]
  }
};

export default function ALevelSubjectSelection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("subject-selection");

  // Fetch student's registered subjects if already registered
  const { data: registeredSubjects, isLoading } = useQuery<StudentSubjects>({
    queryKey: ["/api/student/active-subjects"],
    enabled: user?.role === "student" && user?.currentEducationLevel === "a_level"
  });

  // Effect to set selected subjects from registered data
  useEffect(() => {
    if (registeredSubjects && Array.isArray(registeredSubjects.subjects)) {
      setSelectedSubjects(registeredSubjects.subjects);
    }
  }, [registeredSubjects]);

  // Mutation for registering selected subjects
  const registerSubjectsMutation = useMutation({
    mutationFn: async (subjects: string[]) => {
      if (registeredSubjects?.id) {
        // Update existing registration
        const res = await apiRequest("PUT", `/api/student-subjects/${registeredSubjects.id}`, { 
          subjects,
          educationLevel: "a_level",
          academicYear: new Date().getFullYear().toString(),
          isActive: true
        });
        return await res.json();
      } else {
        // Create new registration
        const res = await apiRequest("POST", "/api/student-subjects", { 
          subjects,
          educationLevel: "a_level",
          academicYear: new Date().getFullYear().toString(),
          isActive: true
        });
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Subjects registered successfully",
        description: "Your subject selection has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/active-subjects"] });
      setActiveTab("degrees");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not register subjects. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubjectRegistration = () => {
    if (selectedSubjects.length < 3) {
      toast({
        title: "Insufficient subjects",
        description: "Please select at least 3 A-Level subjects.",
        variant: "destructive",
      });
      return;
    }
    
    registerSubjectsMutation.mutate(selectedSubjects);
  };

  // Calculate eligible degree programs based on selected subjects
  const getEligiblePrograms = () => {
    const eligiblePrograms = [];
    
    for (const [key, program] of Object.entries(universityDegreePrograms)) {
      // Check if student has selected the required subjects for this program
      const hasRequiredSubjects = program.requiredSubjects.every(subject => 
        selectedSubjects.some(s => s.includes(subject))
      );
      
      // Count how many recommended subjects the student has selected
      const recommendedSubjectsCount = program.recommendedSubjects.filter(subject => 
        selectedSubjects.some(s => s.includes(subject))
      ).length;
      
      if (hasRequiredSubjects) {
        eligiblePrograms.push({
          key,
          ...program,
          recommendedMatch: recommendedSubjectsCount,
          matchPercentage: Math.round(((recommendedSubjectsCount / program.recommendedSubjects.length) * 50) + 50) // 50% for required + up to 50% for recommended
        });
      }
    }
    
    // Sort by match percentage (highest first)
    return eligiblePrograms.sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  // Group subjects by category for rendering
  const getCategorySubjects = () => {
    return Object.entries(aLevelSubjects).map(([category, subjects]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      subjects
    }));
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="A-Level Pathway Planning"
        description="Select your subjects, explore university degree programs and future career paths"
      >
        <Button variant="outline" className="gap-2" onClick={() => navigate("/career-guidance")}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </DashboardHeader>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="subject-selection">Subject Selection</TabsTrigger>
          <TabsTrigger value="degrees">Degree Programs</TabsTrigger>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="careers">Career Options</TabsTrigger>
        </TabsList>

        {/* Subject Selection Tab */}
        <TabsContent value="subject-selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Your A-Level Subjects</CardTitle>
              <CardDescription>
                Choose at least 3 subjects that align with your career goals and strengths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getCategorySubjects().map(({ category, subjects }) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {subjects.map((subject) => (
                        <div 
                          key={subject.id} 
                          className={`flex items-center space-x-2 p-3 rounded-md border 
                            ${selectedSubjects.includes(subject.id) ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
                        >
                          <Checkbox 
                            id={subject.id} 
                            checked={selectedSubjects.includes(subject.id)}
                            onCheckedChange={() => handleSubjectToggle(subject.id)}
                          />
                          <Label htmlFor={subject.id} className="cursor-pointer flex-1">
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Selected: {selectedSubjects.length} subjects
              </div>
              <Button 
                onClick={handleSubjectRegistration}
                disabled={registerSubjectsMutation.isPending}
              >
                {registerSubjectsMutation.isPending ? "Saving..." : "Save Selection & Continue"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Degree Programs Tab */}
        <TabsContent value="degrees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Degree Programs</CardTitle>
              <CardDescription>
                Based on your A-Level subject selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getEligiblePrograms().length > 0 ? (
                getEligiblePrograms().map((program) => (
                  <Card key={program.key} className={program.matchPercentage >= 80 ? "border-green-300" : "border-amber-300"}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <div className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {program.matchPercentage}% match
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Required Subjects
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {program.requiredSubjects.map((subject, idx) => {
                              // Find the full name of the subject
                              let subjectName = subject;
                              Object.values(aLevelSubjects).forEach(categorySubjects => {
                                const foundSubject = categorySubjects.find(s => s.id.includes(subject));
                                if (foundSubject) subjectName = foundSubject.name;
                              });
                              
                              const hasSubject = selectedSubjects.some(s => s.includes(subject));
                              
                              return (
                                <span 
                                  key={idx} 
                                  className={`text-xs px-2 py-1 rounded-full ${hasSubject ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                  {subjectName} {hasSubject ? '✓' : '✗'}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Recommended Subjects
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {program.recommendedSubjects.map((subject, idx) => {
                              // Find the full name of the subject
                              let subjectName = subject;
                              Object.values(aLevelSubjects).forEach(categorySubjects => {
                                const foundSubject = categorySubjects.find(s => s.id.includes(subject));
                                if (foundSubject) subjectName = foundSubject.name;
                              });
                              
                              const hasSubject = selectedSubjects.some(s => s.includes(subject));
                              
                              return (
                                <span 
                                  key={idx} 
                                  className={`text-xs px-2 py-1 rounded-full ${hasSubject ? 'bg-green-100 text-green-800' : 'bg-muted'}`}
                                >
                                  {subjectName} {hasSubject ? '✓' : ''}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="degrees">
                          <AccordionTrigger className="text-sm font-medium">
                            <div className="flex items-center">
                              <School className="h-4 w-4 mr-2" />
                              Available Degrees ({program.degrees.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              {program.degrees.map((degree, idx) => (
                                <Card key={idx} className="border-muted">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-base">{degree.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {degree.university} • {degree.duration}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pb-2">
                                    <p className="text-sm text-muted-foreground">
                                      {degree.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="careers">
                          <AccordionTrigger className="text-sm font-medium">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2" />
                              Potential Careers ({program.careers.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                              {program.careers.map((career, idx) => (
                                <div key={idx} className="bg-muted p-2 rounded-md text-sm">
                                  {career}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("universities")}>
                        Explore Universities
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Eligible Programs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Your current subject selection doesn't match the requirements for standard degree programs.
                    Please go back and select more appropriate subjects.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("subject-selection")}>
                    Revise Subject Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Universities Tab */}
        <TabsContent value="universities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Explore Universities</CardTitle>
              <CardDescription>
                Learn about top universities offering your potential degree programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <School className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">University of Zimbabwe</CardTitle>
                        <CardDescription>Harare, Zimbabwe • Founded 1952</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2">Zimbabwe's oldest and most prestigious university offering a wide range of undergraduate and graduate programs.</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline">Medicine</Badge>
                      <Badge variant="outline">Engineering</Badge>
                      <Badge variant="outline">Law</Badge>
                      <Badge variant="outline">Arts</Badge>
                      <Badge variant="outline">Sciences</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/universities?id=1" target="_blank" rel="noopener noreferrer">
                        View University Profile
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <School className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">National University of Science and Technology</CardTitle>
                        <CardDescription>Bulawayo, Zimbabwe • Founded 1991</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2">Leading institution for engineering, technology, and applied sciences education in Zimbabwe.</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline">Engineering</Badge>
                      <Badge variant="outline">Computer Science</Badge>
                      <Badge variant="outline">Applied Sciences</Badge>
                      <Badge variant="outline">Industrial Technology</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/universities?id=2" target="_blank" rel="noopener noreferrer">
                        View University Profile
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <School className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Midlands State University</CardTitle>
                        <CardDescription>Gweru, Zimbabwe • Founded 1999</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2">Comprehensive university known for its business, humanities, and social science programs.</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline">Business</Badge>
                      <Badge variant="outline">Humanities</Badge>
                      <Badge variant="outline">Law</Badge>
                      <Badge variant="outline">Education</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/universities?id=3" target="_blank" rel="noopener noreferrer">
                        View University Profile
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <School className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Harare Institute of Technology</CardTitle>
                        <CardDescription>Harare, Zimbabwe • Founded 2005</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2">Specialized institution focused on technological innovation, engineering, and IT education.</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline">Technology</Badge>
                      <Badge variant="outline">Software Engineering</Badge>
                      <Badge variant="outline">Biotechnology</Badge>
                      <Badge variant="outline">Electronics</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/universities?id=4" target="_blank" rel="noopener noreferrer">
                        View University Profile
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="default" asChild>
                  <a href="/universities" target="_blank" rel="noopener noreferrer">
                    View All Universities
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Careers Tab */}
        <TabsContent value="careers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Explore Career Pathways</CardTitle>
              <CardDescription>
                Discover career opportunities based on your interests and subject selections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {getEligiblePrograms().map((program) => (
                  <Card key={program.key}>
                    <CardHeader>
                      <CardTitle className="text-lg">{program.title} Careers</CardTitle>
                      <CardDescription>
                        Career paths available after completing degrees in this field
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {program.careers.map((career, idx) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Card className="hover:border-primary cursor-pointer transition-all">
                                  <CardHeader className="p-4">
                                    <CardTitle className="text-base">{career}</CardTitle>
                                  </CardHeader>
                                </Card>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" align="center" className="max-w-sm">
                                <div className="text-sm">
                                  <p>Click to explore detailed career information, salary ranges, and job opportunities.</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="mt-2 text-center">
                  <Button variant="default" asChild>
                    <a href="/career-guidance" className="flex items-center gap-2">
                      Explore Career Guidance Center
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}