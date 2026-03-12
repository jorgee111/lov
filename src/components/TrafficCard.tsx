import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrafficCardProps {
  zone: string;
  status: "fluido" | "moderado" | "congestionado";
  trend: "up" | "down" | "stable";
  prediction: string;
  index: number;
}

const statusConfig = {
  fluido: { label: "Fluido", className: "bg-success/15 text-success border-success/20" },
  moderado: { label: "Moderado", className: "bg-warning/15 text-warning border-warning/20" },
  congestionado: { label: "Congestionado", className: "bg-destructive/15 text-destructive border-destructive/20" },
};

const TrafficCard = ({ zone, status, trend, prediction, index }: TrafficCardProps) => {
  const config = statusConfig[status];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">{zone}</h3>
          <span className={cn("mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className)}>
            {config.label}
          </span>
        </div>
        <TrendIcon className={cn(
          "h-5 w-5",
          trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
        )} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Predicción: <span className="text-foreground">{prediction}</span>
      </p>
    </motion.div>
  );
};

export default TrafficCard;
