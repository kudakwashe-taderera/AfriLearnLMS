import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  Plus, 
  Search, 
  MessagesSquare, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  Eye,
  Filter,
  ArrowUpDown,
  ChevronDown
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiscussionsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState("recent");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    courseId: "",
  });

  // Fetch all discussions
  const { data: discussions, isLoading: discussionsLoading } = useQuery({
    queryKey: ["/api/discussions"],
    enabled: !!user,
  });

  // Fetch all courses for dropdown
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  // For students: Fetch enrolled courses
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user && user.role === "student",
  });

  // For instructors: Fetch teaching courses
  const { data: teachingCourses, isLoading: teachingCoursesLoading } = useQuery({
    queryKey: [`/api/instructor/${user?.id}/courses`],
    enabled: !!user && user.role === "instructor",
  });

  // Sample discussions data for demo
  const sampleDiscussions = [
    {
      id: "1",
      title: "Understanding Cultural Dynamics in West Africa",
      content: "I'm trying to better understand the cultural interactions between different ethnic groups in West Africa during the 16th century. Can anyone recommend specific readings that cover this topic?",
      courseId: "1",
      courseName: "Introduction to African History",
      authorId: "1",
      authorName: "Fatima Nkosi",
      authorRole: "student",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      replies: 5,
      views: 28,
      isSticky: false,
      tags: ["cultural studies", "history", "west africa"]
    },
    {
      id: "2",
      title: "Data Visualization Techniques for Research Papers",
      content: "I'm working on a research paper and struggling with effective data visualization. Which tools and techniques do you recommend for scientific data presentation?",
      courseId: "2",
      courseName: "Data Science Fundamentals",
      authorId: "2",
      authorName: "John Okafor",
      authorRole: "student",
      authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      replies: 8,
      views: 42,
      isSticky: false,
      tags: ["data science", "visualization", "research"]
    },
    {
      id: "3",
      title: "[IMPORTANT] Upcoming Midterm Exam Information",
      content: "Please note that the midterm exam will cover chapters 1-5 and will include both multiple choice and essay questions. The exam will take place on May 15th.",
      courseId: "1",
      courseName: "Introduction to African History",
      authorId: "3",
      authorName: "Dr. Kofi Annan",
      authorRole: "instructor",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      replies: 12,
      views: 87,
      isSticky: true,
      tags: ["announcement", "exam", "important"]
    },
    {
      id: "4",
      title: "Market Analysis Case Study Discussion",
      content: "For our upcoming group project, I'd like to discuss potential companies we could analyze. I'm thinking about focusing on emerging tech startups in Africa. Any other suggestions?",
      courseId: "3",
      courseName: "Business Administration",
      authorId: "4",
      authorName: "Amina Diallo",
      authorRole: "student",
      authorAvatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      replies: 15,
      views: 53,
      isSticky: false,
      tags: ["group project", "business", "market analysis"]
    },
    {
      id: "5",
      title: "Help with Physics Lab Experiment",
      content: "I'm having trouble setting up the pendulum experiment for our lab assignment. Can someone explain how to properly measure the period of oscillation?",
      courseId: "4",
      courseName: "Introduction to Physics",
      authorId: "5",
      authorName: "Kwame Mensah",
      authorRole: "student",
      authorAvatar: "",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      replies: 3,
      views: 19,
      isSticky: false,
      tags: ["physics", "lab", "help"]
    },
  ];

  // Sample courses data
  const sampleCourses = [
    { id: "1", title: "Introduction to African History" },
    { id: "2", title: "Data Science Fundamentals" },
    { id: "3", title: "Business Administration" },
    { id: "4", title: "Introduction to Physics" },
    { id: "5", title: "Cultural Anthropology" },
  ];

  // Use real data if available, otherwise use sample data
  const displayedDiscussions = discussions?.length > 0 ? discussions : sampleDiscussions;
  const userCourses = user?.role === "student" 
    ? (enrollments?.map(e => e.course) || []) 
    : user?.role === "instructor" 
      ? (teachingCourses || [])
      : [];
  
  const displayedCourses = courses?.length > 0 
    ? courses 
    : user?.role === "student" || user?.role === "instructor" 
      ? userCourses.length > 0 ? userCourses : sampleCourses
      : sampleCourses;

  // Filter and sort discussions
  const getFilteredDiscussions = () => {
    let filtered = [...displayedDiscussions];
    
    // Apply tab filter
    if (activeTab === "my-posts") {
      filtered = filtered.filter(d => d.authorId === user?.id);
    } else if (activeTab === "my-courses") {
      const userCourseIds = userCourses.map(c => c.id);
      filtered = filtered.filter(d => userCourseIds.includes(d.courseId));
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply course filter
    if (courseFilter) {
      filtered = filtered.filter(d => d.courseId === courseFilter);
    }
    
    // Sticky posts should always be at the top
    const stickyPosts = filtered.filter(d => d.isSticky);
    const nonStickyPosts = filtered.filter(d => !d.isSticky);
    
    // Apply sorting to non-sticky posts
    let sortedNonSticky;
    switch (sortOption) {
      case "recent":
        sortedNonSticky = [...nonStickyPosts].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "oldest":
        sortedNonSticky = [...nonStickyPosts].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "most-replies":
        sortedNonSticky = [...nonStickyPosts].sort((a, b) => b.replies - a.replies);
        break;
      case "most-views":
        sortedNonSticky = [...nonStickyPosts].sort((a, b) => b.views - a.views);
        break;
      case "title-asc":
        sortedNonSticky = [...nonStickyPosts].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sortedNonSticky = nonStickyPosts;
    }
    
    // Combine sticky and sorted non-sticky posts
    return [...stickyPosts, ...sortedNonSticky];
  };

  const filteredDiscussions = getFilteredDiscussions();

  // Handle creating a new post
  const handleCreatePost = () => {
    console.log("Creating new post:", newPost);
    // In a real app, we would call a mutation here
    setIsCreatingPost(false);
    setNewPost({ title: "", content: "", courseId: "" });
  };

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) {
          return "Yesterday";
        } else if (diffDays < 7) {
          return `${diffDays} days ago`;
        } else if (diffDays < 30) {
          return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        } else {
          return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        }
      }
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
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
                Discussion Forums
              </h1>
              <p className="text-sm text-umber-700">
                Engage in course discussions with instructors and peers
              </p>
            </div>
            <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
              <DialogTrigger asChild>
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create Discussion</DialogTitle>
                  <DialogDescription>
                    Start a new discussion topic to share ideas or ask questions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select 
                      onValueChange={(v) => setNewPost({...newPost, courseId: v})} 
                      value={newPost.courseId}
                    >
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {displayedCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a clear, specific title for your discussion" 
                      value={newPost.title} 
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Discussion Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Share your thoughts, questions, or ideas..." 
                      className="min-h-[150px]"
                      value={newPost.content} 
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatingPost(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    onClick={handleCreatePost}
                    disabled={!newPost.title || !newPost.content || !newPost.courseId}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Post Discussion
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All Discussions</TabsTrigger>
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
                <TabsTrigger value="my-posts">My Posts</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Select onValueChange={setCourseFilter} value={courseFilter} defaultValue="">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by course" />
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
                      checked={sortOption === "recent"}
                      onCheckedChange={() => setSortOption("recent")}
                    >
                      Most Recent
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOption === "oldest"}
                      onCheckedChange={() => setSortOption("oldest")}
                    >
                      Oldest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOption === "most-replies"}
                      onCheckedChange={() => setSortOption("most-replies")}
                    >
                      Most Replies
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOption === "most-views"}
                      onCheckedChange={() => setSortOption("most-views")}
                    >
                      Most Views
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOption === "title-asc"}
                      onCheckedChange={() => setSortOption("title-asc")}
                    >
                      Title (A-Z)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 mb-6"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              {discussionsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                </div>
              ) : filteredDiscussions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <MessagesSquare className="h-12 w-12 text-umber-300 mb-4" />
                    <h3 className="text-lg font-semibold text-umber-800 mb-2">No discussions found</h3>
                    <p className="text-umber-600 mb-6 text-center max-w-md">
                      {searchQuery || courseFilter ? 
                        "Try adjusting your search or filters to find discussions." :
                        activeTab === "my-posts" ? 
                          "You haven't created any discussion posts yet." : 
                          activeTab === "my-courses" ?
                            "There are no discussions in your courses yet." :
                            "No discussions are available at the moment."}
                    </p>
                    {searchQuery || courseFilter ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("");
                          setCourseFilter("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Button 
                        className="bg-primary-400 hover:bg-primary-500 text-white"
                        onClick={() => setIsCreatingPost(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start a Discussion
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredDiscussions.map((discussion) => (
                    <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
                      <Card className="transition-shadow hover:shadow-md cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-500 hover:bg-primary-100"
                                >
                                  {discussion.courseName}
                                </Badge>
                                {discussion.isSticky && (
                                  <Badge variant="outline" className="border-status-error text-status-error text-xs">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-umber-900 group-hover:text-primary-500">
                                {discussion.title}
                              </h3>
                              <p className="text-sm text-umber-600 line-clamp-2 mt-1 mb-3">
                                {discussion.content}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {discussion.tags.map((tag, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="px-2 py-0.5 text-xs bg-neutral-50"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={discussion.authorAvatar} />
                                <AvatarFallback className="bg-neutral-200 text-umber-700 text-xs">
                                  {getInitials(discussion.authorName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-umber-600">
                                {discussion.authorName} 
                                <span className="mx-1">•</span>
                                {formatRelativeTime(new Date(discussion.updatedAt))}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-umber-600">
                              <div className="flex items-center">
                                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                <span>{discussion.replies}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                <span>{discussion.views}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}