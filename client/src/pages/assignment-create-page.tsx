import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  FileText,
  Plus,
  Upload,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertAssignmentSchema } from "@shared/schema";

// Extend assignment schema with additional fields needed for the form
const assignmentFormSchema = insertAssignmentSchema.extend({
  courseId: z.coerce.number({
    required_error: "Course is required",
    invalid_type_error: "Course must be selected",
  }),
  attachments: z.array(z.any()).optional(), // For file uploads
  dueDate: z.date({
    required_error: "Due date is required",
    invalid_type_error: "Due date is required",
  }),
  dueTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export default function AssignmentCreatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  // Fetch instructor's courses for dropdown
  const { data: instructorCourses, isLoading: coursesLoading } = useQuery({
    queryKey: [`/api/instructor/${user?.id}/courses`],
    enabled: !!user && (user.role === "instructor" || user.role === "admin"),
  });

  // Form with validation
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: undefined,
      totalPoints: 100,
      dueDate: undefined,
      dueTime: "23:59",
      attachments: [],
    },
  });

  // Assignment creation mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: AssignmentFormValues) => {
      // In a real app, you would upload attachment files and get URLs
      // Then include those URLs in the assignment data
      
      // Combine date and time into a single ISO string
      const { dueDate, dueTime, attachments, ...assignmentDataWithoutFiles } = assignmentData;
      
      const dueDateObj = new Date(dueDate);
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':').map(Number);
        dueDateObj.setHours(hours, minutes);
      }
      
      const assignmentDataToSend = {
        ...assignmentDataWithoutFiles,
        dueDate: dueDateObj.toISOString(),
        // In a real app, this would be an array of attachment URLs after upload
        attachments: files.map(file => file.name),
      };
      
      const res = await apiRequest("POST", "/api/assignments", assignmentDataToSend);
      return await res.json();
    },
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      queryClient.invalidateQueries({ queryKey: [`/api/instructor/${user?.id}/assignments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${assignment.courseId}/assignments`] });
      
      toast({
        title: "Assignment created",
        description: "Your assignment has been created successfully.",
      });
      
      // Navigate to the new assignment
      navigate(`/assignments/${assignment.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: AssignmentFormValues) => {
    createAssignmentMutation.mutate(data);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...filesArray]);
      
      // Set form value
      form.setValue("attachments", [...(form.getValues().attachments || []), ...filesArray]);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    form.setValue(
      "attachments", 
      (form.getValues().attachments || []).filter((_, i) => i !== index)
    );
  };

  // Sample courses for demo if no courses are loaded yet
  const sampleCourses = [
    { id: 1, title: "Introduction to African History" },
    { id: 2, title: "Data Science Fundamentals" },
    { id: 3, title: "Business Administration" },
    { id: 4, title: "Introduction to Physics" },
    { id: 5, title: "Cultural Anthropology" },
  ];

  const coursesForDropdown = instructorCourses?.length > 0 ? instructorCourses : sampleCourses;

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-primary-400 mb-4">Access Denied</h1>
          <p className="text-umber-700 mb-6">
            You don't have permission to access this page. This area is restricted to instructor or admin roles.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-primary-400 hover:bg-primary-500 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 text-primary-400 hover:text-primary-500 p-0"
              onClick={() => navigate("/assignments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>

            <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-6">
              Create New Assignment
            </h1>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                    <CardDescription>
                      Provide the essential details for your new assignment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Midterm Essay" 
                        {...form.register("title")}
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-status-error">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courseId">Course</Label>
                      <Select 
                        onValueChange={(value) => form.setValue("courseId", parseInt(value))}
                        defaultValue={form.getValues().courseId?.toString()}
                      >
                        <SelectTrigger id="courseId">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesLoading ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary-400 mr-2" />
                              Loading courses...
                            </div>
                          ) : (
                            coursesForDropdown.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.courseId && (
                        <p className="text-sm text-status-error">{form.formState.errors.courseId.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Assignment Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide detailed instructions for the assignment" 
                        className="min-h-[150px]"
                        {...form.register("description")}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-status-error">{form.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalPoints">Total Points</Label>
                      <Input 
                        id="totalPoints" 
                        type="number" 
                        min="1"
                        placeholder="e.g., 100" 
                        {...form.register("totalPoints", { valueAsNumber: true })}
                      />
                      {form.formState.errors.totalPoints && (
                        <p className="text-sm text-status-error">{form.formState.errors.totalPoints.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !form.getValues().dueDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {form.getValues().dueDate ? (
                                  format(form.getValues().dueDate, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={form.getValues().dueDate}
                                onSelect={(date) => form.setValue("dueDate", date as Date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {form.formState.errors.dueDate && (
                            <p className="text-sm text-status-error">{form.formState.errors.dueDate.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueTime">Due Time</Label>
                        <Input 
                          id="dueTime" 
                          type="time" 
                          {...form.register("dueTime")}
                        />
                        {form.formState.errors.dueTime && (
                          <p className="text-sm text-status-error">{form.formState.errors.dueTime.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attachments Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>
                      Upload files that students will need for this assignment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6">
                      <div className="flex flex-col items-center justify-center mb-4">
                        <Upload className="h-10 w-10 text-neutral-400 mb-2" />
                        <p className="text-sm text-umber-600 mb-1 text-center">
                          Drag and drop files, or click to select files
                        </p>
                        <p className="text-xs text-umber-500 text-center">
                          PDF, Word, Excel, PowerPoint, and image files are supported
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Label 
                          htmlFor="attachments" 
                          className="bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded-md cursor-pointer"
                        >
                          <Plus className="h-4 w-4 mr-2 inline-block" />
                          Add Files
                        </Label>
                        <input 
                          id="attachments"
                          type="file" 
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-umber-700">Attached Files</h4>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between border rounded-md p-2 bg-white"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-umber-500 mr-2" />
                                <span className="text-sm text-umber-800">{file.name}</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-status-error hover:text-status-error/80 hover:bg-status-error/10"
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/assignments")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    disabled={createAssignmentMutation.isPending}
                  >
                    {createAssignmentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Assignment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}