import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, addMonths, subMonths } from "date-fns";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Filter,
  X,
  BookOpen,
  FileText,
  GraduationCap,
  BellRing
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

// Event types and colors
const EVENT_TYPES = [
  { id: "assignment", label: "Assignment", color: "bg-primary-400", icon: <FileText className="h-4 w-4" /> },
  { id: "lecture", label: "Lecture", color: "bg-secondary-400", icon: <BookOpen className="h-4 w-4" /> },
  { id: "exam", label: "Exam", color: "bg-status-error", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "announcement", label: "Announcement", color: "bg-accent-400", icon: <BellRing className="h-4 w-4" /> },
  { id: "deadline", label: "Deadline", color: "bg-status-warning", icon: <Clock className="h-4 w-4" /> },
];

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(
    EVENT_TYPES.map(type => type.id)
  );
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "assignment",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    courseId: "",
    description: ""
  });

  // Fetch user events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: [
      user?.role === "student" 
        ? "/api/student/events" 
        : `/api/user/${user?.id}/events`
    ],
    enabled: !!user,
  });

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: [user?.role === "student" ? "/api/student/courses" : `/api/instructor/${user?.id}/courses`],
    enabled: !!user,
  });

  // Navigation functions
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  // Toggle event type filter
  const toggleEventType = (type: string) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };

  // Handle creating a new event
  const handleCreateEvent = () => {
    console.log("Creating new event:", newEvent);
    // In a real app, we would call a mutation here
    setIsAddingEvent(false);
    setNewEvent({
      title: "",
      type: "assignment",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00",
      courseId: "",
      description: ""
    });
  };

  // Sample events data for demo
  const sampleEvents = [
    {
      id: "1",
      title: "Data Analysis Assignment Due",
      type: "assignment",
      courseId: "2",
      courseName: "Data Science Fundamentals",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15, 23, 59),
      description: "Final project submission deadline",
      color: "bg-primary-400"
    },
    {
      id: "2",
      title: "African History Lecture",
      type: "lecture",
      courseId: "1",
      courseName: "Introduction to African History",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 10, 14, 0),
      description: "Topic: Pre-colonial kingdoms of West Africa",
      color: "bg-secondary-400"
    },
    {
      id: "3",
      title: "Physics Midterm Exam",
      type: "exam",
      courseId: "4",
      courseName: "Introduction to Physics",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20, 10, 0),
      description: "Covers chapters 1-5",
      color: "bg-status-error"
    },
    {
      id: "4",
      title: "Course Materials Updated",
      type: "announcement",
      courseId: "1",
      courseName: "Introduction to African History",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 5, 9, 0),
      description: "New readings added for Week 6",
      color: "bg-accent-400"
    },
    {
      id: "5",
      title: "Business Case Study Deadline",
      type: "deadline",
      courseId: "3",
      courseName: "Business Administration",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25, 23, 59),
      description: "Group project final submission",
      color: "bg-status-warning"
    },
    {
      id: "6",
      title: "Cultural Analysis Presentation",
      type: "assignment",
      courseId: "5",
      courseName: "Cultural Anthropology",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 18, 14, 30),
      description: "15-minute presentation in class",
      color: "bg-primary-400"
    }
  ];

  // Sample courses data for demo
  const sampleCourses = [
    { id: "1", title: "Introduction to African History" },
    { id: "2", title: "Data Science Fundamentals" },
    { id: "3", title: "Business Administration" },
    { id: "4", title: "Introduction to Physics" },
    { id: "5", title: "Cultural Anthropology" },
  ];

  // Use real data if available, otherwise use sample data
  const displayedEvents = events || sampleEvents;
  const displayedCourses = courses || sampleCourses;

  // Filter events by selected types
  const filteredEvents = displayedEvents.filter(event => 
    selectedEventTypes.includes(event.type)
  );

  // Calendar rendering functions
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevMonth}
            className="h-8 w-8 p-0 text-umber-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="h-8 px-2 text-xs text-umber-700"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="h-8 w-8 p-0 text-umber-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-umber-600 py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        
        // Get events for this day
        const dayEvents = filteredEvents.filter(event => 
          isSameDay(new Date(event.date), day)
        );

        // Get first few events and count how many more there are
        const displayEvents = dayEvents.slice(0, 2);
        const moreEventsCount = dayEvents.length - displayEvents.length;

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-28 border border-neutral-200 p-1 transition-colors",
              !isCurrentMonth ? "bg-neutral-50 text-neutral-400" : "bg-white",
              isToday ? "border-primary-400" : "",
              isSelected ? "bg-primary-50" : ""
            )}
            onClick={() => onDateClick(day)}
          >
            <div className={cn(
              "text-right text-sm font-medium p-1",
              isToday ? "text-primary-500" : "text-umber-900"
            )}>
              {formattedDate}
            </div>
            <div className="overflow-y-auto max-h-[70px]">
              {displayEvents.map((event, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-xs mb-1 px-1 py-0.5 rounded truncate text-white",
                    event.color
                  )}
                >
                  {event.title}
                </div>
              ))}
              {moreEventsCount > 0 && (
                <div className="text-xs text-umber-600 px-1">
                  +{moreEventsCount} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  // Get events for selected date
  const selectedDateEvents = filteredEvents.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  // Format time function
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  // Get event type info
  const getEventTypeInfo = (type: string) => {
    return EVENT_TYPES.find(t => t.id === type) || EVENT_TYPES[0];
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
                Calendar
              </h1>
              <p className="text-sm text-umber-700">
                View and manage your schedule and deadlines
              </p>
            </div>
            <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
              <DialogTrigger asChild>
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event or reminder in your calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter event title" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <select 
                      id="type" 
                      className="w-full p-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    >
                      {EVENT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Related Course (Optional)</Label>
                    <select 
                      id="course" 
                      className="w-full p-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={newEvent.courseId}
                      onChange={(e) => setNewEvent({...newEvent, courseId: e.target.value})}
                    >
                      <option value="">None</option>
                      {displayedCourses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Add details about this event" 
                      className="min-h-[80px]"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-primary-400 hover:bg-primary-500 text-white"
                    onClick={handleCreateEvent}
                    disabled={!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with filters and selected day events */}
            <div className="space-y-6">
              {/* Event Type Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Event Types</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs text-umber-700"
                      onClick={() => setSelectedEventTypes(EVENT_TYPES.map(type => type.id))}
                    >
                      Show All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EVENT_TYPES.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-${type.id}`} 
                        checked={selectedEventTypes.includes(type.id)}
                        onCheckedChange={() => toggleEventType(type.id)}
                      />
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        type.id === "assignment" ? "bg-primary-400" :
                        type.id === "lecture" ? "bg-secondary-400" :
                        type.id === "exam" ? "bg-status-error" :
                        type.id === "announcement" ? "bg-accent-400" :
                        "bg-status-warning"
                      )}></div>
                      <Label 
                        htmlFor={`filter-${type.id}`} 
                        className="text-sm font-medium text-umber-800 cursor-pointer"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Selected Day Events */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length > 0 
                      ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''}` 
                      : 'No events scheduled'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event, idx) => {
                        const eventType = getEventTypeInfo(event.type);
                        return (
                          <div 
                            key={idx} 
                            className="p-3 bg-white rounded-md border border-neutral-200 hover:border-primary-200 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                event.color
                              )}></div>
                              <span className="text-xs font-medium text-umber-600">
                                {formatTime(new Date(event.date))}
                              </span>
                              <Badge 
                                className="px-1.5 py-0 text-xs text-white"
                                style={{backgroundColor: event.color.replace('bg-', '').replace('-400', '-500')}}
                              >
                                {eventType.label}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-umber-900 mb-1">{event.title}</h4>
                            {event.courseName && (
                              <div className="flex items-center text-xs text-umber-600 mb-1">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {event.courseName}
                              </div>
                            )}
                            {event.description && (
                              <p className="text-xs text-umber-600 mt-1">{event.description}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <CalendarIcon className="h-8 w-8 mx-auto text-umber-300 mb-2" />
                      <p className="text-sm text-umber-600">No events scheduled for this day</p>
                      <Button
                        variant="link"
                        className="mt-2 text-primary-400"
                        onClick={() => setIsAddingEvent(true)}
                      >
                        Add an event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-4">
                  {renderHeader()}
                  {renderDays()}
                  {renderCells()}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Textarea component for the dialog
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