
import { useState } from "react";
import { initialProjects, projectTasks } from "@/data/projectsData";
import { Project } from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddProject = (project: Project) => {
    setProjects([project, ...projects]);
    
    // Initialize empty task array for the new project
    projectTasks[project.id] = [];
    
    toast({
      title: "Project created",
      description: `${project.title} has been added to your projects.`
    });
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const filteredProjects = projects
    .filter(project => {
      if (searchTerm) {
        return project.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(project => {
      if (filter) return project.category === filter;
      return true;
    });

  return {
    projects,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedProject,
    setSelectedProject,
    filteredProjects,
    handleAddProject,
    handleProjectSelect
  };
};
