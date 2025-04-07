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
import { BookOpen, CheckCircle2, ChevronRight, Info, School } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Zimbabwe O Level subjects
const oLevelSubjects = [
  { id: "english", name: "English Language" },
  { id: "mathematics", name: "Mathematics" },
  { id: "shona", name: "Shona" },
  { id: "ndebele", name: "Ndebele" },
  { id: "biology", name: "Biology" },
  { id: "chemistry", name: "Chemistry" },
  { id: "physics", name: "Physics" },
  { id: "combined_science", name: "Combined Science" },
  { id: "geography", name: "Geography" },
  { id: "history", name: "History" },
  { id: "religious_studies", name: "Religious Studies" },
  { id: "business_studies", name: "Business Studies" },
  { id: "accounting", name: "Accounting" },
  { id: "economics", name: "Economics" },
  { id: "computer_science", name: "Computer Science" },
  { id: "agriculture", name: "Agriculture" },
  { id: "technical_graphics", name: "Technical Graphics" },
  { id: "metal_work", name: "Metal Work" },
  { id: "wood_work", name: "Wood Work" },
  { id: "food_and_nutrition", name: "Food and Nutrition" },
  { id: "fashion_and_fabrics", name: "Fashion and Fabrics" },
  { id: "art", name: "Art" },
  { id: "music", name: "Music" },
  { id: "physical_education", name: "Physical Education" },
];

// A Level pathways based on O Level subjects
const aLevelPathways = {
  sciences: {
    title: "Sciences Pathway",
    prerequisites: ["mathematics", "biology", "chemistry", "physics", "combined_science"],
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    careers: ["Doctor", "Engineer", "Pharmacist", "Computer Scientist", "Researcher"]
  },
  commercials: {
    title: "Commercial Pathway",
    prerequisites: ["mathematics", "business_studies", "accounting", "economics"],
    subjects: ["Accounting", "Business Studies", "Economics", "Mathematics"],
    careers: ["Accountant", "Business Analyst", "Economist", "Entrepreneur", "Marketing Specialist"]
  },
  arts: {
    title: "Arts and Humanities Pathway",
    prerequisites: ["english", "history", "religious_studies", "geography", "art", "music"],
    subjects: ["English Literature", "History", "Religious Studies", "Geography", "Sociology"],
    careers: ["Lawyer", "Journalist", "Teacher", "Social Worker", "Public Relations Officer"]
  },
  technical: {
    title: "Technical Pathway",
    prerequisites: ["mathematics", "technical_graphics", "metal_work", "wood_work"],
    subjects: ["Design and Technology", "Mathematics", "Physics", "Technical Drawing"],
    careers: ["Architect", "Civil Engineer", "Mechanical Engineer", "Technician", "Product Designer"]
  }
};

// University programs based on pathways
const universityPrograms = {
  sciences: [
    { name: "Medicine and Surgery", university: "University of Zimbabwe", prerequisites: ["Biology", "Chemistry"] },
    { name: "Engineering", university: "National University of Science and Technology", prerequisites: ["Mathematics", "Physics"] },
    { name: "Computer Science", university: "Harare Institute of Technology", prerequisites: ["Mathematics", "Computer Science"] },
    { name: "Pharmacy", university: "University of Zimbabwe", prerequisites: ["Chemistry", "Biology"] }
  ],
  commercials: [
    { name: "Bachelor of Accountancy", university: "University of Zimbabwe", prerequisites: ["Accounting", "Mathematics"] },
    { name: "Business Administration", university: "Midlands State University", prerequisites: ["Business Studies", "Economics"] },
    { name: "Banking and Finance", university: "National University of Science and Technology", prerequisites: ["Mathematics", "Economics"] }
  ],
  arts: [
    { name: "Law", university: "University of Zimbabwe", prerequisites: ["English Literature", "History"] },
    { name: "Social Work", university: "Women's University in Africa", prerequisites: ["Sociology", "Religious Studies"] },
    { name: "Media and Communication", university: "Midlands State University", prerequisites: ["English Literature", "Sociology"] }
  ],
  technical: [
    { name: "Architecture", university: "National University of Science and Technology", prerequisites: ["Technical Drawing", "Mathematics"] },
    { name: "Civil Engineering", university: "University of Zimbabwe", prerequisites: ["Mathematics", "Physics"] },
    { name: "Mechanical Engineering", university: "Harare Institute of Technology", prerequisites: ["Mathematics", "Physics"] }
  ]
};

