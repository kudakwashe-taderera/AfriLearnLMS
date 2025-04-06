import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Info } from "lucide-react";

interface DashboardStatsProps {
  enrollments: any[];
}

export default function DashboardStats({ enrollments }: DashboardStatsProps) {
  // Calculate overall progress across all courses
  const calculateOverallProgress = () => {
    if (!enrollments || enrollments.length === 0) return 0;
    
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
    return Math.round(totalProgress / enrollments.length);
  };

  // Get upcoming deadlines
  const getUpcomingDeadlines = () => {
    // In a real app, this would fetch actual assignment deadlines
    return [
      { id: 1, title: "Data Science Assignment", dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12) }, // Today
      { id: 2, title: "Physics Lab Report", dueDate: new Date(Date.now() + 1000 * 60 * 60 * 36) } // Tomorrow
    ];
  };

  // Get recent grades
  const getRecentGrades = () => {
    // In a real app, this would fetch actual grades
    return [
      { id: 1, title: "History Essay", score: 92, total: 100 },
      { id: 2, title: "Math Quiz", score: 78, total: 100 }
    ];
  };

  const overallProgress = calculateOverallProgress();
  const upcomingDeadlines = getUpcomingDeadlines();
  const recentGrades = getRecentGrades();

  // Format the due date
  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `In ${diffDays} days`;
    }
  };

  // Calculate grade color based on score
  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-status-success";
    if (score >= 75) return "text-status-warning";
    return "text-status-error";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* Overall Progress */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans font-semibold text-umber-800">Overall Progress</h3>
            <span className="text-sm font-medium text-primary-400">{overallProgress}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="bg-primary-400 h-full rounded-full progress-bar" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-umber-600">
            {overallProgress > 75 
              ? "You're making excellent progress across your courses!" 
              : overallProgress > 50 
                ? "You're on track with most of your courses" 
                : "You have some courses that need attention"}
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans font-semibold text-umber-800">Upcoming Deadlines</h3>
            <span className="text-xs px-2 py-1 bg-status-warning bg-opacity-20 text-status-warning rounded-full">
              {upcomingDeadlines.length} Due Soon
            </span>
          </div>
          {upcomingDeadlines.map(deadline => (
            <p key={deadline.id} className="text-sm font-medium mb-1 text-umber-800">
              {deadline.title} <span className="text-status-warning">{formatDueDate(deadline.dueDate)}</span>
            </p>
          ))}
          <Link href="/assignments">
            <a className="text-xs font-medium text-primary-400 inline-block mt-1 hover:text-primary-500">View all</a>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Grades */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans font-semibold text-umber-800">Recent Grades</h3>
            <span className="text-xs px-2 py-1 bg-status-success bg-opacity-20 text-status-success rounded-full">
              {recentGrades.length} New
            </span>
          </div>
          {recentGrades.map(grade => (
            <p key={grade.id} className="text-sm mb-1">
              <span className="font-medium text-umber-800">{grade.title}:</span> 
              <span className={`font-semibold ml-1 ${getGradeColor(grade.score)}`}>
                {grade.score}%
              </span>
            </p>
          ))}
          <Link href="/grades">
            <a className="text-xs font-medium text-primary-400 inline-block mt-1 hover:text-primary-500">View all grades</a>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
