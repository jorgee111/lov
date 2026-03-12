import { Bus, Clock, MapPin } from "lucide-react";
import OccupancyIndicator from "./OccupancyIndicator";
import { motion } from "framer-motion";

export interface BusLineData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  eta: number;
  occupancy: "low" | "medium" | "high";
  occupancyPercent: number;
  color: string;
}

const BusLineCard = ({ line, index }: { line: BusLineData; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 flex items-center gap-4"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl font-display font-bold text-sm"
        style={{ backgroundColor: line.color + "22", color: line.color }}
      >
        {line.name}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground truncate">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{line.origin} → {line.destination}</span>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{line.eta} min</span>
          </div>
          <OccupancyIndicator level={line.occupancy} percentage={line.occupancyPercent} size="sm" />
        </div>
      </div>
      <div className="flex items-center">
        <Bus className="h-5 w-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
};

export default BusLineCard;
