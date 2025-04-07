import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  ChevronRight, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  FileText,
  CheckCircle,
  Briefcase,
  Building,
  UserCheck,
  Globe,
  Award,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  
  // If user is logged in, redirect to the appropriate dashboard
  if (user) {
    const dashboardPath = getDashboardPath(user.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Welcome back, {user.firstName}!</CardTitle>
            <CardDescription>You are already logged in as {user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You will be redirected to your dashboard shortly.</p>
          </CardContent>
          <CardFooter>
            <Link to={dashboardPath}>
              <Button className="w-full">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Default to landing page for logged out users
  return <LandingPage />;
}

// Helper function to get the dashboard path based on user role
function getDashboardPath(role: string) {
  switch (role) {
    case 'student':
      return '/student-dashboard';
    case 'instructor':
      return '/instructor-dashboard';
    case 'admin':
      return '/admin-dashboard';
    case 'employer':
      return '/employer-dashboard';
    case 'university_admin':
      return '/university-admin-dashboard';
    case 'ministry_official':
      return '/ministry-dashboard';
    default:
      return '/';
  }
}

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to AfriLearnHub</h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 opacity-90">
            The comprehensive education and career system connecting students, institutions, and employers across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Education & Career System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AfriLearnHub brings together everything students, educators, employers, and institutions need in one integrated platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10" />}
              title="Learning Management"
              description="Powerful course management, assignments, grading, and communication tools for teaching and learning."
            />
            
            <FeatureCard 
              icon={<GraduationCap className="h-10 w-10" />}
              title="University Applications"
              description="Streamlined application process to universities across Africa with tracking and document management."
            />
            
            <FeatureCard 
              icon={<Briefcase className="h-10 w-10" />}
              title="Career & Job Portal"
              description="Connect students with employers through job listings, internships, and career guidance resources."
            />
            
            <FeatureCard 
              icon={<Users className="h-10 w-10" />}
              title="Inter-University Collaboration"
              description="Enable research partnerships, resource sharing, and academic collaboration between institutions."
            />
            
            <FeatureCard 
              icon={<UserCheck className="h-10 w-10" />}
              title="Mentorship & Guidance"
              description="Connect students with mentors from industry and academia for career guidance and support."
            />
            
            <FeatureCard 
              icon={<Award className="h-10 w-10" />}
              title="Ministry & Governance"
              description="Educational oversight tools for ministry officials to monitor quality and implement policies."
            />
          </div>
        </div>
      </section>
      
      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">For Every Educational Stakeholder</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AfriLearnHub serves the entire educational ecosystem with tailored features for each role.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><GraduationCap className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">Students</h3>
              <p className="text-muted-foreground">Access courses, apply to universities, find jobs and internships, connect with mentors, and track academic progress.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><BookOpen className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">Instructors</h3>
              <p className="text-muted-foreground">Create courses, manage assignments, communicate with students, and collaborate with colleagues.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><Building className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">University Administrators</h3>
              <p className="text-muted-foreground">Manage applications, coordinate programs, track enrollment, and foster inter-university partnerships.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><Briefcase className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">Employers</h3>
              <p className="text-muted-foreground">Post jobs, find qualified candidates, view academic records, and build talent pipelines with educational institutions.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><UserCheck className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">Mentors</h3>
              <p className="text-muted-foreground">Guide students through their academic and career journeys with structured mentorship programs.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm h-full">
              <div className="text-primary mb-4"><FileText className="h-10 w-10" /></div>
              <h3 className="text-xl font-medium mb-2">Ministry Officials</h3>
              <p className="text-muted-foreground">Monitor educational quality, analyze data trends, develop policies, and support educational initiatives.</p>
              <Link to="/auth">
                <Button variant="link" className="p-0 mt-4">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted Across Africa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with AfriLearnHub.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AfriLearnHub has transformed how we teach and engage with students. The integrated platform connects our university with employers and other institutions."
              author="Dr. Adeola Osei"
              role="Professor, University of Ghana"
            />
            
            <TestimonialCard
              quote="As a student, I can manage my courses, apply to universities, and find internships all in one place. The career guidance tools have been invaluable."
              author="Chioma Nwosu"
              role="Student, University of Lagos"
            />
            
            <TestimonialCard
              quote="The ability to connect directly with universities and view student academic records has dramatically improved our recruitment process."
              author="Mohammed Kenyatta"
              role="HR Director, TechAfrica Innovations"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join AfriLearnHub Today</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Experience the future of education with our comprehensive platform connecting students, educators, institutions, and employers.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/auth">Create Your Account</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">AfriLearnHub</h3>
              <p className="text-muted-foreground">Transforming education across Africa</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Support</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Universities</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Career Resources</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Partnerships</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 AfriLearnHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="text-primary mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// User Type Card Component
function UserTypeCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm h-full">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <Link to="/auth">
        <Button variant="link" className="p-0 mt-4">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="text-primary text-4xl mb-4">"</div>
        <p className="italic mb-6">{quote}</p>
        <div className="border-t pt-4">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Action Card Component
function ActionCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Link href={link}>
      <Card className="h-full hover:bg-muted/30 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-primary">{icon}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function StudentHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to AfriLearnHub</h1>
        
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/student-dashboard">
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/courses-page">
              My Courses
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <ActionCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Courses"
          description="Access your enrolled courses and course materials"
          link="/courses-page"
        />
        
        <ActionCard
          icon={<FileText className="h-6 w-6" />}
          title="Assignments"
          description="View and submit your pending assignments"
          link="/assignments-page"
        />
        
        <ActionCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Grades"
          description="Check your grades and academic progress"
          link="/grades-page"
        />
        
        <ActionCard
          icon={<Calendar className="h-6 w-6" />}
          title="Calendar"
          description="Keep track of important dates and deadlines"
          link="/calendar-page"
        />
        
        <ActionCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Discussions"
          description="Participate in course discussions and forums"
          link="/discussions-page"
        />
        
        <ActionCard
          icon={<Users className="h-6 w-6" />}
          title="Messages"
          description="Communicate with instructors and classmates"
          link="/messages-page"
        />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/profile-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> View Profile
          </Link>
          <Link href="/student-dashboard" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Student Dashboard
          </Link>
          <Link href="/assignments-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Upcoming Assignments
          </Link>
          <Link href="/grades-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Recent Grades
          </Link>
          <Link href="/calendar-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Academic Calendar
          </Link>
          <Link href="/messages-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

function InstructorHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to AfriLearnHub</h1>
        
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/instructor-dashboard">
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/courses-page">
              My Courses
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <ActionCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Courses"
          description="Manage your courses and course materials"
          link="/courses-page"
        />
        
        <ActionCard
          icon={<FileText className="h-6 w-6" />}
          title="Assignments"
          description="Create and grade student assignments"
          link="/assignments-page"
        />
        
        <ActionCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Grades"
          description="View and manage student grades"
          link="/grades-page"
        />
        
        <ActionCard
          icon={<Calendar className="h-6 w-6" />}
          title="Calendar"
          description="Manage course schedule and deadlines"
          link="/calendar-page"
        />
        
        <ActionCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Discussions"
          description="Facilitate course discussions and forums"
          link="/discussions-page"
        />
        
        <ActionCard
          icon={<Users className="h-6 w-6" />}
          title="Messages"
          description="Communicate with students and colleagues"
          link="/messages-page"
        />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/profile-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> View Profile
          </Link>
          <Link href="/instructor-dashboard" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Instructor Dashboard
          </Link>
          <Link href="/course-create-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Create New Course
          </Link>
          <Link href="/assignment-create-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Create New Assignment
          </Link>
          <Link href="/grades-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Grade Submissions
          </Link>
          <Link href="/messages-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to AfriLearnHub</h1>
        
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin-dashboard">
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/user-management-page">
              User Management
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <ActionCard
          icon={<Users className="h-6 w-6" />}
          title="User Management"
          description="Manage students, instructors, and administrators"
          link="/user-management-page"
        />
        
        <ActionCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Courses"
          description="Oversee all courses and academic programs"
          link="/courses-page"
        />
        
        <ActionCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Analytics"
          description="Access system-wide analytics and reports"
          link="/admin-dashboard"
        />
        
        <ActionCard
          icon={<Calendar className="h-6 w-6" />}
          title="Calendar"
          description="Manage institutional calendar and events"
          link="/calendar-page"
        />
        
        <ActionCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Announcements"
          description="Create and manage system-wide announcements"
          link="/admin-dashboard"
        />
        
        <ActionCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="System Status"
          description="Monitor system health and performance"
          link="/admin-dashboard"
        />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/profile-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> View Profile
          </Link>
          <Link href="/admin-dashboard" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Admin Dashboard
          </Link>
          <Link href="/user-management-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> User Management
          </Link>
          <Link href="/courses-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Course Management
          </Link>
          <Link href="/calendar-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Academic Calendar
          </Link>
          <Link href="/messages-page" className="text-primary hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" /> Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

