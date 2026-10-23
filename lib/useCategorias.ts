"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type TarjetaCategoria = {
  id: number;
  nombre: string;
  subtitulo: string | null;
  imagen: string | null;
  enlace: string;
  color: string | null;
  orden: number;
  activa: boolean;
};

const fallbackTarjetas: TarjetaCategoria[] = [
  {
    id: 1,
    nombre: "Maquillaje",
    subtitulo: "Belleza",
    imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/maquillaje",
    color: "#ff1493",
    orden: 1,
    activa: true,
  },
  {
    id: 2,
    nombre: "Hogar",
    subtitulo: "Espacios",
    imagen: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/hogar",
    color: "#00d9d9",
    orden: 2,
    activa: true,
  },
  {
    id: 3,
    nombre: "Papelería",
    subtitulo: "Crear",
    imagen: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/papeleria-kawaii",
    color: "#a83cff",
    orden: 3,
    activa: true,
  },
  {
    id: 4,
    nombre: "Temporada",
    subtitulo: "Especial",
    imagen: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/temporada",
    color: "#ff8400",
    orden: 4,
    activa: true,
  },
  {
    id: 5,
    nombre: "Accesorios",
    subtitulo: "Estilo",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/accesorios",
    color: "#00d9d9",
    orden: 5,
    activa: true,
  },
  {
    id: 6,
    nombre: "Mascotas",
    subtitulo: "Peluditos",
    imagen: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/mascotas",
    color: "#ff1493",
    orden: 6,
    activa: true,
  },
];

export function useTarjetasCategorias() {
  const [tarjetas, setTarjetas] = useState<TarjetaCategoria[]>(fallbackTarjetas);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarTarjetasSupabase() {
      try {
        const { data, error } = await supabase
          .from("tarjetas_categorias")
          .select("*")
          .order("orden", { ascending: true });

        if (data && data.length > 0) {
          const nombresEnDb = data.map((t: any) => t.nombre.toLowerCase());
          const faltantes = fallbackTarjetas.filter(
            (fb) => !nombresEnDb.includes(fb.nombre.toLowerCase())
          );
          setTarjetas([...data, ...faltantes].sort((a, b) => a.orden - b.orden));
        } else {
          setTarjetas(fallbackTarjetas);
        }
      } catch (err) {
        setTarjetas(fallbackTarjetas);
      } finally {
        setLoading(false);
      }
    }

    cargarTarjetasSupabase();
  }, []);

  return { tarjetas, loading };
}

export type PaginaCategoria = {
  id: number;
  slug: string;
  etiqueta: string | null;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  imagen_principal: string | null;
  color_principal: string | null;
  color_secundario: string | null;
  banner_final_titulo: string | null;
  banner_final_descripcion: string | null;
  banner_final_texto_boton: string | null;
  banner_final_enlace: string | null;
  activa: boolean;
};

const fallbackPaginas: Record<string, PaginaCategoria> = {
  accesorios: {
    id: 5,
    slug: "accesorios",
    etiqueta: "Colección Accesorios",
    titulo: "Accesorios",
    subtitulo: "para brillar.",
    descripcion: "Descubre complementos únicos, delicados y llenos de estilo para darle el toque final a cada uno de tus días.",
    imagen_principal: null,
    color_principal: "#00d9d9",
    color_secundario: "#a83cff",
    banner_final_titulo: "Detalles que hacen la diferencia.",
    banner_final_descripcion: "Sigue explorando Natt Store y encuentra esos productos que simplemente se sienten hechos para ti.",
    banner_final_texto_boton: "Explorar tienda",
    banner_final_enlace: "/tienda",
    activa: true,
  },
  mascotas: {
    id: 6,
    slug: "mascotas",
    etiqueta: "Colección Mascotas",
    titulo: "Mascotas",
    subtitulo: "y peluditos.",
    descripcion: "Todo lo mejor para el cuidado y la alegría de tus fieles compañeros de cuatro patas.",
    imagen_principal: null,
    color_principal: "#ff1493",
    color_secundario: "#a83cff",
    banner_final_titulo: "Detalles que hacen felices a tus peluditos.",
    banner_final_descripcion: "Sigue explorando Natt Store y encuentra todo lo que necesitas para tu mascota.",
    banner_final_texto_boton: "Explorar tienda",
    banner_final_enlace: "/tienda",
    activa: true,
  },
};

export function usePaginaCategoria(slug: string) {
  const [pagina, setPagina] = useState<PaginaCategoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPaginaSupabase() {
      try {
        if (!slug) return;

        let { data, error } = await supabase
          .from("paginas_categorias")
          .select("*")
          .ilike("slug", slug)
          .maybeSingle();

        if (!data) {
          const nombreNormalizado = slug.charAt(0).toUpperCase() + slug.slice(1);
          const res = await supabase
            .from("paginas_categorias")
            .select("*")
            .ilike("titulo", nombreNormalizado)
            .maybeSingle();
          data = res.data;
        }

        if (data) {
          setPagina(data);
        } else {
          setPagina(fallbackPaginas[slug] || {
            id: 99,
            slug: slug,
            etiqueta: `Colección ${slug}`,
            titulo: slug.charAt(0).toUpperCase() + slug.slice(1),
            subtitulo: "para enamorarte.",
            descripcion: "Descubre productos únicos y especiales pensados para ti.",
            imagen_principal: null,
            color_principal: "#ff1493",
            color_secundario: "#00d9d9",
            banner_final_titulo: "Detalles que hacen la diferencia.",
            banner_final_descripcion: "Sigue explorando Natt Store y encuentra tus favoritos.",
            banner_final_texto_boton: "Explorar tienda",
            banner_final_enlace: "/tienda",
            activa: true,
          });
        }
      } catch (err) {
        setPagina(fallbackPaginas[slug] || null);
      } finally {
        setLoading(false);
      }
    }

    cargarPaginaSupabase();
  }, [slug]);

  return { pagina, loading };
}