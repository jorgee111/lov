import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Shield, Users, AlertTriangle, BarChart3, Bus, MessageSquare, ChevronRight, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Bus3DModel } from "@/components/Bus3DModel";
interface Incident {
  id: string;
  type: string;
  title: string;
  description: string | null;
  line: string | null;
  status: string;
  created_at: string;
}

interface Suggestion {
  id: string;
  message: string;
  response: string | null;
  created_at: string;
}

const statusIcon = {
  abierta: <AlertTriangle className="h-4 w-4 text-warning" />,
  en_proceso: <Clock className="h-4 w-4 text-info" />,
  resuelta: <CheckCircle className="h-4 w-4 text-success" />,
};

// Mock Telemetry Data
const mockFleetTelemetry = [
  {
    id: "bus-01",
    line: "27",
    totalKm: 145200,
    lastService: "2023-11-15",
    tireWearFL: 85,
    tireWearFR: 80,
    tireWearRL: 45,
    tireWearRR: 20, // Critical
    glassCondition: "ok",
    engineStatus: "warning"
  },
  {
    id: "bus-02",
    line: "65",
    totalKm: 89000,
    lastService: "2024-01-10",
    tireWearFL: 90,
    tireWearFR: 92,
    tireWearRL: 88,
    tireWearRR: 85,
    glassCondition: "warning",
    engineStatus: "ok"
  },
  {
    id: "bus-03",
    line: "82",
    totalKm: 215000,
    lastService: "2023-08-05",
    tireWearFL: 15, // Critical
    tireWearFR: 10, // Critical
    tireWearRL: 12, // Critical
    tireWearRR: 15, // Critical
    glassCondition: "critical",
    engineStatus: "critical"
  }
];

