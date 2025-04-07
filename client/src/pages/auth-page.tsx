import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { InsertUser } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Loader2, 
  Building2, 
  School, 
  BriefcaseBusiness, 
  GanttChartSquare, 
  ChevronRight 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define login schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Define complete register schema
const registerSchema = z.object({
  // Basic Information
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["student", "instructor", "admin", "employer", "university_admin", "ministry_official"], {
    required_error: "Please select a role",
  }),
  currentEducationLevel: z.enum(["o_level", "a_level", "undergraduate", "graduate", "phd", "professional"], {
    required_error: "Please select your current education level",
  }).optional(),
  
  // Student-specific fields
  // Personal Information
  nationalId: z.string().optional(),
  studentId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  placeOfBirth: z.string().optional(),
  
  // Contact information
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  
  // Parent/Guardian details
  parentName: z.string().optional(),
  parentOccupation: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  parentAddress: z.string().optional(),
  
  // Educational records
  previousSchool: z.string().optional(),
  previousQualifications: z.string().optional(),
  
  // Additional information
  medicalConditions: z.string().optional(),
  specialNeeds: z.string().optional(),
  extraCurricularActivities: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [registrationStep, setRegistrationStep] = useState<number>(1);
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // Basic Information
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "student",
      currentEducationLevel: undefined,
      
      // Student-specific fields
      // Personal Information
      nationalId: "",
      studentId: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      placeOfBirth: "",
      
      // Contact information
      permanentAddress: "",
      currentAddress: "",
      phoneNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      
      // Parent/Guardian details
      parentName: "",
      parentOccupation: "",
      parentPhone: "",
      parentEmail: "",
      parentAddress: "",
      
      // Educational records
      previousSchool: "",
      previousQualifications: "",
      
      // Additional information
      medicalConditions: "",
      specialNeeds: "",
      extraCurricularActivities: "",
    },
  });
  
  // Watch for role changes to conditionally show education level selection
  const selectedRole = registerForm.watch("role");
  
  // Handle redirection outside the render function
  useEffect(() => {
    if (user) {
      // For students, always redirect to career guidance page first
      if (user.role === 'student') {
        // New approach: direct them to Career Guidance first
        navigate("/career-guidance");
      } else if (user.role === 'instructor') {
        navigate("/instructor-dashboard");
      } else if (user.role === 'admin') {
        navigate("/admin-dashboard");
      } else if (user.role === 'employer') {
        navigate("/employer-dashboard");
      } else if (user.role === 'university_admin') {
        navigate("/university-admin-dashboard");
      } else if (user.role === 'ministry_official') {
        navigate("/ministry-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);
  
  // If user is logged in, don't render the auth page
  if (user) {
    return null;
  }
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Only submit if it's the final step or we're not in multi-step registration mode
    if (registrationStep === 2 || selectedRole !== 'student') {
      // Remove the confirmPassword field as it's not part of the API
      // and prepare user data
      const { confirmPassword, ...cleanData } = data;
      
      // Convert to InsertUser type to match the mutation's expected parameters
      registerMutation.mutate(cleanData as InsertUser);
    } else {
      // Move to the next step if we're in the first step
      setRegistrationStep(2);
    }
  };
  
  // Handle going back to the previous step
  const handleGoBack = () => {
    setRegistrationStep(1);
  };

  // Get education level display name
  const getEducationLevelName = (level: string) => {
    switch(level) {
      case 'o_level': return 'O-Level';
      case 'a_level': return 'A-Level';
      case 'undergraduate': return 'Undergraduate';
      case 'graduate': return 'Graduate';
      case 'phd': return 'PhD';
      case 'professional': return 'Professional';
      default: return level;
    }
  };

  // Get role display name
  const getRoleName = (role: string) => {
    switch(role) {
      case 'student': return 'Student';
      case 'instructor': return 'Instructor';
      case 'admin': return 'Administrator';
      case 'employer': return 'Employer';
      case 'university_admin': return 'University Admin';
      case 'ministry_official': return 'Ministry Official';
      default: return role;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">AfriLearnHub</CardTitle>
            <CardDescription>
              Comprehensive Education and Career System
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username or email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <a 
                              href="/forgot-password" 
                              className="text-xs text-primary hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/forgot-password");
                              }}
                            >
                              Forgot password?
                            </a>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>Login</>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    
                    {/* Step 1: Basic Information and Role Selection */}
                    {(registrationStep === 1 || selectedRole !== 'student') && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="First name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>I am a...</FormLabel>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "student" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("student")}
                                >
                                  <GraduationCap className="h-5 w-5" />
                                  <span className="text-xs">Student</span>
                                </Button>
                                
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "instructor" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("instructor")}
                                >
                                  <BookOpen className="h-5 w-5" />
                                  <span className="text-xs">Instructor</span>
                                </Button>
                                
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "employer" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("employer")}
                                >
                                  <BriefcaseBusiness className="h-5 w-5" />
                                  <span className="text-xs">Employer</span>
                                </Button>
                                
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "university_admin" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("university_admin")}
                                >
                                  <School className="h-5 w-5" />
                                  <span className="text-xs">University Admin</span>
                                </Button>
                                
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "ministry_official" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("ministry_official")}
                                >
                                  <GanttChartSquare className="h-5 w-5" />
                                  <span className="text-xs">Ministry Official</span>
                                </Button>
                                
                                <Button
                                  type="button"
                                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                    field.value === "admin" ? "border-primary bg-primary/10" : ""
                                  }`}
                                  variant="outline"
                                  onClick={() => field.onChange("admin")}
                                >
                                  <Users className="h-5 w-5" />
                                  <span className="text-xs">Admin</span>
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    {/* Step 2: Education Level Selection (for students only) */}
                    {selectedRole === 'student' && registrationStep === 2 && (
                      <>
                        <div className="mb-4">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="p-0 h-auto text-primary flex items-center"
                            onClick={handleGoBack}
                          >
                            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                            Back to account details
                          </Button>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Education Details</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Please select your current education level to help us provide you with the most relevant resources and guidance.
                          </p>
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="currentEducationLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Education Level</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your education level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="o_level">O-Level</SelectItem>
                                  <SelectItem value="a_level">A-Level</SelectItem>
                                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                  <SelectItem value="graduate">Graduate/Masters</SelectItem>
                                  <SelectItem value="phd">PhD</SelectItem>
                                  <SelectItem value="professional">Professional Certification</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                              
                              {field.value && (
                                <div className="mt-4 p-3 bg-secondary/30 rounded-md">
                                  <h4 className="font-medium mb-2">What to expect as a {getEducationLevelName(field.value)} student:</h4>
                                  <ul className="text-sm space-y-2 list-disc pl-5">
                                    {field.value === 'o_level' && (
                                      <>
                                        <li>Access to O-Level subject materials and exercises</li>
                                        <li>Early career guidance tailored to your interests</li>
                                        <li>Study groups with fellow O-Level students</li>
                                        <li>Grade tracking and progress reports</li>
                                      </>
                                    )}
                                    {field.value === 'a_level' && (
                                      <>
                                        <li>A-Level specialized course materials</li>
                                        <li>University application guidance</li>
                                        <li>Subject selection advice based on career aspirations</li>
                                        <li>Mock exams and advanced assessment tools</li>
                                      </>
                                    )}
                                    {field.value === 'undergraduate' && (
                                      <>
                                        <li>Undergraduate course management</li>
                                        <li>Internship opportunities matching your field</li>
                                        <li>Connection with industry mentors</li>
                                        <li>Career preparation resources</li>
                                      </>
                                    )}
                                    {field.value === 'graduate' && (
                                      <>
                                        <li>Advanced research resources</li>
                                        <li>Professional networking tools</li>
                                        <li>Job placement services</li>
                                        <li>Thesis and project management tools</li>
                                      </>
                                    )}
                                    {field.value === 'phd' && (
                                      <>
                                        <li>Research collaboration opportunities</li>
                                        <li>Teaching assistant resources</li>
                                        <li>Publication and conference tools</li>
                                        <li>Academic career development</li>
                                      </>
                                    )}
                                    {field.value === 'professional' && (
                                      <>
                                        <li>Industry-specific certification paths</li>
                                        <li>Continuing education resources</li>
                                        <li>Professional development tracking</li>
                                        <li>Career advancement tools</li>
                                      </>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        {/* Additional Student Information - Only shown after education level is selected */}
                        {registerForm.watch('currentEducationLevel') && (
                          <>
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Personal Information</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            {/* Student ID and National ID */}
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="studentId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Student ID (if applicable)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter student ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="nationalId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>National ID Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter national ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Date of Birth and Gender */}
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Nationality and Place of Birth */}
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="nationality"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nationality</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter nationality" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="placeOfBirth"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Place of Birth</FormLabel>
                                    <FormControl>
                                      <Input placeholder="City, Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            {/* Phone Number */}
                            <FormField
                              control={registerForm.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {/* Permanent Address */}
                            <FormField
                              control={registerForm.control}
                              name="permanentAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Permanent Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter permanent address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {/* Current Address */}
                            <FormField
                              control={registerForm.control}
                              name="currentAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Address (if different)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter current address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Emergency Contact</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="emergencyContactName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Emergency Contact Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter emergency contact name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="emergencyContactPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Emergency Contact Phone</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="emergencyContactRelationship"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Relationship</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Parent, Sibling" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Parent/Guardian Information</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="parentName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Parent/Guardian Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter parent/guardian name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="parentOccupation"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter occupation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="parentPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="parentEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="parentAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Educational Records</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="previousSchool"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Previous School/Institution</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter previous school name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="previousQualifications"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Previous Qualifications</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter qualifications" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="mt-6 mb-2">
                              <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                              <div className="h-px bg-border mb-4"></div>
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="medicalConditions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Medical Conditions (if any)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter any medical conditions" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="specialNeeds"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Special Needs or Accommodations</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter any special needs" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="extraCurricularActivities"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Extra-Curricular Activities</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter activities" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                    
                    {(registrationStep === 2 || selectedRole !== 'student') && (
                      <div className="flex items-center space-x-2 mb-4">
                        <input 
                          type="checkbox" 
                          id="termsAccepted" 
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          required
                        />
                        <label htmlFor="termsAccepted" className="text-sm text-muted-foreground">
                          I agree to the{" "}
                          <a 
                            href="/terms" 
                            className="text-primary hover:underline" 
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/terms");
                            }}
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a 
                            href="/privacy" 
                            className="text-primary hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/privacy");
                            }}
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending || (selectedRole === 'student' && registrationStep === 2 && !registerForm.watch('currentEducationLevel'))}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : selectedRole === 'student' && registrationStep === 1 ? (
                        <>Continue to Education Details</>
                      ) : (
                        <>Create Account</>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to AfriLearnHub's Terms of Service and Privacy Policy.</p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero */}
      <div className="hidden md:flex md:w-1/2 bg-primary text-primary-foreground">
        <div className="flex flex-col items-start justify-center p-10 lg:p-20 h-full">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            Welcome to AfriLearnHub
          </h1>
          <p className="text-lg mb-8 opacity-90">
            The comprehensive education and career system for students, educators, employers and educational institutions.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Students</h3>
                <p className="opacity-90">Access courses, assignments, career guidance and connect with opportunities all in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Educators</h3>
                <p className="opacity-90">Create courses, manage assignments, track student progress, and provide valuable guidance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Employers</h3>
                <p className="opacity-90">Connect with talent, post job opportunities, and engage with educational institutions.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <School className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Institutions</h3>
                <p className="opacity-90">Manage applications, collaborate with other universities, and maintain quality education.</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-10 gap-2 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground"
            onClick={() => setActiveTab("register")}
          >
            Get Started Today
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}