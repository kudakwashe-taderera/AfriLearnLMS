import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Users, Book } from "lucide-react";

interface CourseCardProps {
  course: any;
  isInstructor?: boolean;
  enrollment?: any;
}

export default function CourseCard({ course, isInstructor = false, enrollment }: CourseCardProps) {
  // Calculate the time since last access
  const getLastAccessed = (lastAccessedDate?: string | Date) => {
    if (!lastAccessedDate) return "Never";
    
    const lastAccessed = new Date(lastAccessedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastAccessed.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    }
  };

  // Get appropriate status badge based on progress or status
  const getStatusBadge = () => {
    if (isInstructor) {
      return <Badge className="bg-primary-50 text-primary-400">Active</Badge>;
    }
    
    const progress = enrollment?.progress || 0;
    
    if (progress === 100) {
      return <Badge className="bg-status-success bg-opacity-20 text-status-success">Completed</Badge>;
    } else if (progress > 75) {
      return <Badge className="bg-status-success bg-opacity-20 text-status-success">Up to date</Badge>;
    } else if (progress > 25) {
      return <Badge className="bg-primary-50 text-primary-400">In Progress</Badge>;
    } else if (progress > 0) {
      return <Badge className="bg-secondary-50 text-secondary-400">Just Started</Badge>;
    } else {
      return <Badge className="bg-status-error bg-opacity-20 text-status-error">Not Started</Badge>;
    }
  };

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-32 bg-cover bg-center" style={{ 
        backgroundImage: course.coverImage ? `url(${course.coverImage})` : 'none',
        backgroundColor: course.coverImage ? 'transparent' : '#E05D25'
      }}>
        <div className="h-full w-full bg-gradient-to-t from-umber-900 to-transparent opacity-60"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {getStatusBadge()}
          {isInstructor ? (
            <div className="flex items-center text-sm font-medium text-accent-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.enrollmentCount || 0}</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-accent-400">{enrollment?.progress || 0}%</span>
          )}
        </div>
        
        <h3 className="font-sans font-semibold text-umber-900 mb-1 line-clamp-1">{course.title}</h3>
        
        {isInstructor ? (
          <p className="text-sm text-umber-700 mb-3">Created: {formatDate(course.createdAt)}</p>
        ) : (
          <p className="text-sm text-umber-700 mb-3">{course.instructorName || "Dr. Unknown"}</p>
        )}
        
        {!isInstructor && (
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-accent-400 h-full rounded-full" 
              style={{ width: `${enrollment?.progress || 0}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          {isInstructor ? (
            <span className="text-xs text-umber-600">
              <Book className="h-3 w-3 inline mr-1" />
              {course.modulesCount || 0} modules
            </span>
          ) : (
            <span className="text-xs text-umber-600">
              Last accessed: {getLastAccessed(enrollment?.lastAccessed)}
            </span>
          )}
          
          <Link href={`/courses/${course.id}`}>
            <button className="text-primary-400 hover:text-primary-500">
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
