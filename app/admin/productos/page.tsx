"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/useProducts";

/* =========================================================
   ICONOS
========================================================= */
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M4 20H8L19 9L15 5L4 16V20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 6L18 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 7H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 7L8 20H16L17 7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [seccionFiltro, setSeccionFiltro] = useState("Todos");
  const [borrandoId, setBorrandoId] = useState<number | null>(null);

  async function loadProductos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setProductos(
        data.map((p: any) => ({ ...p, href: `/tienda/producto/${p.id}` }))
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProductos();
  }, []);

  const secciones = useMemo(() => {
    const set = new Set<string>();
    productos.forEach((p) => set.add(p.section));
    return ["Todos", ...Array.from(set)];
  }, [productos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return productos.filter((p) => {
      const matchSeccion =
        seccionFiltro === "Todos" || p.section === seccionFiltro;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchSeccion && matchQuery;
    });
  }, [productos, query, seccionFiltro]);

  const handleDelete = async (product: Product) => {
    const confirm = window.confirm(
      `¿Borrar "${product.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirm) return;

    setBorrandoId(product.id);

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", product.id);

    setBorrandoId(null);

    if (error) {
      alert("Error al borrar: " + error.message);
      return;
    }

    setProductos((current) => current.filter((p) => p.id !== product.id));
  };

  const handleToggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("productos")
      .update({ active: !product.active })
      .eq("id", product.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setProductos((current) =>
      current.map((p) =>
        p.id === product.id ? { ...p, active: !p.active } : p
      )
    );
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="relative space-y-5">
      {/* =========================================================
          ENCABEZADO
      ========================================================= */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] px-7 py-7 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-9 sm:py-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#ff1493]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#00d9d9]/12 blur-3xl" />

        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
          }}
        />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
              Catálogo
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Productos
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              {productos.length} en total · {productos.filter((p) => p.active).length} activos
            </p>
          </div>

          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 rounded-full bg-[#ff1493] px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4]"
          >
            <IconPlus />
            Nuevo producto
          </Link>
        </div>
      </div>

      {/* =========================================================
          FILTROS
      ========================================================= */}
      <div className="rounded-[24px] border border-white/60 bg-white/75 p-5 backdrop-blur-md">
        <div className="flex flex-wrap gap-3">
          {/* Buscador */}
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#67545d]">
              <IconSearch />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] py-3 pl-11 pr-4 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white"
            />
          </div>

          {/* Sección */}
          <div className="flex flex-wrap gap-2">
            {secciones.map((s) => {
              const active = seccionFiltro === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeccionFiltro(s)}
                  className={`rounded-full px-4 py-2.5 text-[11px] font-bold transition ${
                    active
                      ? "bg-[#ff1493] text-white shadow-[0_6px_18px_rgba(255,20,147,0.28)]"
                      : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          LISTA DE PRODUCTOS
      ========================================================= */}
      <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/80 backdrop-blur-md">
        {/* Header en desktop */}
        <div className="hidden border-b border-[#24191f]/8 bg-[#f9f4f0] px-6 py-3 lg:grid lg:grid-cols-[80px_1fr_120px_120px_100px_120px] lg:items-center lg:gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Imagen
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Producto
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Precio
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Stock
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Estado
          </span>
          <span className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Acciones
          </span>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-[#f5eee7]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-bold text-[#67545d]">
              No hay productos que coincidan.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#24191f]/6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="grid gap-3 px-5 py-4 transition hover:bg-[#f9f4f0]/60 sm:px-6 lg:grid-cols-[80px_1fr_120px_120px_100px_120px] lg:items-center lg:gap-4"
              >
                {/* Imagen */}
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#f5eee7]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff1493]">
                    {p.section} · {p.category}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-black text-[#24191f]">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-[#67545d]">ID: {p.id}</p>
                </div>

                {/* Precio */}
                <div className="text-xs font-black text-[#24191f]">
                  {formatPrice(p.price)}
                </div>

                {/* Stock */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                      p.stock <= (5 as number)
                        ? "bg-[#ff1493]/12 text-[#ff1493]"
                        : "bg-[#00bfc0]/15 text-[#008f91]"
                    }`}
                  >
                    {p.stock} uds
                  </span>
                </div>

                {/* Estado */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(p)}
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black transition ${
                      p.active
                        ? "bg-[#00bfc0]/15 text-[#008f91] hover:bg-[#00bfc0]/25"
                        : "bg-[#24191f]/8 text-[#67545d] hover:bg-[#24191f]/15"
                    }`}
                  >
                    {p.active ? "Activo" : "Inactivo"}
                  </button>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 lg:justify-end">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    aria-label="Editar"
                  >
                    <IconEdit />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    disabled={borrandoId === p.id}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493] disabled:opacity-50"
                    aria-label="Borrar"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}