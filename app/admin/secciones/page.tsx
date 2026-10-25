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
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
type Seccion = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  color: string | null;
  orden: number;
  activa: boolean;
};

type PaginaCategoria = {
  id: number;
  slug: string;
  etiqueta: string | null;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  imagen_principal: string | null;
  color_principal: string | null;
  color_secundario: string | null;
};

type Categoria = {
  id: number;
  nombre: string;
  seccion: string;
  orden: number;
  activa: boolean;
};

type TarjetaCategoria = {
  id: number;
  nombre: string;
  subtitulo: string | null;
  imagen: string | null;
  enlace: string;
  color: string | null;
  orden: number;
  activa: boolean;
};

/* Respaldo limpio sin Accesorios */
const seccionesFallback: Seccion[] = [
  { id: 1, nombre: "Maquillaje", slug: "maquillaje", descripcion: null, imagen: null, color: "#ff1493", orden: 1, activa: true },
  { id: 2, nombre: "Hogar", slug: "hogar", descripcion: null, imagen: null, color: "#00d9d9", orden: 2, activa: true },
  { id: 3, nombre: "Papelería", slug: "papeleria-kawaii", descripcion: null, imagen: null, color: "#a83cff", orden: 3, activa: true },
  { id: 4, nombre: "Temporada", slug: "temporada", descripcion: null, imagen: null, color: "#ff8400", orden: 4, activa: true },
  { id: 6, nombre: "Mascotas", slug: "mascotas", descripcion: null, imagen: null, color: "#ff1493", orden: 5, activa: true },
];

