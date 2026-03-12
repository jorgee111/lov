import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Route, Bus, Siren, MessageSquare, MapPin, Clock, ChevronRight, Plus, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const quickActions = [
  { icon: AlertTriangle, label: "Incidencia", type: "normal", color: "text-warning" },
  { icon: Siren, label: "Urgencia", type: "urgencia", color: "text-destructive" },
  { icon: Bus, label: "Refuerzo", type: "refuerzo", color: "text-info" },
];

const assignedRoute = {
  line: "27",
  stops: ["Embajadores", "Lavapiés", "Atocha", "Retiro", "Goya", "Diego de León", "Nuevos Ministerios", "Plaza Castilla"],
  currentStop: 3,
};

const ConductorDashboard = () => {
  const { profile } = useAuth();
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentType, setIncidentType] = useState<string>("normal");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("incidents").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id!,
      type: incidentType,
      title: incidentTitle,
      description: incidentDesc,
      line: profile?.assigned_line || "27",
    });
    if (error) {
      toast.error("Error al crear incidencia");
    } else {
      toast.success(incidentType === "urgencia" ? "⚠️ Incidencia de URGENCIA enviada" : "Incidencia enviada");
      setShowIncidentForm(false);
      setIncidentTitle("");
      setIncidentDesc("");
    }
    setSubmitting(false);
  };

  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
            <Bus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Panel Conductor</h1>
            <p className="text-xs text-muted-foreground">
              {profile?.display_name || "Conductor"} · Línea {profile?.assigned_line || "27"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => { setIncidentType(action.type); setShowIncidentForm(true); }}
            className="glass-card p-4 flex flex-col items-center gap-2"
          >
            <action.icon className={`h-6 w-6 ${action.color}`} />
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Incident Form */}
      {showIncidentForm && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateIncident}
          className="mt-4 glass-card p-4 space-y-3"
        >
          <h3 className="font-display font-semibold text-foreground text-sm">
            {incidentType === "urgencia" ? "🚨 Incidencia de URGENCIA" : incidentType === "refuerzo" ? "🚌 Solicitar Refuerzo" : "📋 Nueva Incidencia"}
          </h3>
          <input
            type="text"
            placeholder="Título de la incidencia"
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
            required
            className="w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            placeholder="Descripción..."
            value={incidentDesc}
            onChange={(e) => setIncidentDesc(e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowIncidentForm(false)}
              className="flex-1 rounded-lg bg-muted py-2 text-sm font-medium text-muted-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg gradient-primary py-2 text-sm font-display font-semibold text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Enviar
            </button>
          </div>
        </motion.form>
      )}

      {/* Current Route */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Route className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Ruta actual — Línea {assignedRoute.line}</h2>
        </div>
        <div className="glass-card p-4">
          <div className="space-y-0">
            {assignedRoute.stops.map((stop, i) => (
              <div key={stop} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full border-2 ${
                    i < assignedRoute.currentStop ? "bg-success border-success" :
                    i === assignedRoute.currentStop ? "bg-primary border-primary animate-pulse-dot" :
                    "bg-muted border-muted-foreground/30"
                  }`} />
                  {i < assignedRoute.stops.length - 1 && (
                    <div className={`w-0.5 h-6 ${i < assignedRoute.currentStop ? "bg-success/50" : "bg-muted-foreground/20"}`} />
                  )}
                </div>
                <span className={`text-sm ${
                  i === assignedRoute.currentStop ? "font-semibold text-primary" :
                  i < assignedRoute.currentStop ? "text-muted-foreground line-through" :
                  "text-foreground"
                }`}>
                  {stop}
                  {i === assignedRoute.currentStop && <span className="text-xs text-primary ml-1">← Actual</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-4 grid grid-cols-2 gap-3"
      >
        <div className="glass-card p-3.5">
          <Clock className="h-4 w-4 text-info" />
          <p className="mt-1.5 text-lg font-display font-bold text-foreground">14:32</p>
          <p className="text-[11px] text-muted-foreground">Próxima parada</p>
        </div>
        <div className="glass-card p-3.5">
          <MapPin className="h-4 w-4 text-success" />
          <p className="mt-1.5 text-lg font-display font-bold text-foreground">5/8</p>
          <p className="text-[11px] text-muted-foreground">Paradas restantes</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConductorDashboard;
