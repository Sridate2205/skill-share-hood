import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import RequestDetail from "./pages/RequestDetail";
import OfferDetail from "./pages/OfferDetail";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/offer/:id" element={<OfferDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
