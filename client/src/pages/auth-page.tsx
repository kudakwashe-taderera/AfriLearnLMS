import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { BookOpen, User, Lock, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "instructor"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

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
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-4 md:p-12 bg-white">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-md bg-primary-400 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-umber-900 ml-2">AfriLearn</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input 
                        id="username" 
                        placeholder="Your username" 
                        className="pl-10"
                        {...loginForm.register("username")}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-status-error">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Your password" 
                        className="pl-10"
                        {...loginForm.register("password")}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-status-error">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary-400 hover:bg-primary-500"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Fill in your details to join AfriLearn</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="First name" 
                        {...registerForm.register("firstName")}
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-status-error">{registerForm.formState.errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Last name" 
                        {...registerForm.register("lastName")}
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-status-error">{registerForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Your email" 
                        className="pl-10"
                        {...registerForm.register("email")}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-status-error">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <div className="relative">
                      <Input 
                        id="reg-username" 
                        placeholder="Choose a username" 
                        className="pl-10"
                        {...registerForm.register("username")}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-status-error">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="Create a password" 
                        className="pl-10"
                        {...registerForm.register("password")}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-status-error">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirm your password" 
                        className="pl-10"
                        {...registerForm.register("confirmPassword")}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-umber-400" />
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-status-error">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <select 
                      id="role"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                      {...registerForm.register("role")}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                    {registerForm.formState.errors.role && (
                      <p className="text-sm text-status-error">{registerForm.formState.errors.role.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary-400 hover:bg-primary-500"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side hero */}
      <div className="hidden md:flex md:w-1/2 bg-primary-400 text-white p-12 flex-col justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6">Welcome to AfriLearn</h1>
          <p className="text-xl mb-8">
            The premier learning management system designed for African educational institutions.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Join Our Community</h3>
                <p>Connect with instructors and students from across the continent.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Access Quality Education</h3>
                <p>Dive into courses taught by leading African educators and professionals.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Secure and Reliable</h3>
                <p>Your educational journey is protected with our secure platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
