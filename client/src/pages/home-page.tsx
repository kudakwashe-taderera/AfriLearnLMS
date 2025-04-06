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
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  
  // Redirect based on role if the user is logged in
  if (user) {
    switch (user.role) {
      case "student":
        return <StudentHomePage />;
      case "instructor":
        return <InstructorHomePage />;
      case "admin":
        return <AdminHomePage />;
      default:
        return <LandingPage />;
    }
  }
  
  // Default to landing page for logged out users
  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to AfriLearn</h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 opacity-90">
            The premier learning management system designed for African educational institutions and students.
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
            <h2 className="text-3xl font-bold mb-4">Built for the complete educational experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AfriLearn provides a comprehensive set of tools and features designed to enhance teaching and learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10" />}
              title="Course Management"
              description="Easily create and manage courses, organize content, and track student progress."
            />
            
            <FeatureCard 
              icon={<FileText className="h-10 w-10" />}
              title="Assignments & Grading"
              description="Create assignments, assess student work, and provide timely feedback."
            />
            
            <FeatureCard 
              icon={<Calendar className="h-10 w-10" />}
              title="Calendar & Scheduling"
              description="Keep track of important dates, deadlines, and events in one place."
            />
            
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10" />}
              title="Discussions & Forums"
              description="Facilitate engaging discussions and collaborative learning experiences."
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10" />}
              title="Analytics & Reporting"
              description="Track performance metrics and generate insightful reports for data-driven decisions."
            />
            
            <FeatureCard 
              icon={<Users className="h-10 w-10" />}
              title="User Management"
              description="Simplified management of students, instructors, and administrators."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by educational institutions across Africa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with AfriLearn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AfriLearn has completely transformed how we teach and engage with our students. It's made our institution more effective."
              author="Dr. Adeola Osei"
              role="Professor, University of Ghana"
            />
            
            <TestimonialCard
              quote="As a student, I appreciate how easy it is to access course materials, submit assignments, and communicate with my instructors."
              author="Chioma Nwosu"
              role="Student, University of Lagos"
            />
            
            <TestimonialCard
              quote="AfriLearn has simplified administrative tasks and provided valuable insights into our educational programs."
              author="Samuel Mwangi"
              role="Dean, Kenyatta University"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Join thousands of students and educators who are already using AfriLearn to enhance their educational experience.
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
              <h3 className="text-2xl font-bold">AfriLearn</h3>
              <p className="text-muted-foreground">Empowering education across Africa</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Guides</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2023 AfriLearn. All rights reserved.</p>
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

function StudentHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to AfriLearn</h1>
        
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
        <h1 className="text-3xl font-bold">Welcome to AfriLearn</h1>
        
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
        <h1 className="text-3xl font-bold">Welcome to AfriLearn</h1>
        
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

// Component for feature cards on the landing page
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Component for testimonial cards on the landing page
function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
            <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
          </svg>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 italic">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for action cards on the user home pages
function ActionCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="text-primary mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <Link href={link}>
            Go to {title}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}