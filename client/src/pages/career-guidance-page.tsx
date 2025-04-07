import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/hooks/use-auth";
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Briefcase, 
  UserCheck, 
  BarChart, 
  Calendar, 
  FileText 
} from "lucide-react";

const careerPaths = [
  {
    title: "Academic Path",
    description: "Pursue advanced degrees and research opportunities",
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    steps: [
      { title: "Master's Degree", description: "Complete 1-2 years of specialized study" },
      { title: "Ph.D. Program", description: "Conduct original research in your field" },
      { title: "Post-Doctoral Research", description: "Further specialize in your area of expertise" },
      { title: "Faculty Position", description: "Join a university as a lecturer or professor" }
    ]
  },
  {
    title: "Industry Path",
    description: "Apply your knowledge in business and commercial settings",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    steps: [
      { title: "Entry-Level Position", description: "Gain practical work experience" },
      { title: "Specialized Training", description: "Develop industry-specific skills" },
      { title: "Mid-Level Management", description: "Lead teams and projects" },
      { title: "Executive Role", description: "Direct department or company strategy" }
    ]
  },
  {
    title: "Entrepreneurship",
    description: "Start and grow your own business ventures",
    icon: <Award className="h-8 w-8 text-primary" />,
    steps: [
      { title: "Idea Development", description: "Identify market needs and opportunities" },
      { title: "Business Planning", description: "Create a roadmap for your venture" },
      { title: "Funding & Launch", description: "Secure resources and start operations" },
      { title: "Scaling & Growth", description: "Expand your business and impact" }
    ]
  },
  {
    title: "Public Service",
    description: "Work in government or non-profit organizations",
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    steps: [
      { title: "Civil Service Entry", description: "Join government departments or agencies" },
      { title: "Policy Development", description: "Help shape public programs and initiatives" },
      { title: "Leadership Roles", description: "Direct public service programs" },
      { title: "Executive Appointments", description: "Serve in high-level government positions" }
    ]
  }
];

const recommendedCourses = [
  { id: 1, title: "Advanced Data Analytics", description: "Learn to extract insights from complex data sets", skill: "Data Analysis" },
  { id: 2, title: "Project Management Fundamentals", description: "Master the principles of effective project execution", skill: "Management" },
  { id: 3, title: "Business Communication", description: "Develop professional writing and presentation skills", skill: "Communication" },
  { id: 4, title: "Industry Innovation Seminar", description: "Study emerging trends and technologies", skill: "Innovation" }
];

const skillAssessments = [
  { id: 1, title: "Technical Skills Assessment", description: "Evaluate your proficiency in key technical areas", domain: "Technical" },
  { id: 2, title: "Leadership Potential Analysis", description: "Assess your capacity for leading teams and projects", domain: "Leadership" },
  { id: 3, title: "Communication Skills Evaluation", description: "Measure your verbal and written communication abilities", domain: "Communication" },
  { id: 4, title: "Problem-Solving Assessment", description: "Test your analytical and critical thinking abilities", domain: "Analytical" }
];

