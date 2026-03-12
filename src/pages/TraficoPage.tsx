import { motion } from "framer-motion";
import TrafficCard from "@/components/TrafficCard";
import { BarChart3, Brain } from "lucide-react";

const zones = [
  { zone: "Autovía A6 — Moncloa", status: "moderado" as const, trend: "up" as const, prediction: "Congestión a las 18:00 – 19:30" },
  { zone: "M-30 Sur", status: "fluido" as const, trend: "stable" as const, prediction: "Sin incidencias previstas" },
  { zone: "A-2 — Av. América", status: "congestionado" as const, trend: "up" as const, prediction: "Retención hasta las 20:00" },
  { zone: "M-40 Norte", status: "fluido" as const, trend: "down" as const, prediction: "Mejorando progresivamente" },
  { zone: "A-5 — Campamento", status: "moderado" as const, trend: "stable" as const, prediction: "Tráfico moderado hasta las 19:00" },
  { zone: "M-30 Este — O'Donnell", status: "congestionado" as const, trend: "up" as const, prediction: "Accidente reportado, desvío sugerido" },
];

const TraficoPage = () => {
  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Tráfico</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Predicción con Inteligencia Artificial</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-5 gradient-accent rounded-xl p-4 flex items-center gap-3"
      >
        <Brain className="h-8 w-8 text-accent-foreground/70" />
        <div>
          <h3 className="font-display font-semibold text-accent-foreground text-sm">Modelo YOLO + Series Temporales</h3>
          <p className="text-xs text-accent-foreground/70 mt-0.5">
            Análisis de cámaras DGT con visión artificial y datos meteorológicos
          </p>
        </div>
      </motion.div>

      <div className="mt-5 flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="font-display font-semibold text-foreground">Zonas monitorizadas</h2>
      </div>

      <div className="space-y-2.5">
        {zones.map((zone, i) => (
          <TrafficCard key={zone.zone} {...zone} index={i} />
        ))}
      </div>
    </div>
  );
};

export default TraficoPage;
