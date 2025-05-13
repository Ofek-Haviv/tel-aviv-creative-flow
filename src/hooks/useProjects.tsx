
import { useState, useEffect } from "react";
import { Project } from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectTask } from "@/components/ProjectCard";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, ProjectTask[]>>({});
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedProjects: Project[] = data.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category as "personal" | "business" | "finance" | "design" | "urgent",
          dueDate: p.due_date,
          description: p.description || undefined,
          progress: p.progress,
          tasks: {
            total: p.total_tasks,
            completed: p.completed_tasks
          }
        }));

        setProjects(formattedProjects);
        
        // Fetch tasks for each project
        await Promise.all(
          formattedProjects.map(project => fetchProjectTasks(project.id))
        );
        
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error fetching projects",
          description: "Could not load your projects. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, toast]);

  const fetchProjectTasks = async (projectId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedTasks: ProjectTask[] = data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        dueDate: task.due_date || undefined
      }));

      setProjectTasks(prev => ({
        ...prev,
        [projectId]: formattedTasks
      }));
      
    } catch (error) {
      console.error('Error fetching project tasks:', error);
    }
  };

  const handleAddProject = async (project: Project) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Insert project into Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description || null,
          due_date: project.dueDate || null,
          progress: project.progress,
          total_tasks: project.tasks.total,
          completed_tasks: project.tasks.completed,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;

      // Add project to local state
      const formattedProject: Project = {
        id: data.id,
        title: data.title,
        category: data.category as "personal" | "business" | "finance" | "design" | "urgent",
        dueDate: data.due_date,
        description: data.description || undefined,
        progress: data.progress,
        tasks: {
          total: data.total_tasks,
          completed: data.completed_tasks
        }
      };
      
      setProjects([formattedProject, ...projects]);
      
      // Initialize empty task array for the new project
      setProjectTasks(prev => ({
        ...prev,
        [formattedProject.id]: []
      }));
      
      toast({
        title: "Project created",
        description: `${formattedProject.title} has been added to your projects.`
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error creating project",
        description: "Could not create your project. Please try again later.",
        variant: "destructive"
      });
    }
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
    projectTasks,
    isLoading,
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
