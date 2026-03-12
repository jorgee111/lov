import { NavLink, useLocation } from "react-router-dom";
import { Home, Bus, BarChart3, Bell, Search, User, Route, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { role } = useAuth();

  const pasajeroItems = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/lineas", icon: Bus, label: "Líneas" },
    { to: "/buscar", icon: Search, label: "Buscar" },
    { to: "/trafico", icon: BarChart3, label: "Tráfico" },
    { to: "/perfil", icon: User, label: "Perfil" },
  ];

  const conductorItems = [
    { to: "/", icon: Home, label: "Panel" },
    { to: "/lineas", icon: Route, label: "Rutas" },
    { to: "/alertas", icon: Bell, label: "Alertas" },
    { to: "/perfil", icon: User, label: "Perfil" },
  ];

  const gestorItems = [
    { to: "/", icon: Shield, label: "Panel" },
    { to: "/lineas", icon: Bus, label: "Líneas" },
    { to: "/trafico", icon: BarChart3, label: "Tráfico" },
    { to: "/alertas", icon: Bell, label: "Alertas" },
    { to: "/perfil", icon: User, label: "Perfil" },
  ];

  const navItems = role === "conductor" ? conductorItems : role === "gestor" ? gestorItems : pasajeroItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
