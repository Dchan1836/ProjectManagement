import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  BarChart3, 
  Columns,
  ListTodo,
  Menu, 
  X,
  Bell,
  Search,
  Settings,
  CalendarDays,
  Sun,
  Star,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/upskilled_evolution_logo_1767034599609.jpg";

interface LayoutProps {
  children: React.ReactNode;
}

interface DateInfo {
  date: string;
  isHoliday: boolean;
  holidayName: string | null;
  holidayType: string | null;
  nextWorkday: string;
}

const HOLIDAY_TYPE_LABELS: Record<string, string> = {
  public:      "Public Holiday",
  bank:        "Bank Holiday",
  optional:    "Optional Holiday",
  school:      "School Holiday",
  observance:  "Observance",
};

const HOLIDAY_TYPE_COLORS: Record<string, string> = {
  public:     "bg-red-100 text-red-700 border-red-200",
  bank:       "bg-blue-100 text-blue-700 border-blue-200",
  optional:   "bg-purple-100 text-purple-700 border-purple-200",
  school:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  observance: "bg-gray-100 text-gray-700 border-gray-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);

  const { data: dateInfo, isLoading: dateLoading } = useQuery<DateInfo>({
    queryKey: ["/api/date-info"],
    staleTime: 60_000,
  });

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Gantt Chart", href: "/gantt", icon: BarChart3 },
    { label: "Kanban Board", href: "/kanban", icon: KanbanSquare },
    { label: "Split View", href: "/split-view", icon: Columns },
    { label: "Task List", href: "/tasks", icon: ListTodo },
  ];

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <img src={logoImage} alt="Upskilled Evolution" className="w-8 h-8 rounded-lg object-cover" />
          Upskilled
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-foreground hover:bg-muted rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center gap-3 mb-10 font-display text-2xl font-bold text-foreground">
            <img src={logoImage} alt="Upskilled Evolution" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            Upskilled
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`nav-link cursor-pointer ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}>
                    <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Jane Doe</p>
                <p className="text-xs text-muted-foreground truncate">Product Manager</p>
              </div>
              <Settings size={16} className="text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden relative">
        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4 bg-white/50 border border-border/50 rounded-full px-4 py-2 w-96 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search size={18} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks, projects..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2"></div>

            {/* Clickable date section */}
            <button
              data-testid="button-date-info"
              onClick={() => setDateDialogOpen(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground font-medium px-3 py-1.5 rounded-full hover:bg-secondary hover:text-foreground transition-colors cursor-pointer group"
            >
              <CalendarDays size={16} className="text-primary group-hover:scale-110 transition-transform" />
              <span>{todayLabel}</span>
              {dateInfo?.isHoliday && (
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Holiday today" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pt-0">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Date Info Dialog */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-date-info">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CalendarDays size={20} className="text-primary" />
              Date Information
            </DialogTitle>
          </DialogHeader>

          {dateLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : dateInfo ? (
            <div className="space-y-4 pt-2">

              {/* Today's date */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
                <Sun size={20} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Today</p>
                  <p data-testid="text-date-today" className="text-base font-semibold text-foreground">
                    {formatDate(dateInfo.date)}
                  </p>
                </div>
              </div>

              {/* Holiday status */}
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                dateInfo.isHoliday
                  ? "bg-amber-50 border-amber-200"
                  : "bg-secondary/40 border-border/50"
              }`}>
                <Star
                  size={20}
                  className={dateInfo.isHoliday ? "text-amber-500 mt-0.5 shrink-0" : "text-muted-foreground mt-0.5 shrink-0"}
                />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Holiday Status</p>
                  {dateInfo.isHoliday ? (
                    <div className="space-y-2">
                      <p data-testid="text-holiday-name" className="text-base font-semibold text-amber-700">
                        {dateInfo.holidayName}
                      </p>
                      {dateInfo.holidayType && (
                        <Badge
                          data-testid="badge-holiday-type"
                          variant="outline"
                          className={`text-xs ${HOLIDAY_TYPE_COLORS[dateInfo.holidayType] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {HOLIDAY_TYPE_LABELS[dateInfo.holidayType] ?? dateInfo.holidayType}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p data-testid="text-no-holiday" className="text-sm text-muted-foreground">
                      No holiday today
                    </p>
                  )}
                </div>
              </div>

              {/* Next workday */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
                <ArrowRight size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Next Workday</p>
                  <p data-testid="text-next-workday" className="text-base font-semibold text-foreground">
                    {formatDate(dateInfo.nextWorkday)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                <Info size={12} />
                Holiday data based on US public calendar. Click the date in the header to refresh.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Could not load date information.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
