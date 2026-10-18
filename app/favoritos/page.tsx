"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/components/products/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

/* =========================================================
   AGRUPAR POR SECCIÓN
========================================================= */
function groupBySection(favorites: Product[]) {
  const groups: Record<string, Product[]> = {};

  favorites.forEach((product) => {
    const section = product.section || "Otros";
    if (!groups[section]) groups[section] = [];
    groups[section].push(product);
  });

  return groups;
}

/* =========================================================
   COLOR POR SECCIÓN (para el título)
========================================================= */
function sectionColor(section: string) {
  const map: Record<string, { accent: string; chip: string }> = {
    Maquillaje: { accent: "#ff1493", chip: "bg-[#ff1493]/12 text-[#ff1493]" },
    Hogar: { accent: "#00bfc0", chip: "bg-[#00bfc0]/12 text-[#008f91]" },
    Papelería: { accent: "#a83cff", chip: "bg-[#a83cff]/12 text-[#a83cff]" },
    Temporada: { accent: "#ff8d00", chip: "bg-[#ff8d00]/12 text-[#c26a00]" },
    Otros: { accent: "#68616a", chip: "bg-[#68616a]/12 text-[#68616a]" },
  };

  return map[section] || map.Otros;
}

export default function FavoritosPage() {
  const { favorites, totalFavorites, removeFavorite, clearFavorites } =
    useFavorites();
  const { addToCart } = useCart();

  const grouped = groupBySection(favorites);

  return (
    <main className="min-h-screen overflow-hidden bg-[#eadfd5] text-[#24191f]">
      <Navbar />

      {/* INTRO */}
      <section className="relative px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10">
        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] bg-[#24131f] px-7 py-10 shadow-[0_25px_70px_rgba(70,30,50,0.18)] sm:px-10 lg:px-14 lg:py-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff1493]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-[38%] h-64 w-64 rounded-full bg-[#00d9d9]/20 blur-3xl" />

            <div className="pointer-events-none absolute right-[-80px] top-10 h-40 w-[480px] rotate-[10deg] rounded-[50%] border border-[#ff1493]/35" />
            <div className="pointer-events-none absolute right-[-100px] top-20 h-40 w-[500px] rotate-[10deg] rounded-[50%] border border-[#00d9d9]/30" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00d9d9]">
                  Mi selección Natt
                </p>

                <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                  Lo que guardaste
                  <br />
                  <span className="text-[#ff1493]">por una razón.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Tu rincón personal para esos productos que viste, te
                  encantaron y quieres tener cerquita.
                </p>
              </div>

              <div className="hidden lg:flex">
                <div className="relative flex h-28 w-28 rotate-6 items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.06] backdrop-blur-md">
                  <div className="absolute -right-3 -top-3 h-7 w-7 rounded-full bg-[#ff1493] shadow-[0_0_25px_rgba(255,20,147,0.5)]" />
                  <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-[#00d9d9] shadow-[0_0_25px_rgba(0,217,217,0.4)]" />

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-10 w-10 text-white"
                  >
                    <path
                      d="M12 20.5S4.5 16.4 4.5 10.5C4.5 7.2 6.5 5 9.2 5C10.7 5 11.7 5.8 12 6.9C12.3 5.8 13.3 5 14.8 5C17.5 5 19.5 7.2 19.5 10.5C19.5 16.4 12 20.5 12 20.5Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/tienda"
                className="rounded-full bg-[#ff1493] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84]"
              >
                Descubrir más
              </Link>

              {favorites.length > 0 && (
                <div className="rounded-full border border-white/10 bg-white/[0.08] px-5 py-3 text-xs font-bold text-white/75 backdrop-blur">
                  {totalFavorites}{" "}
                  {totalFavorites === 1
                    ? "producto guardado"
                    : "productos guardados"}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#ff1493] via-[#a83cff] to-[#00d9d9]" />
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto max-w-7xl">
          {favorites.length === 0 ? (
            <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[#f7eee7] px-6 py-16 shadow-[0_20px_55px_rgba(70,40,50,0.09)] sm:py-20">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ff1493]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#00d9d9]/10 blur-3xl" />

              <div className="relative mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 text-[#ff1493]"
                  >
                    <path
                      d="M12 20.5S4.5 16.4 4.5 10.5C4.5 7.2 6.5 5 9.2 5C10.7 5 11.7 5.8 12 6.9C12.3 5.8 13.3 5 14.8 5C17.5 5 19.5 7.2 19.5 10.5C19.5 16.4 12 20.5 12 20.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00aeb0]">
                  Todavía hay espacio
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Tu colección aún está vacía.
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#67545d]">
                  Encuentra algo que te encante, presiona el corazón y
                  guárdalo aquí para volver cuando quieras.
                </p>

                <Link
                  href="/tienda"
                  className="mt-7 inline-flex rounded-full bg-[#ff1493] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84]"
                >
                  Explorar la tienda
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* CABECERA */}
              <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00aeb0]">
                    Guardados
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                    Tu colección personal
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={clearFavorites}
                  className="rounded-full border border-[#24191f]/10 bg-white/70 px-5 py-2.5 text-xs font-bold text-[#75636b] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                >
                  Limpiar favoritos
                </button>
              </div>

              {/* SECCIONES */}
              <div className="space-y-12">
                {Object.entries(grouped).map(([section, products]) => {
                  const colors = sectionColor(section);

                  return (
                    <div key={section}>
                      {/* TÍTULO DE SECCIÓN */}
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#24191f]/10 pb-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                          />
                          <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                            {section}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${colors.chip}`}
                          >
                            {products.length}{" "}
                            {products.length === 1 ? "ítem" : "ítems"}
                          </span>
                        </div>

                        <Link
                          href={`/tienda/${section
                            .toLowerCase()
                            .replace("í", "i")}`}
                          className="text-xs font-bold text-[#75636b] transition hover:text-[#ff1493]"
                        >
                          Ver toda la sección →
                        </Link>
                      </div>

                      {/* GRID DE PRODUCTOS */}
                      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                        {products.map((product) => (
                          <article
                            key={product.id}
                            className="group flex flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_15px_40px_rgba(70,40,50,0.08)] transition duration-500 hover:-translate-y-1"
                          >
                            <div className="relative aspect-[0.9] overflow-hidden bg-[#f4e9e2]">
                              <Link href={product.href}>
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                />
                              </Link>

                              {product.badge && (
                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#24191f] backdrop-blur">
                                  {product.badge}
                                </span>
                              )}

                              {/* BOTÓN ELIMINAR */}
                              <button
                                type="button"
                                onClick={() => removeFavorite(product.id)}
                                aria-label={`Quitar ${product.name} de favoritos`}
                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ff1493] text-white shadow-[0_8px_20px_rgba(255,20,147,0.35)] transition hover:scale-110"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-4 w-4"
                                >
                                  <path d="M12 20.5S4.5 16.4 4.5 10.5C4.5 7.2 6.5 5 9.2 5C10.7 5 11.7 5.8 12 6.9C12.3 5.8 13.3 5 14.8 5C17.5 5 19.5 7.2 19.5 10.5C19.5 16.4 12 20.5 12 20.5Z" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                              <p
                                className="text-[9px] font-bold uppercase tracking-[0.16em]"
                                style={{ color: colors.accent }}
                              >
                                {product.category}
                              </p>

                              <Link href={product.href}>
                                <h4 className="mt-1 line-clamp-2 min-h-[38px] text-sm font-extrabold leading-5 transition hover:text-[#008f91] sm:text-[15px]">
                                  {product.name}
                                </h4>
                              </Link>

                              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                                <p className="text-sm font-black sm:text-base">
                                  {formatPrice(product.price)}
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addToCart({
                                      id: product.id,
                                      name: product.name,
                                      category: product.category,
                                      price: product.price,
                                      image: product.image,
                                    })
                                  }
                                  aria-label={`Agregar ${product.name} al carrito`}
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00bfc0] text-white shadow-[0_7px_18px_rgba(0,191,192,0.25)] transition hover:scale-110"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      d="M5 8.5H19L18 20H6L5 8.5Z"
                                      stroke="currentColor"
                                      strokeWidth="1.7"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M9 8.5V7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7V8.5"
                                      stroke="currentColor"
                                      strokeWidth="1.7"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FRASE FINAL */}
              <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[28px] border border-white/60 bg-[#f7eee7] px-6 py-7 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff1493]">
                    Natt Store
                  </p>

                  <p className="mt-1 text-xl font-black">
                    Tus favoritos, tus reglas.
                  </p>
                </div>

                <Link
                  href="/tienda"
                  className="shrink-0 rounded-full border border-[#24191f]/10 bg-white px-6 py-3 text-sm font-bold transition hover:border-[#00d9d9]/40 hover:bg-[#00d9d9]/10"
                >
                  Seguir explorando
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}