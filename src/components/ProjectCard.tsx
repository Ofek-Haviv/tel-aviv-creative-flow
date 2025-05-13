
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  title: string;
  category: "personal" | "business" | "finance" | "design" | "urgent";
  dueDate?: string;
  description?: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

const ProjectCard = ({ project, onClick, className }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={cn(
        "p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CategoryBadge category={project.category} />
            {project.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(project.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium mt-2">{project.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleExpand}
          className="flex-shrink-0"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Progress</span>
          <span className="text-gray-500">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{project.tasks.completed} completed</span>
          <span>{project.tasks.total - project.tasks.completed} remaining</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 text-sm text-gray-600 animate-fade-in">
          <p>{project.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
