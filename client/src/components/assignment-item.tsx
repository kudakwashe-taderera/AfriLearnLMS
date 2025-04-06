import { Link } from "wouter";
import { FileText, FlaskRound, Book, PresentationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssignmentItemProps {
  assignment: {
    id: number;
    title: string;
    courseName: string;
    dueDate: Date;
    status?: "not_started" | "in_progress" | "submitted" | "graded";
    icon: string;
    color: "warning" | "secondary" | "primary" | "success" | "error";
  };
}

export default function AssignmentItem({ assignment }: AssignmentItemProps) {
  // Format the due date as relative time
  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffTime < 0) {
      return "Past due";
    } else if (diffDays === 0) {
      // Calculate hours
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        return "Due soon";
      }
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return `Due on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  // Return appropriate border color based on assignment color
  const getBorderColor = () => {
    switch (assignment.color) {
      case "warning": return "border-l-4 border-status-warning";
      case "secondary": return "border-l-4 border-secondary-400";
      case "primary": return "border-l-4 border-primary-400";
      case "success": return "border-l-4 border-status-success";
      case "error": return "border-l-4 border-status-error";
      default: return "border-l-4 border-secondary-400";
    }
  };

  // Return appropriate icon background color
  const getIconBgColor = () => {
    switch (assignment.color) {
      case "warning": return "bg-status-warning bg-opacity-10 text-status-warning";
      case "secondary": return "bg-secondary-50 text-secondary-400";
      case "primary": return "bg-primary-50 text-primary-400";
      case "success": return "bg-status-success bg-opacity-10 text-status-success";
      case "error": return "bg-status-error bg-opacity-10 text-status-error";
      default: return "bg-secondary-50 text-secondary-400";
    }
  };

  // Return appropriate icon based on assignment icon type
  const getIcon = () => {
    switch (assignment.icon) {
      case "file-text": return <FileText />;
      case "flask": return <FlaskRound />;
      case "book": return <Book />;
      case "presentation": return <PresentationIcon />;
      default: return <FileText />;
    }
  };

  // Format the status text
  const getStatusText = () => {
    switch (assignment.status) {
      case "not_started": return "Not started";
      case "in_progress": return "Draft saved";
      case "submitted": return "Submitted";
      case "graded": return "Graded";
      default: return "Not started";
    }
  };

  // Format the button text
  const getButtonText = () => {
    switch (assignment.status) {
      case "not_started": return "Start now";
      case "in_progress": return "Continue";
      case "submitted": return "View submission";
      case "graded": return "View grade";
      default: return "Start now";
    }
  };

  return (
    <div className={`flex items-start p-3 rounded-md bg-neutral-50 ${getBorderColor()}`}>
      <div className="flex-shrink-0 mr-3">
        <div className={`w-10 h-10 rounded-md ${getIconBgColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-sans font-semibold text-umber-900">{assignment.title}</h4>
            <p className="text-sm text-umber-700">{assignment.courseName}</p>
          </div>
          <span className={`text-xs font-medium ${
            assignment.color === "warning" ? "text-status-warning" : 
            assignment.color === "error" ? "text-status-error" : 
            "text-umber-700"
          }`}>
            {formatDueDate(assignment.dueDate)}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-xs text-umber-600 mr-3">Submission status: {getStatusText()}</span>
          <Link href={`/assignments/${assignment.id}`}>
            <Button className="text-xs font-medium text-white bg-primary-400 hover:bg-primary-500 px-2 py-1 rounded-md transition-colors h-auto">
              {getButtonText()}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
