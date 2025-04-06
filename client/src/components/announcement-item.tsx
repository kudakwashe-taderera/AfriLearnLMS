import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementItemProps {
  announcement: {
    id: number;
    author: {
      name: string;
      avatar: string;
    };
    courseName: string;
    title: string;
    content: string;
    createdAt: Date;
  };
}

export default function AnnouncementItem({ announcement }: AnnouncementItemProps) {
  // Format the announcement time as relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
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

  // Get avatar initials from author name
  const getAvatarInitials = (name: string) => {
    if (!name) return "";
    
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex items-start">
      {announcement.author.avatar ? (
        <Avatar className="w-10 h-10 rounded-full object-cover mr-3">
          <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
          <AvatarFallback>{getAvatarInitials(announcement.author.name)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center text-white mr-3">
          <span className="text-sm font-medium">{getAvatarInitials(announcement.author.name)}</span>
        </div>
      )}
      
      <div>
        <div className="flex items-center mb-1">
          <h4 className="font-sans font-semibold text-umber-900 mr-2">{announcement.author.name}</h4>
          <span className="text-xs text-umber-600 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatRelativeTime(announcement.createdAt)}
          </span>
        </div>
        <p className="text-sm text-umber-700 mb-2">{announcement.title}</p>
        <p className="text-sm text-umber-800">{announcement.content}</p>
        <div className="mt-2">
          <Button variant="link" className="text-xs text-primary-400 hover:text-primary-500 px-0 py-0 h-auto">View Details</Button>
          <Button variant="link" className="text-xs text-umber-600 hover:text-umber-700 px-0 py-0 ml-3 h-auto">Mark as Read</Button>
        </div>
      </div>
    </div>
  );
}
