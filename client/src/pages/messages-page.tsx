import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  Plus, 
  Search, 
  Send, 
  ChevronRight,
  MoreVertical,
  Trash2,
  Archive,
  Flag,
  User,
  Users,
  MessageCircle,
  ChevronDown
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");

  // Fetch user's conversations (grouped messages)
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: [`/api/messages/${activeTab}`],
    enabled: !!user,
  });

  // Fetch conversation messages when a conversation is selected
  const { data: conversationMessages, isLoading: messagesLoading } = useQuery({
    queryKey: [`/api/conversations/${selectedConversation}`],
    enabled: !!selectedConversation,
  });

  // Fetch potential recipients for new messages
  const { data: potentialRecipients, isLoading: recipientsLoading } = useQuery({
    queryKey: ["/api/users/message-recipients"],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { recipients: string[], subject: string, content: string }) => {
      const res = await apiRequest("POST", "/api/messages", messageData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${activeTab}`] });
      setIsComposing(false);
      setRecipients([]);
      setSubject("");
      setMessageContent("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reply to conversation mutation
  const replyToConversationMutation = useMutation({
    mutationFn: async (data: { conversationId: string, content: string }) => {
      const res = await apiRequest("POST", `/api/conversations/${data.conversationId}/reply`, { content: data.content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${selectedConversation}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${activeTab}`] });
      setNewReply("");
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiRequest("DELETE", `/api/conversations/${conversationId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${activeTab}`] });
      if (selectedConversation) {
        setSelectedConversation(null);
      }
      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete conversation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Archive conversation mutation
  const archiveConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/archive`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/inbox`] });
      queryClient.invalidateQueries({ queryKey: [`/api/messages/archived`] });
      if (selectedConversation && activeTab === "inbox") {
        setSelectedConversation(null);
      }
      toast({
        title: "Conversation archived",
        description: "The conversation has been moved to the archive.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to archive conversation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark conversation as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${activeTab}`] });
    },
    onError: (error: Error) => {
      console.error("Failed to mark conversation as read:", error);
    },
  });

  // Handlers
  const handleSendMessage = () => {
    if (recipients.length > 0 && subject && messageContent) {
      sendMessageMutation.mutate({
        recipients,
        subject,
        content: messageContent
      });
    } else {
      toast({
        title: "Cannot send message",
        description: "Please fill in all required fields: recipients, subject, and message content.",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = () => {
    if (selectedConversation && newReply.trim()) {
      replyToConversationMutation.mutate({
        conversationId: selectedConversation,
        content: newReply
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark as read when selecting
    if (conversationId) {
      markAsReadMutation.mutate(conversationId);
    }
  };

  // Sample data for demo
  // Sample potential recipients
  const sampleRecipients = [
    { id: "1", name: "Dr. Kofi Annan", role: "instructor" },
    { id: "2", name: "Fatima Nkosi", role: "student" },
    { id: "3", name: "John Okafor", role: "student" },
    { id: "4", name: "Prof. Amina Diop", role: "instructor" },
    { id: "5", name: "Ahmed Zewail", role: "student" },
    { id: "6", name: "Admin Support", role: "admin" },
  ];

  // Sample conversations
  const sampleConversations = [
    {
      id: "1",
      subject: "Question about Final Project Requirements",
      participants: [
        { id: "1", name: "Dr. Kofi Annan", role: "instructor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" }
      ],
      lastMessage: {
        content: "Thank you for the clarification about the project requirements. I'll make sure to follow the guidelines.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        senderId: user?.id,
        senderName: `${user?.firstName} ${user?.lastName}`
      },
      unread: false,
      messageCount: 4
    },
    {
      id: "2",
      subject: "Group Assignment Coordination",
      participants: [
        { id: "2", name: "Fatima Nkosi", role: "student", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { id: "3", name: "John Okafor", role: "student", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" }
      ],
      lastMessage: {
        content: "Can we meet tomorrow at 3pm in the library to discuss our group project approach?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        senderId: "2",
        senderName: "Fatima Nkosi"
      },
      unread: true,
      messageCount: 6
    },
    {
      id: "3",
      subject: "Extension Request for Assignment Submission",
      participants: [
        { id: "4", name: "Prof. Amina Diop", role: "instructor", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" }
      ],
      lastMessage: {
        content: "I've reviewed your request and can grant a 48-hour extension given the circumstances. Please submit by Wednesday.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        senderId: "4",
        senderName: "Prof. Amina Diop"
      },
      unread: true,
      messageCount: 3
    },
    {
      id: "4",
      subject: "Additional Resources for Week 5",
      participants: [
        { id: "1", name: "Dr. Kofi Annan", role: "instructor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" }
      ],
      lastMessage: {
        content: "I've shared some additional readings and video resources for week 5 topics. Let me know if you find them helpful.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        senderId: "1",
        senderName: "Dr. Kofi Annan"
      },
      unread: false,
      messageCount: 2
    },
    {
      id: "5",
      subject: "Lab Session Rescheduled",
      participants: [
        { id: "6", name: "Admin Support", role: "admin", avatar: "" }
      ],
      lastMessage: {
        content: "This is an automated notification. The Physics lab session scheduled for Friday has been rescheduled to Monday next week due to facility maintenance.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        senderId: "6",
        senderName: "Admin Support"
      },
      unread: false,
      messageCount: 1
    }
  ];

  // Sample conversation messages
  const sampleConversationMessages = [
    {
      id: "1",
      conversationId: "1",
      content: "Hello Dr. Annan, I'm working on the final project for African History and I have a question about the requirements. The guidelines mention primary sources, but I'm not sure if digital archives count as primary sources for this assignment?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      senderId: user?.id,
      senderName: `${user?.firstName} ${user?.lastName}`,
      senderAvatar: user?.profileImage || ""
    },
    {
      id: "2",
      conversationId: "1",
      content: "Good question. Yes, digital archives of original documents, photographs, recordings, or manuscripts would count as primary sources. However, digital encyclopedia entries or modern scholarly articles about historical events would be secondary sources.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      senderId: "1",
      senderName: "Dr. Kofi Annan",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "3",
      conversationId: "1",
      content: "That's very helpful, thank you! So if I'm using the digital archives from the National Museum collection that contain colonial-era documents, those would be acceptable as primary sources?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      senderId: user?.id,
      senderName: `${user?.firstName} ${user?.lastName}`,
      senderAvatar: user?.profileImage || ""
    },
    {
      id: "4",
      conversationId: "1",
      content: "Exactly. Those would be excellent primary sources for your project. Just make sure to properly cite them, indicating both the original source and the digital archive where you accessed them.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      senderId: "1",
      senderName: "Dr. Kofi Annan",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "5",
      conversationId: "1",
      content: "Thank you for the clarification about the project requirements. I'll make sure to follow the guidelines.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      senderId: user?.id,
      senderName: `${user?.firstName} ${user?.lastName}`,
      senderAvatar: user?.profileImage || ""
    }
  ];

  // Use real data if available, otherwise use sample data
  const displayedConversations = 
    activeTab === "inbox" 
      ? conversations || sampleConversations
      : conversations || [];
  
  const displayedMessages = conversationMessages || 
    (selectedConversation 
      ? sampleConversationMessages.filter(m => m.conversationId === selectedConversation)
      : []);
  
  const displayedRecipients = potentialRecipients || sampleRecipients;

  // Filter conversations by search query
  const filteredConversations = displayedConversations.filter(conversation => 
    conversation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time function
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get participant names for conversation display
  const getParticipantNames = (participants) => {
    return participants.map(p => p.name).join(", ");
  };

  // Get conversation title for header
  const getConversationTitle = () => {
    const conversation = displayedConversations.find(c => c.id === selectedConversation);
    return conversation ? conversation.subject : "";
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-sans text-umber-900 mb-1">
                Messages
              </h1>
              <p className="text-sm text-umber-700">
                Communicate with instructors and fellow students
              </p>
            </div>
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                  <DialogDescription>
                    Compose a new message to instructors or students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select>
                      <SelectTrigger id="recipients">
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientsLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading...
                          </div>
                        ) : (
                          displayedRecipients.map(recipient => (
                            <SelectItem 
                              key={recipient.id} 
                              value={recipient.id}
                              onSelect={() => {
                                if (!recipients.includes(recipient.id)) {
                                  setRecipients([...recipients, recipient.id]);
                                }
                              }}
                            >
                              <div className="flex items-center">
                                <span>{recipient.name}</span>
                                <Badge className="ml-2 text-xs" variant="outline">
                                  {recipient.role}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {recipients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recipients.map(id => {
                          const recipient = displayedRecipients.find(r => r.id === id);
                          return recipient ? (
                            <Badge 
                              key={id} 
                              variant="secondary"
                              className="pl-2 pr-1 py-1 flex items-center gap-1"
                            >
                              {recipient.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-secondary-200"
                                onClick={() => setRecipients(recipients.filter(r => r !== id))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Message subject" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Write your message here..." 
                      className="min-h-[200px]"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || recipients.length === 0 || !subject || !messageContent}
                  >
                    {sendMessageMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div>
              <Card className="h-[calc(100vh-240px)] flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Messages</CardTitle>
                  </div>
                </CardHeader>
                <div className="px-4 pb-2">
                  <Tabs defaultValue="inbox" onValueChange={(v) => setActiveTab(v)}>
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="inbox">Inbox</TabsTrigger>
                      <TabsTrigger value="sent">Sent</TabsTrigger>
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="p-4 border-b">
                  <div className="relative">
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-umber-500 h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversationsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                      <MessageCircle className="h-12 w-12 text-umber-300 mb-4" />
                      <h3 className="text-lg font-semibold text-umber-800 mb-2">No messages found</h3>
                      <p className="text-umber-600 mb-6">
                        {searchQuery ? 
                          "No messages match your search." :
                          activeTab === "inbox" ?
                            "Your inbox is empty." :
                            activeTab === "sent" ?
                              "You haven't sent any messages yet." :
                              "You don't have any archived messages."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredConversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={cn(
                            "border-b last:border-b-0 p-4 hover:bg-neutral-50 cursor-pointer transition-colors",
                            selectedConversation === conversation.id ? "bg-primary-50" : "",
                            conversation.unread ? "bg-neutral-50" : ""
                          )}
                          onClick={() => handleSelectConversation(conversation.id)}
                        >
                          <div className="flex items-start gap-3">
                            {conversation.participants.length === 1 ? (
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={conversation.participants[0].avatar} />
                                <AvatarFallback className="bg-neutral-200 text-umber-700">
                                  {getInitials(conversation.participants[0].name)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center bg-primary-50 rounded-full">
                                <Users className="h-5 w-5 text-primary-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className={`font-semibold text-umber-900 truncate max-w-[180px] ${conversation.unread ? 'font-bold' : ''}`}>
                                  {conversation.subject}
                                </h4>
                                <span className="text-xs text-umber-600 whitespace-nowrap ml-2">
                                  {formatMessageTime(new Date(conversation.lastMessage.timestamp))}
                                </span>
                              </div>
                              <p className="text-xs text-umber-700 truncate">
                                {getParticipantNames(conversation.participants)}
                              </p>
                              <p className="text-xs text-umber-600 truncate mt-1">
                                <span className="font-medium">{conversation.lastMessage.senderName.split(' ')[0]}:</span> {conversation.lastMessage.content}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-umber-600">
                                  {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                                </span>
                                {conversation.unread && (
                                  <Badge className="bg-primary-400">New</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <CardFooter className="pt-4 pb-4 border-t justify-between">
                  <div className="text-xs text-umber-600">
                    {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsComposing(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New Message
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Conversation Detail */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-[calc(100vh-240px)] flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{getConversationTitle()}</CardTitle>
                        <CardDescription>
                          {getParticipantNames(
                            displayedConversations.find(c => c.id === selectedConversation)?.participants || []
                          )}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {activeTab === "inbox" && (
                            <DropdownMenuItem
                              onClick={() => archiveConversationMutation.mutate(selectedConversation)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Reported",
                                description: "This conversation has been reported.",
                              });
                            }}
                          >
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteConversationMutation.mutate(selectedConversation)}
                            className="text-status-error"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    {messagesLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {displayedMessages.map((message) => {
                          const isOwnMessage = message.senderId === user?.id;
                          return (
                            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex items-start gap-3 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-8 h-8 mt-1">
                                  <AvatarImage src={message.senderAvatar} />
                                  <AvatarFallback className="bg-neutral-200 text-umber-700">
                                    {getInitials(message.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "rounded-lg p-3 min-w-[140px]",
                                  isOwnMessage 
                                    ? "bg-primary-400 text-white" 
                                    : "bg-neutral-200 text-umber-800"
                                )}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs font-medium ${isOwnMessage ? 'text-primary-100' : 'text-umber-600'}`}>
                                      {message.senderName}
                                    </span>
                                    <span className={`text-xs ${isOwnMessage ? 'text-primary-100' : 'text-umber-600'}`}>
                                      {formatMessageTime(new Date(message.timestamp))}
                                    </span>
                                  </div>
                                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <CardFooter className="p-4 border-t">
                    <div className="flex items-center w-full space-x-2">
                      <Textarea
                        placeholder="Type your reply..."
                        className="flex-1 min-h-[80px]"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      />
                      <Button
                        className="bg-primary-400 hover:bg-primary-500 text-white"
                        onClick={handleSendReply}
                        disabled={replyToConversationMutation.isPending || !newReply.trim()}
                      >
                        {replyToConversationMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="h-[calc(100vh-240px)] flex flex-col justify-center items-center p-6">
                  <div className="text-center max-w-md">
                    <MessageCircle className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-umber-800 mb-2">No Conversation Selected</h3>
                    <p className="text-umber-600 mb-6">
                      {filteredConversations.length > 0 
                        ? "Select a conversation from the list to view messages" 
                        : "You don't have any messages yet"}
                    </p>
                    <Button 
                      className="bg-primary-400 hover:bg-primary-500 text-white"
                      onClick={() => setIsComposing(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Compose New Message
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Textarea component with styles
const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};