const GestorDashboard = () => {
  const [tab, setTab] = useState<"incidents" | "stats" | "users" | "suggestions" | "fleet3d">("incidents");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 3D Fleet State
  const [selectedBusId, setSelectedBusId] = useState(mockFleetTelemetry[0].id);
  const selectedBus = mockFleetTelemetry.find(b => b.id === selectedBusId) || mockFleetTelemetry[0];

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    if (tab === "incidents") {
      const { data } = await supabase.from("incidents").select("*").order("created_at", { ascending: false });
      setIncidents(data || []);
    } else if (tab === "suggestions") {
      const { data } = await supabase.from("suggestions").select("*").order("created_at", { ascending: false });
      setSuggestions(data || []);
    }
    setLoading(false);
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("incidents").update({ status }).eq("id", id);
    if (error) toast.error("Error al actualizar");
    else {
      toast.success("Estado actualizado");
      loadData();
    }
  };

  const tabs = [
    { id: "incidents" as const, icon: AlertTriangle, label: "Incidencias" },
    { id: "stats" as const, icon: BarChart3, label: "Estadísticas" },
    { id: "users" as const, icon: Users, label: "Usuarios" },
    { id: "suggestions" as const, icon: MessageSquare, label: "Mensajes" },
    { id: "fleet3d" as const, icon: Bus, label: "Flota 3D" },
  ];

  // Mock stats
  const stats = [
    { label: "Autobuses activos", value: "47", icon: Bus, color: "text-primary" },
    { label: "Incidencias hoy", value: "3", icon: AlertTriangle, color: "text-warning" },
    { label: "Pasajeros/hora", value: "3.2K", icon: Users, color: "text-info" },
    { label: "Líneas operativas", value: "12/12", icon: CheckCircle, color: "text-success" },
  ];

  const mockUsers = [
    { name: "Carlos López", role: "conductor", line: "27", status: "activo" },
    { name: "Ana García", role: "conductor", line: "65", status: "activo" },
    { name: "Pedro Martín", role: "conductor", line: "82", status: "descanso" },
    { name: "María Ruiz", role: "gestor", line: null, status: "activo" },
    { name: "Luis Fernández", role: "pasajero", line: null, status: "activo" },
  ];

  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Panel Gestor</h1>
            <p className="text-xs text-muted-foreground">Gestión operativa de flota</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 bg-card rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
              tab === t.id ? "bg-secondary text-primary" : "text-muted-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Incidents Tab */}
      {tab === "incidents" && (
        <div className="mt-4 space-y-2.5">
          {incidents.length === 0 && !loading && (
            <p className="text-center text-sm text-muted-foreground py-8">No hay incidencias registradas</p>
          )}
          {incidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {statusIcon[inc.status as keyof typeof statusIcon]}
                    <h3 className="font-display font-semibold text-sm text-foreground">{inc.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{inc.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      inc.type === "urgencia" ? "bg-destructive/15 text-destructive" :
                      inc.type === "refuerzo" ? "bg-info/15 text-info" :
                      "bg-warning/15 text-warning"
                    }`}>
                      {inc.type}
                    </span>
                    {inc.line && <span>Línea {inc.line}</span>}
                    <span>{new Date(inc.created_at).toLocaleString("es-ES", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {inc.status !== "en_proceso" && (
                  <button onClick={() => updateIncidentStatus(inc.id, "en_proceso")} className="text-[11px] px-3 py-1 rounded-lg bg-info/15 text-info font-medium">
                    En proceso
                  </button>
                )}
                {inc.status !== "resuelta" && (
                  <button onClick={() => updateIncidentStatus(inc.id, "resuelta")} className="text-[11px] px-3 py-1 rounded-lg bg-success/15 text-success font-medium">
                    Resolver
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {tab === "stats" && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 glass-card p-4"
          >
            <h3 className="font-display font-semibold text-foreground mb-3">Ocupación por línea</h3>
            {[
              { line: "27", pct: 30, color: "bg-success" },
              { line: "65", pct: 62, color: "bg-warning" },
              { line: "82", pct: 91, color: "bg-destructive" },
              { line: "44", pct: 18, color: "bg-success" },
              { line: "132", pct: 55, color: "bg-warning" },
            ].map((l) => (
              <div key={l.line} className="flex items-center gap-3 mb-2.5">
                <span className="text-xs font-display font-bold text-foreground w-8">{l.line}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.pct}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full rounded-full ${l.color}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{l.pct}%</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="mt-4 space-y-2.5">
          {mockUsers.map((u, i) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-3.5 flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-display font-bold text-primary">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{u.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {u.role} {u.line && `· Línea ${u.line}`}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                u.status === "activo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}>
                {u.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Suggestions Tab */}
      {tab === "suggestions" && (
        <div className="mt-4 space-y-2.5">
          {suggestions.length === 0 && !loading && (
            <p className="text-center text-sm text-muted-foreground py-8">No hay mensajes de usuarios</p>
          )}
          {suggestions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <p className="text-sm text-foreground">{s.message}</p>
              <span className="mt-1 text-[11px] text-muted-foreground block">
                {new Date(s.created_at).toLocaleString("es-ES")}
              </span>
              {s.response && (
                <div className="mt-2 bg-secondary/50 rounded-lg p-2.5">
                  <p className="text-xs text-foreground">{s.response}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Fleet 3D Tab */}
      {tab === "fleet3d" && (
        <div className="mt-4 flex flex-col gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Selector */}
          <div className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold text-sm">Seleccionar Autobús:</span>
            </div>
            <select 
              className="bg-secondary text-foreground text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
            >
              {mockFleetTelemetry.map(b => (
                <option key={b.id} value={b.id}>Bus {b.id} (Línea {b.line})</option>
              ))}
            </select>
          </div>

          {/* 3D Viewer Area */}
          <div className="flex-1 glass-card overflow-hidden relative rounded-xl border border-border/50 bg-background/50">
            <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/50">
              <p className="text-xs font-medium text-muted-foreground">Interactúa con el modelo 3D</p>
            </div>
            <Canvas shadows camera={{ position: [5, 4, 6], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <Environment preset="city" />
                <Bus3DModel 
                  tireWearFL={selectedBus.tireWearFL}
                  tireWearFR={selectedBus.tireWearFR}
                  tireWearRL={selectedBus.tireWearRL}
                  tireWearRR={selectedBus.tireWearRR}
                  glassCondition={selectedBus.glassCondition}
                  engineStatus={selectedBus.engineStatus}
                  onPartClick={(part) => toast.info(`Inspeccionando: ${part}`)}
                />
                <ContactShadows position={[0, -0.4, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              </Suspense>
              <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Canvas>
          </div>

          {/* Telemetry Data Panel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3">
              <p className="text-[11px] text-muted-foreground mb-1">Kilometraje Total</p>
              <p className="text-lg font-display font-bold text-foreground">
                {selectedBus.totalKm.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">km</span>
              </p>
            </div>
            <div className="glass-card p-3">
              <p className="text-[11px] text-muted-foreground mb-1">Última Revisión</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(selectedBus.lastService).toLocaleDateString("es-ES")}
              </p>
            </div>
            <div className="col-span-2 glass-card p-3 space-y-2">
              <p className="text-[11px] text-muted-foreground">Estado de Neumáticos (Vida útil %)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center bg-secondary/50 px-2 py-1.5 rounded-lg">
                  <span className="text-xs text-foreground">Frontal Izq.</span>
                  <span className={`text-xs font-bold ${selectedBus.tireWearFL < 30 ? 'text-destructive' : selectedBus.tireWearFL < 60 ? 'text-warning' : 'text-success'}`}>{selectedBus.tireWearFL}%</span>
                </div>
                <div className="flex justify-between items-center bg-secondary/50 px-2 py-1.5 rounded-lg">
                  <span className="text-xs text-foreground">Frontal Der.</span>
                  <span className={`text-xs font-bold ${selectedBus.tireWearFR < 30 ? 'text-destructive' : selectedBus.tireWearFR < 60 ? 'text-warning' : 'text-success'}`}>{selectedBus.tireWearFR}%</span>
                </div>
                <div className="flex justify-between items-center bg-secondary/50 px-2 py-1.5 rounded-lg">
                  <span className="text-xs text-foreground">Trasera Izq.</span>
                  <span className={`text-xs font-bold ${selectedBus.tireWearRL < 30 ? 'text-destructive' : selectedBus.tireWearRL < 60 ? 'text-warning' : 'text-success'}`}>{selectedBus.tireWearRL}%</span>
                </div>
                <div className="flex justify-between items-center bg-secondary/50 px-2 py-1.5 rounded-lg">
                  <span className="text-xs text-foreground">Trasera Der.</span>
                  <span className={`text-xs font-bold ${selectedBus.tireWearRR < 30 ? 'text-destructive' : selectedBus.tireWearRR < 60 ? 'text-warning' : 'text-success'}`}>{selectedBus.tireWearRR}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestorDashboard;
