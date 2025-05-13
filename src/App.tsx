
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Calendar from "./pages/Calendar";
import Finances from "./pages/Finances";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
                <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
                <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
                <Route path="/finances" element={<RequireAuth><Finances /></RequireAuth>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
