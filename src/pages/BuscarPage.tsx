import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Clock, Bus } from "lucide-react";
import { useState } from "react";
import OccupancyIndicator from "@/components/OccupancyIndicator";

const suggestions = [
  { origin: "Moncloa", destination: "Atocha", lines: ["65", "82"], duration: 25, occupancy: "medium" as const },
  { origin: "Sol", destination: "Chamartín", lines: ["1", "27"], duration: 18, occupancy: "low" as const },
  { origin: "Legazpi", destination: "Cibeles", lines: ["44", "132"], duration: 14, occupancy: "high" as const },
];

const BuscarPage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Buscar ruta</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Encuentra el mejor camino</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-5 glass-card p-4 space-y-3"
      >
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-success" />
          <input
            type="text"
            placeholder="Origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full rounded-lg bg-muted pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-destructive" />
          <input
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-lg bg-muted pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="w-full rounded-lg gradient-primary py-2.5 text-sm font-display font-semibold text-primary-foreground flex items-center justify-center gap-2">
          <Search className="h-4 w-4" />
          Buscar ruta
        </button>
      </motion.div>

      <div className="mt-6">
        <h2 className="font-display font-semibold text-foreground mb-3">Rutas sugeridas</h2>
        <div className="space-y-2.5">
          {suggestions.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-success shrink-0" />
                <span>{route.origin}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                <span>{route.destination}</span>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {route.duration} min
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bus className="h-3 w-3" />
                  Líneas {route.lines.join(", ")}
                </div>
                <OccupancyIndicator level={route.occupancy} percentage={0} size="sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuscarPage;
