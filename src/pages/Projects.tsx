
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectCard, { Project } from "@/components/ProjectCard";
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
    }
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
                  onValueChange={(value: "personal" | "business" | "finance" | "design") => 
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
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
