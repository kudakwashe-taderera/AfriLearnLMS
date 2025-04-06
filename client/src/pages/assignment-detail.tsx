import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  FileText, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Upload, 
  Check, 
  Award, 
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const submissionSchema = z.object({
  content: z.string().min(1, "Submission content is required"),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const assignmentId = parseInt(id);
  const { user } = useAuth();

  // Fetch assignment details
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}`],
    enabled: !!assignmentId,
  });

  // Fetch course for this assignment
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${assignment?.courseId}`],
    enabled: !!assignment?.courseId,
  });

  // For students: Fetch student submission
  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}/submissions`],
    enabled: !!assignmentId && !!user && user.role === "student",
  });

  // For instructors: Fetch all submissions
  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}/submissions`],
    enabled: !!assignmentId && !!user && user.role === "instructor",
  });

  const isLoading = assignmentLoading || 
                    courseLoading || 
                    (user?.role === "student" && submissionLoading) ||
                    (user?.role === "instructor" && submissionsLoading);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: SubmissionFormValues) => {
    // This would typically call a mutation to submit the assignment
    console.log("Submitting assignment:", data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!assignment || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FileText className="h-16 w-16 text-primary-300 mb-4" />
        <h1 className="text-2xl font-bold text-umber-900 mb-2">Assignment Not Found</h1>
        <p className="text-umber-700 mb-6 text-center">
          The assignment you are looking for does not exist or has been removed.
        </p>
        <Link href="/assignments">
          <Button className="bg-primary-400 hover:bg-primary-500 text-white">
            Browse Assignments
          </Button>
        </Link>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    
    if (now > due) {
      return "Past due";
    }
    
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
    }
  };

  // Determine submission status and badge color
  const getSubmissionStatus = () => {
    if (!submission || submission.length === 0) {
      return { text: "Not Started", color: "bg-neutral-400" };
    }
    
    const studentSubmission = submission[0];
    
    if (studentSubmission.status === "submitted") {
      return { text: "Submitted", color: "bg-accent-400" };
    } else if (studentSubmission.status === "in_progress") {
      return { text: "In Progress", color: "bg-secondary-400" };
    } else {
      return { text: "Not Started", color: "bg-neutral-400" };
    }
  };

  const submissionStatus = getSubmissionStatus();
  const isSubmitted = submission && submission.length > 0 && submission[0].status === "submitted";
  const isPastDue = new Date(assignment.dueDate) < new Date();
  const hasSubmissions = submissions && submissions.length > 0;

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          {/* Back Link */}
          <Link href={`/courses/${course.id}`} className="inline-flex items-center text-primary-400 hover:text-primary-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Details Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assignment Details */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                      <p className="text-sm text-umber-600 mt-1">{course.title}</p>
                    </div>
                    <Badge className={`${submissionStatus.color} text-white`}>
                      {submissionStatus.text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                      <span className="text-sm text-umber-800">Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-secondary-400 mr-2" />
                      <span className="text-sm text-umber-800">{formatTimeRemaining(assignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-accent-400 mr-2" />
                      <span className="text-sm text-umber-800">Points: {assignment.totalPoints}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-umber-900 mb-2">Assignment Description</h3>
                    <div className="prose prose-umber max-w-none">
                      <p className="text-umber-800 whitespace-pre-line">{assignment.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Submission Form */}
              {user?.role === "student" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPastDue && !isSubmitted ? (
                      <div className="bg-status-error bg-opacity-10 border border-status-error text-status-error rounded-md p-4 mb-4">
                        <p className="text-sm font-medium">This assignment is past due. Late submissions may not be accepted.</p>
                      </div>
                    ) : null}

                    {isSubmitted ? (
                      <div className="space-y-4">
                        <div className="bg-accent-50 border border-accent-200 text-accent-800 rounded-md p-4 mb-4 flex items-center">
                          <Check className="h-5 w-5 text-accent-400 mr-2" />
                          <p className="text-sm font-medium">Assignment submitted successfully on {formatDate(submission[0].submittedAt)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-umber-700 mb-2">Your submission:</h3>
                          <div className="bg-neutral-50 rounded-md p-4 border">
                            <p className="text-umber-800 whitespace-pre-line">{submission[0].content}</p>
                            {submission[0].fileUrl && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-umber-700 mb-2">Attached file:</h4>
                                <div className="flex items-center p-2 bg-white rounded border">
                                  <FileText className="h-4 w-4 text-primary-400 mr-2" />
                                  <span className="text-sm text-umber-800 flex-1 truncate">{submission[0].fileUrl.split('/').pop()}</span>
                                  <Button variant="outline" size="sm">View</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-umber-700 mb-1">
                            Submission Text
                          </label>
                          <Textarea 
                            id="content"
                            placeholder="Enter your submission here..."
                            className="min-h-[200px]"
                            {...form.register("content")}
                          />
                          {form.formState.errors.content && (
                            <p className="text-sm text-status-error mt-1">{form.formState.errors.content.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="file" className="block text-sm font-medium text-umber-700 mb-1">
                            Attach File (optional)
                          </label>
                          <div className="flex items-center">
                            <Input id="file" type="file" className="flex-1" />
                          </div>
                        </div>
                      </form>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                    {!isSubmitted && (
                      <>
                        <Button variant="outline">Save Draft</Button>
                        <Button 
                          className="bg-primary-400 hover:bg-primary-500 text-white"
                          onClick={form.handleSubmit(onSubmit)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                      </>
                    )}
                    {isSubmitted && !isPastDue && (
                      <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                        <FileUp className="h-4 w-4 mr-2" />
                        Resubmit
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}

              {/* Instructor View: Student Submissions */}
              {user?.role === "instructor" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasSubmissions ? (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <div key={submission.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={submission.student?.profileImage} />
                                  <AvatarFallback className="bg-neutral-200 text-umber-700">
                                    {submission.student?.firstName?.[0]}{submission.student?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-umber-900">{submission.student?.firstName} {submission.student?.lastName}</p>
                                  <p className="text-xs text-umber-600">Submitted: {formatDate(submission.submittedAt)}</p>
                                </div>
                              </div>
                              <Badge className={submission.status === "submitted" ? "bg-accent-400" : "bg-secondary-400"}>
                                {submission.status === "submitted" ? "Submitted" : "In Progress"}
                              </Badge>
                            </div>
                            <div className="bg-neutral-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-umber-800 whitespace-pre-line">{submission.content}</p>
                              {submission.fileUrl && (
                                <div className="mt-3 flex items-center p-2 bg-white rounded border">
                                  <FileText className="h-4 w-4 text-primary-400 mr-2" />
                                  <span className="text-sm text-umber-800 flex-1 truncate">{submission.fileUrl.split('/').pop()}</span>
                                  <Button variant="outline" size="sm">View</Button>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end">
                              <Button className="bg-primary-400 hover:bg-primary-500 text-white">Grade Submission</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-umber-300 mb-4" />
                        <h3 className="text-lg font-semibold text-umber-800 mb-2">No submissions yet</h3>
                        <p className="text-sm text-umber-600">
                          None of your students have submitted this assignment yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Assignment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.role === "student" ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-umber-700">Submission Status</span>
                          <Badge className={submissionStatus.color}>
                            {submissionStatus.text}
                          </Badge>
                        </div>
                        <Progress 
                          value={isSubmitted ? 100 : submission && submission.length > 0 ? 50 : 0} 
                          className="h-2" 
                        />
                      </div>
                      <div className="text-sm text-umber-600">
                        {isSubmitted ? (
                          <p>✓ Submitted on {formatDate(submission[0].submittedAt)}</p>
                        ) : (
                          <p>⚠ Assignment is due on {formatDate(assignment.dueDate)}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Instructor View */
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-umber-700">Submission Rate</span>
                          <span className="text-sm font-medium text-umber-900">
                            {submissions?.length || 0}/{course.students?.length || 0} students
                          </span>
                        </div>
                        <Progress 
                          value={course.students?.length ? ((submissions?.length || 0) / course.students.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                      <div className="text-sm text-umber-600">
                        <p>Assignment is due on {formatDate(assignment.dueDate)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                      <FileText className="h-4 w-4 text-primary-400 mr-3" />
                      <span className="text-sm text-umber-800">Assignment Guidelines</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                      <FileText className="h-4 w-4 text-primary-400 mr-3" />
                      <span className="text-sm text-umber-800">Reference Materials</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                      <FileText className="h-4 w-4 text-primary-400 mr-3" />
                      <span className="text-sm text-umber-800">Grading Rubric</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-umber-800">Homework 1: Foundations</p>
                        <p className="text-xs text-umber-600">Due: 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-secondary-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-secondary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-umber-800">Quiz 1: Core Concepts</p>
                        <p className="text-xs text-umber-600">Due: Tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 hover:bg-neutral-50 rounded-md cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-accent-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-accent-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-umber-800">Final Project</p>
                        <p className="text-xs text-umber-600">Due: in 2 weeks</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
