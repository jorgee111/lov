import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const users = [
    { email: "pasajero@cityflow.test", password: "Pasajero123!", name: "Ana García", role: "pasajero" },
    { email: "conductor@cityflow.test", password: "Conductor123!", name: "Carlos López", role: "conductor" },
    { email: "gestor@cityflow.test", password: "Gestor123!", name: "María Admin", role: "gestor" },
  ];

  const results = [];

  for (const u of users) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { display_name: u.name, role: u.role },
    });

    if (error) {
      // If user exists, try updating role
      if (error.message?.includes("already")) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = listData?.users?.find((x: any) => x.email === u.email);
        if (existing) {
          // Update role in user_roles
          await supabaseAdmin.from("user_roles").upsert(
            { user_id: existing.id, role: u.role },
            { onConflict: "user_id" }
          );
          // Reset password
          await supabaseAdmin.auth.admin.updateUserById(existing.id, { password: u.password });
          results.push({ email: u.email, status: "updated", role: u.role });
        }
      } else {
        results.push({ email: u.email, status: "error", message: error.message });
      }
    } else {
      results.push({ email: u.email, status: "created", role: u.role });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
