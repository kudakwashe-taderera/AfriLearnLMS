import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Users, ArrowRight, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["student", "instructor", "admin"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }
  
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "student",
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove the confirmPassword field as it's not part of the API
    const { confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">AfriLearn</CardTitle>
            <CardDescription>
              Africa's premier learning management system
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
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
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
                          <FormLabel>Password</FormLabel>
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
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            <Button
                              type="button"
                              className={`flex flex-col items-center gap-2 h-auto py-3 ${
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
                              className={`flex flex-col items-center gap-2 h-auto py-3 ${
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
                              className={`flex flex-col items-center gap-2 h-auto py-3 ${
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
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
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
            <p>By continuing, you agree to AfriLearn's Terms of Service and Privacy Policy.</p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero */}
      <div className="hidden md:flex md:w-1/2 bg-primary text-primary-foreground">
        <div className="flex flex-col items-start justify-center p-10 lg:p-20 h-full">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            Welcome to AfriLearn
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Africa's premier learning management system built for students, instructors, and educational institutions.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Students</h3>
                <p className="opacity-90">Access courses, assignments, grades and connect with your instructors all in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Instructors</h3>
                <p className="opacity-90">Create courses, manage assignments, track student progress, and provide valuable feedback.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full mt-1">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">For Administrators</h3>
                <p className="opacity-90">Manage your institution, users, and monitor system-wide activity and performance.</p>
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