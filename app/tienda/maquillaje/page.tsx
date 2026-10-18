"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProductsBySection } from "@/lib/useProducts";
import { usePaginaCategoria } from "@/lib/useCategorias";

const fallback = {
  etiqueta: "Colección Maquillaje",
  titulo: "Maquillaje",
  subtitulo: "para enamorarte.",
  descripcion:
    "Descubre productos para crear looks suaves, brillantes y llenos de personalidad. Encuentra tus favoritos y hazlos parte de tu rutina.",
  imagen_principal: null as string | null,
  color_principal: "#ff1493",
  color_secundario: "#00d9d9",
  banner_final_titulo: "Detalles que hacen la diferencia.",
  banner_final_descripcion:
    "Sigue explorando Natt Store y encuentra esos productos que simplemente se sienten hechos para ti.",
  banner_final_texto_boton: "Explorar tienda",
  banner_final_enlace: "/tienda",
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[#67545d]"
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

export default function MaquillajePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Traer productos reales de Supabase en tiempo real para la sección Maquillaje
  const { products: allProducts, loading } = useProductsBySection("Maquillaje");
  const { pagina } = usePaginaCategoria("maquillaje");

  const info = pagina ?? fallback;

  const colorPrincipal = info.color_principal || fallback.color_principal;
  const colorSecundario = info.color_secundario || fallback.color_secundario;

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

  return (
    <main className="min-h-screen overflow-hidden bg-[#eadfd5] text-[#24191f]">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/60 bg-[#f7eee7] shadow-[0_25px_70px_rgba(105,55,65,0.16)]">
          <div
            className="absolute -left-24 top-10 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${colorPrincipal}33` }}
          />

          <div
            className="absolute -right-20 bottom-0 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${colorSecundario}33` }}
          />

          <div
            className="pointer-events-none absolute -right-24 top-8 h-52 w-[480px] rotate-[12deg] rounded-[50%] border-[2px]"
            style={{ borderColor: `${colorPrincipal}66` }}
          />

          <div
            className="pointer-events-none absolute -right-32 top-20 h-52 w-[500px] rotate-[12deg] rounded-[50%] border-[2px]"
            style={{ borderColor: `${colorSecundario}73` }}
          />

          <div className="relative grid min-h-[390px] items-center gap-8 px-7 py-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-14">
            {/* TEXTO */}
            <div className="relative z-10 max-w-xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white/65 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-md"
                style={{
                  borderColor: `${colorPrincipal}33`,
                  color: colorPrincipal,
                }}
              >
                {info.etiqueta || fallback.etiqueta}
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {info.titulo}
                <br />
                <span style={{ color: colorPrincipal }}>
                  {info.subtitulo}
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#67545d] sm:text-base">
                {info.descripcion}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#productos"
                  className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5"
                  style={{ backgroundColor: colorPrincipal }}
                >
                  Ver productos
                </a>

                <Link
                  href="/tienda"
                  className="rounded-full border border-[#24191f]/10 bg-white/70 px-6 py-3 text-sm font-bold text-[#24191f] backdrop-blur transition hover:bg-white"
                >
                  Volver a tienda
                </Link>
              </div>
            </div>

            {/* COMPOSICIÓN VISUAL OPTIMIZADA */}
            <div className="relative mx-auto h-[270px] w-full max-w-[480px] lg:h-[330px]">
              <div
                className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_25px_55px_rgba(255,20,147,0.22)] sm:h-[260px] sm:w-[260px]"
                style={{
                  background: `linear-gradient(135deg, #fff8f4 0%, ${colorPrincipal}40 60%, ${colorPrincipal} 100%)`,
                }}
              />

              <div
                className="absolute right-[8%] top-[4%] h-20 w-20 rounded-full blur-xl"
                style={{ backgroundColor: `${colorSecundario}33` }}
              />

              <div className="absolute left-1/2 top-1/2 z-10 h-[205px] w-[165px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border-4 border-white/80 bg-white shadow-[0_24px_45px_rgba(80,40,55,0.2)] sm:h-[235px] sm:w-[190px]">
                <Image
                  src={
                    info.imagen_principal ||
                    allProducts[0]?.image ||
                    "/brand/logo.png"
                  }
                  alt={allProducts[0]?.name || "Maquillaje Natt Store"}
                  fill
                  sizes="(max-width: 768px) 190px, 235px"
                  className="object-cover"
                  priority
                />
              </div>

              <div
                className="absolute bottom-[7%] left-1/2 h-[3px] w-[170px] -translate-x-1/2 rounded-full"
                style={{
                  backgroundColor: colorSecundario,
                  boxShadow: `0 0 18px ${colorSecundario}`,
                }}
              />
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
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: colorPrincipal }}
            >
              Catálogo completo
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Encuentra tus favoritos
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
              className="w-full rounded-full border border-[#24191f]/10 bg-white/80 py-3 pl-11 pr-4 text-xs font-medium text-[#24191f] shadow-sm backdrop-blur outline-none transition focus:border-[#ff1493] focus:bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-[#67545d] hover:text-[#ff1493]"
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
      <section
        id="productos"
        className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20"
      >
        <div
          className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${colorPrincipal}1a` }}
        />
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${colorSecundario}1a` }}
        />

        {loading ? (
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-[24px] border border-white/70 bg-white/60"
              >
                <div className="aspect-[0.88] bg-[#f4e9e2]/60" />
                <div className="space-y-2 p-3.5 sm:p-4">
                  <div className="h-2 w-16 rounded bg-[#f4e9e2]" />
                  <div className="h-3 w-full rounded bg-[#f4e9e2]" />
                  <div className="h-3 w-3/4 rounded bg-[#f4e9e2]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[24px] border border-white/70 bg-white/80 shadow-[0_12px_35px_rgba(70,40,50,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(70,40,50,0.15)]"
              >
                <Link href={`/tienda/producto/${product.id}`} className="block">
                  <div className="relative aspect-[0.88] overflow-hidden bg-[#f4e9e2]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {product.badge && (
                      <span
                        className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide shadow-sm backdrop-blur"
                        style={{ color: colorPrincipal }}
                      >
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
                      <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#24191f]">
                        Ver producto
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-3.5 sm:p-4">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#00aeb0]">
                    {product.category}
                  </p>

                  <Link href={`/tienda/producto/${product.id}`}>
                    <h3 className="line-clamp-2 min-h-[38px] text-sm font-extrabold leading-5 text-[#24191f] transition hover:opacity-70 sm:text-[15px]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#24191f] sm:text-base">
                      ${product.price.toLocaleString("es-CO")}
                    </p>

                    <Link
                      href={`/tienda/producto/${product.id}`}
                      aria-label={`Ver ${product.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_7px_18px_rgba(0,0,0,0.15)] transition hover:scale-105"
                      style={{ backgroundColor: colorPrincipal }}
                    >
                      →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-white/70 bg-white/70 p-10 text-center shadow-sm">
            <p className="text-lg font-bold">
              No encontramos productos con &quot;{searchTerm}&quot;.
            </p>

            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: colorPrincipal }}
            >
              Ver todos
            </button>
          </div>
        )}
      </section>

      {/* =========================================================
          BANNER FINAL
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#24131f] px-7 py-10 text-center shadow-[0_20px_55px_rgba(45,20,35,0.18)] sm:px-12">
          <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#ff1493]/30 blur-3xl" />
          <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#00d9d9]/25 blur-3xl" />

          <div className="pointer-events-none absolute left-1/2 top-5 h-[2px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ff1493] to-transparent opacity-80" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f0e8]">
              Natt Store
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {info.banner_final_titulo}
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/65">
              {info.banner_final_descripcion}
            </p>

            <Link
              href={info.banner_final_enlace || "/tienda"}
              className="mt-7 inline-flex rounded-full bg-[#00d9d9] px-6 py-3 text-sm font-black text-[#172124] shadow-[0_10px_30px_rgba(0,217,217,0.2)] transition hover:-translate-y-0.5"
            >
              {info.banner_final_texto_boton || "Explorar tienda"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}