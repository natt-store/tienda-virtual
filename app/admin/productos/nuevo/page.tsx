"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function IconBack() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M19 12H5M11 6L5 12L11 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 16V4M7 9L12 4L17 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function NuevoProductoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    section: "Maquillaje",
    category: "",
    price: "",
    precio_costo: "",
    stock: "0",
    stock_minimo: "5",
    description: "",
    badge: "",
    image: "",
    active: true,
    destacado: false,
    recomendado: false,
  });

  const [categorias, setCategorias] = useState<{ id: number; nombre: string; seccion: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategorias() {
      const { data } = await supabase
        .from("categorias")
        .select("id, nombre, seccion")
        .eq("seccion", form.section)
        .eq("activa", true)
        .order("orden", { ascending: true });

      setCategorias(data || []);

      if (data && data.length > 0) {
        const existe = data.find((c) => c.nombre === form.category);
        if (!existe) {
          setForm((f) => ({ ...f, category: data[0].nombre }));
        }
      } else {
        setForm((f) => ({ ...f, category: "" }));
      }
    }

    loadCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.section]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Error al subir la imagen: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("productos").getPublicUrl(fileName);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Escribe el nombre del producto.");
      return;
    }
    if (!form.category.trim()) {
      setError("Selecciona una categoría.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Escribe un precio válido.");
      return;
    }
    if (!form.image) {
      setError("Sube o pega una imagen del producto.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("productos").insert({
      name: form.name.trim(),
      section: form.section.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      precio_costo: Number(form.precio_costo) || 0,
      image: form.image,
      description: form.description.trim() || null,
      badge: form.badge.trim() || null,
      stock: Number(form.stock) || 0,
      stock_minimo: Number(form.stock_minimo) || 5,
      active: form.active,
      destacado: form.destacado,
      recomendado: form.recomendado,
    });

    setSaving(false);

    if (insertError) {
      setError("Error al guardar: " + insertError.message);
      return;
    }

    router.push("/admin/productos");
  };

  const inputClass =
    "w-full rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] px-4 py-3 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#ff1493]/40 focus:bg-white";

  const ganancia =
    Number(form.price) > 0 && Number(form.precio_costo) >= 0
      ? Number(form.price) - Number(form.precio_costo)
      : 0;

  const margen =
    Number(form.price) > 0
      ? Math.round((ganancia / Number(form.price)) * 100)
      : 0;

  return (
    <div className="relative space-y-5">
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
          <Link
            href="/admin/productos"
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold text-[#67545d] transition hover:text-[#ff1493]"
          >
            <IconBack />
            Volver a productos
          </Link>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
            Nuevo producto
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
            Agregar al catálogo
          </h1>
          <p className="mt-1 text-sm text-[#67545d]">
            Completa la información del nuevo producto.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card title="Información básica">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre del producto">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Paleta de sombras Rosé"
                className={inputClass}
              />
            </Field>

            {/* SECCIÓN SIN ACCESORIOS */}
            <Field label="Sección">
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Maquillaje">Maquillaje</option>
                <option value="Hogar">Hogar</option>
                <option value="Papelería">Papelería</option>
                <option value="Temporada">Temporada</option>
                <option value="Mascotas">Mascotas</option>
              </select>
            </Field>

            <Field label="Categoría">
              {categorias.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#ff1493]/30 bg-[#ff1493]/5 px-4 py-3 text-xs font-bold text-[#ff1493]">
                  No hay categorías para esta sección.{" "}
                  <Link href="/admin/secciones" className="underline">
                    Crear una
                  </Link>
                </div>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Badge (opcional)">
              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Sin badge</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Favorito">Favorito</option>
                <option value="Más vendido">Más vendido</option>
                <option value="Halloween">Halloween</option>
                <option value="Temporada">Temporada</option>
                <option value="Recomendado">Recomendado</option>
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Descripción">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe el producto..."
                  className={inputClass + " resize-none"}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Imagen del producto">
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#24191f]/10 bg-[#f9f4f0] shadow-inner">
              {form.image ? (
                <Image
                  src={form.image}
                  alt={form.name || "Vista previa"}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#67545d]">
                  <IconUpload />
                  <p className="text-[11px] font-bold">Sin imagen</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Field label="Subir archivo">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#ff1493]/25 bg-[#f9f4f0] px-4 py-4 text-xs font-bold text-[#ff1493] transition hover:border-[#ff1493]/50 hover:bg-[#ff1493]/5">
                  {uploading ? "Subiendo..." : "Seleccionar imagen"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </Field>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[#24191f]/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                  o
                </span>
                <span className="h-px flex-1 bg-[#24191f]/10" />
              </div>

              <Field label="Pegar URL de imagen">
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Precio, costo y stock">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio de venta (COP)">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Precio de costo (COP)">
              <input
                type="number"
                name="precio_costo"
                value={form.precio_costo}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Stock">
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Stock mínimo (alerta)">
              <input
                type="number"
                name="stock_minimo"
                value={form.stock_minimo}
                onChange={handleChange}
                placeholder="5"
                className={inputClass}
              />
            </Field>
          </div>

          {Number(form.price) > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#00bfc0]/25 bg-[#00bfc0]/5 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                  Ganancia por unidad
                </p>
                <p className="mt-1 text-lg font-black text-[#008f91]">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(ganancia)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#a83cff]/25 bg-[#a83cff]/5 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#a83cff]">
                  Margen de ganancia
                </p>
                <p className="mt-1 text-lg font-black text-[#a83cff]">
                  {margen}%
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card title="Opciones">
          <div className="space-y-3">
            <Toggle
              label="Producto activo"
              hint="Visible en la tienda"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            <Toggle
              label="Destacado"
              hint="Aparece en 'Los más vendidos' del Home"
              name="destacado"
              checked={form.destacado}
              onChange={handleChange}
            />
            <Toggle
              label="Recomendado"
              hint="Aparece en 'Recomendados' del Home"
              name="recomendado"
              checked={form.recomendado}
              onChange={handleChange}
            />
          </div>
        </Card>

        {error && (
          <div className="rounded-2xl border border-[#ff1493]/25 bg-[#ff1493]/8 px-5 py-4 text-sm font-bold text-[#ff1493]">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/admin/productos"
            className="rounded-full border border-[#24191f]/10 bg-white px-6 py-3.5 text-sm font-bold text-[#67545d] transition hover:bg-[#f5eee7]"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-[#ff1493] px-8 py-3.5 text-sm font-black text-white shadow-[0_10px_25px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
        }}
      />
      <h2 className="mb-5 text-base font-black text-[#24191f]">{title}</h2>
      {children}
    </div>
  );
}

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

function Toggle({
  label,
  hint,
  name,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#24191f]/8 bg-[#f9f4f0] px-4 py-3 transition hover:bg-white">
      <div>
        <p className="text-xs font-bold text-[#24191f]">{label}</p>
        <p className="text-[10px] text-[#67545d]">{hint}</p>
      </div>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-[#ff1493]"
      />
    </label>
  );
}