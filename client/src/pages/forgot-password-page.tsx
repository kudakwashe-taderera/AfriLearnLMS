import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetFormSchema = z.object({
  code: z.string().min(6, { message: "Please enter the verification code" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [stage, setStage] = useState<"email" | "code" | "success">("email");
  const [userEmail, setUserEmail] = useState("");

  // Form for email entry
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form for code entry and password reset
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Request password reset mutation
  const requestResetMutation = useMutation({
    mutationFn: async (data: EmailFormValues) => {
      const res = await apiRequest("POST", "/api/auth/forgot-password", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reset code sent",
        description: "Check your email for the password reset code.",
      });
      setUserEmail(emailForm.getValues().email);
      setStage("code");
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify code and reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetFormValues & { email: string }) => {
      const res = await apiRequest("POST", "/api/auth/reset-password", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });
      setStage("success");
    },
    onError: (error: Error) => {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onEmailSubmit = (data: EmailFormValues) => {
    requestResetMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetFormValues) => {
    resetPasswordMutation.mutate({
      ...data,
      email: userEmail,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md">
        <Link href="/auth" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        {stage === "email" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl text-center font-bold text-umber-900">Forgot Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email address to receive a password reset code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Enter your email address" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary-400 hover:bg-primary-500 text-white"
                    disabled={requestResetMutation.isPending}
                  >
                    {requestResetMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Reset Code...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4">
              <p className="text-sm text-center text-umber-600">
                Remember your password?{" "}
                <Link href="/auth" className="text-primary-500 hover:underline">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}

        {stage === "code" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl text-center font-bold text-umber-900">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter the code sent to <span className="font-semibold">{userEmail}</span> and create your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the 6-digit code" {...field} />
                        </FormControl>
                        <FormDescription>
                          Check your email inbox for the verification code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a new password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters with uppercase, lowercase, and a number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary-400 hover:bg-primary-500 text-white"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 pt-4 border-t text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary-500"
                  onClick={() => {
                    emailForm.reset();
                    setStage("email");
                  }}
                >
                  Try a different email address
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {stage === "success" && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary-500" />
                </div>
                <CardTitle className="text-2xl text-center font-bold text-umber-900">Password Reset Successful</CardTitle>
                <CardDescription className="text-center mt-2">
                  Your password has been reset successfully
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-umber-700 mb-6">
                You can now log in with your new password to access your account.
              </p>
              <Link href="/auth">
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-umber-500">
            Need help? <Link href="/help" className="text-primary-500 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}