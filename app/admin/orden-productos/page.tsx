"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

type ElementoTienda = {
  uid: string;
  tipo: "producto" | "titulo" | "subtitulo";
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  orden: number;
  categoria_destino?: string;
};

const seccionesDisponibles = ["Maquillaje", "Hogar", "Papelería", "Temporada", "Mascotas"];

export default function OrdenProductosPage() {
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("Maquillaje");
  const [subFiltroOrden, setSubFiltroOrden] = useState<"todos" | "maquillaje" | "cuidado">("todos");
  
  const [elementos, setElementos] = useState<ElementoTienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [draggedUid, setDraggedUid] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [tipoCreacion, setTipoCreacion] = useState<"titulo" | "subtitulo">("titulo");
  const [inputText, setInputText] = useState("");

  const [destinosSeleccionados, setDestinosSeleccionados] = useState({
    maquillaje: true,
    cuidado: true,
  });

  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const cargarDatos = async (seccion: string) => {
    setLoading(true);

    const { data: prods } = await supabase
      .from("productos")
      .select("id, name, category, price, image, orden")
      .eq("section", seccion);

    const { data: seps } = await supabase
      .from("separadores_orden")
      .select("id, titulo, subtitulo, categoria_destino, orden")
      .eq("seccion", seccion);

    const listaProds: ElementoTienda[] = (prods || []).map((p: any) => ({
      uid: `prod-${p.id}`,
      tipo: "producto",
      id: p.id,
      name: p.name,
      category: p.category || seccion,
      price: p.price || 0,
      image: p.image || "",
      orden: p.orden ?? 0,
    }));

    const listaSeps: ElementoTienda[] = [];
    (seps || []).forEach((s: any) => {
      if (s.titulo) {
        listaSeps.push({
          uid: `tit-${s.id}`,
          tipo: "titulo",
          id: s.id,
          name: s.titulo,
          category: "Separador",
          price: 0,
          image: "",
          orden: s.orden ?? 0,
          categoria_destino: s.categoria_destino || "maquillaje,cuidado",
        });
      }
      if (s.subtitulo) {
        listaSeps.push({
          uid: `sub-${s.id}`,
          tipo: "subtitulo",
          id: s.id,
          name: s.subtitulo,
          category: "Separador",
          price: 0,
          image: "",
          orden: (s.orden ?? 0) + 0.1,
          categoria_destino: s.categoria_destino || "maquillaje,cuidado",
        });
      }
    });

    const combinado = [...listaProds, ...listaSeps].sort((a, b) => a.orden - b.orden);
    const normalizado = combinado.map((item: ElementoTienda, idx: number) => ({ ...item, orden: idx }));

    setElementos(normalizado);
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos(seccionSeleccionada);
  }, [seccionSeleccionada]);

  const elementosFiltradosAdmin = useMemo(() => {
    if (seccionSeleccionada !== "Maquillaje" || subFiltroOrden === "todos") {
      return elementos;
    }

    return elementos.filter((el: ElementoTienda) => {
      if (el.tipo === "producto") {
        const cat = el.category?.toLowerCase() || "";
        if (subFiltroOrden === "maquillaje" && !cat.includes("maquillaje")) return false;
        if (subFiltroOrden === "cuidado" && !cat.includes("cuidado") && !cat.includes("personal")) return false;
      }
      if (el.tipo === "titulo" || el.tipo === "subtitulo") {
        const destino = el.categoria_destino || "maquillaje,cuidado";
        if (!destino.includes(subFiltroOrden)) return false;
      }
      return true;
    });
  }, [elementos, seccionSeleccionada, subFiltroOrden]);

  const handleDragStart = (uid: string) => {
    setDraggedUid(uid);
  };

  const handleDragOver = (e: React.DragEvent, targetUid: string) => {
    e.preventDefault();
    if (draggedUid === null || draggedUid === targetUid) return;

    const draggedIndex = elementosFiltradosAdmin.findIndex((el) => el.uid === draggedUid);
    const targetIndex = elementosFiltradosAdmin.findIndex((el) => el.uid === targetUid);

    if (draggedIndex < 0 || targetIndex < 0) return;

    const nuevos = [...elementosFiltradosAdmin];
    const [moved] = nuevos.splice(draggedIndex, 1);
    nuevos.splice(targetIndex, 0, moved);

    setElementos(nuevos);
  };

  const handleDragEnd = async () => {
    setDraggedUid(null);
    const reindexados = elementosFiltradosAdmin.map((el: ElementoTienda, idx: number) => ({ ...el, orden: idx }));
    await guardarOrdenCompleto(reindexados);
  };

  const moverConBoton = async (index: number, direccion: "arriba" | "abajo") => {
    const targetIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= elementosFiltradosAdmin.length) return;

    const nuevos = [...elementosFiltradosAdmin];
    const [moved] = nuevos.splice(index, 1);
    nuevos.splice(targetIndex, 0, moved);

    const reindexados = nuevos.map((el: ElementoTienda, idx: number) => ({ ...el, orden: idx }));
    setElementos(reindexados);
    await guardarOrdenCompleto(reindexados);
  };

  const guardarOrdenCompleto = async (lista: ElementoTienda[]) => {
    setSaving(true);

    const promesasProds = lista
      .filter((el) => el.tipo === "producto")
      .map((el) =>
        supabase.from("productos").update({ orden: el.orden }).eq("id", el.id)
      );

    const promesasSeps = lista
      .filter((el) => el.tipo === "titulo" || el.tipo === "subtitulo")
      .map((el) => {
        const campo = el.tipo === "titulo" ? { titulo: el.name, subtitulo: null } : { subtitulo: el.name, titulo: null };
        return supabase.from("separadores_orden").update({ orden: el.orden, ...campo }).eq("id", el.id);
      });

    await Promise.all([...promesasProds, ...promesasSeps]);
    setSaving(false);
    setMensaje("¡Orden guardado!");
    setTimeout(() => setMensaje(""), 2000);
  };

  const handleCrearElemento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const arrayDestinos: string[] = [];
    if (destinosSeleccionados.maquillaje) arrayDestinos.push("maquillaje");
    if (destinosSeleccionados.cuidado) arrayDestinos.push("cuidado");
    const destinoFinal = arrayDestinos.join(",") || "maquillaje,cuidado";

    const datosInserta: any = {
      seccion: seccionSeleccionada,
      titulo: tipoCreacion === "titulo" ? inputText.trim() : null,
      subtitulo: tipoCreacion === "subtitulo" ? inputText.trim() : null,
      categoria_destino: destinoFinal,
      orden: elementos.length,
    };

    const { error } = await supabase.from("separadores_orden").insert(datosInserta);

    if (!error) {
      setInputText("");
      setShowModal(false);
      await cargarDatos(seccionSeleccionada);
    } else {
      console.error("Error al crear:", error);
      alert(`Error al guardar: ${error.message || "Revisa la consola"}`);
    }
  };

  const handleBorrarElemento = async (id: number, tipo: string) => {
    if (!window.confirm(`¿Eliminar este ${tipo}?`)) return;
    await supabase.from("separadores_orden").delete().eq("id", id);
    await cargarDatos(seccionSeleccionada);
  };

  return (
    <div className="relative space-y-6">
      {/* Encabezado */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] px-7 py-7 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-9 sm:py-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#ff1493]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#00d9d9]/12 blur-3xl" />
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)" }}
        />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
              Organizador Visual Independiente
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Títulos, Subtítulos y Productos
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              Crea títulos o subtítulos sueltos y arrástralos donde quieras entre tus productos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setTipoCreacion("titulo");
                setShowModal(true);
              }}
              className="rounded-full bg-[#ff1493] px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:bg-[#ff2fa4]"
            >
              + Nuevo Título
            </button>
            <button
              type="button"
              onClick={() => {
                setTipoCreacion("subtitulo");
                setShowModal(true);
              }}
              className="rounded-full bg-[#00d9d9] px-5 py-3 text-xs font-black text-[#172124] shadow-[0_10px_25px_rgba(0,217,217,0.3)] transition hover:bg-[#1aebeb]"
            >
              + Nuevo Subtítulo
            </button>

            {saving && <span className="text-xs font-bold text-[#ff1493]">Guardando...</span>}
            {mensaje && (
              <div className="rounded-2xl border border-[#00bfc0]/30 bg-[#00bfc0]/10 px-4 py-2 text-xs font-bold text-[#008f91]">
                {mensaje} ✨
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selector de Secciones Principales */}
      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/60 bg-white/75 p-3 backdrop-blur-md">
        {seccionesDisponibles.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => {
              setSeccionSeleccionada(sec);
              setSubFiltroOrden("todos");
            }}
            className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
              seccionSeleccionada === sec
                ? "bg-[#ff1493] text-white shadow-[0_8px_20px_rgba(255,20,147,0.28)]"
                : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Si estamos en la sección Maquillaje, mostramos pestañas secundarias */}
      {seccionSeleccionada === "Maquillaje" && (
        <div className="flex items-center gap-2 bg-[#f9f4f0] p-2 rounded-2xl border border-[#24191f]/10 w-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#67545d] px-2">Ordenar vista:</span>
          <button
            type="button"
            onClick={() => setSubFiltroOrden("todos")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              subFiltroOrden === "todos" ? "bg-[#24191f] text-white" : "bg-white text-[#67545d]"
            }`}
          >
            Todos juntos
          </button>
          <button
            type="button"
            onClick={() => setSubFiltroOrden("maquillaje")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              subFiltroOrden === "maquillaje" ? "bg-[#ff1493] text-white" : "bg-white text-[#67545d]"
            }`}
          >
            Solo Maquillaje
          </button>
          <button
            type="button"
            onClick={() => setSubFiltroOrden("cuidado")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              subFiltroOrden === "cuidado" ? "bg-[#00d9d9] text-[#172124]" : "bg-white text-[#67545d]"
            }`}
          >
            Solo Cuidado Personal
          </button>
        </div>
      )}

      {/* Modal para crear Título o Subtítulo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl border border-white/60 space-y-4">
            <h3 className="text-lg font-black text-[#24191f]">
              {tipoCreacion === "titulo" ? "Añadir Título Independiente" : "Añadir Subtítulo Independiente"}
            </h3>
            <form onSubmit={handleCrearElemento} className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                  {tipoCreacion === "titulo" ? "Texto del Título (Ej: BLOOMSHELL)" : "Texto del Subtítulo (Ej: Ojos y Cejas)"}
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={tipoCreacion === "titulo" ? "Ej: BLOOMSHELL" : "Ej: Ojos y Cejas"}
                  className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] px-4 py-3 text-sm font-medium outline-none focus:border-[#ff1493]"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                  ¿En qué pestañas se debe mostrar? (Elige una o ambas)
                </label>
                <div className="space-y-2 bg-[#f9f4f0] p-4 rounded-2xl border border-[#24191f]/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={destinosSeleccionados.maquillaje}
                      onChange={(e) =>
                        setDestinosSeleccionados({ ...destinosSeleccionados, maquillaje: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#ff1493] focus:ring-[#ff1493]"
                    />
                    <span className="text-xs font-bold text-[#24191f]">Mostrar en Maquillaje</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={destinosSeleccionados.cuidado}
                      onChange={(e) =>
                        setDestinosSeleccionados({ ...destinosSeleccionados, cuidado: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#00d9d9] focus:ring-[#00d9d9]"
                    />
                    <span className="text-xs font-bold text-[#24191f]">Mostrar en Cuidado Personal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ff1493] px-6 py-2.5 text-xs font-black text-white"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ampliar imagen */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative max-w-2xl overflow-hidden rounded-[30px] bg-white p-2 shadow-2xl">
            <img
              src={imagenAmpliada}
              alt="Producto ampliado"
              className="max-h-[80vh] w-auto rounded-[24px] object-contain"
            />
            <button
              type="button"
              onClick={() => setImagenAmpliada(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-sm font-bold text-white shadow-lg hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Contenedor principal */}
      <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #a83cff, #ff1493, #00d9d9)" }}
        />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-black text-[#24191f]">
            Sección: <span className="text-[#ff1493]">{seccionSeleccionada}</span> {subFiltroOrden !== "todos" && `(${subFiltroOrden})`}
          </h2>
          <p className="text-xs text-[#67545d]">
            Arrastra títulos, subtítulos o productos para ordenarlos.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-bold text-[#67545d]">
            Cargando tienda... ✨
          </div>
        ) : elementosFiltradosAdmin.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-[#f9f4f0] py-16 text-center">
            <p className="text-xs font-bold text-[#67545d]">
              No hay elementos en esta vista todavía.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {elementosFiltradosAdmin.map((el: ElementoTienda, index: number) => {
              if (el.tipo === "titulo") {
                return (
                  <div
                    key={el.uid}
                    draggable
                    onDragStart={() => handleDragStart(el.uid)}
                    onDragOver={(e) => handleDragOver(e, el.uid)}
                    onDragEnd={handleDragEnd}
                    className={`col-span-full relative overflow-hidden rounded-[24px] border border-[#ff1493]/30 bg-gradient-to-r from-[#ff1493]/10 via-[#a83cff]/10 to-[#00d9d9]/10 px-8 py-5 cursor-grab active:cursor-grabbing transition shadow-sm my-2 backdrop-blur-md ${
                      draggedUid === el.uid ? "opacity-40 scale-98" : ""
                    }`}
                  >
                    <div className="relative flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff1493] text-[10px] font-black text-white shadow-md">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                              Título Principal
                            </p>
                            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#24191f]">
                              Visible en: {el.categoria_destino || "maquillaje,cuidado"}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-[#24191f] tracking-tight mt-0.5">
                            {el.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBorrarElemento(el.id, "título")}
                          className="rounded-xl border border-red-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition shadow-sm"
                        >
                          Eliminar
                        </button>
                        <div className="flex gap-1 bg-white/80 p-1 rounded-xl border border-gray-200 shadow-sm">
                          <button
                            type="button"
                            onClick={() => moverConBoton(index, "arriba")}
                            disabled={index === 0}
                            className="rounded-lg px-3 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moverConBoton(index, "abajo")}
                            disabled={index === elementosFiltradosAdmin.length - 1}
                            className="rounded-lg px-3 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (el.tipo === "subtitulo") {
                return (
                  <div
                    key={el.uid}
                    draggable
                    onDragStart={() => handleDragStart(el.uid)}
                    onDragOver={(e) => handleDragOver(e, el.uid)}
                    onDragEnd={handleDragEnd}
                    className={`col-span-full relative overflow-hidden rounded-[20px] border border-[#00d9d9]/30 bg-gradient-to-r from-[#00d9d9]/10 to-[#ff1493]/5 px-8 py-3.5 cursor-grab active:cursor-grabbing transition shadow-sm my-1 backdrop-blur-md ${
                      draggedUid === el.uid ? "opacity-40 scale-98" : ""
                    }`}
                  >
                    <div className="relative flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008f91] text-[9px] font-black text-white shadow-md">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                              Subtítulo / Categoría
                            </p>
                            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#24191f]">
                              Visible en: {el.categoria_destino || "maquillaje,cuidado"}
                            </span>
                          </div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#24191f] mt-0.5">
                            {el.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBorrarElemento(el.id, "subtítulo")}
                          className="rounded-xl border border-red-200 bg-white/80 px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-50 transition shadow-sm"
                        >
                          Eliminar
                        </button>
                        <div className="flex gap-1 bg-white/80 p-1 rounded-xl border border-gray-200 shadow-sm">
                          <button
                            type="button"
                            onClick={() => moverConBoton(index, "arriba")}
                            disabled={index === 0}
                            className="rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moverConBoton(index, "abajo")}
                            disabled={index === elementosFiltradosAdmin.length - 1}
                            className="rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={el.uid}
                  draggable
                  onDragStart={() => handleDragStart(el.uid)}
                  onDragOver={(e) => handleDragOver(e, el.uid)}
                  onDragEnd={handleDragEnd}
                  className={`group relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-4 cursor-grab active:cursor-grabbing transition shadow-sm hover:shadow-xl flex flex-col justify-between ${
                    draggedUid === el.uid ? "opacity-40 scale-95 shadow-none" : ""
                  }`}
                >
                  <div>
                    <div className="absolute left-6 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#24191f]/80 text-[10px] font-black text-white shadow-sm backdrop-blur-md">
                      #{index + 1}
                    </div>

                    <div
                      onClick={() => el.image && setImagenAmpliada(el.image)}
                      className="relative aspect-[4/4.6] w-full overflow-hidden rounded-[18px] bg-[#eee4dc] cursor-zoom-in group/img shadow-inner mb-3"
                      title="Haz clic para ampliar imagen"
                    >
                      {el.image ? (
                        <img
                          src={el.image}
                          alt={el.name}
                          className="h-full w-full object-cover transition duration-300 group-hover/img:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">Sin foto</div>
                      )}
                    </div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#ff1493]">
                      {el.category || seccionSeleccionada}
                    </p>
                    <h3 className="mt-1 line-clamp-1 text-xs font-bold text-[#342b31]">
                      {el.name}
                    </h3>
                    <p className="mt-1 text-xs font-black text-[#24191f]">
                      ${el.price?.toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[10px] font-bold text-gray-400">Mover:</span>
                    <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => moverConBoton(index, "arriba")}
                        disabled={index === 0}
                        className="rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moverConBoton(index, "abajo")}
                        disabled={index === elementosFiltradosAdmin.length - 1}
                        className="rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}