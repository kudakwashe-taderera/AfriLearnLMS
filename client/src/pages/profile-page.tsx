import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone,
  Building,
  MapPin,
  Globe,
  Book,
  GraduationCap,
  Briefcase,
  Clock,
  ShieldCheck,
  Save,
  Upload,
  Edit,
  Camera,
  ChevronRight,
  MessageCircle
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

// Profile form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  institution: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  timezone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Security form schema
const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

// Notification settings schema
const notificationSettingsSchema = z.object({
  emailAnnouncements: z.boolean(),
  emailAssignments: z.boolean(),
  emailMessages: z.boolean(),
  emailGrades: z.boolean(),
  emailReminders: z.boolean(),
  pushAnnouncements: z.boolean(),
  pushAssignments: z.boolean(),
  pushMessages: z.boolean(),
  pushGrades: z.boolean(),
  pushReminders: z.boolean(),
});

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/profile`],
    enabled: !!user,
  });

  // Fetch user notification settings
  const { data: notificationSettings, isLoading: notificationsLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/notification-settings`],
    enabled: !!user,
  });

  // Fetch user activity
  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/activity`],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PATCH", `/api/users/${user?.id}/profile`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/profile`] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: SecurityFormValues) => {
      const res = await apiRequest("POST", `/api/users/${user?.id}/change-password`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: async (data: NotificationSettingsValues) => {
      const res = await apiRequest("PATCH", `/api/users/${user?.id}/notification-settings`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/notification-settings`] });
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update notification settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);
      
      const res = await apiRequest("POST", `/api/users/${user?.id}/profile-picture`, formData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/profile`] });
      setIsEditingAvatar(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile picture",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sample profile data for demo
  const sampleProfileData = {
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+123 456 7890",
    bio: "I'm a third-year student passionate about African history and cultural studies. Currently pursuing a double major in History and Anthropology with a minor in Data Science.",
    profileImage: user?.profileImage || "",
    institution: "University of Lagos",
    location: "Lagos, Nigeria",
    website: "https://johndoe-portfolio.edu",
    role: user?.role || "student",
    major: "History & Anthropology",
    graduationYear: "2025",
    department: "Department of History and Cultural Studies",
    position: "Teaching Assistant",
    timezone: "Africa/Lagos",
    joinedDate: new Date(2022, 8, 15), // September 15, 2022
    lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  };

  // Sample notification settings for demo
  const sampleNotificationSettings = {
    emailAnnouncements: true,
    emailAssignments: true,
    emailMessages: true,
    emailGrades: true,
    emailReminders: false,
    pushAnnouncements: true,
    pushAssignments: true, 
    pushMessages: true,
    pushGrades: true,
    pushReminders: true,
  };

  // Sample user activity for demo
  const sampleUserActivity = [
    {
      id: "1",
      type: "assignment",
      title: "Data Analysis Project Submitted",
      course: "Data Science Fundamentals",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "2",
      type: "course",
      title: "Enrolled in African Literature",
      course: "African Literature",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    {
      id: "3",
      type: "grade",
      title: "Received grade for Midterm Essay",
      course: "Introduction to African History",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    },
    {
      id: "4",
      type: "discussion",
      title: "Posted in Cultural Dynamics Discussion",
      course: "Introduction to African History",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    },
    {
      id: "5",
      type: "profile",
      title: "Updated profile information",
      course: "",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    }
  ];

  // Use real data if available, otherwise use sample data
  const displayedProfileData = profileData || sampleProfileData;
  const displayedNotificationSettings = notificationSettings || sampleNotificationSettings;
  const displayedUserActivity = userActivity || sampleUserActivity;

  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: displayedProfileData.firstName,
      lastName: displayedProfileData.lastName,
      email: displayedProfileData.email,
      phone: displayedProfileData.phone,
      bio: displayedProfileData.bio,
      institution: displayedProfileData.institution,
      location: displayedProfileData.location,
      website: displayedProfileData.website,
      major: displayedProfileData.major,
      graduationYear: displayedProfileData.graduationYear,
      department: displayedProfileData.department,
      position: displayedProfileData.position,
      timezone: displayedProfileData.timezone,
    },
  });

  // Security form setup
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification settings form setup
  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: displayedNotificationSettings,
  });

  // Form submission handlers
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onSecuritySubmit = (data: SecurityFormValues) => {
    updatePasswordMutation.mutate(data);
  };

  const onNotificationSubmit = (data: NotificationSettingsValues) => {
    updateNotificationSettingsMutation.mutate(data);
  };

  // Handle profile image changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePicture = () => {
    if (profileImageFile) {
      updateProfilePictureMutation.mutate(profileImageFile);
    }
  };

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format relative time function
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) {
          return "Yesterday";
        } else if (diffDays < 7) {
          return `${diffDays} days ago`;
        } else if (diffDays < 30) {
          return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        } else {
          return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        }
      }
    }
  };

  // Get initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Book className="h-4 w-4 text-primary-400" />;
      case "course":
        return <GraduationCap className="h-4 w-4 text-secondary-400" />;
      case "grade":
        return <GraduationCap className="h-4 w-4 text-accent-400" />;
      case "discussion":
        return <MessageCircle className="h-4 w-4 text-status-success" />;
      case "profile":
        return <User className="h-4 w-4 text-status-info" />;
      default:
        return <Clock className="h-4 w-4 text-umber-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
                My Profile
              </h1>
              <p className="text-sm text-umber-700">
                Manage your account details and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                      {profileImagePreview ? (
                        <AvatarImage src={profileImagePreview} />
                      ) : (
                        <>
                          <AvatarImage src={displayedProfileData.profileImage} />
                          <AvatarFallback className="text-2xl bg-primary-100 text-primary-500">
                            {getInitials(displayedProfileData.firstName, displayedProfileData.lastName)}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    {isEditingAvatar ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full h-32 w-32 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            id="profile-picture"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <label 
                            htmlFor="profile-picture" 
                            className="cursor-pointer flex flex-col items-center justify-center text-white"
                          >
                            <Camera className="h-8 w-8 mb-1" />
                            <span className="text-xs">Select Photo</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="absolute bottom-0 right-0 h-8 w-8 p-0 bg-primary-400 hover:bg-primary-500 text-white rounded-full"
                        onClick={() => setIsEditingAvatar(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingAvatar && (
                    <div className="flex gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setIsEditingAvatar(false);
                          setProfileImageFile(null);
                          setProfileImagePreview(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-primary-400 hover:bg-primary-500 text-white"
                        size="sm"
                        disabled={!profileImageFile || updateProfilePictureMutation.isPending}
                        onClick={handleUpdateProfilePicture}
                      >
                        {updateProfilePictureMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-umber-900 mb-1">{`${displayedProfileData.firstName} ${displayedProfileData.lastName}`}</h2>
                  <div className="flex items-center mb-3">
                    <Badge className="capitalize">
                      {displayedProfileData.role}
                    </Badge>
                  </div>
                  
                  <div className="text-center mb-4">
                    {displayedProfileData.bio && (
                      <p className="text-sm text-umber-700">{displayedProfileData.bio}</p>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-umber-500" />
                      <div>
                        <Label className="text-xs text-umber-500">Email</Label>
                        <p className="text-sm text-umber-800">{displayedProfileData.email}</p>
                      </div>
                    </div>
                    {displayedProfileData.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-umber-500" />
                        <div>
                          <Label className="text-xs text-umber-500">Phone</Label>
                          <p className="text-sm text-umber-800">{displayedProfileData.phone}</p>
                        </div>
                      </div>
                    )}
                    {displayedProfileData.institution && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-3 text-umber-500" />
                        <div>
                          <Label className="text-xs text-umber-500">Institution</Label>
                          <p className="text-sm text-umber-800">{displayedProfileData.institution}</p>
                        </div>
                      </div>
                    )}
                    {displayedProfileData.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-3 text-umber-500" />
                        <div>
                          <Label className="text-xs text-umber-500">Location</Label>
                          <p className="text-sm text-umber-800">{displayedProfileData.location}</p>
                        </div>
                      </div>
                    )}
                    {displayedProfileData.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-3 text-umber-500" />
                        <div>
                          <Label className="text-xs text-umber-500">Website</Label>
                          <a 
                            href={displayedProfileData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-500 hover:underline"
                          >
                            {displayedProfileData.website.replace(/(^\w+:|^)\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-2">
                    <p className="text-xs text-umber-500">Joined {formatDate(displayedProfileData.joinedDate)}</p>
                    <p className="text-xs text-umber-500">Last active {formatRelativeTime(displayedProfileData.lastActive)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Profile Settings */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="profile">
                  <Card>
                    <CardHeader className="pb-3">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="profile">Personal Info</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    
                    {/* Profile Tab */}
                    <TabsContent value="profile" className="p-0">
                      <CardContent className="p-6">
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={profileForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number (Optional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Tell us a bit about yourself"
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Briefly describe yourself, your interests, or your academic focus.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="institution"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Institution</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Your university or organization"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={profileForm.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="City, Country"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website (Optional)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="https://yourwebsite.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium text-umber-800 mb-4">
                                {displayedProfileData.role === "student" ? "Student Information" : "Faculty Information"}
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayedProfileData.role === "student" ? (
                                  <>
                                    <FormField
                                      control={profileForm.control}
                                      name="major"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Major/Program</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={profileForm.control}
                                      name="graduationYear"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Expected Graduation Year</FormLabel>
                                          <FormControl>
                                            <Select 
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select year" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                                  <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <FormField
                                      control={profileForm.control}
                                      name="department"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Department</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={profileForm.control}
                                      name="position"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Position/Title</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </>
                                )}
                              </div>
                              
                              <div className="mt-4">
                                <FormField
                                  control={profileForm.control}
                                  name="timezone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Timezone</FormLabel>
                                      <FormControl>
                                        <Select 
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Africa/Lagos">Africa/Lagos (GMT+1)</SelectItem>
                                            <SelectItem value="Africa/Cairo">Africa/Cairo (GMT+2)</SelectItem>
                                            <SelectItem value="Africa/Nairobi">Africa/Nairobi (GMT+3)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">America/Los_Angeles (GMT-8)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormDescription>
                                        Your timezone is used for scheduling and due date calculations.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button
                                type="submit"
                                className="bg-primary-400 hover:bg-primary-500 text-white"
                                disabled={updateProfileMutation.isPending}
                              >
                                {updateProfileMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </TabsContent>
                    
                    {/* Security Tab */}
                    <TabsContent value="security" className="p-0">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-umber-800 mb-4">Password</h3>
                        <Form {...securityForm}>
                          <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                            <FormField
                              control={securityForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={securityForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Password must be at least 8 characters with uppercase, lowercase, and a number.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={securityForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="pt-2 flex justify-end">
                              <Button
                                type="submit"
                                className="bg-primary-400 hover:bg-primary-500 text-white"
                                disabled={updatePasswordMutation.isPending}
                              >
                                {updatePasswordMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Update Password
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                        
                        <Separator className="my-6" />
                        
                        <div>
                          <h3 className="text-lg font-medium text-umber-800 mb-4">Login Activity</h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-umber-800">Last login</p>
                                    <p className="text-xs text-umber-600">{formatRelativeTime(displayedProfileData.lastActive)}</p>
                                  </div>
                                  <Badge variant="outline">Lagos, Nigeria</Badge>
                                </div>
                                <div>
                                  <Button variant="link" className="text-primary-400 p-0 h-auto text-sm">
                                    View login history
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </TabsContent>
                    
                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="p-0">
                      <CardContent className="p-6">
                        <Form {...notificationForm}>
                          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium text-umber-800 mb-4">Email Notifications</h3>
                              <div className="space-y-4">
                                <FormField
                                  control={notificationForm.control}
                                  name="emailAnnouncements"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Announcements</FormLabel>
                                        <FormDescription>
                                          Receive emails about course announcements
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="emailAssignments"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Assignments</FormLabel>
                                        <FormDescription>
                                          Receive emails about new assignments and due dates
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="emailMessages"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Messages</FormLabel>
                                        <FormDescription>
                                          Receive emails about new messages
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="emailGrades"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Grades</FormLabel>
                                        <FormDescription>
                                          Receive emails when grades are posted
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="emailReminders"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Reminders</FormLabel>
                                        <FormDescription>
                                          Receive email reminders about upcoming deadlines
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium text-umber-800 mb-4">Push Notifications</h3>
                              <div className="space-y-4">
                                <FormField
                                  control={notificationForm.control}
                                  name="pushAnnouncements"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Announcements</FormLabel>
                                        <FormDescription>
                                          Receive push notifications about course announcements
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="pushAssignments"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Assignments</FormLabel>
                                        <FormDescription>
                                          Receive push notifications about new assignments and due dates
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="pushMessages"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Messages</FormLabel>
                                        <FormDescription>
                                          Receive push notifications about new messages
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="pushGrades"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Grades</FormLabel>
                                        <FormDescription>
                                          Receive push notifications when grades are posted
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={notificationForm.control}
                                  name="pushReminders"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Reminders</FormLabel>
                                        <FormDescription>
                                          Receive push reminders about upcoming deadlines
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button
                                type="submit"
                                className="bg-primary-400 hover:bg-primary-500 text-white"
                                disabled={updateNotificationSettingsMutation.isPending}
                              >
                                {updateNotificationSettingsMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Preferences
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </TabsContent>
                  </Card>
                </Tabs>
                
                {/* Recent Activity Card */}
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                      </div>
                    ) : displayedUserActivity.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto text-umber-300 mb-3" />
                        <h3 className="text-lg font-medium text-umber-800 mb-1">No activity yet</h3>
                        <p className="text-umber-600">Your recent actions will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayedUserActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-umber-800">{activity.title}</p>
                              {activity.course && (
                                <p className="text-xs text-umber-600">{activity.course}</p>
                              )}
                              <p className="text-xs text-umber-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-6">
                    <Button variant="outline" size="sm">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Using the shadcn Textarea component from ui folder