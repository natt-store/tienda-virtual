"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/* =========================================================
   TARJETAS DE CATEGORÍAS (Las 5 principales)
========================================================= */
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
    color: "#ff8400",
    orden: 1,
    activa: true,
  },
  {
    id: 2,
    nombre: "Hogar",
    subtitulo: "Espacios",
    imagen: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/hogar",
    color: "#a83cff",
    orden: 2,
    activa: true,
  },
  {
    id: 3,
    nombre: "Papelería",
    subtitulo: "Crear",
    imagen: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/papeleria-kawaii",
    color: "#ff8400",
    orden: 3,
    activa: true,
  },
  {
    id: 4,
    nombre: "Temporada",
    subtitulo: "Especial",
    imagen: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/temporada",
    color: "#a83cff",
    orden: 4,
    activa: true,
  },
  {
    id: 5,
    nombre: "Accesorios",
    subtitulo: "Estilo",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/accesorios",
    color: "#c5a059",
    orden: 5,
    activa: true,
  },
];

export function useTarjetasCategorias() {
  const [tarjetas] = useState<TarjetaCategoria[]>(fallbackTarjetas);
  const [loading] = useState(false);

  return { tarjetas, loading };
}

/* =========================================================
   PÁGINAS DE CATEGORÍAS (Con los nuevos colores de Accesorios)
========================================================= */
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
    color_principal: "#c5a059", // Dorado / Champaña elegante
    color_secundario: "#7d9d8c", // Verde salvia sofisticado
    banner_final_titulo: "Detalles que hacen la diferencia.",
    banner_final_descripcion: "Sigue explorando Natt Store y encuentra esos productos que simplemente se sienten hechos para ti.",
    banner_final_texto_boton: "Explorar tienda",
    banner_final_enlace: "/tienda",
    activa: true,
  },
  temporada: {
    id: 4,
    slug: "temporada",
    etiqueta: "Colección Temporada",
    titulo: "Temporada",
    subtitulo: "especial.",
    descripcion: "Descubre los productos ideales para celebrar cada época del año con magia y alegría.",
    imagen_principal: null,
    color_principal: "#ff2fa4",
    color_secundario: "#a83cff",
    banner_final_titulo: "Detalles que hacen la diferencia.",
    banner_final_descripcion: "Sigue explorando Natt Store y encuentra esos productos que simplemente se sienten hechos para ti.",
    banner_final_texto_boton: "Explorar tienda",
    banner_final_enlace: "/tienda",
    activa: true,
  },
};

export function usePaginaCategoria(slug: string) {
  const [pagina] = useState<PaginaCategoria | null>(fallbackPaginas[slug] || null);
  const [loading] = useState(false);

  return { pagina, loading };
}