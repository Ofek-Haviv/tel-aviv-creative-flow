
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProjectFilters from "@/components/ProjectFilters";
import NewProjectDialog from "@/components/NewProjectDialog";
import ProjectsList from "@/components/ProjectsList";
import { Project } from "@/components/ProjectCard";
import { initialProjects, projectTasks } from "@/data/projectsData";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <ProjectFilters 
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <NewProjectDialog onAddProject={handleAddProject} />
      </div>

      <ProjectsList 
        projects={filteredProjects}
        projectTasks={projectTasks}
        onProjectSelect={handleProjectSelect}
      />
    </div>
  );
};

export default Projects;
