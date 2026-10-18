"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

/* =========================================================
   ICONOS
========================================================= */
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   TIPOS
========================================================= */
type Pedido = {
  id: number;
  order_number: string;
  date: string;
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  buyer: any;
  account_email?: string;
  status: string;
  devuelto: boolean;
};

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [detalle, setDetalle] = useState<Pedido | null>(null);

  const load = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("date", { ascending: false });

    setPedidos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const estadosDisponibles = useMemo(() => {
    const set = new Set<string>();
    pedidos.forEach((p) => set.add(p.status || "Pendiente de pago"));
    return ["Todos", ...Array.from(set)];
  }, [pedidos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return pedidos.filter((p) => {
      const matchEstado =
        estadoFiltro === "Todos" || p.status === estadoFiltro;

      const buyer = p.buyer || {};
      const matchQuery =
        !q ||
        p.order_number?.toLowerCase().includes(q) ||
        buyer.nombre?.toLowerCase().includes(q) ||
        buyer.apellido?.toLowerCase().includes(q) ||
        buyer.correo?.toLowerCase().includes(q);

      return matchEstado && matchQuery;
    });
  }, [pedidos, query, estadoFiltro]);

  const cambiarEstado = async (pedido: Pedido, nuevoEstado: string) => {
    const { error } = await supabase
      .from("pedidos")
      .update({ status: nuevoEstado })
      .eq("id", pedido.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setPedidos((current) =>
      current.map((p) =>
        p.id === pedido.id ? { ...p, status: nuevoEstado } : p
      )
    );

    if (detalle?.id === pedido.id) {
      setDetalle({ ...detalle, status: nuevoEstado });
    }
  };

  const toggleDevuelto = async (pedido: Pedido) => {
    const nuevo = !pedido.devuelto;

    const confirm = window.confirm(
      nuevo
        ? `¿Marcar el pedido ${pedido.order_number} como devuelto?`
        : `¿Quitar la marca de devuelto del pedido ${pedido.order_number}?`
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("pedidos")
      .update({ devuelto: nuevo })
      .eq("id", pedido.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setPedidos((current) =>
      current.map((p) =>
        p.id === pedido.id ? { ...p, devuelto: nuevo } : p
      )
    );

    if (detalle?.id === pedido.id) {
      setDetalle({ ...detalle, devuelto: nuevo });
    }
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const estadoColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pendiente")) return "bg-[#ff1493]/12 text-[#ff1493]";
    if (s.includes("enviado") || s.includes("en camino"))
      return "bg-[#a83cff]/12 text-[#a83cff]";
    if (s.includes("entregado")) return "bg-[#00bfc0]/15 text-[#008f91]";
    if (s.includes("cancelado")) return "bg-[#24191f]/10 text-[#67545d]";
    return "bg-[#00bfc0]/15 text-[#008f91]";
  };

  return (
    <div className="relative space-y-5">
      {/* ENCABEZADO */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] px-7 py-7 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-9 sm:py-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#ff1493]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#00d9d9]/12 blur-3xl" />

        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
          }}
        />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
            Ventas
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
            Pedidos
          </h1>
          <p className="mt-1 text-sm text-[#67545d]">
            {pedidos.length} en total ·{" "}
            {pedidos.filter((p) => p.devuelto).length} devueltos
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="rounded-[24px] border border-white/60 bg-white/75 p-5 backdrop-blur-md">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#67545d]">
              <IconSearch />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por número, nombre o correo..."
              className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] py-3 pl-11 pr-4 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {estadosDisponibles.map((s) => {
              const active = estadoFiltro === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEstadoFiltro(s)}
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

      {/* LISTA */}
      <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/80 backdrop-blur-md">
        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#f5eee7]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-bold text-[#67545d]">
              No hay pedidos que coincidan.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#24191f]/6">
            {filtered.map((p) => {
              const esRegalo = p.buyer?.esRegalo;

              return (
                <div
                  key={p.id}
                  className="grid gap-3 px-5 py-4 transition hover:bg-[#f9f4f0]/60 sm:px-6 lg:grid-cols-[1fr_180px_140px_120px] lg:items-center lg:gap-4"
                >
                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-black text-[#24191f]">
                        {p.order_number}
                      </p>
                      {p.devuelto && (
                        <span className="rounded-full bg-[#ff1493]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#ff1493]">
                          Devuelto
                        </span>
                      )}
                      {esRegalo && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-pink-700 border border-pink-200">
                          Regalo 🎁
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#67545d]">
                      {p.buyer?.nombre} {p.buyer?.apellido} ·{" "}
                      {p.buyer?.correo}
                    </p>
                    <p className="text-[10px] text-[#67545d]">
                      {formatDate(p.date)}
                    </p>
                  </div>

                  {/* Estado */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${estadoColor(
                        p.status || ""
                      )}`}
                    >
                      {p.status || "Pendiente"}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-xs font-black text-[#24191f] lg:text-right">
                    {formatPrice(p.total || 0)}
                    <p className="text-[10px] font-normal text-[#67545d]">
                      {p.items?.length || 0}{" "}
                      {(p.items?.length || 0) === 1 ? "producto" : "productos"}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setDetalle(p)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                      aria-label="Ver detalle"
                    >
                      <IconEye />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE DETALLE */}
      {detalle && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10 backdrop-blur-sm"
          onClick={() => setDetalle(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute left-0 right-0 top-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
              }}
            />

            <div className="flex items-start justify-between gap-4 border-b border-[#24191f]/8 p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
                  Detalle del pedido
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#24191f]">
                  {detalle.order_number}
                </h2>
                <p className="mt-1 text-xs text-[#67545d]">
                  {formatDate(detalle.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetalle(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d]"
              >
                <IconClose />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
              {/* Estado + devolución */}
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    Estado
                  </p>
                  <select
                    value={detalle.status || "Pendiente de pago"}
                    onChange={(e) => cambiarEstado(detalle, e.target.value)}
                    className="mt-1 rounded-2xl border border-[#24191f]/10 bg-white px-4 py-2 text-xs font-bold outline-none focus:border-[#ff1493]/40"
                  >
                    <option value="Pendiente de pago">Pendiente de pago</option>
                    <option value="Pagado">Pagado</option>
                    <option value="En preparación">En preparación</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    Devolución
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleDevuelto(detalle)}
                    className={`mt-1 rounded-full px-4 py-2 text-xs font-black transition ${
                      detalle.devuelto
                        ? "bg-[#ff1493] text-white"
                        : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    }`}
                  >
                    {detalle.devuelto ? "✓ Devuelto" : "Marcar devuelto"}
                  </button>
                </div>
              </div>

              {/* AVISO DE REGALO SI APLICA */}
              {detalle.buyer?.esRegalo && (
                <div className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-4 shadow-sm">
                  <p className="text-xs font-black text-pink-700 uppercase tracking-wide flex items-center gap-1.5">
                    🎁 Este pedido es un REGALO
                  </p>
                  <p className="mt-2 text-xs text-[#24191f] leading-5">
                    <span className="font-bold">Dedicatoria / Nota:</span> "{detalle.buyer?.mensajeRegalo || "Sin mensaje especificado"}"
                  </p>
                </div>
              )}

              {/* INFORMACIÓN INTELIGENTE DE CUENTA VS DESTINATARIO */}
              <div className="rounded-2xl border border-[#24191f]/6 bg-white/70 p-5 space-y-3">
                {detalle.account_email && detalle.account_email.trim().toLowerCase() !== (detalle.buyer?.correo || "").trim().toLowerCase() ? (
                  <>
                    {/* CASO 1: Compró desde una cuenta pero los datos son de otra persona */}
                    <div className="border-b border-[#24191f]/8 pb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                        Titular de la Cuenta (Comprador)
                      </p>
                      <p className="text-xs font-black text-[#24191f] mt-1">
                        {detalle.account_email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff1493]">
                        Destinatario / Quien Recibe (Diferente)
                      </p>
                      <p className="text-sm font-black text-[#24191f] mt-1">
                        {detalle.buyer?.nombre} {detalle.buyer?.apellido}
                      </p>
                      <p className="text-xs text-[#67545d]">
                        Contacto: {detalle.buyer?.correo} · {detalle.buyer?.telefono}
                      </p>
                      <p className="text-xs text-[#67545d] mt-1">
                        Dirección: {detalle.buyer?.direccion}, {detalle.buyer?.ciudad} ({detalle.buyer?.departamento})
                      </p>
                      {detalle.buyer?.infoAdicional && (
                        <p className="text-xs italic text-[#67545d] mt-1">
                          Indicaciones: "{detalle.buyer.infoAdicional}"
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* CASO 2: Es la misma persona, se muestra normal */}
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                      Información de entrega
                    </p>
                    <p className="text-sm font-black text-[#24191f]">
                      {detalle.buyer?.nombre} {detalle.buyer?.apellido}
                    </p>
                    <p className="text-xs text-[#67545d]">
                      Contacto: {detalle.buyer?.correo} · {detalle.buyer?.telefono}
                    </p>
                    <p className="text-xs text-[#67545d]">
                      Dirección: {detalle.buyer?.direccion}, {detalle.buyer?.ciudad} ({detalle.buyer?.departamento})
                    </p>
                    {detalle.buyer?.infoAdicional && (
                      <p className="text-xs italic text-[#67545d]">
                        Indicaciones: "{detalle.buyer.infoAdicional}"
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Productos */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                  Productos
                </p>
                <div className="space-y-2">
                  {(detalle.items || []).map((it: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-[#24191f]/6 bg-white/70 p-3"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f5eee7]">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#24191f]">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-[#67545d]">
                          {it.category}
                        </p>
                      </div>
                      <p className="text-xs font-black text-[#24191f]">
                        {it.quantity} × {formatPrice(it.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="rounded-2xl border border-[#24191f]/6 bg-white/70 p-5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#67545d]">Subtotal</span>
                    <span className="font-bold">
                      {formatPrice(detalle.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#67545d]">Envío</span>
                    <span className="font-bold text-[#008f91]">
                      {detalle.shipping === 0
                        ? "Gratis"
                        : formatPrice(detalle.shipping || 0)}
                    </span>
                  </div>
                  {detalle.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#ff1493]">Descuento</span>
                      <span className="font-black text-[#ff1493]">
                        -{formatPrice(detalle.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#24191f]/10 pt-3">
                    <span className="font-black text-[#24191f]">Total</span>
                    <span className="text-lg font-black text-[#ff1493]">
                      {formatPrice(detalle.total || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}