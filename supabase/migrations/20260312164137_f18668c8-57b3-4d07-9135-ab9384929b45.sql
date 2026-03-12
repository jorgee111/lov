
CREATE TABLE public.buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line text NOT NULL,
  destination text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  occupancy_pct integer NOT NULL DEFAULT 0,
  occupancy_level text NOT NULL DEFAULT 'low',
  speed_kmh integer DEFAULT 0,
  driver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view buses
CREATE POLICY "Authenticated users can view buses"
ON public.buses FOR SELECT TO authenticated
USING (true);

-- Conductors can update their own bus
CREATE POLICY "Conductors can update their bus"
ON public.buses FOR UPDATE TO authenticated
USING (driver_id = auth.uid());

-- Gestors can do everything
CREATE POLICY "Gestors full access"
ON public.buses FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'gestor'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.buses;
