"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
type Promocion = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: "porcentaje" | "monto_fijo" | "envio_gratis";
  valor: number;
  codigo: string | null;
  monto_minimo: number;
  usos_maximos: number | null;
  usos_actuales: number;
  activa: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
};

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminCuponesPage() {
  const [promos, setPromos] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Promocion | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promociones")
      .select("*")
      .order("id", { ascending: false });

    setPromos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.nombre.trim()) {
      alert("Escribe un nombre.");
      return;
    }
    if (!editing.codigo?.trim()) {
      alert("Escribe el código del cupón.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      nombre: editing.nombre.trim(),
      descripcion: editing.descripcion?.trim() || null,
      tipo: editing.tipo,
      valor: Number(editing.valor) || 0,
      codigo: editing.codigo.trim().toUpperCase().replace(/\s+/g, ""),
      monto_minimo: Number(editing.monto_minimo) || 0,
      usos_maximos: editing.usos_maximos ? Number(editing.usos_maximos) : null,
      activa: editing.activa,
      fecha_inicio: editing.fecha_inicio || null,
      fecha_fin: editing.fecha_fin || null,
    };

    const { error } = creating
      ? await supabase.from("promociones").insert(payload)
      : await supabase
          .from("promociones")
          .update(payload)
          .eq("id", editing.id);

    setSaving(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setMessage("Guardado correctamente.");
    setEditing(null);
    setCreating(false);
    setTimeout(() => setMessage(""), 3000);
    load();
  };

  const handleDelete = async (p: Promocion) => {
    const confirm = window.confirm(`¿Borrar el cupón "${p.codigo}"?`);
    if (!confirm) return;

    const { error } = await supabase.from("promociones").delete().eq("id", p.id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    load();
  };

  const startCreate = () => {
    setEditing({
      id: 0,
      nombre: "",
      descripcion: "",
      tipo: "porcentaje",
      valor: 10,
      codigo: "",
      monto_minimo: 0,
      usos_maximos: null,
      usos_actuales: 0,
      activa: true,
      fecha_inicio: null,
      fecha_fin: null,
    });
    setCreating(true);
  };

  const startEdit = (p: Promocion) => {
    setEditing({ ...p });
    setCreating(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setCreating(false);
  };

  const inputClass =
    "w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] px-4 py-3 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white";

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

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
              Promociones
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Cupones
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              {promos.length} en total · {promos.filter((p) => p.activa).length} activos
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="flex items-center gap-2 rounded-full bg-[#ff1493] px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4]"
          >
            <IconPlus />
            Nuevo cupón
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#008f91]/25 bg-[#008f91]/5 px-5 py-4 text-xs leading-5 text-[#008f91]">
        <b>¿Qué editas aquí?</b> Los cupones que tus clientes escriben en el{" "}
        <b>carrito</b> para obtener descuentos. Ej: <b>BIENVENIDA10</b>,{" "}
        <b>ENVIOGRATIS</b>.
      </div>

      {message && (
        <div className="rounded-2xl border border-[#00bfc0]/25 bg-[#00bfc0]/8 px-5 py-3 text-sm font-bold text-[#008f91]">
          {message}
        </div>
      )}

      {/* FORMULARIO */}
      {editing && (
        <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
            }}
          />

          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-[#24191f]">
              {creating ? "Nuevo cupón" : "Editar cupón"}
            </h2>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
            >
              <IconClose />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre interno">
              <input
                type="text"
                value={editing.nombre}
                onChange={(e) =>
                  setEditing({ ...editing, nombre: e.target.value })
                }
                placeholder="Ej: Bienvenida 10%"
                className={inputClass}
              />
            </Field>

            <Field label="Código (lo que escribe el cliente)">
              <input
                type="text"
                value={editing.codigo || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Ej: BIENVENIDA10"
                className={inputClass + " font-black uppercase tracking-wide"}
              />
            </Field>

            <Field label="Tipo de descuento">
              <select
                value={editing.tipo}
                onChange={(e) =>
                  setEditing({ ...editing, tipo: e.target.value as any })
                }
                className={inputClass}
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto_fijo">Monto fijo ($)</option>
                <option value="envio_gratis">Envío gratis</option>
              </select>
            </Field>

            <Field
              label={
                editing.tipo === "porcentaje"
                  ? "Valor (%)"
                  : editing.tipo === "monto_fijo"
                    ? "Valor ($)"
                    : "Sin valor"
              }
            >
              <input
                type="number"
                value={editing.valor}
                onChange={(e) =>
                  setEditing({ ...editing, valor: Number(e.target.value) })
                }
                disabled={editing.tipo === "envio_gratis"}
                className={inputClass + " disabled:opacity-50"}
              />
            </Field>

            <Field label="Monto mínimo de compra (0 = sin mínimo)">
              <input
                type="number"
                value={editing.monto_minimo}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    monto_minimo: Number(e.target.value),
                  })
                }
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Usos máximos (vacío = sin límite)">
              <input
                type="number"
                value={editing.usos_maximos || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    usos_maximos: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                placeholder="Sin límite"
                className={inputClass}
              />
            </Field>

            <Field label="Fecha inicio (opcional)">
              <input
                type="date"
                value={editing.fecha_inicio?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    fecha_inicio: e.target.value || null,
                  })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Fecha fin (opcional)">
              <input
                type="date"
                value={editing.fecha_fin?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditing({ ...editing, fecha_fin: e.target.value || null })
                }
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Descripción (opcional)">
                <textarea
                  value={editing.descripcion || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, descripcion: e.target.value })
                  }
                  rows={2}
                  placeholder="Ej: Descuento especial de bienvenida"
                  className={inputClass + " resize-none"}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#24191f]/8 bg-[#f9f4f0] px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-[#24191f]">
                    Cupón activo
                  </p>
                  <p className="text-[10px] text-[#67545d]">
                    Los clientes podrán usarlo en el carrito
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editing.activa}
                  onChange={(e) =>
                    setEditing({ ...editing, activa: e.target.checked })
                  }
                  className="h-5 w-5 accent-[#ff1493]"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-[#24191f]/10 bg-white px-6 py-3 text-sm font-bold text-[#67545d] transition hover:bg-[#f5eee7]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[#ff1493] px-7 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:opacity-60"
            >
              {saving ? "Guardando..." : creating ? "Crear cupón" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {/* LISTA */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 backdrop-blur-md">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-[#f5eee7]"
              />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-[#67545d]">
              No hay cupones todavía. Crea el primero.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {promos.map((p) => (
              <div
                key={p.id}
                className="grid gap-4 rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                        p.activa
                          ? "bg-[#00bfc0]/15 text-[#008f91]"
                          : "bg-[#24191f]/10 text-[#67545d]"
                      }`}
                    >
                      {p.activa ? "Activo" : "Inactivo"}
                    </span>

                    <span className="rounded-full bg-[#ff1493]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#ff1493]">
                      {p.tipo === "porcentaje"
                        ? `${p.valor}% off`
                        : p.tipo === "monto_fijo"
                          ? `$${p.valor.toLocaleString("es-CO")} off`
                          : "Envío gratis"}
                    </span>

                    {p.usos_maximos && (
                      <span className="rounded-full bg-[#a83cff]/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#a83cff]">
                        {p.usos_actuales}/{p.usos_maximos} usos
                      </span>
                    )}

                    {p.monto_minimo > 0 && (
                      <span className="rounded-full bg-[#24191f]/8 px-2.5 py-1 text-[10px] font-bold text-[#67545d]">
                        Desde ${p.monto_minimo.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm font-black text-[#24191f]">
                    {p.nombre}
                  </p>
                  {p.descripcion && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[#67545d]">
                      {p.descripcion}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-white px-3 py-1 text-xs font-black tracking-wider text-[#ff1493]">
                      {p.codigo}
                    </span>
                    {(p.fecha_inicio || p.fecha_fin) && (
                      <span className="text-[10px] text-[#67545d]">
                        {p.fecha_inicio?.split("T")[0] || "—"} → {p.fecha_fin?.split("T")[0] || "—"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    aria-label="Editar"
                  >
                    <IconEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
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

/* =========================================================
   AUXILIARES
========================================================= */
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