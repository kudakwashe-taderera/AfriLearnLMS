import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ArrowLeft, 
  Image as ImageIcon, 
  Upload, 
  Clock,
  BookMarked,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCourseSchema } from "@shared/schema";

// Extend course schema with additional fields needed for the form
const courseFormSchema = insertCourseSchema.extend({
  coverImage: z.any().optional(), // For file upload
  modules: z.array(
    z.object({
      title: z.string().min(1, "Module title is required"),
      description: z.string().optional(),
    })
  ).default([]),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CourseCreatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Form with validation
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      instructorId: user?.id,
      modules: [{ title: "", description: "" }],
    },
  });

  // Course creation mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CourseFormValues) => {
      // In a real app, you would upload the cover image and get a URL
      // Then include that URL in the course data
      const { coverImage, ...courseDataWithoutFile } = courseData;
      
      // Add mock coverImage URL for demo
      const courseDataToSend = {
        ...courseDataWithoutFile,
        coverImage: coverImagePreview || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      };
      
      const res = await apiRequest("POST", "/api/courses", courseDataToSend);
      return await res.json();
    },
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: [`/api/instructor/${user?.id}/courses`] });
      
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
      
      // Navigate to the new course
      navigate(`/courses/${course.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Course creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CourseFormValues) => {
    createCourseMutation.mutate(data);
  };

  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set form value
      form.setValue("coverImage", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new module field
  const addModule = () => {
    const currentModules = form.getValues().modules || [];
    form.setValue("modules", [...currentModules, { title: "", description: "" }]);
  };

  // Remove module field
  const removeModule = (index: number) => {
    const currentModules = form.getValues().modules;
    if (currentModules.length > 1) {
      form.setValue(
        "modules",
        currentModules.filter((_, i) => i !== index)
      );
    }
  };

  // Course categories
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
              onClick={() => navigate("/courses")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>

            <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-6">
              Create New Course
            </h1>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Provide the essential details about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Introduction to Data Science" 
                        {...form.register("title")}
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-status-error">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Course Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide a detailed description of your course" 
                        className="min-h-[120px]"
                        {...form.register("description")}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-status-error">{form.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        onValueChange={(value) => form.setValue("category", value)}
                        defaultValue={form.getValues().category}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.category && (
                        <p className="text-sm text-status-error">{form.formState.errors.category.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Cover Image Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Image</CardTitle>
                    <CardDescription>
                      Upload an image that represents your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      {coverImagePreview ? (
                        <div className="w-full">
                          <img 
                            src={coverImagePreview} 
                            alt="Course cover preview" 
                            className="max-h-64 mx-auto object-cover rounded-md mb-4"
                          />
                          <div className="flex justify-center">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setCoverImagePreview(null);
                                form.setValue("coverImage", null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-12 w-12 text-neutral-400 mb-4" />
                          <p className="text-sm text-umber-600 mb-4 text-center">
                            Drag and drop an image, or click to select a file
                          </p>
                          <Label 
                            htmlFor="coverImage" 
                            className="bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded-md cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2 inline-block" />
                            Upload Image
                          </Label>
                          <input 
                            id="coverImage"
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImageChange}
                          />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Modules Card */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Course Modules</CardTitle>
                        <CardDescription>
                          Organize your course content into modules
                        </CardDescription>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addModule}
                        className="border-primary-400 text-primary-400 hover:bg-primary-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Module
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {form.getValues().modules.map((_, index) => (
                      <div key={index} className="p-4 border border-neutral-200 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-md font-medium text-umber-800">Module {index + 1}</h3>
                          {form.getValues().modules.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={() => removeModule(index)}
                              className="h-8 w-8 p-0 text-status-error hover:text-status-error/80 hover:bg-status-error/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`modules.${index}.title`}>Module Title</Label>
                            <Input 
                              id={`modules.${index}.title`}
                              placeholder="e.g., Introduction to the Course" 
                              {...form.register(`modules.${index}.title`)}
                            />
                            {form.formState.errors.modules?.[index]?.title && (
                              <p className="text-sm text-status-error">
                                {form.formState.errors.modules[index]?.title?.message}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`modules.${index}.description`}>Module Description</Label>
                            <Textarea 
                              id={`modules.${index}.description`}
                              placeholder="Briefly describe what this module covers" 
                              {...form.register(`modules.${index}.description`)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/courses")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <BookMarked className="h-4 w-4 mr-2" />
                        Create Course
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