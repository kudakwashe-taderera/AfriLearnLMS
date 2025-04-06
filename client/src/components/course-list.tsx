import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Plus } from "lucide-react";
import CourseCard from "./course-card";
import { Link } from "wouter";

interface CourseListProps {
  enrollments: any[];
}

export default function CourseList({ enrollments }: CourseListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-sans text-umber-900">Your Courses</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-white shadow-sm text-primary-400" : "text-umber-700 hover:bg-white transition-colors"}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-white shadow-sm text-primary-400" : "text-umber-700 hover:bg-white transition-colors"}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
        </div>
      </div>

      <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4`}>
        {enrollments && enrollments.length > 0 ? (
          enrollments.map((enrollment) => (
            <CourseCard 
              key={enrollment.id} 
              course={enrollment.course} 
              enrollment={enrollment} 
            />
          ))
        ) : (
          // Sample courses for demo (would be removed in real app)
          <>
            <CourseCard 
              course={{
                id: 1,
                title: "Introduction to African History",
                instructorName: "Dr. Kofi Annan",
                coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }}
              enrollment={{
                progress: 78,
                lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
              }}
            />
            <CourseCard 
              course={{
                id: 2,
                title: "Data Science Fundamentals",
                instructorName: "Prof. Amina Diop",
                coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }}
              enrollment={{
                progress: 35,
                lastAccessed: new Date() // Today
              }}
            />
            <CourseCard 
              course={{
                id: 3,
                title: "Business Administration",
                instructorName: "Dr. Nelson Mandela",
                coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }}
              enrollment={{
                progress: 92,
                lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
              }}
            />
            <CourseCard 
              course={{
                id: 4,
                title: "Introduction to Physics",
                instructorName: "Prof. Ahmed Zewail",
                coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }}
              enrollment={{
                progress: 45,
                lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
              }}
            />
            <CourseCard 
              course={{
                id: 5,
                title: "Cultural Anthropology",
                instructorName: "Dr. Wangari Maathai",
                coverImage: "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }}
              enrollment={{
                progress: 12,
                lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
              }}
            />
          </>
        )}

        {/* "Add New Course" card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-neutral-300 flex items-center justify-center h-64">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-5 w-5 text-primary-400" />
            </div>
            <h3 className="font-sans font-semibold text-umber-800 mb-2">Discover New Courses</h3>
            <p className="text-sm text-umber-600 mb-3">Expand your knowledge with our catalog</p>
            <Link href="/courses/browse">
              <Button className="text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 px-4 py-2 rounded-md transition-colors">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
