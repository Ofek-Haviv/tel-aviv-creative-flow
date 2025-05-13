
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckCircle, FolderKanban, CalendarDays, Wallet, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckCircle },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Finances", path: "/finances", icon: Wallet },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-20 p-2">
            <div className="flex justify-around items-center">
              {navItems.slice(0, 4).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex flex-col items-center p-2 rounded-md transition-colors",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </NavLink>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-background/95 z-30 flex flex-col">
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-6 text-xl">
                {renderNavItems()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="w-64 border-r h-screen fixed left-0 top-0 p-6">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold">FlowCOO</h1>
            <p className="text-xs text-muted-foreground mt-1">Your creative assistant</p>
          </div>
          <nav className="space-y-2">
            {renderNavItems()}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;
