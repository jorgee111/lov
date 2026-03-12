import { useState } from "react";
import { motion } from "framer-motion";
import { User, LogOut, ChevronRight, Shield, Bus, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState("");
  const [sending, setSending] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSendSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSending(true);
    const { error } = await supabase.from("suggestions").insert({
      user_id: user!.id,
      message: suggestion,
    });
    if (error) toast.error("Error al enviar");
    else {
      toast.success("Sugerencia enviada");
      setSuggestion("");
    }
    setSending(false);
  };

  const roleLabels = { pasajero: "Pasajero", conductor: "Conductor", gestor: "Gestor" };
  const roleIcons = { pasajero: User, conductor: Bus, gestor: Shield };
  const RoleIcon = roleIcons[role || "pasajero"];

  return (
    <div className="px-4 pt-12 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Perfil</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-5 glass-card p-5 flex items-center gap-4"
      >
        <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center">
          <RoleIcon className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-foreground">{profile?.display_name || "Usuario"}</h2>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
          <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
            {roleLabels[role || "pasajero"]}
          </span>
        </div>
      </motion.div>

      {/* Role-specific info */}
      {role === "conductor" && profile?.assigned_line && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 glass-card p-4"
        >
          <p className="text-xs text-muted-foreground">Línea asignada</p>
          <p className="text-lg font-display font-bold text-primary">{profile.assigned_line}</p>
        </motion.div>
      )}

      {/* Suggestions */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onSubmit={handleSendSuggestion}
        className="mt-4 glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">Enviar sugerencia</h3>
        </div>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Escribe tu sugerencia o petición de asistencia..."
          rows={3}
          className="w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <button
          type="submit"
          disabled={sending || !suggestion.trim()}
          className="mt-2 w-full rounded-lg gradient-primary py-2 text-sm font-display font-semibold text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" /> Enviar
        </button>
      </motion.form>

      {/* Sign out */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={handleSignOut}
        className="mt-4 w-full glass-card p-4 flex items-center gap-3 text-destructive"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-sm font-medium">Cerrar sesión</span>
      </motion.button>
    </div>
  );
};

export default ProfilePage;
