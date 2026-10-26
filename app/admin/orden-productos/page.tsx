"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProductoOrden = {
  id: number;
  name: string;
  section: string;
  category: string;
  price: number;
  image: string;
  orden: number;
};

const seccionesDisponibles = ["Maquillaje", "Hogar", "Papelería", "Temporada", "Mascotas"];

export default function OrdenProductosPage() {
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("Maquillaje");
  const [productos, setProductos] = useState<ProductoOrden[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const cargarProductos = async (seccion: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("id, name, section, category, price, image, orden")
      .eq("section", seccion)
      .order("orden", { ascending: true })
      .order("id", { ascending: true });

    if (!error && data) {
      setProductos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProductos(seccionSeleccionada);
  }, [seccionSeleccionada]);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    const draggedIndex = productos.findIndex((p) => p.id === draggedId);
    const targetIndex = productos.findIndex((p) => p.id === targetId);

    if (draggedIndex < 0 || targetIndex < 0) return;

    const nuevosProductos = [...productos];
    const [movedItem] = nuevosProductos.splice(draggedIndex, 1);
    nuevosProductos.splice(targetIndex, 0, movedItem);

    setProductos(nuevosProductos);
  };

  const handleDragEnd = async () => {
    setDraggedId(null);
    await guardarNuevoOrden(productos);
  };

  const moverPosicion = async (index: number, direccion: "arriba" | "abajo") => {
    const targetIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= productos.length) return;

    const nuevosProductos = [...productos];
    const temp = nuevosProductos[index];
    nuevosProductos[index] = nuevosProductos[targetIndex];
    nuevosProductos[targetIndex] = temp;

    setProductos(nuevosProductos);
    await guardarNuevoOrden(nuevosProductos);
  };

  const guardarNuevoOrden = async (listaActualizada: ProductoOrden[]) => {
    setSaving(true);
    
    const promesas = listaActualizada.map((prod, index) =>
      supabase
        .from("productos")
        .update({ orden: index })
        .eq("id", prod.id)
    );

    await Promise.all(promesas);
    setSaving(false);
    setMensaje("¡Orden guardado automáticamente!");
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="relative space-y-6">
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
              Personalización visual
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Organizar Productos
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              Arrastra las tarjetas o usa las flechas para ordenar cómo se verán los productos en la tienda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs font-bold text-[#ff1493]">Guardando cambios...</span>
            )}
            {mensaje && (
              <div className="rounded-2xl border border-[#00bfc0]/30 bg-[#00bfc0]/10 px-4 py-2 text-xs font-bold text-[#008f91]">
                {mensaje} ✨
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/60 bg-white/75 p-3 backdrop-blur-md">
        {seccionesDisponibles.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setSeccionSeleccionada(sec)}
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

      <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #a83cff, #ff1493, #00d9d9)" }}
        />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-black text-[#24191f]">
            Sección: <span className="text-[#ff1493]">{seccionSeleccionada}</span>
          </h2>
          <p className="text-xs text-[#67545d]">
            Tip: Mantén presionado el mouse sobre cualquier tarjeta y arrástrala para cambiarla de lugar.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-bold text-[#67545d]">
            Cargando productos... ✨
          </div>
        ) : productos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-[#f9f4f0] py-16 text-center">
            <p className="text-xs font-bold text-[#67545d]">
              No hay productos en esta sección todavía.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((prod, index) => (
              <div
                key={prod.id}
                draggable
                onDragStart={() => handleDragStart(prod.id)}
                onDragOver={(e) => handleDragOver(e, prod.id)}
                onDragEnd={handleDragEnd}
                className={`group relative cursor-grab overflow-hidden rounded-[24px] border bg-white shadow-md transition-all active:cursor-grabbing ${
                  draggedId === prod.id
                    ? "border-[#ff1493] opacity-40 scale-95 shadow-none"
                    : "border-black/[0.06] hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                <div className="absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#24191f]/80 text-[10px] font-black text-white shadow-md backdrop-blur-md">
                  #{index + 1}
                </div>

                <div className="relative aspect-[4/4.6] w-full overflow-hidden bg-[#eee4dc]">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#ff1493]">
                    {prod.category || seccionSeleccionada}
                  </p>
                  <h3 className="mt-1 line-clamp-1 text-sm font-bold text-[#342b31]">
                    {prod.name}
                  </h3>
                  <p className="mt-2 text-sm font-black text-[#24191f]">
                    ${prod.price?.toLocaleString("es-CO")}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[10px] font-bold text-gray-400">Mover:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => moverPosicion(index, "arriba")}
                        disabled={index === 0}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moverPosicion(index, "abajo")}
                        disabled={index === productos.length - 1}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-[#ff1493] hover:text-white disabled:opacity-30 transition"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}