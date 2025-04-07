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
      title: "Personalized Feedback",
      description: "Receive tailored feedback and support to help you achieve your educational goals.",
      icon: <MessageSquare className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Structured Schedule",
      description: "Access a well-organized calendar with deadlines and important dates for all your courses.",
      icon: <Calendar className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Comprehensive Resources",
      description: "Access a vast library of educational materials, research papers, and reference guides.",
      icon: <FileText className="h-10 w-10 text-primary-400" />,
    },
    {
      title: "Global Perspectives",
      description: "Learn with content that celebrates African heritage while connecting to global educational standards.",
      icon: <Globe className="h-10 w-10 text-primary-400" />,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "AfriLearnHub transformed my educational journey. The platform is intuitive, and the course content respects our heritage.",
      author: "Chioma A.",
      role: "Computer Science Student",
      institution: "University of Lagos",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      quote: "As an instructor, I've found AfriLearnHub to be a powerful tool for engaging students and tracking their progress.",
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
            <span className="text-xl font-bold text-umber-900">AfriLearnHub</span>
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
                  Learn, Connect, Excel with AfriLearnHub
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
                      <h3 className="text-xl font-bold text-white">AfriLearnHub Dashboard</h3>
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
                Hear from students and instructors who are already experiencing the benefits of AfriLearnHub.
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
                Join thousands of students and educators using AfriLearnHub to achieve their academic goals.
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
                  Benefits of Using AfriLearnHub
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
                      "AfriLearnHub transformed my academic journey. As a student with a part-time job, the flexible learning options allowed me to study at my own pace. The platform's African-focused content made learning more relatable and engaging. Within six months, my grades improved significantly, and I found a community of like-minded peers!"
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

        {/* About Section */}
        <section id="about" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-4">
                About AfriLearnHub
              </h2>
              <p className="text-umber-600 text-lg max-w-3xl mx-auto">
                Our mission is to revolutionize education across Africa by providing accessible, 
                quality learning experiences that honor our heritage while preparing students for global success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-umber-900 mb-4">Our Story</h3>
                <p className="text-umber-700 mb-4">
                  Founded by a team of passionate educators and technologists from across Africa, 
                  AfriLearnHub started with a simple vision: to create an educational platform that truly 
                  addresses the unique needs and perspectives of African students and institutions.
                </p>
                <p className="text-umber-700 mb-4">
                  What began as a small project in 2021 has grown into a comprehensive platform 
                  serving thousands of students across the continent, with partnerships with leading 
                  universities and organizations.
                </p>
                <h3 className="text-2xl font-bold text-umber-900 mt-8 mb-4">Our Values</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                    <span className="text-umber-700">Cultural relevance and respect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                    <span className="text-umber-700">Educational excellence and innovation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                    <span className="text-umber-700">Accessibility and inclusivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                    <span className="text-umber-700">Community collaboration</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200">
                <h3 className="text-2xl font-bold text-umber-900 mb-6">Our Impact</h3>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-umber-900 mb-2">500+ Students</h4>
                    <p className="text-umber-600">
                      Active learners using our platform daily across various educational levels.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-umber-900 mb-2">20+ Universities</h4>
                    <p className="text-umber-600">
                      Partnerships with leading educational institutions across Africa.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-umber-900 mb-2">12 Countries</h4>
                    <p className="text-umber-600">
                      Serving students and institutions across multiple African nations.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-umber-900 mb-2">90% Satisfaction</h4>
                    <p className="text-umber-600">
                      High user satisfaction rates from both students and educators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-primary-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-umber-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-umber-600 text-lg">
                Have questions or need more information? We're here to help you get started with AfriLearnHub.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-umber-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-primary-500"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <div>
                      <h4 className="font-medium text-umber-900">Email</h4>
                      <p className="text-umber-600">contact@afrilearnhub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-primary-500"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <div>
                      <h4 className="font-medium text-umber-900">Phone</h4>
                      <p className="text-umber-600">+254 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-primary-500"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <div>
                      <h4 className="font-medium text-umber-900">Address</h4>
                      <p className="text-umber-600">
                        Innovation Hub, Westlands
                        <br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-xl font-bold text-umber-900 mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                      <a
                        key={social}
                        href={`https://${social}.com/afrilearnhub`}
                        className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center transition-colors hover:bg-primary-200"
                      >
                        <svg
                          className="h-5 w-5 text-primary-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-xl font-bold text-umber-900 mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-umber-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-umber-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-umber-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-umber-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-primary-400 hover:bg-primary-500 text-white">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold">AfriLearnHub</span>
              </div>
              <p className="text-neutral-400 mb-4">
                A comprehensive education and career system designed to empower African students and institutions.
              </p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com/afrilearnhub`}
                    className="text-neutral-400 hover:text-primary-400"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth">
                    <a className="text-neutral-400 hover:text-primary-400">Login</a>
                  </Link>
                </li>
                <li>
                  <Link href="/auth?tab=register">
                    <a className="text-neutral-400 hover:text-primary-400">Register</a>
                  </Link>
                </li>
                <li>
                  <Link href="#features">
                    <a className="text-neutral-400 hover:text-primary-400">Features</a>
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials">
                    <a className="text-neutral-400 hover:text-primary-400">Testimonials</a>
                  </Link>
                </li>
                <li>
                  <Link href="#contact">
                    <a className="text-neutral-400 hover:text-primary-400">Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-primary-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-primary-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-primary-400">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-primary-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-primary-400">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-neutral-400 mb-4">
                Subscribe to our newsletter to receive updates and news about our platform.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-400 w-full"
                />
                <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-md">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} AfriLearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}