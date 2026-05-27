import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><Layout><Subscriptions /></Layout></ProtectedRoute>} />
            <Route path="/communities" element={<ProtectedRoute><Layout><Communities /></Layout></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Layout><Groups /></Layout></ProtectedRoute>} />
            <Route path="/channels" element={<ProtectedRoute><Layout><Channels /></Layout></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><Layout><Music /></Layout></ProtectedRoute>} />
            <Route path="/radio" element={<ProtectedRoute><Layout><Radio /></Layout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
