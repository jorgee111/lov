import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  type: "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
  index: number;
}

const alertConfig = {
  warning: { icon: AlertTriangle, className: "border-l-warning text-warning" },
  info: { icon: Info, className: "border-l-info text-info" },
  success: { icon: CheckCircle, className: "border-l-success text-success" },
};

const AlertCard = ({ type, title, message, time, index }: AlertCardProps) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass-card border-l-4 p-4"
      style={{ borderLeftColor: `hsl(var(--${type === "warning" ? "warning" : type === "info" ? "info" : "success"}))` }}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.className)} />
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm text-foreground">{title}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
          <span className="mt-2 inline-block text-[10px] text-muted-foreground">{time}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
