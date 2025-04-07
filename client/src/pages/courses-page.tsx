import { useState } from "react";
import { Link } from "wouter";
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
  BookOpen,
  Clock,
  Users,
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  PlusCircle,
  Star,
  StarHalf,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for courses
const enrolledCourses = [
  {
    id: 1,
    title: "Introduction to Programming",
    instructor: "Dr. Kwame Mensah",
    department: "Computer Science",
    progress: 68,
    nextDeadline: "2025-04-15",
    nextTask: "Submit Assignment 4",
    credits: 3,
    image: "https://placehold.co/100?text=CS101",
    status: "active",
  },
  {
    id: 2,
    title: "African Literature",
    instructor: "Prof. Nkechi Azikiwe",
    department: "Humanities",
    progress: 45,
    nextDeadline: "2025-04-12",
    nextTask: "Complete Reading Assignment",
    credits: 3,
    image: "https://placehold.co/100?text=LIT205",
    status: "active",
  },
  {
    id: 3,
    title: "Principles of Economics",
    instructor: "Dr. Mohammed Ibrahim",
    department: "Economics",
    progress: 92,
    nextDeadline: "2025-04-20",
    nextTask: "Final Exam",
    credits: 4,
    image: "https://placehold.co/100?text=ECON101",
    status: "active",
  },
  {
    id: 4,
    title: "Chemistry Fundamentals",
    instructor: "Dr. Amina Diop",
    department: "Chemistry",
    progress: 100,
    nextDeadline: null,
    nextTask: "Course Completed",
    credits: 4,
    image: "https://placehold.co/100?text=CHEM101",
    status: "completed",
  },
];

// Sample data for available courses
const availableCourses = [
  {
    id: 101,
    title: "Data Structures and Algorithms",
    instructor: "Dr. Benjamin Okonkwo",
    department: "Computer Science",
    startDate: "2025-06-01",
    duration: "14 weeks",
    credits: 4,
    capacity: "120/150",
    rating: 4.8,
    prerequisites: ["Introduction to Programming"],
    level: "Intermediate",
    description: "A comprehensive study of data structures, algorithm design and analysis.",
    image: "https://placehold.co/100?text=CS201",
  },
  {
    id: 102,
    title: "Modern African History",
    instructor: "Prof. Fatima Ndiaye",
    department: "History",
    startDate: "2025-06-01",
    duration: "12 weeks",
    credits: 3,
    capacity: "85/100",
    rating: 4.5,
    prerequisites: [],
    level: "Introductory",
    description: "Exploration of African history from colonization to present day independence movements.",
    image: "https://placehold.co/100?text=HIST220",
  },
  {
    id: 103,
    title: "Business Ethics and Leadership",
    instructor: "Dr. Ahmed El-Sayed",
    department: "Business Administration",
    startDate: "2025-06-15",
    duration: "10 weeks",
    credits: 3,
    capacity: "45/60",
    rating: 4.7,
    prerequisites: ["Introduction to Business"],
    level: "Advanced",
    description: "Examination of ethical frameworks and leadership principles in business contexts.",
    image: "https://placehold.co/100?text=BUS350",
  },
  {
    id: 104,
    title: "Environmental Science",
    instructor: "Dr. Grace Mwangi",
    department: "Environmental Studies",
    startDate: "2025-06-01",
    duration: "14 weeks",
    credits: 4,
    capacity: "50/75",
    rating: 4.6,
    prerequisites: ["Biology Fundamentals"],
    level: "Intermediate",
    description: "Study of environmental systems, sustainability, and conservation practices.",
    image: "https://placehold.co/100?text=ENV210",
  },
  {
    id: 105,
    title: "Public Health in Africa",
    instructor: "Prof. Samuel Osei",
    department: "Health Sciences",
    startDate: "2025-06-15",
    duration: "12 weeks",
    credits: 3,
    capacity: "90/100",
    rating: 4.9,
    prerequisites: ["Introduction to Health Sciences"],
    level: "Intermediate",
    description: "Overview of public health challenges and solutions in African contexts.",
    image: "https://placehold.co/100?text=HLTH250",
  },
];

// Function to render star ratings
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Filter available courses
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  // Get unique departments for filter
  const departments = ["all", ...new Set(availableCourses.map(course => course.department))];
  
  // Get unique levels for filter
  const levels = ["all", ...new Set(availableCourses.map(course => course.level))];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Courses"
        description="View your enrolled courses and discover new learning opportunities"
      />

      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Enrolled Courses ({enrolledCourses.length})</h2>
            <Input 
              placeholder="Search courses..." 
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {enrolledCourses
              .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-xl">{course.title}</CardTitle>
                            {course.status === "completed" ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline">{course.credits} Credits</Badge>
                            )}
                          </div>
                          <CardDescription>{course.department}</CardDescription>
                          <div className="text-sm mt-1">Instructor: {course.instructor}</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {course.status === "active" && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Course Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Next: {course.nextTask}</span>
                            {course.nextDeadline && (
                              <>
                                <span className="mx-1">•</span>
                                <span>Due {new Date(course.nextDeadline).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        View Course <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <Input 
                placeholder="Search by title, instructor, or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription>{course.department}</CardDescription>
                        </div>
                        <Badge variant="outline">{course.credits} Credits</Badge>
                      </div>
                      <div className="text-sm mt-1">Instructor: {course.instructor}</div>
                      <div className="mt-2">
                        <StarRating rating={course.rating} />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Starts: {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Capacity: {course.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="font-normal">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  
                  {course.prerequisites.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium">Prerequisites:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {course.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline">{prereq}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    View Details
                  </Button>
                  <Button>
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {user?.role === "instructor" && (
            <div className="pt-4">
              <Link href="/course-create">
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}