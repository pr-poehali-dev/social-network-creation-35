import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Subscriptions from "@/pages/Subscriptions";
import Communities from "@/pages/Communities";
import Groups from "@/pages/Groups";
import Channels from "@/pages/Channels";
import Music from "@/pages/Music";
import Radio from "@/pages/Radio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Feed /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/messages" element={<Layout><Messages /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
          <Route path="/communities" element={<Layout><Communities /></Layout>} />
          <Route path="/groups" element={<Layout><Groups /></Layout>} />
          <Route path="/channels" element={<Layout><Channels /></Layout>} />
          <Route path="/music" element={<Layout><Music /></Layout>} />
          <Route path="/radio" element={<Layout><Radio /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