export default function OLevelSubjectSelection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("subject-selection");

  // Fetch student's registered subjects if already registered
  const { data: registeredSubjects, isLoading } = useQuery<StudentSubjects>({
    queryKey: ["/api/student/active-subjects"],
    enabled: user?.role === "student" && user?.currentEducationLevel === "o_level"
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
          educationLevel: "o_level",
          academicYear: new Date().getFullYear().toString(),
          isActive: true
        });
        return await res.json();
      } else {
        // Create new registration
        const res = await apiRequest("POST", "/api/student-subjects", { 
          subjects,
          educationLevel: "o_level",
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
      setActiveTab("pathways");
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
    if (selectedSubjects.length < 5) {
      toast({
        title: "Insufficient subjects",
        description: "Please select at least 5 subjects including English and Mathematics.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSubjects.includes("english") || !selectedSubjects.includes("mathematics")) {
      toast({
        title: "Core subjects required",
        description: "English Language and Mathematics are compulsory subjects.",
        variant: "destructive",
      });
      return;
    }

    registerSubjectsMutation.mutate(selectedSubjects);
  };

  // Calculate eligible pathways based on selected subjects
  const getEligiblePathways = () => {
    const eligiblePathways = [];
    
    for (const [key, pathway] of Object.entries(aLevelPathways)) {
      // Check if student has selected at least 2 prerequisite subjects for this pathway
      const matchingPrerequisites = pathway.prerequisites.filter(subject => 
        selectedSubjects.includes(subject)
      );
      
      if (matchingPrerequisites.length >= 2) {
        eligiblePathways.push({
          key,
          ...pathway,
          matchCount: matchingPrerequisites.length,
          matchPercentage: Math.round((matchingPrerequisites.length / pathway.prerequisites.length) * 100)
        });
      }
    }
    
    // Sort by most matches first
    return eligiblePathways.sort((a, b) => b.matchCount - a.matchCount);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="O-Level Pathway Planning"
        description="Select your subjects, explore possible A-Level combinations and future career paths"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="subject-selection">Subject Selection</TabsTrigger>
          <TabsTrigger value="pathways">A-Level Pathways</TabsTrigger>
          <TabsTrigger value="university-programs">University Programs</TabsTrigger>
          <TabsTrigger value="careers">Career Options</TabsTrigger>
        </TabsList>

        {/* Subject Selection Tab */}
        <TabsContent value="subject-selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Your O-Level Subjects</CardTitle>
              <CardDescription>
                Choose at least 5 subjects including English and Mathematics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {oLevelSubjects.map((subject) => (
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
                    {(subject.id === "english" || subject.id === "mathematics") && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">
                        Required
                      </span>
                    )}
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

        {/* A-Level Pathways Tab */}
        <TabsContent value="pathways" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended A-Level Pathways</CardTitle>
              <CardDescription>
                Based on your O-Level subject selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getEligiblePathways().length > 0 ? (
                getEligiblePathways().map((pathway) => (
                  <Card key={pathway.key} className={pathway.matchPercentage >= 70 ? "border-green-300" : "border-amber-300"}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pathway.title}</CardTitle>
                        <div className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {pathway.matchPercentage}% match
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Recommended A-Level Subjects
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pathway.subjects.map((subject, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-muted rounded-full">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Your Matching Prerequisites
                          </h4>
                          <div className="text-xs text-muted-foreground">
                            {pathway.prerequisites.filter(subject => 
                              selectedSubjects.includes(subject)
                            ).map(s => {
                              const full = oLevelSubjects.find(subj => subj.id === s)?.name;
                              return full;
                            }).join(", ")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("university-programs")}>
                        Explore University Programs
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Eligible Pathways Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Your current subject selection doesn't match any standard A-Level pathway requirements.
                    Please go back and select more prerequisite subjects.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("subject-selection")}>
                    Revise Subject Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* University Programs Tab */}
        <TabsContent value="university-programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Explore University Programs</CardTitle>
              <CardDescription>
                Programs you may qualify for based on your potential A-Level pathway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(universityPrograms).map(([pathwayKey, programs]) => (
                  <AccordionItem key={pathwayKey} value={pathwayKey}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <School className="h-5 w-5 mr-2 text-primary" />
                        <span>{aLevelPathways[pathwayKey as keyof typeof aLevelPathways].title} Programs</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {programs.map((program, idx) => (
                          <Card key={idx} className="overflow-hidden">
                            <div className="bg-muted px-4 py-2 border-b">
                              <h4 className="font-medium">{program.name}</h4>
                              <p className="text-xs text-muted-foreground">{program.university}</p>
                            </div>
                            <div className="p-4">
                              <div className="mb-2">
                                <h5 className="text-sm font-medium mb-1">Required A-Level Subjects</h5>
                                <div className="flex flex-wrap gap-1">
                                  {program.prerequisites.map((subject, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="w-full mt-2">
                                View Program Details
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Careers Tab */}
        <TabsContent value="careers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Potential Career Paths</CardTitle>
              <CardDescription>
                Explore career opportunities based on your educational pathway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(aLevelPathways).map(([key, pathway]) => (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{pathway.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-medium mb-2">Potential Careers</h4>
                      <div className="space-y-2">
                        {pathway.careers.map((career, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center p-2 rounded-md bg-muted"
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{career}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Explore Career Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}