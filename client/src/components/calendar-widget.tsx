import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Helper to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Helper to get year
  const getYear = (date: Date) => {
    return date.getFullYear();
  };
  
  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Helper to get start day of month (0 = Sunday, 1 = Monday, etc)
  const getStartDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Generate array of weekday names
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = getStartDayOfMonth(currentDate);
    const prevMonthDays = startDay;
    
    // Days from previous month
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    const calendarDays = [];
    
    // Add days from previous month
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }
    
    // Add days from next month to complete the grid (6 rows * 7 columns)
    const totalCalendarDays = 42; // 6 weeks * 7 days
    const remainingDays = totalCalendarDays - calendarDays.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      });
    }
    
    return calendarDays;
  };
  
  // Check if a day has events
  const hasEvents = (date: Date) => {
    // Example events for the calendar
    const events = [
      new Date(new Date().getFullYear(), new Date().getMonth(), 16),
      new Date(new Date().getFullYear(), new Date().getMonth(), 18),
      new Date(new Date().getFullYear(), new Date().getMonth(), 21),
    ];
    
    return events.some(event => 
      event.getDate() === date.getDate() && 
      event.getMonth() === date.getMonth() && 
      event.getFullYear() === date.getFullYear()
    );
  };
  
  // Check if a day is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Format am/pm time
  const formatTime = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    const min = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour}:${min} ${ampm}`;
  };
  
  // Get today's schedule
  const getTodaySchedule = () => {
    return [
      {
        id: 1,
        time: { hours: 9, minutes: 0 },
        title: "African History Lecture",
        location: "Building B, Room 105",
        color: "primary"
      },
      {
        id: 2,
        time: { hours: 11, minutes: 30 },
        title: "Data Science Tutorial",
        location: "Online - Zoom Meeting",
        color: "secondary"
      },
      {
        id: 3,
        time: { hours: 14, minutes: 0 },
        title: "Physics Lab Session",
        location: "Science Building, Lab 3",
        color: "accent"
      },
      {
        id: 4,
        time: { hours: 23, minutes: 59 },
        title: "Data Analysis Due",
        location: "Assignment Deadline",
        color: "warning"
      }
    ];
  };
  
  const calendarDays = generateCalendarDays();
  const todaySchedule = getTodaySchedule();
  
  // Get color for schedule item
  const getScheduleItemColor = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-50 border-l-2 border-primary-400";
      case "secondary":
        return "bg-secondary-50 border-l-2 border-secondary-400";
      case "accent":
        return "bg-accent-50 border-l-2 border-accent-400";
      case "warning":
        return "bg-status-warning bg-opacity-10 border-l-2 border-status-warning";
      default:
        return "bg-neutral-50 border-l-2 border-neutral-400";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Calendar</CardTitle>
          <Button variant="link" className="text-primary-400 hover:text-primary-500 p-0 h-auto">
            Full Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-umber-700 hover:text-umber-900"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="font-sans font-semibold text-umber-800">
              {getMonthName(currentDate)} {getYear(currentDate)}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-umber-700 hover:text-umber-900"
              onClick={nextMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekdays.map((day, index) => (
              <span key={index} className="text-xs font-medium text-umber-600">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`text-xs p-2 relative cursor-pointer hover:bg-neutral-100 rounded-full ${
                  day.currentMonth ? "text-umber-800" : "text-umber-400"
                } ${
                  isToday(day.date) ? "bg-primary-400 text-white hover:bg-primary-500" : ""
                }`}
              >
                {day.day}
                {hasEvents(day.date) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-status-warning rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans font-semibold text-umber-800 mb-2">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <div key={item.id} className="flex items-start">
                <div className="flex-shrink-0 w-12 text-right mr-3">
                  <span className={`text-xs font-medium ${
                    item.color === "warning" ? "text-status-warning" : "text-umber-700"
                  }`}>
                    {formatTime(item.time.hours, item.time.minutes)}
                  </span>
                </div>
                <div className={`flex-grow p-2 rounded-md ${getScheduleItemColor(item.color)}`}>
                  <h4 className="text-sm font-medium text-umber-800">{item.title}</h4>
                  <p className="text-xs text-umber-600">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
