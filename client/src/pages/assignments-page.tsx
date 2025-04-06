import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2, Plus, Search, Filter, CalendarCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssignmentItem from "@/components/assignment-item";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("due-date-asc");
  const [viewTab, setViewTab] = useState(user?.role === "student" ? "upcoming" : "all");

  // Fetch all assignments for the user
  const { data: allAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: [
      user?.role === "student" 
        ? "/api/student/assignments" 
        : user?.role === "instructor" 
          ? `/api/instructor/${user.id}/assignments` 
          : "/api/assignments"
    ],
    enabled: !!user,
  });

  // Define assignment status options
  const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "submitted", label: "Submitted" },
    { value: "graded", label: "Graded" },
    { value: "past_due", label: "Past Due" },
  ];

  // Filter and sort assignments
  const getFilteredAssignments = () => {
    let filteredAssignments = [];
    
    // Determine which assignments to display based on the active tab
    if (allAssignments) {
      if (user?.role === "student") {
        if (viewTab === "upcoming") {
          // Upcoming assignments - due date is in the future
          filteredAssignments = allAssignments.filter(
            a => new Date(a.dueDate) > new Date()
          );
        } else if (viewTab === "past") {
          // Past assignments - due date is in the past
          filteredAssignments = allAssignments.filter(
            a => new Date(a.dueDate) <= new Date()
          );
        } else {
          filteredAssignments = allAssignments;
        }
      } else {
        // For instructors/admins, just show all
        filteredAssignments = allAssignments;
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      filteredAssignments = filteredAssignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filteredAssignments = filteredAssignments.filter(assignment => {
        // Handle past due status specially
        if (statusFilter.includes("past_due") && 
            new Date(assignment.dueDate) < new Date() && 
            assignment.status !== "submitted" && 
            assignment.status !== "graded") {
          return true;
        }
        
        return statusFilter.includes(assignment.status);
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case "title-asc":
        return [...filteredAssignments].sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return [...filteredAssignments].sort((a, b) => b.title.localeCompare(a.title));
      case "due-date-asc":
        return [...filteredAssignments].sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      case "due-date-desc":
        return [...filteredAssignments].sort((a, b) => 
          new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
      default:
        return filteredAssignments;
    }
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  // Sample assignments for demo
  const sampleAssignments = [
    {
      id: 1,
      title: "Final Project Analysis",
      courseName: "Data Science Fundamentals",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      status: "not_started",
      icon: "file-text",
      color: "warning"
    },
    {
      id: 2,
      title: "Lab Report: Wave Properties",
      courseName: "Introduction to Physics",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      status: "in_progress",
      icon: "flask",
      color: "secondary"
    },
    {
      id: 3,
      title: "Cultural Impact Essay",
      courseName: "Cultural Anthropology",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      status: "submitted",
      icon: "book",
      color: "primary"
    },
    {
      id: 4,
      title: "Market Analysis Presentation",
      courseName: "Business Administration",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: "graded",
      icon: "presentation",
      color: "success"
    },
    {
      id: 5,
      title: "Calculus I: Final Exam",
      courseName: "Calculus I",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
      status: "not_started",
      icon: "file-text",
      color: "secondary"
    },
    {
      id: 6,
      title: "Historical Research Project",
      courseName: "Introduction to African History",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: "not_started",
      icon: "book",
      color: "error"
    },
  ];

  const filteredAssignments = allAssignments ? getFilteredAssignments() : [];
  
  // If no assignments are loaded yet or filtering returns no results, use samples
  const displayedAssignments = filteredAssignments.length > 0 
    ? filteredAssignments 
    : sampleAssignments;

  // Define tabs based on user role
  const getTabs = () => {
    if (user?.role === "student") {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" onClick={() => setViewTab("upcoming")}>Upcoming</TabsTrigger>
          <TabsTrigger value="past" onClick={() => setViewTab("past")}>Past Due</TabsTrigger>
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>All Assignments</TabsTrigger>
        </TabsList>
      );
    } else if (user?.role === "instructor") {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="to_grade" onClick={() => setViewTab("to_grade")}>To Grade</TabsTrigger>
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>All Assignments</TabsTrigger>
        </TabsList>
      );
    } else {
      return (
        <TabsList className="mb-6">
          <TabsTrigger value="all" onClick={() => setViewTab("all")}>All Assignments</TabsTrigger>
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
                Assignments
              </h1>
              <p className="text-sm text-umber-700">
                View and manage your assignments
              </p>
            </div>
            {(user?.role === "instructor" || user?.role === "admin") && (
              <Link href="/assignments/create">
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue={viewTab} className="space-y-4">
            {getTabs()}
            
            <TabsContent value={viewTab} className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search assignments..."
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
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {statusOptions.map(status => (
                        <DropdownMenuCheckboxItem
                          key={status.value}
                          checked={statusFilter.includes(status.value)}
                          onCheckedChange={() => toggleStatusFilter(status.value)}
                        >
                          {status.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-neutral-300">
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        Sort
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "due-date-asc"}
                        onCheckedChange={() => setSortOption("due-date-asc")}
                      >
                        Due Date (Soonest First)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOption === "due-date-desc"}
                        onCheckedChange={() => setSortOption("due-date-desc")}
                      >
                        Due Date (Latest First)
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

              {assignmentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                </div>
              ) : displayedAssignments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <CalendarCheck className="h-12 w-12 text-umber-300 mb-4" />
                    <h3 className="text-lg font-semibold text-umber-800 mb-2">No assignments found</h3>
                    <p className="text-umber-600 mb-6 text-center max-w-md">
                      {searchQuery || statusFilter.length > 0 
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : user?.role === "student" && viewTab === "upcoming"
                          ? "You don't have any upcoming assignments. Check back later!"
                          : user?.role === "student" && viewTab === "past"
                            ? "You don't have any past assignments."
                            : user?.role === "instructor" && viewTab === "to_grade"
                              ? "You don't have any submissions to grade."
                              : "No assignments available."}
                    </p>
                    {searchQuery || statusFilter.length > 0 ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {displayedAssignments.map(assignment => (
                    <AssignmentItem key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              )}
            </TabsContent>

            {user?.role === "student" && (
              <>
                <TabsContent value="past">
                  <div className="space-y-4">
                    {sampleAssignments
                      .filter(a => new Date(a.dueDate) <= new Date())
                      .map(assignment => (
                        <AssignmentItem key={assignment.id} assignment={assignment} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {sampleAssignments.map(assignment => (
                      <AssignmentItem key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
                </TabsContent>
              </>
            )}

            {user?.role === "instructor" && (
              <TabsContent value="to_grade">
                <div className="space-y-4">
                  {sampleAssignments
                    .filter(a => a.status === "submitted")
                    .map(assignment => (
                      <AssignmentItem key={assignment.id} assignment={assignment} />
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