export default function CareerGuidancePage() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Career Guidance"
        description="Explore career paths, assessments, and personalized recommendations"
      >
        {user?.role === 'student' && (
          <div className="flex space-x-2">
            {user.currentEducationLevel === 'o_level' && (
              <Button asChild>
                <a href="/olevel-subject-selection">Select O-Level Subjects</a>
              </Button>
            )}
            {user.currentEducationLevel === 'a_level' && (
              <Button asChild>
                <a href="/alevel-subject-selection">Select A-Level Subjects</a>
              </Button>
            )}
            {user.currentEducationLevel === 'undergraduate' && (
              <Button asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <a href="/student-dashboard">Go to Dashboard</a>
            </Button>
          </div>
        )}
      </DashboardHeader>
      
      {/* Welcome banner for new students */}
      <div className="mb-6 p-6 bg-primary/10 rounded-lg border border-primary/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="p-3 rounded-full bg-primary/20 text-primary">
            <GraduationCap className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Welcome to AfriLearnHub Career Guidance!</h2>
            <p className="text-muted-foreground mb-3">
              This is your starting point for your educational journey. Here you can explore career paths, 
              get personalized advice, find mentorship opportunities, and plan your educational path.
            </p>
            <div className="flex flex-wrap gap-2">
              {user?.role === 'student' && user?.currentEducationLevel === 'o_level' && (
                <Button variant="default" asChild>
                  <a href="/olevel-subject-selection">Select Your O-Level Subjects</a>
                </Button>
              )}
              {user?.role === 'student' && user?.currentEducationLevel === 'a_level' && (
                <Button variant="default" asChild>
                  <a href="/alevel-subject-selection">Select Your A-Level Subjects</a>
                </Button>
              )}
              {user?.role === 'student' && user?.currentEducationLevel === 'undergraduate' && (
                <Button variant="default" asChild>
                  <a href="/courses">Browse Available Courses</a>
                </Button>
              )}
              <Button variant="outline" asChild>
                <a href="/universities">Explore Universities</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block absolute -right-12 -top-12 p-10 rounded-full bg-primary/5"></div>
        <div className="hidden md:block absolute -right-6 -bottom-6 p-6 rounded-full bg-primary/5"></div>
      </div>
      
      <Tabs defaultValue="paths" className="space-y-4">
        <TabsList>
          <TabsTrigger value="paths">Career Paths</TabsTrigger>
          <TabsTrigger value="skills">Skill Development</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="planning">Career Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerPaths.map((path, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {path.icon}
                    <div>
                      <CardTitle>{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {path.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 mt-1">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore This Path</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>Based on your profile and career interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedCourses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="text-xs">Skills: {course.skill}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{course.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Enroll</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessments</CardTitle>
                <CardDescription>Evaluate your abilities and identify areas for growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillAssessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription className="text-xs">Domain: {assessment.domain}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{assessment.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Take Assessment</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mentorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find a Mentor</CardTitle>
              <CardDescription>Connect with industry professionals and academic experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">Professor of Computer Science, 15+ years experience</p>
                    </div>
                  </div>
                  <Button>Request</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Michael Chen</h4>
                      <p className="text-sm text-muted-foreground">Senior Engineer at Google, Tech Industry Expert</p>
                    </div>
                  </div>
                  <Button>Request</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Amara Okafor</h4>
                      <p className="text-sm text-muted-foreground">Founder & CEO, Startup Advisor</p>
                    </div>
                  </div>
                  <Button>Request</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Mentorship Events</CardTitle>
              <CardDescription>Workshops, webinars, and networking opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Calendar className="h-10 w-10 text-primary" />
                  <div>
                    <h4 className="font-medium">Industry Insights Panel</h4>
                    <p className="text-sm">May 15, 2025 • 3:00 PM</p>
                    <p className="text-sm text-muted-foreground mt-1">Q&A with professionals from leading companies</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Calendar className="h-10 w-10 text-primary" />
                  <div>
                    <h4 className="font-medium">Resume Building Workshop</h4>
                    <p className="text-sm">May 20, 2025 • 1:00 PM</p>
                    <p className="text-sm text-muted-foreground mt-1">Learn how to create an effective professional resume</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Development Plan</CardTitle>
              <CardDescription>Your personalized roadmap to career success</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Short-term Goals (1 Year)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="text-sm">Complete core technical courses with GPA ≥ 3.5</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="text-sm">Secure summer internship in target industry</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="text-sm">Develop proficiency in two programming languages</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Medium-term Goals (2-3 Years)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Complete degree with honors distinction</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Secure entry-level position at target company</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Build professional network of 50+ industry contacts</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Long-term Goals (5+ Years)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Advance to senior-level position</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Complete advanced certification or graduate degree</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <p className="text-sm">Lead major projects or initiatives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Development Plan</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resources & Tools</CardTitle>
              <CardDescription>Additional resources to support your career journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Resume Builder</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Create professional resumes with our easy-to-use templates</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <BarChart className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Skills Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Track your skill growth and identify improvement areas</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Career Library</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Access articles, videos, and guides on career development</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}