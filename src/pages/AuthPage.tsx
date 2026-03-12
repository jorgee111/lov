import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Bus, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada correctamente");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Bus className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">CityFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Transporte inteligente para Madrid</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground text-center">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          {!isLogin && (
            <div>
              <label className="text-xs text-muted-foreground font-medium">Nombre</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
                required={!isLogin}
                className="mt-1 w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="mt-1 w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium">Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg bg-muted px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-primary py-2.5 text-sm font-display font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Cargando..." : isLogin ? "Entrar" : "Registrarse"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
