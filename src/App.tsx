import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import LineasPage from "./pages/LineasPage";
import BuscarPage from "./pages/BuscarPage";
import TraficoPage from "./pages/TraficoPage";
import AlertasPage from "./pages/AlertasPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ConductorDashboard from "./pages/ConductorDashboard";
import GestorDashboard from "./pages/GestorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RoleHome = () => {
  const { role } = useAuth();
  if (role === "conductor") return <ConductorDashboard />;
  if (role === "gestor") return <GestorDashboard />;
  return <Index />;
};

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<RoleHome />} />
        <Route path="/lineas" element={<LineasPage />} />
        <Route path="/buscar" element={<BuscarPage />} />
        <Route path="/trafico" element={<TraficoPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/conductor" element={<ConductorDashboard />} />
        <Route path="/gestor" element={<GestorDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
