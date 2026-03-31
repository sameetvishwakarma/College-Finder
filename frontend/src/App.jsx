import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminProvider, trackPageVisit } from "./context/AdminContext";

// Pages
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SavedColleges from "./pages/SavedColleges";

// Admin
import AdminLoginPage from "./admin/AdminLoginPage";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import UserManager from "./admin/UserManager";
import AnalyticsPanel from "./admin/AnalyticsPanel";
import ChecklistEditor from "./admin/ChecklistEditor";
import QuizConfig from "./admin/QuizConfig";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

function VisitTracker() {
  const { user } = useAuth();
  useEffect(() => { if (user) trackPageVisit(); }, [user]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <AuthProvider>
        <AdminProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <VisitTracker />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Protected user routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/saved"     element={<ProtectedRoute><SavedColleges /></ProtectedRoute>} />

                  {/* Admin routes — Colleges removed */}
                  <Route path="/admin"               element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard"     element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                  <Route path="/admin/users"         element={<AdminLayout><UserManager /></AdminLayout>} />
                  <Route path="/admin/analytics"     element={<AdminLayout><AnalyticsPanel /></AdminLayout>} />
                  <Route path="/admin/checklist"     element={<AdminLayout><ChecklistEditor /></AdminLayout>} />
                  <Route path="/admin/quiz-config"   element={<AdminLayout><QuizConfig /></AdminLayout>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </AdminProvider>
      </AuthProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
