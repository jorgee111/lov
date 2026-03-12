import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Bus, Users, Gauge, RefreshCw } from "lucide-react";

interface BusData {
  id: string;
  line: string;
  destination: string;
  lat: number;
  lng: number;
  occupancy_pct: number;
  occupancy_level: string;
  speed_kmh: number;
  is_active: boolean;
}

const getOccupancyColor = (level: string) => {
  switch (level) {
    case "low": return "#22c55e";
    case "medium": return "#f59e0b";
    case "high": return "#ef4444";
    default: return "#22c55e";
  }
};

const getOccupancyLabel = (level: string) => {
  switch (level) {
    case "low": return "Bajo";
    case "medium": return "Medio";
    case "high": return "Alto";
    default: return "Bajo";
  }
};

const createBusIcon = (line: string, occupancyLevel: string) => {
  const color = getOccupancyColor(occupancyLevel);
  return L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="
        background: ${color};
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
        font-family: 'Space Grotesk', sans-serif;
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">${line}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const MADRID_CENTER: [number, number] = [40.4168, -3.7038];

const FitBounds = ({ buses }: { buses: BusData[] }) => {
  const map = useMap();
  useEffect(() => {
    if (buses.length > 0) {
      const bounds = L.latLngBounds(buses.map(b => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [buses.length]);
  return null;
};

const MapaPage = () => {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    const { data } = await supabase
      .from("buses")
      .select("*")
      .eq("is_active", true);
    if (data) setBuses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBuses();

    const channel = supabase
      .channel("buses-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const newBus = payload.new as BusData;
            setBuses((prev) => {
              const idx = prev.findIndex((b) => b.id === newBus.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = newBus;
                return updated;
              }
              return [...prev, newBus];
            });
          }
          if (payload.eventType === "DELETE") {
            setBuses((prev) => prev.filter((b) => b.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const activeBuses = buses.filter(b => b.is_active);
  const avgOccupancy = activeBuses.length
    ? Math.round(activeBuses.reduce((s, b) => s + b.occupancy_pct, 0) / activeBuses.length)
    : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-12 pb-3"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-display font-bold text-foreground">Mapa en vivo</h1>
          <button
            onClick={fetchBuses}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <div className="glass-card px-3 py-2 flex items-center gap-2 flex-1">
            <Bus className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Activos</p>
              <p className="text-sm font-display font-bold text-foreground">{activeBuses.length}</p>
            </div>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2 flex-1">
            <Users className="h-4 w-4 text-info" />
            <div>
              <p className="text-xs text-muted-foreground">Aforo medio</p>
              <p className="text-sm font-display font-bold text-foreground">{avgOccupancy}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <div className="flex-1 relative mx-4 mb-4 rounded-xl overflow-hidden border border-border">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-card">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <MapContainer
            center={MADRID_CENTER}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <FitBounds buses={activeBuses} />
            {activeBuses.map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={createBusIcon(bus.line, bus.occupancy_level)}
                eventHandlers={{
                  click: () => setSelectedBus(bus),
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{
                        background: getOccupancyColor(bus.occupancy_level),
                        color: "white",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontWeight: 700,
                        fontSize: 14,
                      }}>
                        Línea {bus.line}
                      </div>
                    </div>
                    <p style={{ margin: "4px 0", fontSize: 13 }}>
                      <strong>Destino:</strong> {bus.destination}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: 13 }}>
                      <strong>Aforo:</strong> {bus.occupancy_pct}% ({getOccupancyLabel(bus.occupancy_level)})
                    </p>
                    <p style={{ margin: "4px 0", fontSize: 13 }}>
                      <strong>Velocidad:</strong> {bus.speed_kmh} km/h
                    </p>
                    <div style={{
                      marginTop: 8,
                      height: 6,
                      background: "#e5e7eb",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${bus.occupancy_pct}%`,
                        height: "100%",
                        background: getOccupancyColor(bus.occupancy_level),
                        borderRadius: 3,
                        transition: "width 0.3s",
                      }} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Bottom legend */}
      <div className="px-4 pb-4">
        <div className="glass-card p-3 flex items-center justify-around">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Bajo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Medio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPage;
