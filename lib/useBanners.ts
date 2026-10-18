"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Banner = {
  id: number;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  imagen: string | null;
  texto_boton: string | null;
  enlace_boton: string | null;
  posicion: string;
  orden: number;
  activo: boolean;
};

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBanners() {
      setLoading(true);

      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "hero")
        .order("orden", { ascending: true });

      if (!mounted) return;

      if (!error) setBanners((data as Banner[]) || []);
      else setBanners([]);

      setLoading(false);
    }

    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  return { banners, loading };
}

/* =========================================================
   BARRA SUPERIOR (texto negro arriba del Navbar)
========================================================= */
export function useBarraSuperior() {
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchBarra() {
      const { data, error } = await supabase
        .from("barra_superior")
        .select("*")
        .eq("activo", true)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (!error && data) setTexto(data.texto);
    }

    fetchBarra();

    return () => {
      mounted = false;
    };
  }, []);

  return texto;
}