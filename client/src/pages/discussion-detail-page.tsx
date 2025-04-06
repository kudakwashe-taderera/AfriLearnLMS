import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link, useParams } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ArrowLeft, 
  MessageCircle, 
  ThumbsUp, 
  Flag, 
  Share,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  BookOpen
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newReply, setNewReply] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  // Fetch discussion details
  const { data: discussion, isLoading: discussionLoading } = useQuery({
    queryKey: [`/api/discussions/${id}`],
    enabled: !!id,
  });

  // Fetch discussion replies
  const { data: replies, isLoading: repliesLoading } = useQuery({
    queryKey: [`/api/discussions/${id}/replies`],
    enabled: !!id,
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/discussions/${id}/replies`, { content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${id}/replies`] });
      setNewReply("");
      setShowReplyForm(false);
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Like/unlike discussion mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (discussionId: string) => {
      const res = await apiRequest("POST", `/api/discussions/${discussionId}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to like/unlike",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Like/unlike reply mutation
  const toggleReplyLikeMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const res = await apiRequest("POST", `/api/discussions/replies/${replyId}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${id}/replies`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to like/unlike reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Report discussion mutation
  const reportDiscussionMutation = useMutation({
    mutationFn: async (discussionId: string) => {
      const res = await apiRequest("POST", `/api/discussions/${discussionId}/report`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Your report has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler to post a new reply
  const handlePostReply = () => {
    if (newReply.trim()) {
      createReplyMutation.mutate(newReply);
    }
  };

  // Toggle reply visibility
  const toggleReplyVisibility = (replyId: string) => {
    if (expandedReplies.includes(replyId)) {
      setExpandedReplies(expandedReplies.filter(id => id !== replyId));
    } else {
      setExpandedReplies([...expandedReplies, replyId]);
    }
  };

  // Sample discussion data for demo
  const sampleDiscussion = {
    id: "1",
    title: "Understanding Cultural Dynamics in West Africa",
    content: "I'm trying to better understand the cultural interactions between different ethnic groups in West Africa during the 16th century. Specifically, I'm interested in how trade networks influenced cultural exchange and the development of shared practices.\n\nCan anyone recommend specific readings or resources that cover this topic in depth? I've already read the course textbook chapter on this period, but I'm looking for more specialized sources.\n\nAlso, if anyone has insights on how to approach this topic for my final research paper, I'd greatly appreciate the guidance!",
    courseId: "1",
    courseName: "Introduction to African History",
    authorId: "1",
    authorName: "Fatima Nkosi",
    authorRole: "student",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    views: 28,
    likes: 5,
    isLikedByUser: false,
    isSticky: false,
    tags: ["cultural studies", "history", "west africa"],
  };

  // Sample replies for demo
  const sampleReplies = [
    {
      id: "1",
      discussionId: "1",
      content: "I'd recommend checking out 'Networks of Trade, Networks of Meaning: Interactions in the West African Past' by Ogundiran and Falola. It provides an excellent analysis of how trade networks shaped cultural exchanges across the region during that period.",
      authorId: "2",
      authorName: "Dr. Kofi Annan",
      authorRole: "instructor",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      likes: 3,
      isLikedByUser: true,
      isInstructorResponse: true,
      replies: [
        {
          id: "6",
          content: "Thank you so much, Dr. Annan! I'll definitely look into that book. Is it available in our library?",
          authorId: "1",
          authorName: "Fatima Nkosi",
          authorRole: "student",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
          likes: 0,
          isLikedByUser: false,
        }
      ]
    },
    {
      id: "2",
      discussionId: "1",
      content: "For your research paper, I would suggest focusing on a specific trade network or commodity (like gold or salt) and examining how it created cultural connections. This approach will help you keep the scope manageable while still addressing the broader theme of cultural exchange.",
      authorId: "3",
      authorName: "John Okafor",
      authorRole: "student",
      authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      likes: 2,
      isLikedByUser: false,
      isInstructorResponse: false,
      replies: []
    },
    {
      id: "3",
      discussionId: "1",
      content: "I found this journal article really helpful for a similar topic: 'The Crossroads of Culture: Cultural Interaction in West African Trading Cities, 1450-1700' by Amanda Jensen in the Journal of African Historical Studies (Vol. 42, Issue 3). It specifically looks at how urban centers became cultural melting pots through trade.",
      authorId: "4",
      authorName: "Amina Diallo",
      authorRole: "student",
      authorAvatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      likes: 1,
      isLikedByUser: false,
      isInstructorResponse: false,
      replies: []
    },
    {
      id: "4",
      discussionId: "1",
      content: "Don't forget to look at the linguistic evidence too! The spread of trade languages and loanwords can tell us a lot about cultural exchange. The book 'Language, Trade and History in West Africa' by P.E.H. Hair might be useful for this aspect.",
      authorId: "5",
      authorName: "Kwame Mensah",
      authorRole: "student",
      authorAvatar: "",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      likes: 0,
      isLikedByUser: false,
      isInstructorResponse: false,
      replies: []
    },
    {
      id: "5",
      discussionId: "1",
      content: "I'd also recommend looking at primary sources if possible. The accounts of early European traders and explorers, while biased, can provide interesting perspectives on cultural interactions. The library has some translated collections that might be useful.",
      authorId: "2",
      authorName: "Dr. Kofi Annan",
      authorRole: "instructor",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      likes: 4,
      isLikedByUser: false,
      isInstructorResponse: true,
      replies: []
    }
  ];

  // Use real data if available, otherwise use sample data
  const displayedDiscussion = discussion || sampleDiscussion;
  const displayedReplies = replies || sampleReplies;

  // Format date function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  };

  if (discussionLoading || repliesLoading) {
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
          <div className="max-w-5xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link href="/discussions">
                <Button variant="ghost" className="px-0 text-primary-400 hover:text-primary-500">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Discussions
                </Button>
              </Link>
            </div>

            {/* Discussion Thread */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-500 hover:bg-primary-100"
                  >
                    <Link href={`/courses/${displayedDiscussion.courseId}`}>
                      <span className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {displayedDiscussion.courseName}
                      </span>
                    </Link>
                  </Badge>
                  {displayedDiscussion.isSticky && (
                    <Badge variant="outline" className="border-status-error text-status-error text-xs">
                      Pinned
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-umber-900">
                  {displayedDiscussion.title}
                </CardTitle>
                <div className="flex items-center mt-2">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={displayedDiscussion.authorAvatar} />
                    <AvatarFallback className="bg-neutral-200 text-umber-700">
                      {getInitials(displayedDiscussion.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-umber-900">{displayedDiscussion.authorName}</span>
                      <Badge 
                        variant="outline" 
                        className="ml-2 px-1.5 py-0 text-xs border-primary-200 text-primary-500 bg-primary-50"
                      >
                        {displayedDiscussion.authorRole.charAt(0).toUpperCase() + displayedDiscussion.authorRole.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-umber-600">
                      Posted on {formatDate(new Date(displayedDiscussion.createdAt))}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="prose prose-umber max-w-none">
                  {displayedDiscussion.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-umber-800">{paragraph}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-4">
                  {displayedDiscussion.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-2 py-0.5 text-xs bg-neutral-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center border-t border-neutral-200">
                <div className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center gap-1 px-2 ${
                      displayedDiscussion.isLikedByUser ? 'text-primary-500' : 'text-umber-600'
                    }`}
                    onClick={() => toggleLikeMutation.mutate(displayedDiscussion.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{displayedDiscussion.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 px-2 text-umber-600"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 px-2 text-umber-600"
                    onClick={() => {
                      // In a real app, implement share functionality
                      toast({
                        title: "Link copied",
                        description: "Discussion link copied to clipboard",
                      });
                    }}
                  >
                    <Share className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 px-2 text-umber-600"
                    onClick={() => reportDiscussionMutation.mutate(displayedDiscussion.id)}
                  >
                    <Flag className="h-4 w-4" />
                    <span className="hidden sm:inline">Report</span>
                  </Button>
                  {user?.id === displayedDiscussion.authorId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center text-status-error">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Reply Form */}
            {showReplyForm && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Post a Reply</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <Textarea
                    placeholder="Write your reply here..."
                    className="min-h-[150px]"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowReplyForm(false);
                      setNewReply("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    onClick={handlePostReply}
                    disabled={createReplyMutation.isPending || !newReply.trim()}
                  >
                    {createReplyMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Post Reply
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Replies */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-umber-900 mb-4">
                Replies ({displayedReplies.length})
              </h2>

              {displayedReplies.map((reply) => (
                <Card key={reply.id} className={`${reply.isInstructorResponse ? 'border-l-4 border-l-primary-400' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={reply.authorAvatar} />
                        <AvatarFallback className="bg-neutral-200 text-umber-700">
                          {getInitials(reply.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-umber-900">{reply.authorName}</span>
                          <Badge 
                            variant="outline" 
                            className="ml-2 px-1.5 py-0 text-xs border-primary-200 text-primary-500 bg-primary-50"
                          >
                            {reply.authorRole.charAt(0).toUpperCase() + reply.authorRole.slice(1)}
                          </Badge>
                          {reply.isInstructorResponse && (
                            <Badge className="ml-2 px-1.5 py-0 text-xs bg-primary-400 text-white">
                              Instructor
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-umber-600 mb-2">
                          Posted on {formatDate(new Date(reply.createdAt))}
                        </p>
                        <div className="prose prose-umber max-w-none mb-3">
                          <p className="text-umber-800">{reply.content}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`flex items-center gap-1 px-2 ${
                                reply.isLikedByUser ? 'text-primary-500' : 'text-umber-600'
                              }`}
                              onClick={() => toggleReplyLikeMutation.mutate(reply.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{reply.likes}</span>
                            </Button>
                            {reply.replies && reply.replies.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 px-2 text-umber-600"
                                onClick={() => toggleReplyVisibility(reply.id)}
                              >
                                {expandedReplies.includes(reply.id) ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Hide {reply.replies.length} {reply.replies.length === 1 ? 'reply' : 'replies'}</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span>Show {reply.replies.length} {reply.replies.length === 1 ? 'reply' : 'replies'}</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 px-2 text-umber-600"
                              onClick={() => {
                                setShowReplyForm(true);
                                setNewReply(`@${reply.authorName} `);
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span className="hidden sm:inline">Reply</span>
                            </Button>
                            {user?.id === reply.authorId && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="px-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center">
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex items-center text-status-error">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                        
                        {/* Nested replies */}
                        {reply.replies && reply.replies.length > 0 && expandedReplies.includes(reply.id) && (
                          <div className="mt-4 pl-4 border-l-2 border-neutral-200">
                            {reply.replies.map((nestedReply) => (
                              <div key={nestedReply.id} className="mb-4 last:mb-0">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={nestedReply.authorAvatar} />
                                    <AvatarFallback className="bg-neutral-200 text-umber-700 text-xs">
                                      {getInitials(nestedReply.authorName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <span className="font-medium text-umber-900">{nestedReply.authorName}</span>
                                      <Badge 
                                        variant="outline" 
                                        className="ml-2 px-1.5 py-0 text-xs border-primary-200 text-primary-500 bg-primary-50"
                                      >
                                        {nestedReply.authorRole.charAt(0).toUpperCase() + nestedReply.authorRole.slice(1)}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-umber-600 mb-2">
                                      Posted on {formatDate(new Date(nestedReply.createdAt))}
                                    </p>
                                    <div className="prose prose-umber max-w-none mb-2">
                                      <p className="text-umber-800 text-sm">{nestedReply.content}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={`flex items-center gap-1 px-2 text-sm ${
                                          nestedReply.isLikedByUser ? 'text-primary-500' : 'text-umber-600'
                                        }`}
                                        onClick={() => toggleReplyLikeMutation.mutate(nestedReply.id)}
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                        <span>{nestedReply.likes}</span>
                                      </Button>
                                      {user?.id === nestedReply.authorId && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="px-2 h-7">
                                              <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="flex items-center">
                                              <Edit className="h-4 w-4 mr-2" />
                                              <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="flex items-center text-status-error">
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              <span>Delete</span>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {displayedReplies.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageCircle className="h-12 w-12 text-umber-300 mb-4" />
                    <h3 className="text-lg font-semibold text-umber-800 mb-2">No replies yet</h3>
                    <p className="text-umber-600 mb-6 text-center max-w-md">
                      Be the first to reply to this discussion!
                    </p>
                    <Button 
                      className="bg-primary-400 hover:bg-primary-500 text-white"
                      onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Write a Reply
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}