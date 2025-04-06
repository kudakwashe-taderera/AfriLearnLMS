import { Link, useLocation } from "wouter";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Star,
  CheckCircle,
  ArrowRight,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  // Features data
  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with interactive content, quizzes, and real-time feedback to enhance your understanding.",
      icon: <GraduationCap className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Collaborative Community",
      description: "Connect with fellow students and instructors through discussion forums and group projects.",
      icon: <Users className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Comprehensive Course Materials",
      description: "Access a wide range of course materials, including videos, readings, and assignments.",
      icon: <FileText className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Responsive Support",
      description: "Get help when you need it with our responsive support system and instructor office hours.",
      icon: <MessageSquare className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Organized Schedule",
      description: "Stay on track with a clear calendar view of all your deadlines, classes, and events.",
      icon: <Calendar className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "African Excellence",
      description: "Experience culturally relevant content that celebrates African knowledge systems and history.",
      icon: <Globe className="h-10 w-10 text-primary-400" />,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "AfriLearn transformed my educational journey. The platform is intuitive, and the course content respects our heritage.",
      author: "Chioma A.",
      role: "Computer Science Student",
      institution: "University of Lagos",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      quote: "As an instructor, I've found AfriLearn to be a powerful tool for engaging students and tracking their progress.",
      author: "Dr. Kofi Mensah",
      role: "Professor of Economics",
      institution: "University of Ghana",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5,
    },
    {
      quote: "The platform's focus on African perspectives makes it uniquely valuable for our educational system.",
      author: "Prof. Amina Ibrahim",
      role: "Educational Technology Specialist",
      institution: "Addis Ababa University",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 4,
    },
  ];

  // If user is logged in, redirect to their dashboard
  if (user) {
    const dashboardPath = 
      user.role === "admin" ? "/admin/dashboard" : 
      user.role === "instructor" ? "/instructor/dashboard" : 
      "/student/dashboard";
    
    navigate(dashboardPath);
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-umber-900">AfriLearn</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features">
              <a className="text-sm font-medium text-umber-700 hover:text-primary-500">Features</a>
            </Link>
            <Link href="#testimonials">
              <a className="text-sm font-medium text-umber-700 hover:text-primary-500">Testimonials</a>
            </Link>
            <Link href="#about">
              <a className="text-sm font-medium text-umber-700 hover:text-primary-500">About</a>
            </Link>
            <Link href="#contact">
              <a className="text-sm font-medium text-umber-700 hover:text-primary-500">Contact</a>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth?tab=register">
              <Button className="bg-primary-400 hover:bg-primary-500 text-white">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
          <div className="container px-4 md:px-6 py-16 md:py-24 lg:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Learn, Connect, Excel with AfriLearn
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/90">
                  A modern learning management system designed for African educational excellence. 
                  Unlock your potential with our comprehensive educational platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth?tab=register">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-300"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-400"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500"></div>
                  </div>
                  <div className="text-white/90 text-sm">
                    <span className="font-semibold">Join 500+</span> students & educators
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-lg bg-white/10 blur-lg"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="h-7 w-7 text-white" />
                      <h3 className="text-xl font-bold text-white">AfriLearn Dashboard</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/20 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Current Courses</h4>
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-white/10 rounded-md p-2 flex items-center justify-between"
                            >
                              <span className="text-white/90 text-sm">
                                African Literature 101
                              </span>
                              <span className="text-xs bg-primary-600/70 text-white px-2 py-0.5 rounded">
                                In Progress
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Upcoming Assignments</h4>
                        <div className="space-y-2">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-white/10 rounded-md p-2 flex items-center justify-between"
                            >
                              <span className="text-white/90 text-sm">
                                Research Essay
                              </span>
                              <span className="text-xs text-white/90">Due in 3 days</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-full">
            <svg
              className="absolute bottom-0 left-0 right-0 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,288L60,272C120,256,240,224,360,218.7C480,213,600,235,720,245.3C840,256,960,256,1080,234.7C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-neutral-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">20+</h3>
                <p className="text-umber-700 font-medium">Universities</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">100+</h3>
                <p className="text-umber-700 font-medium">Courses</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">500+</h3>
                <p className="text-umber-700 font-medium">Students</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">50+</h3>
                <p className="text-umber-700 font-medium">Instructors</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-4">
                Powerful Features for Better Learning
              </h2>
              <p className="text-umber-600 text-lg max-w-3xl mx-auto">
                Our comprehensive learning management system offers everything you need to succeed
                in your educational journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-umber-900 mb-2">{feature.title}</h3>
                  <p className="text-umber-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-neutral-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-umber-600 text-lg max-w-3xl mx-auto">
                Hear from students and instructors who are already experiencing the benefits of AfriLearn.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-primary-400 fill-primary-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-umber-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 mr-4 overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-umber-900">{testimonial.author}</h4>
                      <p className="text-umber-600 text-sm">{testimonial.role}</p>
                      <p className="text-umber-500 text-xs">{testimonial.institution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-4">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-umber-600 text-lg mb-8">
                Join thousands of students and educators using AfriLearn to achieve their academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?tab=register">
                  <Button size="lg" className="bg-primary-400 hover:bg-primary-500 text-white">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-primary-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-6">
                  Benefits of Using AfriLearn
                </h2>
                <p className="text-umber-600 text-lg mb-8">
                  Our platform is designed to provide a comprehensive learning experience that meets the unique needs of African educational institutions and students.
                </p>
                <div className="space-y-4">
                  {[
                    "Culturally relevant content and perspectives",
                    "Flexible learning options to accommodate different schedules",
                    "Comprehensive progress tracking and analytics",
                    "Interactive learning tools and resources",
                    "Collaborative spaces for community engagement",
                    "Mobile-friendly design for learning on the go",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-primary-500 mt-0.5" />
                      <span className="text-umber-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-lg bg-primary-100 blur-lg"></div>
                <div className="relative bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-7 w-7 text-primary-500" />
                    <h3 className="text-xl font-bold text-umber-900">Student Success Story</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-umber-700 italic">
                      "AfriLearn transformed my academic journey. As a student with a part-time job, the flexible learning options allowed me to study at my own pace. The platform's African-focused content made learning more relatable and engaging. Within six months, my grades improved significantly, and I found a community of like-minded peers!"
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary-100 mr-4 overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/150?img=5"
                          alt="Success story"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-umber-900">Kwame Osei</h4>
                        <p className="text-umber-600 text-sm">Computer Science Student</p>
                        <p className="text-umber-500 text-xs">University of Cape Town</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-umber-900 text-white py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">AfriLearn</span>
              </div>
              <p className="text-white/80 mb-6">
                A modern learning management system designed for African educational excellence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-primary-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-primary-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-primary-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-primary-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/auth">
                    <a className="text-white/80 hover:text-primary-400">Sign In</a>
                  </Link>
                </li>
                <li>
                  <Link href="/auth?tab=register">
                    <a className="text-white/80 hover:text-primary-400">Register</a>
                  </Link>
                </li>
                <li>
                  <Link href="#features">
                    <a className="text-white/80 hover:text-primary-400">Features</a>
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials">
                    <a className="text-white/80 hover:text-primary-400">Testimonials</a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <a className="text-white/80 hover:text-primary-400">Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <a className="text-white/80 hover:text-primary-400">Terms of Service</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Learn</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    Student Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-primary-400">
                    Instructor Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 mt-0.5 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-white/80">
                    123 Education Avenue
                    <br />
                    Accra, Ghana
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a href="mailto:contact@afrilearn.com" className="text-white/80 hover:text-primary-400">
                    contact@afrilearn.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href="tel:+233123456789" className="text-white/80 hover:text-primary-400">
                    +233 12 345 6789
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-white/10 text-white/80 px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary-400"
                  />
                  <button className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-r-md">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/60 text-sm">
            <p>&copy; {new Date().getFullYear()} AfriLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}