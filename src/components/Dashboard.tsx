import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard, { Task } from "./TaskCard";
import ProjectCard, { Project } from "./ProjectCard";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClickUpDashboard from "./ClickUpDashboard";
import { useState } from "react";

// Sample data
const tasks: Task[] = [
  {
    id: "1",
    title: "Reply to fabric supplier",
    completed: false,
    category: "business",
    dueDate: new Date().toISOString(),
    description: "Check pricing for the new collection fabrics"
  },
  {
    id: "2",
    title: "Schedule photoshoot",
    completed: false,
    category: "design",
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: "3",
    title: "Walk the dog",
    completed: true,
    category: "personal",
    dueDate: new Date().toISOString()
  },
  {
    id: "4",
    title: "Prepare tax documents",
    completed: false,
    category: "finance",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    description: "Gather receipts for Q1 expenses"
  },
];

const projects: Project[] = [
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
  }
];

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  increasing?: boolean;
}

const businessMetrics: DashboardMetric[] = [
  { title: "Sales This Week", value: "₪8,254", change: "+12%", increasing: true },
  { title: "New Customers", value: 24, change: "+5%", increasing: true },
  { title: "Inventory Items", value: 156, change: "-3%", increasing: false },
  { title: "Website Visits", value: 1289, change: "+18%", increasing: true },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [clickUpConnected, setClickUpConnected] = useState(false);
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    console.log(`Task ${id} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleConnectClickUp = () => {
    // In a real implementation, this would open OAuth flow or API key input
    console.log("Connecting to ClickUp...");
    // For demo purposes, we'll just set as connected
    setClickUpConnected(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Today</h1>
        <p className="text-muted-foreground text-lg">{new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessMetrics.map((metric, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.change && (
                  <span className={`text-xs font-medium ${metric.increasing ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Personal & Business</TabsTrigger>
          <TabsTrigger value="tech">Tech Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Priority Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Priority Tasks</CardTitle>
                  <CardDescription>Tasks that need your attention today</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => navigate("/tasks")}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.slice(0, 3).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => navigate("/tasks")}
                >
                  View all tasks
                </Button>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Your ongoing long-term projects</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => navigate("/projects")}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.slice(0, 2).map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project.id)}
                  />
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => navigate("/projects")}
                >
                  View all projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tech">
          <div className="mt-4">
            <ClickUpDashboard 
              isConnected={clickUpConnected}
              onConnect={handleConnectClickUp}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
