import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2, Search, ArrowUpDown, ChevronDown, Award, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export default function GradesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState("course-asc");
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  // For student: Fetch student grades
  const { data: studentGrades, isLoading: studentGradesLoading } = useQuery({
    queryKey: ["/api/student/grades"],
    enabled: !!user && user.role === "student",
  });

  // For instructors: Fetch course list and student list
  const { data: instructorCourses, isLoading: coursesLoading } = useQuery({
    queryKey: [`/api/instructor/${user?.id}/courses`],
    enabled: !!user && user.role === "instructor",
  });

  // Fetch students in selected course (for instructors)
  const { data: courseStudents, isLoading: studentsLoading } = useQuery({
    queryKey: [`/api/courses/${courseFilter}/students`],
    enabled: !!user && user.role === "instructor" && !!courseFilter,
  });

  // Fetch grades for selected student or course (for instructors)
  const { data: instructorGrades, isLoading: instructorGradesLoading } = useQuery({
    queryKey: [
      selectedStudent 
        ? `/api/student/${selectedStudent}/grades` 
        : courseFilter 
          ? `/api/courses/${courseFilter}/grades` 
          : null
    ],
    enabled: !!user && user.role === "instructor" && (!!selectedStudent || !!courseFilter),
  });

  // Handle all loading states
  const isLoading = 
    (user?.role === "student" && studentGradesLoading) ||
    (user?.role === "instructor" && coursesLoading) ||
    (user?.role === "instructor" && courseFilter && studentsLoading) ||
    (user?.role === "instructor" && (selectedStudent || courseFilter) && instructorGradesLoading);

  // Sample data for courses, students, and grades
  const sampleCourses = [
    { id: "1", title: "Introduction to African History" },
    { id: "2", title: "Data Science Fundamentals" },
    { id: "3", title: "Business Administration" },
    { id: "4", title: "Introduction to Physics" },
    { id: "5", title: "Cultural Anthropology" },
  ];

  const sampleStudents = [
    { id: "1", name: "Fatima Nkosi" },
    { id: "2", name: "John Okafor" },
    { id: "3", name: "Amina Diallo" },
    { id: "4", name: "Kwame Mensah" },
    { id: "5", name: "Zainab Ahmed" },
  ];

  const sampleGrades = [
    { 
      id: "1", 
      assignmentId: "1",
      assignmentTitle: "Midterm Essay", 
      courseId: "1",
      courseName: "Introduction to African History", 
      score: 85, 
      totalPoints: 100, 
      submissionDate: "2023-04-15", 
      feedback: "Good analysis of historical context, but could improve on citation format.",
      status: "graded" 
    },
    { 
      id: "2", 
      assignmentId: "2",
      assignmentTitle: "Data Analysis Project", 
      courseId: "2",
      courseName: "Data Science Fundamentals", 
      score: 92, 
      totalPoints: 100, 
      submissionDate: "2023-04-20", 
      feedback: "Excellent work with the data visualization and statistical analysis.",
      status: "graded" 
    },
    { 
      id: "3", 
      assignmentId: "3",
      assignmentTitle: "Business Case Study", 
      courseId: "3",
      courseName: "Business Administration", 
      score: 78, 
      totalPoints: 100, 
      submissionDate: "2023-04-25", 
      feedback: "Good insights, but financial analysis needs more depth.",
      status: "graded" 
    },
    { 
      id: "4", 
      assignmentId: "4",
      assignmentTitle: "Lab Report", 
      courseId: "4",
      courseName: "Introduction to Physics", 
      score: 88, 
      totalPoints: 100, 
      submissionDate: "2023-05-01", 
      feedback: "Well-structured report with good experimental analysis.",
      status: "graded" 
    },
    { 
      id: "5", 
      assignmentId: "5",
      assignmentTitle: "Cultural Analysis Paper", 
      courseId: "5",
      courseName: "Cultural Anthropology", 
      score: 90, 
      totalPoints: 100, 
      submissionDate: "2023-05-10", 
      feedback: "Excellent cultural insights and research methodology.",
      status: "graded" 
    },
  ];

  // Use real data if available, otherwise use sample data
  const displayedGrades = user?.role === "student" 
    ? (studentGrades && studentGrades.length > 0 ? studentGrades : sampleGrades)
    : (instructorGrades && instructorGrades.length > 0 ? instructorGrades : []);

  const displayedCourses = instructorCourses && instructorCourses.length > 0 
    ? instructorCourses 
    : sampleCourses;

  const displayedStudents = courseStudents && courseStudents.length > 0 
    ? courseStudents 
    : courseFilter ? sampleStudents : [];

  // Calculate overall grade statistics
  const calculateStatistics = (grades: any[]) => {
    if (!grades || grades.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const scores = grades.map(grade => 
      (grade.score / grade.totalPoints) * 100
    );
    
    return {
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  };

  const gradeStatistics = calculateStatistics(displayedGrades);

  // Get letter grade from percentage
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Get color based on grade percentage
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-status-success";
    if (percentage >= 80) return "text-secondary-500";
    if (percentage >= 70) return "text-primary-500";
    if (percentage >= 60) return "text-status-warning";
    return "text-status-error";
  };

  // Filter and sort grades
  const getFilteredGrades = () => {
    let filteredGrades = [...displayedGrades];
    
    // Apply search filter
    if (searchQuery) {
      filteredGrades = filteredGrades.filter(grade => 
        grade.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply course filter for students (instructors use the dropdown)
    if (user?.role === "student" && courseFilter) {
      filteredGrades = filteredGrades.filter(grade => 
        grade.courseId === courseFilter
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "course-asc":
        return [...filteredGrades].sort((a, b) => a.courseName.localeCompare(b.courseName));
      case "course-desc":
        return [...filteredGrades].sort((a, b) => b.courseName.localeCompare(a.courseName));
      case "assignment-asc":
        return [...filteredGrades].sort((a, b) => a.assignmentTitle.localeCompare(b.assignmentTitle));
      case "assignment-desc":
        return [...filteredGrades].sort((a, b) => b.assignmentTitle.localeCompare(a.assignmentTitle));
      case "grade-asc":
        return [...filteredGrades].sort((a, b) => (a.score / a.totalPoints) - (b.score / b.totalPoints));
      case "grade-desc":
        return [...filteredGrades].sort((a, b) => (b.score / b.totalPoints) - (a.score / a.totalPoints));
      case "date-asc":
        return [...filteredGrades].sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
      case "date-desc":
        return [...filteredGrades].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
      default:
        return filteredGrades;
    }
  };

  const filteredGrades = getFilteredGrades();

  // Get a list of unique courses from grades (for student's course filter)
  const getUniqueCourses = () => {
    if (!displayedGrades || displayedGrades.length === 0) return [];
    
    const courseMap = new Map();
    displayedGrades.forEach(grade => {
      if (!courseMap.has(grade.courseId)) {
        courseMap.set(grade.courseId, {
          id: grade.courseId,
          name: grade.courseName
        });
      }
    });
    
    return Array.from(courseMap.values());
  };

  const uniqueCourses = getUniqueCourses();

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
              {user?.role === "student" ? "My Grades" : "Student Grades"}
            </h1>
            <p className="text-sm text-umber-700">
              {user?.role === "student" 
                ? "View your assignment grades and feedback" 
                : "Manage and view student grades for your courses"}
            </p>
          </div>

          {user?.role === "instructor" ? (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course-select" className="block text-sm font-medium text-umber-700 mb-1">
                  Select Course
                </Label>
                <Select
                  onValueChange={(value) => {
                    setCourseFilter(value);
                    setSelectedStudent("");
                  }}
                  value={courseFilter}
                >
                  <SelectTrigger id="course-select">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Courses</SelectItem>
                    {displayedCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="student-select" className="block text-sm font-medium text-umber-700 mb-1">
                  Select Student
                </Label>
                <Select
                  onValueChange={setSelectedStudent}
                  value={selectedStudent}
                  disabled={!courseFilter}
                >
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder={courseFilter ? "Select a student" : "Select a course first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Students</SelectItem>
                    {displayedStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Award className="text-primary-400 h-5 w-5 mr-2" />
                      <h3 className="font-medium text-umber-800">Overall GPA</h3>
                    </div>
                    <div className={`text-xl font-bold ${getGradeColor(gradeStatistics.average)}`}>
                      {getLetterGrade(gradeStatistics.average)}
                    </div>
                  </div>
                  <Progress value={gradeStatistics.average} className="h-2 mb-1" />
                  <p className="text-sm text-umber-600 text-right">{gradeStatistics.average.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BookOpen className="text-secondary-400 h-5 w-5 mr-2" />
                      <h3 className="font-medium text-umber-800">Course Count</h3>
                    </div>
                    <div className="text-xl font-bold text-secondary-500">
                      {uniqueCourses.length}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileText className="text-accent-400 h-5 w-5 mr-2" />
                      <h3 className="font-medium text-umber-800">Assignments Graded</h3>
                    </div>
                    <div className="text-xl font-bold text-accent-500">
                      {displayedGrades.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filter and Sort Tools */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search assignments or courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
            </div>

            {user?.role === "student" && uniqueCourses.length > 0 && (
              <Select onValueChange={setCourseFilter} value={courseFilter} defaultValue="">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  {uniqueCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
                  checked={sortOption === "course-asc"}
                  onCheckedChange={() => setSortOption("course-asc")}
                >
                  Course (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "course-desc"}
                  onCheckedChange={() => setSortOption("course-desc")}
                >
                  Course (Z-A)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "assignment-asc"}
                  onCheckedChange={() => setSortOption("assignment-asc")}
                >
                  Assignment (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "assignment-desc"}
                  onCheckedChange={() => setSortOption("assignment-desc")}
                >
                  Assignment (Z-A)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "grade-asc"}
                  onCheckedChange={() => setSortOption("grade-asc")}
                >
                  Grade (Low to High)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "grade-desc"}
                  onCheckedChange={() => setSortOption("grade-desc")}
                >
                  Grade (High to Low)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "date-asc"}
                  onCheckedChange={() => setSortOption("date-asc")}
                >
                  Date (Oldest First)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "date-desc"}
                  onCheckedChange={() => setSortOption("date-desc")}
                >
                  Date (Newest First)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Grades Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            </div>
          ) : filteredGrades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Award className="h-12 w-12 text-umber-300 mb-4" />
                <h3 className="text-lg font-semibold text-umber-800 mb-2">No grades found</h3>
                <p className="text-umber-600 mb-6 text-center max-w-md">
                  {searchQuery || courseFilter ? 
                    "Try adjusting your search or filters to find grades." :
                    user?.role === "student" ? 
                      "You don't have any graded assignments yet." : 
                      "No student grades available for the selected criteria."}
                </p>
                {(searchQuery || courseFilter) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setCourseFilter("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Tabs defaultValue="table" className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Grades</CardTitle>
                    <TabsList>
                      <TabsTrigger value="table">Table View</TabsTrigger>
                      <TabsTrigger value="cards">Card View</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>
                    {user?.role === "student" 
                      ? "Your grades and feedback for all assignments"
                      : courseFilter 
                        ? `Grades for ${displayedCourses.find(c => c.id.toString() === courseFilter)?.title || 'selected course'}`
                        : "All grades across your courses"}
                  </CardDescription>
                </CardHeader>
                
                <TabsContent value="table" className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGrades.map((grade) => {
                          const percentage = (grade.score / grade.totalPoints) * 100;
                          const letterGrade = getLetterGrade(percentage);
                          return (
                            <TableRow key={grade.id}>
                              <TableCell className="font-medium">{grade.courseName}</TableCell>
                              <TableCell>{grade.assignmentTitle}</TableCell>
                              <TableCell>{grade.score}/{grade.totalPoints}</TableCell>
                              <TableCell>
                                <span className={`font-bold ${getGradeColor(percentage)}`}>
                                  {letterGrade} ({percentage.toFixed(1)}%)
                                </span>
                              </TableCell>
                              <TableCell>{new Date(grade.submissionDate).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/assignments/${grade.assignmentId}`}>
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="cards">
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredGrades.map((grade) => {
                        const percentage = (grade.score / grade.totalPoints) * 100;
                        const letterGrade = getLetterGrade(percentage);
                        return (
                          <Card key={grade.id} className="overflow-hidden">
                            <div className={`h-2 ${
                              percentage >= 90 ? "bg-status-success" :
                              percentage >= 80 ? "bg-secondary-400" :
                              percentage >= 70 ? "bg-primary-400" :
                              percentage >= 60 ? "bg-status-warning" :
                              "bg-status-error"
                            }`}></div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-umber-800">{grade.assignmentTitle}</h3>
                                <span className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                                  {letterGrade}
                                </span>
                              </div>
                              <p className="text-sm text-umber-600 mb-2">{grade.courseName}</p>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Score:</span>
                                <span className="font-medium">{grade.score}/{grade.totalPoints} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <Progress value={percentage} className="h-2 mb-3" />
                              <div className="text-xs text-umber-600 mb-2">
                                Submitted: {new Date(grade.submissionDate).toLocaleDateString()}
                              </div>
                              {grade.feedback && (
                                <div className="mt-2 p-2 bg-neutral-50 rounded-md border border-neutral-200 text-sm">
                                  <p className="font-medium mb-1">Feedback:</p>
                                  <p className="text-umber-700">{grade.feedback}</p>
                                </div>
                              )}
                              <div className="mt-3">
                                <Link href={`/assignments/${grade.assignmentId}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Assignment
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}