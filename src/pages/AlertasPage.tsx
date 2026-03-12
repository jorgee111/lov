import { motion } from "framer-motion";
import AlertCard from "@/components/AlertCard";
import { Bell } from "lucide-react";

const alerts = [
  { type: "warning" as const, title: "Retraso Línea 82", message: "Retraso de 8 minutos debido a obras en Pirámides. Ruta alternativa: Línea 27.", time: "Hace 5 min" },
  { type: "info" as const, title: "Desvío temporal M-30", message: "Obras de mantenimiento en M-30 Sur entre km 12-15. Desvío por salida anterior.", time: "Hace 15 min" },
  { type: "success" as const, title: "Línea N1 restablecida", message: "El servicio nocturno de la línea N1 ha sido restablecido con normalidad.", time: "Hace 32 min" },
  { type: "warning" as const, title: "Alta ocupación Línea 1", message: "Ocupación superior al 85% en Línea 1 dirección Sol. Considere la Línea 44 como alternativa.", time: "Hace 45 min" },
  { type: "info" as const, title: "Mantenimiento programado", message: "Mañana 13/03 la Línea 132 tendrá frecuencia reducida de 6:00 a 9:00 por mantenimiento preventivo.", time: "Hace 1h" },
  { type: "success" as const, title: "Tráfico normalizado en A6", message: "El tráfico en la A6 se ha normalizado tras las retenciones de esta mañana.", time: "Hace 2h" },
];

const AlertasPage = () => {
  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Alertas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Notificaciones del servicio</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-foreground" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {alerts.length}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 space-y-2.5">
        {alerts.map((alert, i) => (
          <AlertCard key={i} {...alert} index={i} />
        ))}
      </div>
    </div>
  );
};

export default AlertasPage;
