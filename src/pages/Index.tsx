import { motion } from "framer-motion";
import { Bus, TrendingUp, Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import OccupancyIndicator from "@/components/OccupancyIndicator";

const stats = [
  { icon: Bus, label: "Autobuses activos", value: "47", color: "text-primary" },
  { icon: Users, label: "Pasajeros/hora", value: "3.2K", color: "text-info" },
  { icon: Clock, label: "ETA promedio", value: "8 min", color: "text-success" },
  { icon: TrendingUp, label: "Tráfico A6", value: "Moderado", color: "text-warning" },
];

const liveBuses = [
  { line: "27", dest: "Plaza Castilla", eta: 3, occupancy: "low" as const, pct: 30 },
  { line: "65", dest: "Moncloa", eta: 7, occupancy: "medium" as const, pct: 65 },
  { line: "82", dest: "Atocha", eta: 2, occupancy: "high" as const, pct: 90 },
  { line: "44", dest: "Chamartín", eta: 12, occupancy: "low" as const, pct: 20 },
];

const Dashboard = () => {
  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Bus className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">CityFlow</h1>
            <p className="text-xs text-muted-foreground">Madrid · Tiempo real</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
          <span className="text-xs text-success font-medium">Sistema operativo</span>
          <span className="text-xs text-muted-foreground ml-auto">Actualizado hace 30s</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-3.5"
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <p className="mt-2 text-lg font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live Buses */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-foreground">Próximos autobuses</h2>
          <Link to="/lineas" className="flex items-center gap-0.5 text-xs text-primary font-medium">
            Ver todos <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {liveBuses.map((bus, i) => (
            <motion.div
              key={bus.line}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card p-3.5 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-display font-bold text-sm text-primary">
                {bus.line}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{bus.dest}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{bus.eta} min</span>
                  <OccupancyIndicator level={bus.occupancy} percentage={bus.pct} size="sm" />
                </div>
              </div>
              <span className="text-lg font-display font-bold text-primary">{bus.eta}'</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Traffic Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Link to="/trafico" className="glass-card p-4 block gradient-accent rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-accent-foreground/70">Predicción IA</p>
              <h3 className="font-display font-bold text-accent-foreground mt-0.5">Tráfico A6</h3>
              <p className="text-xs text-accent-foreground/80 mt-1">
                Congestión prevista a las 18:00 — planifica tu ruta
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-foreground/60" />
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;
