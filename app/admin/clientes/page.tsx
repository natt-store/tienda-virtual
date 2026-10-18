"use client";

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
type Cliente = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  prefs: any;
  acepta_politica: boolean;
  es_invitado: boolean;
  created_at: string;
};

type Pedido = {
  id: number;
  order_number: string;
  date: string;
  total: number;
  status: string;
  devuelto: boolean;
  buyer: any;
};

type ClienteConStats = Cliente & {
  pedidos: number;
  totalGastado: number;
  ultimaCompra: string | null;
  pedidosData: Pedido[];
};

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<ClienteConStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [detalle, setDetalle] = useState<ClienteConStats | null>(null);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);

    const { data: clientesData } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending: false });

    const { data: pedidosData } = await supabase
      .from("pedidos")
      .select("*")
      .order("date", { ascending: false });

    const pedidos = pedidosData || [];
    const clientesBase: Cliente[] = clientesData || [];

    const combinados: ClienteConStats[] = clientesBase.map((c) => {
      const pedidosCliente = pedidos.filter((p) => {
        const correoPedido = (p.buyer?.correo || "").toLowerCase().trim();
        return correoPedido === c.email.toLowerCase().trim();
      });

      const noDevueltos = pedidosCliente.filter((p) => !p.devuelto);
      const totalGastado = noDevueltos.reduce(
        (a, p) => a + (p.total || 0),
        0
      );

      return {
        ...c,
        es_invitado: c.es_invitado ?? true,
        pedidos: pedidosCliente.length,
        totalGastado,
        ultimaCompra: pedidosCliente[0]?.date || null,
        pedidosData: pedidosCliente,
      };
    });

    combinados.sort((a, b) => b.totalGastado - a.totalGastado);
    setClientes(combinados);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes;

    return clientes.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q)
    );
  }, [clientes, query]);

  /* ========== EDITAR ========== */
  const handleSaveEdit = async () => {
    if (!editing) return;
    if (!editing.email.trim()) {
      alert("El correo no puede quedar vacío.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("clientes")
      .update({
        name: editing.name?.trim() || null,
        email: editing.email.trim().toLowerCase(),
        phone: editing.phone?.trim() || null,
        prefs: editing.prefs || { email: true, whatsapp: false, sms: false },
        acepta_politica: editing.acepta_politica,
        es_invitado: editing.es_invitado,
      })
      .eq("id", editing.id);

    setSaving(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setEditing(null);
    load();
  };

  /* ========== BORRAR ========== */
  const handleDelete = async (c: Cliente) => {
    const confirm = window.confirm(
      `¿Borrar a "${c.name || c.email}"?\n\nOJO: los pedidos NO se borran, solo desaparece de la lista de clientes.`
    );
    if (!confirm) return;

    setDeleting(true);

    const { error } = await supabase.from("clientes").delete().eq("id", c.id);

    setDeleting(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    if (detalle?.id === c.id) setDetalle(null);
    load();
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const totalClientes = clientes.length;
  const clientesRegistrados = clientes.filter((c) => !c.es_invitado).length;
  const clientesInvitados = clientes.filter((c) => c.es_invitado).length;
  const clientesConCompras = clientes.filter((c) => c.pedidos > 0).length;
  const totalFacturado = clientes.reduce((a, c) => a + c.totalGastado, 0);
  const ticketPromedioGlobal =
    clientesConCompras > 0
      ? Math.round(totalFacturado / clientesConCompras)
      : 0;

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
            Comunidad
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
            Clientes
          </h1>
          <p className="mt-1 text-sm text-[#67545d]">
            {totalClientes} en total · {clientesRegistrados} con cuenta ·{" "}
            {clientesInvitados} invitados
          </p>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #ff1493, transparent)",
            }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
            Total clientes
          </p>
          <p className="mt-2 text-2xl font-black text-[#ff1493]">
            {totalClientes}
          </p>
          <p className="text-[10px] text-[#67545d]">
            {clientesConCompras} han comprado
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #a83cff, transparent)",
            }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
            Ticket promedio
          </p>
          <p className="mt-2 text-2xl font-black text-[#a83cff]">
            {formatPrice(ticketPromedioGlobal)}
          </p>
          <p className="text-[10px] text-[#67545d]">
            Por cliente que compra
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #00bfc0, transparent)",
            }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
            Facturado en total
          </p>
          <p className="mt-2 text-2xl font-black text-[#00bfc0]">
            {formatPrice(totalFacturado)}
          </p>
          <p className="text-[10px] text-[#67545d]">
            Sin contar pedidos devueltos
          </p>
        </div>
      </div>

      {/* FILTRO */}
      <div className="rounded-[24px] border border-white/60 bg-white/75 p-5 backdrop-blur-md">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#67545d]">
            <IconSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] py-3 pl-11 pr-4 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white"
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/80 backdrop-blur-md">
        <div className="hidden border-b border-[#24191f]/8 bg-[#f9f4f0] px-6 py-3 lg:grid lg:grid-cols-[1fr_180px_140px_140px_120px] lg:items-center lg:gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Cliente
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Contacto
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Pedidos
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#67545d]">
            Total gastado
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
              {query
                ? "No hay clientes que coincidan."
                : "Aún no hay clientes."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#24191f]/6">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="grid gap-3 px-5 py-4 transition hover:bg-[#f9f4f0]/60 sm:px-6 lg:grid-cols-[1fr_180px_140px_140px_120px] lg:items-center lg:gap-4"
              >
                {/* Cliente */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-black text-[#24191f]">
                      {c.name || c.email.split("@")[0]}
                    </p>
                    {c.es_invitado ? (
                      <span className="rounded-full bg-[#a83cff]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#a83cff]">
                        Invitado
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#00bfc0]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#008f91]">
                        Con cuenta
                      </span>
                    )}
                  </div>
                  {c.ultimaCompra && (
                    <p className="text-[10px] text-[#67545d]">
                      Última compra: {formatDate(c.ultimaCompra)}
                    </p>
                  )}
                </div>

                {/* Contacto */}
                <div className="min-w-0">
                  <p className="truncate text-xs text-[#67545d]">{c.email}</p>
                  {c.phone && (
                    <p className="text-[10px] text-[#67545d]">{c.phone}</p>
                  )}
                </div>

                {/* Pedidos */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                      c.pedidos > 0
                        ? "bg-[#00bfc0]/15 text-[#008f91]"
                        : "bg-[#24191f]/8 text-[#67545d]"
                    }`}
                  >
                    {c.pedidos} {c.pedidos === 1 ? "pedido" : "pedidos"}
                  </span>
                </div>

                {/* Total */}
                <div className="text-xs font-black text-[#ff1493]">
                  {formatPrice(c.totalGastado)}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setDetalle(c)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    aria-label="Ver detalle"
                  >
                    <IconEye />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...c })}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    aria-label="Editar"
                  >
                    <IconEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    disabled={deleting}
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

      {/* MODAL DETALLE */}
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
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
                  Ficha del cliente
                </p>
                <h2 className="mt-1 truncate text-2xl font-black text-[#24191f]">
                  {detalle.name || detalle.email.split("@")[0]}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-xs text-[#67545d]">{detalle.email}</p>
                  {detalle.es_invitado ? (
                    <span className="rounded-full bg-[#a83cff]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#a83cff]">
                      Invitado
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#00bfc0]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#008f91]">
                      Con cuenta
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetalle(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d]"
              >
                <IconClose />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#24191f]/6 bg-white/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    Pedidos
                  </p>
                  <p className="mt-1 text-xl font-black text-[#ff1493]">
                    {detalle.pedidos}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#24191f]/6 bg-white/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    Total gastado
                  </p>
                  <p className="mt-1 text-xl font-black text-[#00bfc0]">
                    {formatPrice(detalle.totalGastado)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#24191f]/6 bg-white/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    Cliente desde
                  </p>
                  <p className="mt-1 text-xs font-black text-[#24191f]">
                    {formatDate(detalle.created_at)}
                  </p>
                </div>
              </div>

              {detalle.prefs && (
                <div className="mt-5 rounded-2xl border border-[#24191f]/6 bg-white/70 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                    Preferencias de contacto
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detalle.prefs?.email && (
                      <span className="rounded-full bg-[#ff1493]/12 px-3 py-1 text-[10px] font-black text-[#ff1493]">
                        Correo
                      </span>
                    )}
                    {detalle.prefs?.whatsapp && (
                      <span className="rounded-full bg-[#25d366]/15 px-3 py-1 text-[10px] font-black text-[#1a8a44]">
                        WhatsApp
                      </span>
                    )}
                    {detalle.prefs?.sms && (
                      <span className="rounded-full bg-[#00d9d9]/20 px-3 py-1 text-[10px] font-black text-[#008f91]">
                        SMS
                      </span>
                    )}
                    {!detalle.prefs?.email &&
                      !detalle.prefs?.whatsapp &&
                      !detalle.prefs?.sms && (
                        <span className="text-xs text-[#67545d]">
                          No autorizó promociones.
                        </span>
                      )}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                  Historial de pedidos
                </p>

                {detalle.pedidosData.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-white/70 py-8 text-center">
                    <p className="text-xs font-bold text-[#67545d]">
                      Este cliente aún no ha hecho pedidos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {detalle.pedidosData.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#24191f]/6 bg-white/70 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-black text-[#24191f]">
                              {p.order_number}
                            </p>
                            {p.devuelto && (
                              <span className="rounded-full bg-[#ff1493]/15 px-2 py-0.5 text-[9px] font-black uppercase text-[#ff1493]">
                                Devuelto
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#67545d]">
                            {formatDate(p.date)} · {p.status}
                          </p>
                        </div>
                        <p className="text-sm font-black text-[#ff1493]">
                          {formatPrice(p.total || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editing && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] shadow-2xl"
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
                  Editar cliente
                </p>
                <h2 className="mt-1 text-xl font-black text-[#24191f]">
                  {editing.name || editing.email}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d]"
              >
                <IconClose />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
              <Field label="Nombre completo">
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Correo">
                <input
                  type="email"
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Teléfono">
                <input
                  type="tel"
                  value={editing.phone || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Tipo de cliente">
                <select
                  value={editing.es_invitado ? "invitado" : "cuenta"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      es_invitado: e.target.value === "invitado",
                    })
                  }
                  className={inputClass}
                >
                  <option value="invitado">Invitado (sin cuenta)</option>
                  <option value="cuenta">Con cuenta</option>
                </select>
              </Field>

              <Field label="Preferencias de contacto">
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#24191f]/8 bg-white px-4 py-3">
                    <span className="text-xs font-bold">Correo</span>
                    <input
                      type="checkbox"
                      checked={editing.prefs?.email ?? false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          prefs: {
                            ...(editing.prefs || {}),
                            email: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 accent-[#ff1493]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#24191f]/8 bg-white px-4 py-3">
                    <span className="text-xs font-bold">WhatsApp</span>
                    <input
                      type="checkbox"
                      checked={editing.prefs?.whatsapp ?? false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          prefs: {
                            ...(editing.prefs || {}),
                            whatsapp: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 accent-[#25d366]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#24191f]/8 bg-white px-4 py-3">
                    <span className="text-xs font-bold">SMS</span>
                    <input
                      type="checkbox"
                      checked={editing.prefs?.sms ?? false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          prefs: {
                            ...(editing.prefs || {}),
                            sms: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 accent-[#00bfc0]"
                    />
                  </label>
                </div>
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#24191f]/8 p-6">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#24191f]/10 bg-white px-6 py-3 text-sm font-bold text-[#67545d] transition hover:bg-[#f5eee7]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="rounded-full bg-[#ff1493] px-7 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] px-4 py-3 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
        {label}
      </label>
      {children}
    </div>
  );
}