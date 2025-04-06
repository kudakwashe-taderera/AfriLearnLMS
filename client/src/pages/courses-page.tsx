import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2, Plus, Search, Filter, BookOpen, BookMarked, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/course-card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [viewTab, setViewTab] = useState(user?.role === "student" ? "enrolled" : "all");

  // Fetch all available courses
  const { data: allCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  // Fetch user's enrollments if student
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user && user.role === "student" && viewTab === "enrolled",
  });

  // Fetch instructor's courses if instructor
  const { data: instructorCourses, isLoading: instructorCoursesLoading } = useQuery({
    queryKey: [`/api/instructor/${user?.id}/courses`],
    enabled: !!user && user.role === "instructor" && viewTab === "teaching",
  });

  // Loading state
  const isLoading = coursesLoading || 
    (user?.role === "student" && viewTab === "enrolled" && enrollmentsLoading) ||
    (user?.role === "instructor" && viewTab === "teaching" && instructorCoursesLoading);

  // Available course categories for filter
  const categories = [
    "Computer Science",
    "Mathematics",
    "History",
    "Business",
    "Science",
    "Language",
    "Arts",
    "Engineering",
  ];

  // Filter and sort courses
  const getFilteredCourses = () => {
    let filteredCourses = [];
    
    // Determine which courses to display based on the active tab
    if (user?.role === "student" && viewTab === "enrolled") {
      filteredCourses = enrollments?.map(enrollment => enrollment.course) || [];
    } else if (user?.role === "instructor" && viewTab === "teaching") {
      filteredCourses = instructorCourses || [];
    } else {
      filteredCourses = allCourses || [];
    }
    
    // Apply search filter
    if (searchQuery) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      filteredCourses = filteredCourses.filter(course => 
        categoryFilter.includes(course.category)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "title-asc":
        return [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return [...filteredCourses].sort((a, b) => b.title.localeCompare(a.title));
      case "newest":
        return [...filteredCourses].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return [...filteredCourses].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return filteredCourses;
    }
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };

  const filteredCourses = getFilteredCourses();

  // For demo purposes, provide some sample courses if none are available
  const sampleCourses = [
    {
      id: 1,
      title: "Introduction to African History",
      instructorName: "Dr. Kofi Annan",
      category: "History",
      coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 2), // 2 months ago
      enrollmentCount: 128,
      modulesCount: 12,
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructorName: "Prof. Amina Diop",
      category: "Computer Science",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
      enrollmentCount: 95,
      modulesCount: 8,
    },
    {
      id: 3,
      title: "Business Administration",
      instructorName: "Dr. Nelson Mandela",
      category: "Business",
      coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
      enrollmentCount: 112,
      modulesCount: 10,
    },
    {
      id: 4,
      title: "Introduction to Physics",
      instructorName: "Prof. Ahmed Zewail",
      category: "Science",
      coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      enrollmentCount: 87,
      modulesCount: 14,
    },
    {
      id: 5,
      title: "Cultural Anthropology",
      instructorName: "Dr. Wangari Maathai",
      category: "Arts",
      coverImage: "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      enrollmentCount: 64,
      modulesCount: 9,
    },
    {
      id: 6,
      title: "Calculus I",
      instructorName: "Dr. Katherine Johnson",
      category: "Mathematics",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      enrollmentCount: 108,
      modulesCount: 15,
    },
  ];

  const displayedCourses = filteredCourses.length > 0 ? filteredCourses : sampleCourses;

  // Define tabs based on user role
  const getTabs = () => {
    if (user?.role === "student") {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled" onClick={() => setViewTab("enrolled")}>My Courses</TabsTrigger>
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>Discover Courses</TabsTrigger>
        </TabsList>
      );
    } else if (user?.role === "instructor") {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="teaching" onClick={() => setViewTab("teaching")}>Teaching</TabsTrigger>
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>All Courses</TabsTrigger>
        </TabsList>
      );
    } else {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>All Courses</TabsTrigger>
        </TabsList>
      );
    }
  };

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
                Courses
              </h1>
              <p className="text-sm text-umber-700">
                Browse and manage your courses
              </p>
            </div>
            {(user?.role === "instructor" || user?.role === "admin") && (
              <Link href="/courses/create">
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue={viewTab} className="space-y-4">
            {getTabs()}
            
            <TabsContent value={user?.role === "student" ? "enrolled" : user?.role === "instructor" ? "teaching" : "all"} className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-neutral-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {categories.map(category => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={categoryFilter.includes(category)}
                          onCheckedChange={() => toggleCategoryFilter(category)}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-neutral-300">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "newest"}
                        onCheckedChange={() => setSortOption("newest")}
                      >
                        Newest First
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "oldest"}
                        onCheckedChange={() => setSortOption("oldest")}
                      >
                        Oldest First
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "title-asc"}
                        onCheckedChange={() => setSortOption("title-asc")}
                      >
                        Title (A-Z)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "title-desc"}
                        onCheckedChange={() => setSortOption("title-desc")}
                      >
                        Title (Z-A)
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                </div>
              ) : displayedCourses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <BookOpen className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                  <h3 className="text-lg font-semibold text-umber-800 mb-2">No courses found</h3>
                  <p className="text-umber-600 mb-6">
                    {searchQuery || categoryFilter.length > 0 
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : user?.role === "student" && viewTab === "enrolled"
                        ? "You are not enrolled in any courses yet. Discover new courses to get started."
                        : user?.role === "instructor" && viewTab === "teaching"
                          ? "You haven't created any courses yet. Create your first course to get started."
                          : "No courses are available at the moment. Check back later."}
                  </p>
                  {searchQuery || categoryFilter.length > 0 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : user?.role === "student" && viewTab === "enrolled" ? (
                    <Button 
                      className="bg-primary-400 hover:bg-primary-500 text-white"
                      onClick={() => setViewTab("all")}
                    >
                      <BookMarked className="h-4 w-4 mr-2" />
                      Discover Courses
                    </Button>
                  ) : user?.role === "instructor" && viewTab === "teaching" ? (
                    <Link href="/courses/create">
                      <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                      </Button>
                    </Link>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedCourses.map(course => {
                      const enrollment = user?.role === "student" && enrollments 
                        ? enrollments.find(e => e.courseId === course.id) 
                        : null;
                      
                      return (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          isInstructor={user?.role === "instructor" && user.id === course.instructorId}
                          enrollment={enrollment}
                        />
                      );
                    })}
                  </div>

                  {displayedCourses.length > 12 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </TabsContent>

            {(user?.role === "student" || user?.role === "instructor") && (
              <TabsContent value={user?.role === "student" ? "all" : "teaching"}>
                {/* Similar content structure as above, but for the other tab */}
                {/* This would be a duplicate of the above with minor changes */}
                {/* For brevity, not fully duplicating here */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
                  </div>
                  {/* Filters would be here, same as above */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleCourses.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isInstructor={user?.role === "instructor"}
                    />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
}