import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  BookOpen, 
  Users, 
  Clock, 
  CalendarCheck, 
  BookMarked,
  MessageSquare, 
  FileText, 
  Award, 
  Settings,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AssignmentItem from "@/components/assignment-item";
import AnnouncementItem from "@/components/announcement-item";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id);
  const { user } = useAuth();

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  // Fetch course instructor
  const { data: instructor, isLoading: instructorLoading } = useQuery({
    queryKey: [`/api/users/${course?.instructorId}`],
    enabled: !!course?.instructorId,
  });

  // Fetch course assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/assignments`],
    enabled: !!courseId,
  });

  // Fetch course announcements
  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/announcements`],
    enabled: !!courseId,
  });

  // Fetch course enrollments (if user is instructor or admin)
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/enrollments`],
    enabled: !!courseId && !!user && (user.role === "instructor" || user.role === "admin"),
  });

  // Fetch student enrollment (if user is student)
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: [`/api/student/${user?.id}/course/${courseId}/enrollment`],
    enabled: !!courseId && !!user && user.role === "student",
  });

  const isLoading = courseLoading || 
                    instructorLoading || 
                    assignmentsLoading || 
                    announcementsLoading || 
                    (user?.role === "student" && enrollmentLoading) ||
                    ((user?.role === "instructor" || user?.role === "admin") && enrollmentsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <BookOpen className="h-16 w-16 text-primary-300 mb-4" />
        <h1 className="text-2xl font-bold text-umber-900 mb-2">Course Not Found</h1>
        <p className="text-umber-700 mb-6 text-center">
          The course you are looking for does not exist or has been removed.
        </p>
        <Link href="/courses">
          <Button className="bg-primary-400 hover:bg-primary-500 text-white">
            Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  const instructorName = instructor 
    ? `${instructor.firstName} ${instructor.lastName}` 
    : course.instructorId === user?.id 
      ? `${user.firstName} ${user.lastName}` 
      : "Unknown Instructor";

  const instructorAvatar = instructor?.profileImage || user?.profileImage;
  const instructorInitials = getInitials(instructorName);

  // Calculate course progress for students
  const courseProgress = enrollment?.progress || 0;

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Check if user is the instructor of this course
  const isInstructor = user?.id === course.instructorId;

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-neutral-100">
          {/* Course Header */}
          <div className="h-48 bg-cover bg-center relative" style={{
            backgroundImage: course.coverImage ? `url(${course.coverImage})` : 'none',
            backgroundColor: course.coverImage ? 'transparent' : '#E05D25'
          }}>
            <div className="absolute inset-0 bg-gradient-to-t from-umber-900 to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-sans">{course.title}</h1>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={instructorAvatar} />
                      <AvatarFallback className="bg-primary-300 text-white text-xs">
                        {instructorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{instructorName}</span>
                  </div>
                </div>
                {user?.role === "student" && (
                  <div className="flex flex-col items-end">
                    <div className="text-sm mb-1">Course Progress: {courseProgress}%</div>
                    <Progress value={courseProgress} className="h-2 w-32 md:w-48 bg-white/20" />
                  </div>
                )}
                {isInstructor && (
                  <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Course
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-4 md:p-6">
            {/* Course Stats/Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <Users className="h-5 w-5 text-primary-400 mr-3" />
                  <div>
                    <p className="text-xs text-umber-600">Students</p>
                    <p className="text-lg font-semibold text-umber-900">{enrollments?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <CalendarCheck className="h-5 w-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-xs text-umber-600">Assignments</p>
                    <p className="text-lg font-semibold text-umber-900">{assignments?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <Clock className="h-5 w-5 text-accent-400 mr-3" />
                  <div>
                    <p className="text-xs text-umber-600">Created</p>
                    <p className="text-lg font-semibold text-umber-900">{formatDate(course.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <MessageSquare className="h-5 w-5 text-umber-600 mr-3" />
                  <div>
                    <p className="text-xs text-umber-600">Announcements</p>
                    <p className="text-lg font-semibold text-umber-900">{announcements?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                {(isInstructor || user?.role === "admin") && (
                  <TabsTrigger value="students">Students</TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-umber-800 whitespace-pre-line">{course.description}</p>
                  </CardContent>
                </Card>

                {/* Recent Announcements */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Announcements</CardTitle>
                      <Link href="#announcements">
                        <Button variant="link" className="text-primary-400">View All</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {announcementsLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                      </div>
                    ) : announcements && announcements.length > 0 ? (
                      <div className="space-y-4">
                        {announcements.slice(0, 2).map((announcement) => (
                          <div key={announcement.id}>
                            <AnnouncementItem announcement={{
                              id: announcement.id,
                              author: {
                                name: announcement.creator ? `${announcement.creator.firstName} ${announcement.creator.lastName}` : 'Unknown',
                                avatar: announcement.creator?.profileImage
                              },
                              courseName: course.title,
                              title: announcement.title,
                              content: announcement.content,
                              createdAt: new Date(announcement.createdAt)
                            }} />
                            <Separator className="my-4" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-umber-600">
                        No announcements yet
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Assignments */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Assignments</CardTitle>
                      <Link href="#assignments">
                        <Button variant="link" className="text-primary-400">View All</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignmentsLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                      </div>
                    ) : assignments && assignments.length > 0 ? (
                      <div className="space-y-4">
                        {assignments
                          .filter(assignment => new Date(assignment.dueDate) > new Date())
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .slice(0, 3)
                          .map((assignment) => (
                            <AssignmentItem 
                              key={assignment.id}
                              assignment={{
                                id: assignment.id,
                                title: assignment.title,
                                courseName: course.title,
                                dueDate: new Date(assignment.dueDate),
                                status: "not_started",
                                icon: "file-text",
                                color: new Date(assignment.dueDate).getTime() - Date.now() < 1000 * 60 * 60 * 48 ? "warning" : "secondary"
                              }} 
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-umber-600">
                        No upcoming assignments
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Course Modules</CardTitle>
                      {isInstructor && (
                        <Button className="bg-primary-400 hover:bg-primary-500 text-white" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      Course content organized by modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Module 1 */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-neutral-50 p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <BookMarked className="h-5 w-5 text-primary-400 mr-3" />
                            <h3 className="font-semibold text-umber-900">Module 1: Introduction</h3>
                          </div>
                          <Badge className="bg-accent-400">Current</Badge>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <FileText className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Course Syllabus</span>
                          </div>
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <FileText className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Introduction Slides</span>
                          </div>
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <Award className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Quiz: Getting Started</span>
                          </div>
                        </div>
                      </div>

                      {/* Module 2 */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-neutral-50 p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <BookMarked className="h-5 w-5 text-primary-400 mr-3" />
                            <h3 className="font-semibold text-umber-900">Module 2: Core Concepts</h3>
                          </div>
                          <Badge variant="outline" className="bg-neutral-100 text-umber-700">Upcoming</Badge>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <FileText className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Lecture Notes</span>
                          </div>
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <FileText className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Reading Assignment</span>
                          </div>
                        </div>
                      </div>

                      {/* Module 3 */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-neutral-50 p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <BookMarked className="h-5 w-5 text-primary-400 mr-3" />
                            <h3 className="font-semibold text-umber-900">Module 3: Advanced Topics</h3>
                          </div>
                          <Badge variant="outline" className="bg-neutral-100 text-umber-700">Upcoming</Badge>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <FileText className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Research Materials</span>
                          </div>
                          <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                            <Award className="h-4 w-4 text-umber-600 mr-3" />
                            <span className="text-sm text-umber-800">Final Project Guidelines</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Course Assignments</CardTitle>
                      {isInstructor && (
                        <Button className="bg-primary-400 hover:bg-primary-500 text-white" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Assignment
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      All assignments for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignmentsLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                      </div>
                    ) : assignments && assignments.length > 0 ? (
                      <div className="space-y-4">
                        {assignments
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .map((assignment) => (
                            <AssignmentItem 
                              key={assignment.id}
                              assignment={{
                                id: assignment.id,
                                title: assignment.title,
                                courseName: course.title,
                                dueDate: new Date(assignment.dueDate),
                                status: "not_started",
                                icon: "file-text",
                                color: new Date(assignment.dueDate).getTime() - Date.now() < 1000 * 60 * 60 * 48 ? "warning" : "secondary"
                              }} 
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <FileText className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                        <h3 className="text-lg font-semibold text-umber-800 mb-2">No assignments yet</h3>
                        <p className="text-sm text-umber-600 mb-4">There are no assignments for this course yet.</p>
                        {isInstructor && (
                          <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Assignment
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Course Announcements</CardTitle>
                      {isInstructor && (
                        <Button className="bg-primary-400 hover:bg-primary-500 text-white" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Announcement
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      Important updates and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {announcementsLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                      </div>
                    ) : announcements && announcements.length > 0 ? (
                      <div className="space-y-4">
                        {announcements
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((announcement) => (
                            <div key={announcement.id}>
                              <AnnouncementItem announcement={{
                                id: announcement.id,
                                author: {
                                  name: announcement.creator ? `${announcement.creator.firstName} ${announcement.creator.lastName}` : 'Unknown',
                                  avatar: announcement.creator?.profileImage
                                },
                                courseName: course.title,
                                title: announcement.title,
                                content: announcement.content,
                                createdAt: new Date(announcement.createdAt)
                              }} />
                              <Separator className="my-4" />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                        <h3 className="text-lg font-semibold text-umber-800 mb-2">No announcements yet</h3>
                        <p className="text-sm text-umber-600 mb-4">There are no announcements for this course yet.</p>
                        {isInstructor && (
                          <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Announcement
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students Tab (Only for instructors and admins) */}
              {(isInstructor || user?.role === "admin") && (
                <TabsContent value="students">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enrolled Students</CardTitle>
                      <CardDescription>
                        Students currently enrolled in this course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {enrollmentsLoading ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                        </div>
                      ) : enrollments && enrollments.length > 0 ? (
                        <div className="space-y-4">
                          {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={enrollment.student?.profileImage} />
                                  <AvatarFallback className="bg-neutral-200 text-umber-700">
                                    {getInitials(`${enrollment.student?.firstName} ${enrollment.student?.lastName}`)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-umber-900">{enrollment.student?.firstName} {enrollment.student?.lastName}</p>
                                  <p className="text-xs text-umber-600">Enrolled: {formatDate(enrollment.enrolledAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-umber-800">Progress</p>
                                  <p className="text-xs text-umber-600">{enrollment.progress}%</p>
                                </div>
                                <Progress value={enrollment.progress} className="h-2 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <Users className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                          <h3 className="text-lg font-semibold text-umber-800 mb-2">No students enrolled</h3>
                          <p className="text-sm text-umber-600">There are no students enrolled in this course yet.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
