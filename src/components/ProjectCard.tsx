
import { Calendar, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
  projectTasks?: ProjectTask[];
}

const ProjectCard = ({ project, onClick, className, projectTasks = [] }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    setShowDetails(true);
    if (onClick) onClick();
  };

  return (
    <>
      <div 
        className={cn(
          "p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer",
          className
        )}
        onClick={handleCardClick}
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CategoryBadge category={project.category} />
              {project.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {project.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-sm mt-1">{project.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Completion</span>
                  <span className="text-gray-500">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
              <div className="mt-2 border rounded-md divide-y">
                {projectTasks.length > 0 ? (
                  projectTasks.map(task => (
                    <div key={task.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`${task.completed ? 'text-green-500' : 'text-gray-300'}`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                      </div>
                      {task.dueDate && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short", 
                            day: "numeric"
                          })}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No tasks added to this project yet</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
