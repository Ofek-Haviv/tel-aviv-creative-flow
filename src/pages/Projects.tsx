
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectCard, { Project, ProjectTask } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Sample project tasks data
const projectTasks: Record<string, ProjectTask[]> = {
  "1": [
    { id: "1-1", title: "Plan photoshoot locations", completed: true },
    { id: "1-2", title: "Design promotional materials", completed: true },
    { id: "1-3", title: "Contact influencers for promotion", completed: true },
    { id: "1-4", title: "Create social media campaign", completed: true },
    { id: "1-5", title: "Finalize store displays", completed: true },
    { id: "1-6", title: "Prepare press release", completed: false },
    { id: "1-7", title: "Organize launch event", completed: false },
    { id: "1-8", title: "Film video content", completed: false },
    { id: "1-9", title: "Update online store", completed: false },
    { id: "1-10", title: "Brief sales team", completed: false },
    { id: "1-11", title: "Prepare email newsletter", completed: false },
    { id: "1-12", title: "Final review of collection", completed: false },
  ],
  "2": [
    { id: "2-1", title: "Create mood board", completed: true },
    { id: "2-2", title: "Draft initial layout", completed: true },
    { id: "2-3", title: "Source new display fixtures", completed: false },
    { id: "2-4", title: "Schedule contractor meetings", completed: false },
    { id: "2-5", title: "Finalize budget", completed: false },
    { id: "2-6", title: "Select color scheme", completed: false },
    { id: "2-7", title: "Order custom fixtures", completed: false },
    { id: "2-8", title: "Create timeline for implementation", completed: false },
  ],
  "3": [
    { id: "3-1", title: "Collect Q2 sales data", completed: true },
    { id: "3-2", title: "Analyze profit margins", completed: true },
    { id: "3-3", title: "Compare to previous quarters", completed: true },
    { id: "3-4", title: "Create presentation slides", completed: true },
    { id: "3-5", title: "Draft executive summary", completed: false },
    { id: "3-6", title: "Prepare investor Q&A", completed: false },
  ],
  "4": [
    { id: "4-1", title: "Audit current website", completed: true },
    { id: "4-2", title: "Create wireframes", completed: true },
    { id: "4-3", title: "Design mobile views", completed: true },
    { id: "4-4", title: "Update product photography", completed: false },
    { id: "4-5", title: "Implement checkout improvements", completed: false },
    { id: "4-6", title: "SEO optimization", completed: false },
    { id: "4-7", title: "User testing", completed: false },
    { id: "4-8", title: "Browser compatibility testing", completed: false },
    { id: "4-9", title: "Performance optimization", completed: false },
    { id: "4-10", title: "Launch new site", completed: false },
  ],
  "5": [
    { id: "5-1", title: "Research relevant influencers", completed: true },
    { id: "5-2", title: "Create campaign brief", completed: true },
    { id: "5-3", title: "Negotiate contracts", completed: true },
    { id: "5-4", title: "Develop content guidelines", completed: true },
    { id: "5-5", title: "Ship products to influencers", completed: true },
    { id: "5-6", title: "Review content drafts", completed: false },
    { id: "5-7", title: "Coordinate posting schedule", completed: false },
    { id: "5-8", title: "Track campaign metrics", completed: false },
  ],
};

// Sample data
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Summer Collection Launch",
    category: "business",
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    description: "Plan and execute the summer collection launch including photoshoot, marketing materials, and store event",
    progress: 45,
    tasks: {
      total: 12,
      completed: 5
    }
  },
  {
    id: "2",
    title: "Store Renovation",
    category: "design",
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    description: "Redesign store layout and implement new display concepts",
    progress: 20,
    tasks: {
      total: 8,
      completed: 2
    }
  },
  {
    id: "3",
    title: "Q2 Financial Review",
    category: "finance",
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    description: "Analyze Q2 performance and prepare report for investors",
    progress: 75,
    tasks: {
      total: 6,
      completed: 4
    }
  },
  {
    id: "4",
    title: "Website Redesign",
    category: "design",
    dueDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    description: "Update online store with new branding and improved UX",
    progress: 30,
    tasks: {
      total: 10,
      completed: 3
    }
  },
  {
    id: "5",
    title: "Influencer Campaign",
    category: "business",
    dueDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    description: "Coordinate with influencers for the new collection promotion",
    progress: 60,
    tasks: {
      total: 8,
      completed: 5
    }
  }
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "business",
    description: "",
    progress: 0,
    tasks: {
      total: 0,
      completed: 0
    }
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleAddProject = () => {
    if (newProject.title?.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        category: newProject.category as "personal" | "business" | "finance" | "design" | "urgent",
        description: newProject.description,
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
        progress: 0,
        tasks: {
          total: 0,
          completed: 0
        }
      };
      
      setProjects([project, ...projects]);
      setShowAddDialog(false);
      setNewProject({
        title: "",
        category: "business",
        description: "",
        progress: 0,
        tasks: {
          total: 0,
          completed: 0
        }
      });
      setSelectedDate(undefined);

      // Initialize empty task array for the new project
      projectTasks[project.id] = [];
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search projects" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new project to organize your work
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Project title" 
                  value={newProject.title} 
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newProject.category} 
                  onValueChange={(value: "personal" | "business" | "finance" | "design" | "urgent") => 
                    setNewProject({ ...newProject, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the project" 
                  value={newProject.description} 
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 sm:mx-0">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button 
            variant={filter === "personal" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("personal")}
            className="whitespace-nowrap"
          >
            Personal
          </Button>
          <Button 
            variant={filter === "business" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("business")}
            className="whitespace-nowrap"
          >
            Business
          </Button>
          <Button 
            variant={filter === "finance" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("finance")}
            className="whitespace-nowrap"
          >
            Finance
          </Button>
          <Button 
            variant={filter === "design" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("design")}
            className="whitespace-nowrap"
          >
            Design
          </Button>
          <Button 
            variant={filter === "urgent" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("urgent")}
            className="whitespace-nowrap"
          >
            Urgent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              projectTasks={projectTasks[project.id] || []}
              onClick={() => handleProjectSelect(project.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
