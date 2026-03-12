import { motion } from "framer-motion";
import BusLineCard, { BusLineData } from "@/components/BusLineCard";
import { Search } from "lucide-react";
import { useState } from "react";

const allLines: BusLineData[] = [
  { id: "1", name: "27", origin: "Embajadores", destination: "Plaza Castilla", eta: 3, occupancy: "low", occupancyPercent: 25, color: "#e8a838" },
  { id: "2", name: "65", origin: "Moncloa", destination: "Atocha", eta: 7, occupancy: "medium", occupancyPercent: 62, color: "#3b9ed4" },
  { id: "3", name: "82", origin: "Chamartín", destination: "Pirámides", eta: 2, occupancy: "high", occupancyPercent: 91, color: "#e05252" },
  { id: "4", name: "44", origin: "Legazpi", destination: "Chamartín", eta: 12, occupancy: "low", occupancyPercent: 18, color: "#4ade80" },
  { id: "5", name: "132", origin: "Cibeles", destination: "Las Tablas", eta: 5, occupancy: "medium", occupancyPercent: 55, color: "#a78bfa" },
  { id: "6", name: "N1", origin: "Cibeles", destination: "Las Tablas", eta: 15, occupancy: "low", occupancyPercent: 12, color: "#94a3b8" },
  { id: "7", name: "1", origin: "Av. América", destination: "Sol", eta: 4, occupancy: "high", occupancyPercent: 88, color: "#f97316" },
  { id: "8", name: "74", origin: "Oporto", destination: "Canillejas", eta: 9, occupancy: "medium", occupancyPercent: 50, color: "#14b8a6" },
];

const LineasPage = () => {
  const [search, setSearch] = useState("");
  const filtered = allLines.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.origin.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Líneas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Estado en tiempo real de los autobuses</p>
      </motion.div>

      <div className="mt-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar línea o parada..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-card border border-border pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="mt-4 space-y-2.5">
        {filtered.map((line, i) => (
          <BusLineCard key={line.id} line={line} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
};

export default LineasPage;
