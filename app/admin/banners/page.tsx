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
function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M12 16V4M7 9L12 4L17 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   TIPOS
========================================================= */
type Banner = {
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

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("orden", { ascending: true });

    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `banners/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      alert("Error al subir: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("productos").getPublicUrl(fileName);
    setEditing((prev) => (prev ? { ...prev, imagen: data.publicUrl } : prev));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.titulo.trim()) {
      alert("Escribe el título del banner.");
      return;
    }
    if (!editing.imagen) {
      alert("Sube o pega una imagen.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      titulo: editing.titulo.trim(),
      subtitulo: editing.subtitulo?.trim() || null,
      descripcion: editing.descripcion?.trim() || null,
      imagen: editing.imagen,
      texto_boton: editing.texto_boton?.trim() || null,
      enlace_boton: editing.enlace_boton?.trim() || null,
      posicion: editing.posicion || "hero",
      orden: editing.orden || 1,
      activo: editing.activo,
    };

    const { error } = creating
      ? await supabase.from("banners").insert(payload)
      : await supabase.from("banners").update(payload).eq("id", editing.id);

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

  const handleDelete = async (b: Banner) => {
    const confirm = window.confirm(`¿Borrar el banner "${b.titulo}"?`);
    if (!confirm) return;

    const { error } = await supabase.from("banners").delete().eq("id", b.id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    load();
  };

  const startCreate = () => {
    setEditing({
      id: 0,
      titulo: "",
      subtitulo: "",
      descripcion: "",
      imagen: "",
      texto_boton: "Explorar ahora",
      enlace_boton: "/tienda",
      posicion: "hero",
      orden: banners.length + 1,
      activo: true,
    });
    setCreating(true);
  };

  const startEdit = (b: Banner) => {
    setEditing({ ...b });
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
              Contenido visual
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Banners del Hero
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              {banners.length} slides · rotan automáticamente en el Home
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="flex items-center gap-2 rounded-full bg-[#ff1493] px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4]"
          >
            <IconPlus />
            Nuevo banner
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#008f91]/25 bg-[#008f91]/5 px-5 py-4 text-xs leading-5 text-[#008f91]">
        <b>¿Qué editas aquí?</b> Los 3 slides grandes del banner principal
        del Home. Cada uno tiene su propia imagen, título y texto.
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
              {creating ? "Nuevo banner" : "Editar banner"}
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
            <Field label="Título principal">
              <input
                type="text"
                value={editing.titulo}
                onChange={(e) =>
                  setEditing({ ...editing, titulo: e.target.value })
                }
                placeholder="Ej: Tu mundo"
                className={inputClass}
              />
            </Field>

            <Field label="Subtítulo (en cursiva)">
              <input
                type="text"
                value={editing.subtitulo || ""}
                onChange={(e) =>
                  setEditing({ ...editing, subtitulo: e.target.value })
                }
                placeholder="Ej: más bonito"
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Descripción">
                <textarea
                  value={editing.descripcion || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, descripcion: e.target.value })
                  }
                  rows={2}
                  placeholder="Descripción del banner..."
                  className={inputClass + " resize-none"}
                />
              </Field>
            </div>

            <Field label="Texto del botón">
              <input
                type="text"
                value={editing.texto_boton || ""}
                onChange={(e) =>
                  setEditing({ ...editing, texto_boton: e.target.value })
                }
                placeholder="Explorar ahora"
                className={inputClass}
              />
            </Field>

            <Field label="Enlace del botón">
              <input
                type="text"
                value={editing.enlace_boton || ""}
                onChange={(e) =>
                  setEditing({ ...editing, enlace_boton: e.target.value })
                }
                placeholder="/tienda"
                className={inputClass}
              />
            </Field>

            <Field label="Orden (1 = primero)">
              <input
                type="number"
                value={editing.orden}
                onChange={(e) =>
                  setEditing({ ...editing, orden: Number(e.target.value) })
                }
                className={inputClass}
              />
            </Field>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#24191f]/8 bg-[#f9f4f0] px-4 py-3">
                <div>
                  <p className="text-xs font-bold">Banner activo</p>
                  <p className="text-[10px] text-[#67545d]">
                    Visible en el Home
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editing.activo}
                  onChange={(e) =>
                    setEditing({ ...editing, activo: e.target.checked })
                  }
                  className="h-5 w-5 accent-[#ff1493]"
                />
              </label>
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <Field label="Imagen del banner (grande, horizontal)">
                <div className="grid gap-4 sm:grid-cols-[260px_1fr]">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0]">
                    {editing.imagen ? (
                      <img
                        src={editing.imagen}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#67545d]">
                        <p className="text-[11px] font-bold">Sin imagen</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#ff1493]/25 bg-[#f9f4f0] px-4 py-4 text-xs font-bold text-[#ff1493] transition hover:border-[#ff1493]/50 hover:bg-[#ff1493]/5">
                      {uploading ? (
                        "Subiendo..."
                      ) : (
                        <>
                          <IconUpload />
                          Subir imagen
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={uploadImage}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    <input
                      type="text"
                      value={editing.imagen || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, imagen: e.target.value })
                      }
                      placeholder="O pega una URL https://..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </Field>
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
              disabled={saving || uploading}
              className="rounded-full bg-[#ff1493] px-7 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:opacity-60"
            >
              {saving ? "Guardando..." : creating ? "Crear banner" : "Guardar cambios"}
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
                className="h-28 animate-pulse rounded-2xl bg-[#f5eee7]"
              />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-[#67545d]">
              No hay banners todavía. Crea el primero.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="grid gap-4 rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4 sm:grid-cols-[220px_1fr_auto] sm:items-center"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#efe4da]">
                  {b.imagen ? (
                    <img
                      src={b.imagen}
                      alt={b.titulo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-bold text-[#67545d]">
                      Sin imagen
                    </div>
                  )}

                  {!b.activo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#67545d]">
                        Inactivo
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff1493]">
                    Orden {b.orden}
                  </p>
                  <p className="mt-1 text-sm font-black text-[#24191f]">
                    {b.titulo}
                    {b.subtitulo && (
                      <span className="ml-1 font-serif italic text-[#ff1493]">
                        {b.subtitulo}
                      </span>
                    )}
                  </p>
                  {b.descripcion && (
                    <p className="mt-1 line-clamp-1 text-[11px] text-[#67545d]">
                      {b.descripcion}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-bold text-[#008f91]">
                    Botón: {b.texto_boton} → {b.enlace_boton}
                  </p>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => startEdit(b)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                    aria-label="Editar"
                  >
                    <IconEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b)}
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