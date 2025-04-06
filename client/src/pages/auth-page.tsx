import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen, User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InsertUser } from "@shared/schema";

// Define forms schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["student", "instructor"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type definitions
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if already logged in
  if (user) {
    const redirectPath = 
      user.role === "admin" ? "/admin/dashboard" : 
      user.role === "instructor" ? "/instructor/dashboard" : 
      "/student/dashboard";
    
    navigate(redirectPath);
    return null;
  }

  // Login form setup
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form setup
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        toast({
          title: "Login failed",
          description: error.message || "Invalid username or password",
          variant: "destructive",
        });
      },
    });
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword from data before sending to API
    const { confirmPassword, ...userData } = data;
    
    registerMutation.mutate(userData as InsertUser, {
      onError: (error) => {
        toast({
          title: "Registration failed",
          description: error.message || "There was a problem creating your account",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-umber-900">AfriLearn</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Sign in to access your account" 
                  : "Sign up for a free account to get started"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <div className="relative">
                        <Input
                          id="login-username"
                          placeholder="Enter your username"
                          className="pl-10"
                          {...loginRegister("username")}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {loginErrors.username && (
                        <p className="text-sm text-status-error">{loginErrors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link href="/forgot-password">
                          <span className="text-sm text-primary-500 hover:text-primary-600">
                            Forgot password?
                          </span>
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          {...loginRegister("password")}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-status-error">{loginErrors.password.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-400 hover:bg-primary-500"
                      disabled={loginMutation.isPending || isLoginSubmitting}
                    >
                      {loginMutation.isPending || isLoginSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>Sign in</>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Register Form */}
                <TabsContent value="register">
                  <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">First Name</Label>
                        <Input
                          id="register-firstName"
                          placeholder="First name"
                          {...registerRegister("firstName")}
                        />
                        {registerErrors.firstName && (
                          <p className="text-sm text-status-error">{registerErrors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Last Name</Label>
                        <Input
                          id="register-lastName"
                          placeholder="Last name"
                          {...registerRegister("lastName")}
                        />
                        {registerErrors.lastName && (
                          <p className="text-sm text-status-error">{registerErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <div className="relative">
                        <Input
                          id="register-username"
                          placeholder="Create a username"
                          className="pl-10"
                          {...registerRegister("username")}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {registerErrors.username && (
                        <p className="text-sm text-status-error">{registerErrors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email Address</Label>
                      <div className="relative">
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...registerRegister("email")}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {registerErrors.email && (
                        <p className="text-sm text-status-error">{registerErrors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10"
                          {...registerRegister("password")}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {registerErrors.password && (
                        <p className="text-sm text-status-error">{registerErrors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="register-confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10"
                          {...registerRegister("confirmPassword")}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-umber-400" />
                      </div>
                      {registerErrors.confirmPassword && (
                        <p className="text-sm text-status-error">{registerErrors.confirmPassword.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-role">I am a</Label>
                      <select
                        id="register-role"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...registerRegister("role")}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                      </select>
                      {registerErrors.role && (
                        <p className="text-sm text-status-error">{registerErrors.role.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-400 hover:bg-primary-500"
                      disabled={registerMutation.isPending || isRegisterSubmitting}
                    >
                      {registerMutation.isPending || isRegisterSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>Create account</>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-sm text-center text-umber-600">
                By signing in or creating an account, you agree to our
                <Link href="/terms" className="text-primary-500 hover:text-primary-600 mx-1">
                  Terms of Service
                </Link>
                and
                <Link href="/privacy" className="text-primary-500 hover:text-primary-600 ml-1">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-400 to-primary-600 flex-col justify-center items-center p-8 text-white">
        <div className="max-w-md">
          <BookOpen className="h-16 w-16 mb-6" />
          <h1 className="text-4xl font-bold mb-4">AfriLearn Learning Management System</h1>
          <p className="text-lg mb-8">
            Access quality education, connect with instructors, and enhance your learning experience with a platform designed for African educational excellence.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Personalized Learning</h3>
                <p className="text-white/80">Tailor your education journey to your specific needs and pace</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interactive Content</h3>
                <p className="text-white/80">Engage with dynamic multimedia resources and collaborative tools</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">African-Focused Curriculum</h3>
                <p className="text-white/80">Explore content that celebrates and represents African knowledge systems</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex">
            <Button variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white">
              Learn more about AfriLearn
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}