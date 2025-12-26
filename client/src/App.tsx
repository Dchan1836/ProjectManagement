import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { registerLicense } from '@syncfusion/ej2-base';

import Dashboard from "@/pages/Dashboard";
import GanttChart from "@/pages/GanttChart";
import KanbanBoard from "@/pages/KanbanBoard";
import NotFound from "@/pages/not-found";

// Register Syncfusion Community License
// In a real app, this would be an env variable. For this demo, using a placeholder or it works in trial mode.
// registerLicense('YOUR_LICENSE_KEY');

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/gantt" component={GanttChart} />
      <Route path="/kanban" component={KanbanBoard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
