"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProductsBySection } from "@/lib/useProducts";
import { usePaginaCategoria } from "@/lib/useCategorias";

const fallbackHogar = {
  etiqueta: "Colección Hogar",
  titulo: "Tu espacio,",
  subtitulo: "tu esencia.",
  descripcion:
    "Pequeños detalles que transforman tus espacios y hacen que cada rincón se sienta más tuyo.",
  imagen_principal: null as string | null,
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[#675b55]"
      aria-hidden="true"
    >
      <path
        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HogarPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Traer productos reales de Supabase en tiempo real para la sección Hogar
  const { products: allProducts, loading } = useProductsBySection("Hogar");
  const { pagina } = usePaginaCategoria("hogar");

  const info = pagina ?? fallbackHogar;

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return allProducts;
    }

    const term = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }, [searchTerm, allProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#e8ddd2] text-[#24191f]">
      <Navbar />

      {/* =========================================================
          HERO HOGAR
      ========================================================= */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f5eee7] shadow-[0_25px_70px_rgba(85,65,55,0.15)]">

          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#00d9d9]/15 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-80 w-80 rounded-full bg-[#ff1493]/10 blur-3xl" />
          <div className="absolute left-[45%] top-[-100px] h-64 w-64 rounded-full bg-[#f3c9a8]/30 blur-3xl" />

          <div className="pointer-events-none absolute -right-28 top-8 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/35" />
          <div className="pointer-events-none absolute -right-20 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#ff1493]/20" />
          <div className="pointer-events-none absolute bottom-[-130px] left-[18%] h-60 w-[600px] rounded-[50%] border-[2px] border-[#c99f82]/25" />

          <div className="relative grid min-h-[400px] items-center gap-8 px-7 py-12 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:px-16 lg:py-14">

            {/* TEXTO */}
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-[#00bfc0]/20 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#008f91] backdrop-blur-md">
                {info.etiqueta || "Colección Hogar"}
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {info.titulo}
                <br />
                <span className="text-[#008f91]">
                  {info.subtitulo}
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#675b55] sm:text-base">
                {info.descripcion}
              </p>

              {/* BOTONES */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#productos"
                  className="rounded-full bg-[#00bfc0] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa]"
                >
                  Ver productos
                </a>

                <Link
                  href="/tienda"
                  className="rounded-full border border-[#24191f]/10 bg-white/75 px-6 py-3 text-sm font-bold text-[#24191f] backdrop-blur transition hover:bg-white"
                >
                  Volver a la tienda
                </Link>
              </div>
            </div>

            {/* COMPOSICIÓN VISUAL OPTIMIZADA */}
            <div className="relative mx-auto h-[285px] w-full max-w-[480px] lg:h-[335px]">
              <div className="absolute left-1/2 top-1/2 h-[225px] w-[225px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#fffaf5] via-[#ead8ca] to-[#cdb29e] shadow-[0_28px_60px_rgba(105,75,60,0.18)] sm:h-[265px] sm:w-[265px]" />
              
              <div className="absolute left-1/2 top-1/2 z-10 h-[210px] w-[170px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border-4 border-white/85 bg-white shadow-[0_24px_50px_rgba(70,50,45,0.22)] sm:h-[240px] sm:w-[195px]">
                <Image
                  src={
                    info.imagen_principal ||
                    allProducts[0]?.image ||
                    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=85"
                  }
                  alt={allProducts[0]?.name || "Productos para el hogar Natt Store"}
                  fill
                  sizes="(max-width: 768px) 195px, 240px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          BARRA DE BÚSQUEDA Y TÍTULO
      ========================================================= */}
      <section className="px-4 pb-7 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
              Para tu espacio
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Hazlo más tuyo
            </h2>
          </div>

          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, categoría..."
              className="w-full rounded-full border border-[#24191f]/10 bg-white/80 py-3 pl-11 pr-4 text-xs font-medium text-[#24191f] shadow-sm backdrop-blur outline-none transition focus:border-[#00bfc0] focus:bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-[#675b55] hover:text-[#008f91]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCTOS
      ========================================================= */}
      <section id="productos" className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full py-12 text-center text-sm font-bold text-[#67545d]">
              Cargando productos...
            </p>
          ) : (
            filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[24px] border border-white/75 bg-white/85 shadow-[0_12px_35px_rgba(70,55,45,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(70,55,45,0.15)]"
              >
                <Link href={`/tienda/producto/${product.id}`} className="block">
                  <div className="relative aspect-[0.88] overflow-hidden bg-[#efe4da]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#008f91] shadow-sm backdrop-blur">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-3.5 sm:p-4">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff1493]">
                    {product.category}
                  </p>
                  <Link href={`/tienda/producto/${product.id}`}>
                    <h3 className="line-clamp-2 min-h-[38px] text-sm font-extrabold leading-5 text-[#24191f] transition hover:text-[#008f91] sm:text-[15px]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#24191f] sm:text-base">
                      {formatPrice(product.price)}
                    </p>
                    <Link
                      href={`/tienda/producto/${product.id}`}
                      aria-label={`Ver ${product.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00bfc0] text-sm font-bold text-white shadow-[0_7px_18px_rgba(0,191,192,0.22)] transition hover:scale-105"
                    >
                      →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* SIN PRODUCTOS */}
        {!loading && filteredProducts.length === 0 && (
          <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-white/70 bg-white/70 p-10 text-center shadow-sm">
            <p className="text-lg font-bold">
              No encontramos productos con &quot;{searchTerm}&quot;.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-5 rounded-full bg-[#00bfc0] px-5 py-2.5 text-sm font-bold text-white"
            >
              Ver todos
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}