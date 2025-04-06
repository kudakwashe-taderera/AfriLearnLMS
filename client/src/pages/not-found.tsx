import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-8">
        <FileQuestion className="h-16 w-16 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the page you were looking for. The page may have been moved, deleted, or never existed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <a href="mailto:support@afrilearn.com">
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
}