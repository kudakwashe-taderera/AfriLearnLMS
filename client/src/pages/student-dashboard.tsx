import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Loader2 } from "lucide-react";
import CourseList from "@/components/course-list";
import DashboardStats from "@/components/dashboard-stats";
import AssignmentItem from "@/components/assignment-item";
import CalendarWidget from "@/components/calendar-widget";
import AnnouncementItem from "@/components/announcement-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Fetch student enrollments with course details
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user,
  });

  // Fetch recent announcements (we'll get a combined list for all enrolled courses)
  const { data: recentAnnouncements, isLoading: announcementsLoading } = useQuery({
    queryKey: ["/api/student/announcements"],
    enabled: !!user,
  });

  // For demo purposes, create upcoming assignments on client-side
  const upcomingAssignments = enrollments ? [] : null;

  if (enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-sm text-umber-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-accent-400 hover:bg-accent-500 text-white">
                  Explore Courses
                </Button>
              </div>
            </div>

            {/* Progress Overview */}
            <DashboardStats enrollments={enrollments || []} />
          </section>

          {/* Enrolled Courses Section */}
          <CourseList enrollments={enrollments || []} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Upcoming Assignments Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold font-sans text-umber-900">Upcoming Assignments</h2>
                  <Link href="/assignments" className="text-sm text-primary-400 hover:text-primary-500 font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingAssignments ? (
                    upcomingAssignments.length > 0 ? (
                      upcomingAssignments.map((assignment) => (
                        <AssignmentItem key={assignment.id} assignment={assignment} />
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-umber-600">No upcoming assignments</p>
                      </div>
                    )
                  ) : (
                    <>
                      <AssignmentItem 
                        assignment={{
                          id: 1,
                          title: "Final Project Analysis",
                          courseName: "Data Science Fundamentals",
                          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // Today
                          status: "not_started",
                          icon: "file-text",
                          color: "warning"
                        }} 
                      />
                      <AssignmentItem 
                        assignment={{
                          id: 2,
                          title: "Lab Report: Wave Properties",
                          courseName: "Introduction to Physics",
                          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
                          status: "in_progress",
                          icon: "flask",
                          color: "warning"
                        }} 
                      />
                      <AssignmentItem 
                        assignment={{
                          id: 3,
                          title: "Cultural Impact Essay",
                          courseName: "Cultural Anthropology",
                          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
                          status: "not_started",
                          icon: "book",
                          color: "secondary"
                        }} 
                      />
                      <AssignmentItem 
                        assignment={{
                          id: 4,
                          title: "Market Analysis Presentation",
                          courseName: "Business Administration",
                          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days
                          status: "not_started",
                          icon: "presentation",
                          color: "secondary"
                        }} 
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="lg:col-span-1">
              <CalendarWidget />
            </div>
          </div>

          {/* Recent Announcements Section */}
          <section className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold font-sans text-umber-900">Recent Announcements</h2>
                <Link href="/announcements" className="text-sm text-primary-400 hover:text-primary-500 font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {announcementsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                  </div>
                ) : recentAnnouncements && recentAnnouncements.length > 0 ? (
                  recentAnnouncements.map((announcement) => (
                    <div key={announcement.id}>
                      <AnnouncementItem announcement={announcement} />
                      <Separator className="my-4" />
                    </div>
                  ))
                ) : (
                  <>
                    <AnnouncementItem 
                      announcement={{
                        id: 1,
                        author: {
                          name: "Dr. Kofi Annan",
                          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        },
                        courseName: "Introduction to African History",
                        title: "Important update for Introduction to African History",
                        content: "Dear students, please note that next week's lecture will cover the pre-colonial kingdoms of West Africa. The reading materials have been updated in the course resources section. Make sure to review them before class.",
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
                      }} 
                    />
                    <Separator className="my-4" />
                    <AnnouncementItem 
                      announcement={{
                        id: 2,
                        author: {
                          name: "Prof. Amina Diop",
                          avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        },
                        courseName: "Data Science Fundamentals",
                        title: "Data Science Tutorial Session Added",
                        content: "An additional tutorial session has been scheduled for tomorrow at 11:30 AM to help with the upcoming assignment. We'll be covering data visualization techniques that will be useful for your final project.",
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
                      }} 
                    />
                    <Separator className="my-4" />
                    <AnnouncementItem 
                      announcement={{
                        id: 3,
                        author: {
                          name: "AfriLearn Administration",
                          avatar: ""
                        },
                        courseName: "System",
                        title: "System Maintenance Notice",
                        content: "The system will be undergoing maintenance this weekend from Saturday 8 PM to Sunday 2 AM. During this time, you may experience brief periods of unavailability. We apologize for any inconvenience.",
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
                      }} 
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