/* Respaldo limpio sin Accesorios */
const tarjetasFallback: TarjetaCategoria[] = [
  { id: 1, nombre: "Maquillaje", subtitulo: "Belleza", enlace: "/tienda/maquillaje", imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90", color: "#ff1493", orden: 1, activa: true },
  { id: 2, nombre: "Hogar", subtitulo: "Espacios", enlace: "/tienda/hogar", imagen: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=90", color: "#00d9d9", orden: 2, activa: true },
  { id: 3, nombre: "Papelería", subtitulo: "Crear", enlace: "/tienda/papeleria-kawaii", imagen: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=90", color: "#a83cff", orden: 3, activa: true },
  { id: 4, nombre: "Temporada", subtitulo: "Especial", enlace: "/tienda/temporada", imagen: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=900&q=90", color: "#ff8400", orden: 4, activa: true },
  { id: 6, nombre: "Mascotas", subtitulo: "Peluditos", enlace: "/tienda/mascotas", imagen: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=90", color: "#ff1493", orden: 5, activa: true },
];

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminSeccionesPage() {
  const [tab, setTab] = useState<"secciones" | "portada">("secciones");

  const [secciones, setSecciones] = useState<Seccion[]>(seccionesFallback);
  const [activeSeccion, setActiveSeccion] = useState<string>("Maquillaje");
  const [paginas, setPaginas] = useState<Record<string, PaginaCategoria | null>>({});
  const [categorias, setCategorias] = useState<Record<string, Categoria[]>>({});
  const [loading, setLoading] = useState(true);

  const [tarjetas, setTarjetas] = useState<TarjetaCategoria[]>([]);
  const [editingTarjeta, setEditingTarjeta] = useState<TarjetaCategoria | null>(null);
  const [isCreatingTarjeta, setIsCreatingTarjeta] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [showNewCatForm, setShowNewCatForm] = useState(false);

  const load = async () => {
    setLoading(true);

    const { data: secs } = await supabase
      .from("secciones")
      .select("*")
      .order("orden", { ascending: true });

    const dbSecs = secs && secs.length > 0 ? secs : seccionesFallback;
    const finalSecs = seccionesFallback.map((fallbackSec) => {
      const found = dbSecs.find((ds: any) => (ds.slug === fallbackSec.slug || ds.nombre === fallbackSec.nombre) && ds.nombre?.toLowerCase() !== "accesorios");
      return found || fallbackSec;
    }).filter((s) => s.nombre?.toLowerCase() !== "accesorios");

    setSecciones(finalSecs);
    if (finalSecs.length > 0 && !activeSeccion) {
      setActiveSeccion(finalSecs[0].nombre);
    }

    const paginasMap: Record<string, PaginaCategoria | null> = {};
    const categoriasMap: Record<string, Categoria[]> = {};

    for (const s of finalSecs) {
      const { data: page } = await supabase
        .from("paginas_categorias")
        .select("*")
        .eq("slug", s.slug)
        .maybeSingle();

      if (page) {
        paginasMap[s.nombre] = page as PaginaCategoria;
      } else {
        paginasMap[s.nombre] = {
          id: 99 + s.id,
          slug: s.slug,
          etiqueta: `Colección ${s.nombre}`,
          titulo: s.nombre,
          subtitulo: "para enamorarte.",
          descripcion: `Descubre productos increíbles en la sección de ${s.nombre}.`,
          imagen_principal: null,
          color_principal: s.color || "#ff1493",
          color_secundario: "#00d9d9",
        };
      }

      const { data: cats } = await supabase
        .from("categorias")
        .select("*")
        .eq("seccion", s.nombre)
        .order("orden", { ascending: true });

      categoriasMap[s.nombre] = cats || [];
    }

    setPaginas(paginasMap);
    setCategorias(categoriasMap);

    const { data: tjs } = await supabase
      .from("tarjetas_categorias")
      .select("*")
      .order("orden", { ascending: true });

    const dbTarjetas = tjs && tjs.length > 0 ? tjs : tarjetasFallback;
    const finalTarjetas = dbTarjetas.filter(
      (t: any) =>
        t.nombre?.toLowerCase() !== "accesorios" &&
        !t.enlace?.includes("accesorios")
    );

    setTarjetas(finalTarjetas);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPage = activeSeccion ? paginas[activeSeccion] : null;
  const currentCats = activeSeccion ? categorias[activeSeccion] || [] : [];
  const currentSeccion = secciones.find((s) => s.nombre === activeSeccion);

  const setPageField = (field: keyof PaginaCategoria, value: any) => {
    if (!currentPage) return;
    setPaginas((p) => ({
      ...p,
      [activeSeccion]: { ...currentPage, [field]: value },
    }));
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onDone: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const ext = file.name.split(".").pop();
    const fileName = `secciones/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setMessage("Error: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("productos").getPublicUrl(fileName);
    onDone(data.publicUrl);
    setUploading(false);
  };

  const handleSavePagina = async () => {
    if (!currentPage || !activeSeccion) return;
    setSaving(true);
    setMessage("");

    const { data: existing } = await supabase
      .from("paginas_categorias")
      .select("id")
      .eq("slug", currentPage.slug)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("paginas_categorias").insert({
        slug: currentPage.slug,
        etiqueta: currentPage.etiqueta,
        titulo: currentPage.titulo,
        subtitulo: currentPage.subtitulo,
        descripcion: currentPage.descripcion,
        imagen_principal: currentPage.imagen_principal,
        color_principal: currentPage.color_principal,
        color_secundario: currentPage.color_secundario,
        activa: true,
      });
      setSaving(false);
      if (error) {
        setMessage("Error: " + error.message);
        return;
      }
      setMessage(`Hero de ${activeSeccion} creado y guardado en Supabase correctamente.`);
      await load();
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const { error } = await supabase
      .from("paginas_categorias")
      .update({
        etiqueta: currentPage.etiqueta,
        titulo: currentPage.titulo,
        subtitulo: currentPage.subtitulo,
        descripcion: currentPage.descripcion,
        imagen_principal: currentPage.imagen_principal,
        color_principal: currentPage.color_principal,
        color_secundario: currentPage.color_secundario,
      })
      .eq("slug", currentPage.slug);

    setSaving(false);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage(`Hero de ${activeSeccion} guardado correctamente en Supabase.`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveTarjeta = async () => {
    if (!editingTarjeta) return;

    if (!editingTarjeta.nombre.trim()) {
      alert("Escribe el nombre de la tarjeta.");
      return;
    }
    if (!editingTarjeta.imagen) {
      alert("Sube o pega una imagen.");
      return;
    }

    setSaving(true);

    const payload = {
      nombre: editingTarjeta.nombre.trim(),
      subtitulo: editingTarjeta.subtitulo?.trim() || null,
      imagen: editingTarjeta.imagen,
      enlace: editingTarjeta.enlace.trim(),
      color: editingTarjeta.color || "#ff1493",
      orden: editingTarjeta.orden || 1,
      activa: editingTarjeta.activa ?? true,
    };

    const { error } = isCreatingTarjeta
      ? await supabase.from("tarjetas_categorias").insert(payload)
      : await supabase
          .from("tarjetas_categorias")
          .update(payload)
          .eq("id", editingTarjeta.id);

    setSaving(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setEditingTarjeta(null);
    setIsCreatingTarjeta(false);
    await load();
  };

  const handleDeleteTarjeta = async (t: TarjetaCategoria) => {
    const confirm = window.confirm(`¿Borrar la tarjeta "${t.nombre}"?`);
    if (!confirm) return;

    const { error } = await supabase
      .from("tarjetas_categorias")
      .delete()
      .eq("id", t.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    await load();
  };

  const handleCreateCat = async () => {
    if (!newCatName.trim() || !activeSeccion) return;

    const { data, error } = await supabase
      .from("categorias")
      .insert({
        nombre: newCatName.trim(),
        seccion: activeSeccion,
        orden: currentCats.length + 1,
        activa: true,
      })
      .select()
      .single();

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setCategorias((c) => ({
      ...c,
      [activeSeccion]: [...currentCats, data],
    }));
    setNewCatName("");
    setShowNewCatForm(false);
  };

  const handleDeleteCat = async (cat: Categoria) => {
    const confirm = window.confirm(`¿Borrar la categoría "${cat.nombre}"?`);
    if (!confirm) return;

    const { error } = await supabase.from("categorias").delete().eq("id", cat.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setCategorias((c) => ({
      ...c,
      [activeSeccion]: currentCats.filter((x) => x.id !== cat.id),
    }));
  };

  const handleUpdateCat = async () => {
    if (!editingCat || !editingCat.nombre.trim()) return;

    const { error } = await supabase
      .from("categorias")
      .update({ nombre: editingCat.nombre.trim() })
      .eq("id", editingCat.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setCategorias((c) => ({
      ...c,
      [activeSeccion]: currentCats.map((x) =>
        x.id === editingCat.id ? editingCat : x
      ),
    }));

    setEditingCat(null);
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
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
            Contenido
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
            Secciones y Portada
          </h1>
          <p className="mt-1 text-sm text-[#67545d]">
            Edita las imágenes y textos que aparecen en toda la tienda.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/60 bg-white/75 p-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setTab("secciones")}
          className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
            tab === "secciones"
              ? "bg-[#ff1493] text-white shadow-[0_8px_20px_rgba(255,20,147,0.28)]"
              : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
          }`}
        >
          1. Hero de cada sección
        </button>
        <button
          type="button"
          onClick={() => setTab("portada")}
          className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
            tab === "portada"
              ? "bg-[#ff1493] text-white shadow-[0_8px_20px_rgba(255,20,147,0.28)]"
              : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
          }`}
        >
          2. Tarjetas de la tienda y del Home
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-[#00bfc0]/25 bg-[#00bfc0]/8 px-5 py-3 text-sm font-bold text-[#008f91]">
          {message}
        </div>
      )}

      {/* ============ TAB 1: HERO DE CADA SECCIÓN ============ */}
      {tab === "secciones" && (
        <>
          <div className="rounded-2xl border border-[#00bfc0]/25 bg-[#00bfc0]/5 px-5 py-4 text-xs leading-5 text-[#008f91]">
            <b>¿Qué editas aquí?</b> Los textos y la <b>imagen circular</b> del hero de cada sección:{" "}
            <span className="font-bold">/tienda/maquillaje</span>,{" "}
            <span className="font-bold">/tienda/hogar</span>,{" "}
            <span className="font-bold">/tienda/mascotas</span>, etc.
          </div>

          <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/60 bg-white/75 p-3 backdrop-blur-md">
            {secciones.map((s) => {
              const active = activeSeccion === s.nombre;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSeccion(s.nombre)}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                    active
                      ? "bg-[#ff1493] text-white shadow-[0_8px_20px_rgba(255,20,147,0.28)]"
                      : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                  }`}
                >
                  {s.nombre}
                </button>
              );
            })}
          </div>

          {!currentPage ? (
            <div className="rounded-[26px] border border-dashed border-[#24191f]/15 bg-white/60 py-16 text-center">
              <p className="text-sm font-bold text-[#67545d]">
                Esta sección no tiene datos de hero todavía.
              </p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
                <div
                  className="absolute left-0 right-0 top-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
                  }}
                />
                <h2 className="mb-1 text-base font-black text-[#24191f]">
                  Hero de {activeSeccion}
                </h2>
                <p className="mb-5 text-xs text-[#67545d]">
                  Los textos y el círculo que se ven arriba en{" "}
                  <span className="font-bold">/tienda/{currentSeccion?.slug}</span>
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Etiqueta pequeña (arriba del título)">
                    <input
                      type="text"
                      value={currentPage.etiqueta || ""}
                      onChange={(e) => setPageField("etiqueta", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Título principal">
                    <input
                      type="text"
                      value={currentPage.titulo}
                      onChange={(e) => setPageField("titulo", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Subtítulo (el que va en cursiva)">
                    <input
                      type="text"
                      value={currentPage.subtitulo || ""}
                      onChange={(e) => setPageField("subtitulo", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Color principal">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentPage.color_principal || "#ff1493"}
                        onChange={(e) =>
                          setPageField("color_principal", e.target.value)
                        }
                        className="h-12 w-16 cursor-pointer rounded-2xl border border-[#24191f]/10 bg-white p-1"
                      />
                      <input
                        type="text"
                        value={currentPage.color_principal || ""}
                        onChange={(e) =>
                          setPageField("color_principal", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </Field>
                  <Field label="Color secundario">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentPage.color_secundario || "#00d9d9"}
                        onChange={(e) =>
                          setPageField("color_secundario", e.target.value)
                        }
                        className="h-12 w-16 cursor-pointer rounded-2xl border border-[#24191f]/10 bg-white p-1"
                      />
                      <input
                        type="text"
                        value={currentPage.color_secundario || ""}
                        onChange={(e) =>
                          setPageField("color_secundario", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Descripción">
                      <textarea
                        value={currentPage.descripcion || ""}
                        onChange={(e) =>
                          setPageField("descripcion", e.target.value)
                        }
                        rows={3}
                        className={inputClass + " resize-none"}
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="mb-2 rounded-2xl border border-[#ff1493]/20 bg-[#ff1493]/5 px-4 py-3 text-[11px] leading-5 text-[#ff1493]">
                      <b>Imagen del círculo del hero</b> → Es la que aparece{" "}
                      <b>dentro del círculo</b> en el banner grande de esta sección.
                    </div>
                    <Field label="Imagen del círculo">
                      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0]">
                          {currentPage.imagen_principal ? (
                            <img
                              src={currentPage.imagen_principal}
                              alt="Portada hero"
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
                                Subir imagen del círculo
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(e) =>
                                uploadImage(e, (url) =>
                                  setPageField("imagen_principal", url)
                                )
                              }
                              className="hidden"
                              disabled={uploading}
                            />
                          </label>
                          <input
                            type="text"
                            value={currentPage.imagen_principal || ""}
                            onChange={(e) =>
                              setPageField("imagen_principal", e.target.value)
                            }
                            placeholder="O pega una URL https://..."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePagina}
                    disabled={saving}
                    className="rounded-full bg-[#ff1493] px-7 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar hero"}
                  </button>
                </div>
              </div>

              {/* CATEGORÍAS */}
              <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
                <div
                  className="absolute left-0 right-0 top-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #a83cff, #ff1493, #00d9d9)",
                  }}
                />
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black text-[#24191f]">
                      Categorías de {activeSeccion}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#67545d]">
                      Los filtros que aparecen en esta sección.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewCatForm(true)}
                    className="flex items-center gap-2 rounded-full bg-[#00bfc0] px-5 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa]"
                  >
                    <IconPlus />
                    Nueva categoría
                  </button>
                </div>

                {showNewCatForm && (
                  <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#00bfc0]/30 bg-[#00bfc0]/5 p-4">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Nombre de la categoría"
                      className={inputClass + " flex-1"}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCreateCat}
                      className="rounded-full bg-[#00bfc0] px-5 py-2.5 text-xs font-black text-white"
                    >
                      Crear
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCatForm(false);
                        setNewCatName("");
                      }}
                      className="rounded-full border border-[#24191f]/10 bg-white px-5 py-2.5 text-xs font-bold text-[#67545d]"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {currentCats.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-[#f9f4f0] py-10 text-center">
                    <p className="text-xs font-bold text-[#67545d]">
                      No hay categorías todavía.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentCats.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] px-4 py-3"
                      >
                        {editingCat?.id === cat.id ? (
                          <>
                            <input
                              type="text"
                              value={editingCat.nombre}
                              onChange={(e) =>
                                setEditingCat({
                                  ...editingCat,
                                  nombre: e.target.value,
                                })
                              }
                              className={inputClass + " flex-1"}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleUpdateCat}
                                className="rounded-full bg-[#00bfc0] px-4 py-2 text-xs font-black text-white"
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCat(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d]"
                              >
                                <IconClose />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-[#24191f]">
                              {cat.nombre}
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingCat(cat)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                              >
                                <IconEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCat(cat)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ============ TAB 2: PORTADA ============ */}
      {tab === "portada" && (
        <>
          <div className="rounded-2xl border border-[#a83cff]/25 bg-[#a83cff]/5 px-5 py-4 text-xs leading-5 text-[#a83cff]">
            <b>¿Qué editas aquí?</b> Las tarjetas de categoría que aparecen en{" "}
            <span className="font-bold">/tienda</span> y en el <span className="font-bold">Home</span>.
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
            <div
              className="absolute left-0 right-0 top-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, #a83cff, #ff1493, #00d9d9)",
              }}
            />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-[#24191f]">
                  Tarjetas de la portada
                </h2>
                <p className="mt-0.5 text-xs text-[#67545d]">
                  Aparecen en <b>/tienda</b> y en el <b>Home</b>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTarjeta({
                    id: 0,
                    nombre: "",
                    subtitulo: "",
                    imagen: "",
                    enlace: "/tienda/",
                    color: "#ff1493",
                    orden: tarjetas.length + 1,
                    activa: true,
                  });
                  setIsCreatingTarjeta(true);
                }}
                className="flex items-center gap-2 rounded-full bg-[#00bfc0] px-5 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa]"
              >
                <IconPlus />
                Nueva tarjeta
              </button>
            </div>

            {loading ? (
              <div className="h-32 animate-pulse rounded-2xl bg-[#f5eee7]" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tarjetas.map((t) => (
                  <div
                    key={t.id}
                    className="overflow-hidden rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0]"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efe4da]">
                      {t.imagen ? (
                        <img
                          src={t.imagen}
                          alt={t.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-bold text-[#67545d]">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-black text-[#24191f]">
                        {t.nombre}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#67545d]">
                        {t.subtitulo}
                      </p>
                      <p className="text-[9px] text-[#67545d]">{t.enlace}</p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTarjeta({ ...t });
                            setIsCreatingTarjeta(false);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                        >
                          <IconEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTarjeta(t)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ============ MODAL EDITAR TARJETA ============ */}
      {editingTarjeta && (
        <Modal
          onClose={() => {
            setEditingTarjeta(null);
            setIsCreatingTarjeta(false);
          }}
        >
          <h2 className="text-lg font-black text-[#24191f]">
            {isCreatingTarjeta ? "Nueva tarjeta" : `Editar ${editingTarjeta.nombre}`}
          </h2>
          <p className="mt-1 text-xs text-[#67545d]">
            Esta tarjeta aparece en <b>/tienda</b> y en el <b>Home</b>.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <input
                type="text"
                value={editingTarjeta.nombre}
                onChange={(e) =>
                  setEditingTarjeta({ ...editingTarjeta, nombre: e.target.value })
                }
                placeholder="Ej: Mascotas"
                className={inputClass}
              />
            </Field>
            <Field label="Subtítulo">
              <input
                type="text"
                value={editingTarjeta.subtitulo || ""}
                onChange={(e) =>
                  setEditingTarjeta({
                    ...editingTarjeta,
                    subtitulo: e.target.value,
                  })
                }
                placeholder="Ej: Peluditos"
                className={inputClass}
              />
            </Field>
            <Field label="Enlace">
              <input
                type="text"
                value={editingTarjeta.enlace}
                onChange={(e) =>
                  setEditingTarjeta({ ...editingTarjeta, enlace: e.target.value })
                }
                placeholder="/tienda/mascotas"
                className={inputClass}
              />
            </Field>
            <Field label="Color">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editingTarjeta.color || "#ff1493"}
                  onChange={(e) =>
                    setEditingTarjeta({ ...editingTarjeta, color: e.target.value })
                  }
                  className="h-12 w-16 cursor-pointer rounded-2xl border border-[#24191f]/10 bg-white p-1"
                />
                <input
                  type="text"
                  value={editingTarjeta.color || ""}
                  onChange={(e) =>
                    setEditingTarjeta({ ...editingTarjeta, color: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </Field>
            <Field label="Orden">
              <input
                type="number"
                value={editingTarjeta.orden}
                onChange={(e) =>
                  setEditingTarjeta({
                    ...editingTarjeta,
                    orden: Number(e.target.value),
                  })
                }
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Imagen de la tarjeta">
                <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0]">
                    {editingTarjeta.imagen ? (
                      <img
                        src={editingTarjeta.imagen}
                        alt="Tarjeta"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-bold text-[#67545d]">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#ff1493]/25 bg-[#f9f4f0] px-4 py-4 text-xs font-bold text-[#ff1493] transition hover:border-[#ff1493]/50 hover:bg-[#ff1493]/5">
                      {uploading ? "Subiendo..." : "Subir imagen"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) =>
                          uploadImage(e, (url) =>
                            setEditingTarjeta({ ...editingTarjeta, imagen: url })
                          )
                        }
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <input
                      type="text"
                      value={editingTarjeta.imagen || ""}
                      onChange={(e) =>
                        setEditingTarjeta({
                          ...editingTarjeta,
                          imagen: e.target.value,
                        })
                      }
                      placeholder="O pega URL..."
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
              onClick={() => {
                setEditingTarjeta(null);
                setIsCreatingTarjeta(false);
              }}
              className="rounded-full border border-[#24191f]/10 bg-white px-6 py-3 text-sm font-bold text-[#67545d]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveTarjeta}
              disabled={saving}
              className="rounded-full bg-[#ff1493] px-7 py-3 text-sm font-black text-white disabled:opacity-60"
            >
              {saving ? "Guardando..." : isCreatingTarjeta ? "Crear tarjeta" : "Guardar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
          }}
        />
        {children}
      </div>
    </div>
  );
}