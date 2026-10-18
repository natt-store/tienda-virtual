"use client";

import Link from "next/link";
import { useMemo } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProducts } from "@/lib/useProducts";
import { useCart } from "@/components/cart/CartContext";
import { useFavorites } from "@/components/favorites/FavoritesContext";

export default function NovedadesPage() {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { products } = useProducts();

  const newProducts = useMemo(
    () => products.filter((p) => p.badge === "Nuevo").slice(0, 8),
    [products]
  );

  const featuredProducts = useMemo(
    () =>
      products
        .filter((p) => p.badge === "Favorito" || p.badge === "Más vendido")
        .slice(0, 8),
    [products]
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* =========================================================
          HERO NOVEDADES
      ========================================================= */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f5eee7] shadow-[0_25px_70px_rgba(85,65,55,0.15)]">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#a83cff]/15 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-80 w-80 rounded-full bg-[#ff1493]/12 blur-3xl" />
          <div className="absolute left-[45%] top-[-100px] h-64 w-64 rounded-full bg-[#00d9d9]/18 blur-3xl" />

          <div className="pointer-events-none absolute -right-28 top-8 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#a83cff]/25" />
          <div className="pointer-events-none absolute -right-20 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/25" />
          <div className="pointer-events-none absolute bottom-[-130px] left-[18%] h-60 w-[600px] rounded-[50%] border-[2px] border-[#ff1493]/15" />

          <div className="relative grid min-h-[400px] items-center gap-8 px-7 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-16">
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-[#a83cff]/20 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a83cff] backdrop-blur-md">
                Novedades · Natt Store
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Lo nuevo
                <br />
                <span className="text-[#a83cff]">
                  llegó para quedarse.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#675b55] sm:text-base">
                Descubre lo último en maquillaje, hogar, papelería y más.
                Piezas recién llegadas, pensadas para enamorarte.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tienda"
                  className="rounded-full bg-[#a83cff] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(168,60,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#c13cff]"
                >
                  Ver toda la tienda
                </Link>

                <Link
                  href="/favoritos"
                  className="rounded-full border border-[#24191f]/10 bg-white/75 px-6 py-3 text-sm font-bold text-[#24191f] backdrop-blur transition hover:bg-white"
                >
                  Mis favoritos
                </Link>
              </div>
            </div>

            {/* COMPOSICIÓN VISUAL */}
            <div className="relative mx-auto h-[285px] w-full max-w-[480px] lg:h-[335px]">
              <div className="absolute left-1/2 top-1/2 h-[225px] w-[225px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#fffaf5] via-[#ead8ca] to-[#cdb29e] shadow-[0_28px_60px_rgba(105,75,60,0.18)] sm:h-[265px] sm:w-[265px]" />

              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#a83cff]/30 sm:h-[290px] sm:w-[290px]" />

              <div className="absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00d9d9]/20 sm:h-[320px] sm:w-[320px]" />

              <div className="absolute left-[8%] top-[15%] text-xl text-[#ff1493]">
                ✦
              </div>
              <div className="absolute right-[9%] top-[21%] text-2xl text-[#a83cff]">
                ✦
              </div>
              <div className="absolute bottom-[14%] left-[14%] text-lg text-[#00bfc0]">
                ✧
              </div>
              <div className="absolute bottom-[10%] right-[15%] text-xl text-[#ff1493]">
                ✦
              </div>

              <div className="absolute left-[7%] top-[42%] flex h-12 w-12 rotate-[-10deg] items-center justify-center rounded-full border border-[#a83cff]/20 bg-white/75 text-xl text-[#a83cff] shadow-sm backdrop-blur-md">
                ✦
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 h-[210px] w-[170px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border-4 border-white/85 bg-white shadow-[0_24px_50px_rgba(70,50,45,0.22)] sm:h-[240px] sm:w-[195px]">
                <img
                  src={
                    newProducts[0]?.image ||
                    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85"
                  }
                  alt={newProducts[0]?.name || "Novedades Natt Store"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute bottom-[2%] left-1/2 h-[8px] w-[180px] -translate-x-1/2 rounded-full bg-[#a83cff]/70 blur-[2px] shadow-[0_0_20px_rgba(168,60,255,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCTOS NUEVOS
      ========================================================= */}
      <section className="relative px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a83cff]">
                Recién llegados
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Nuevos en la tienda
              </h2>
            </div>
            <p className="max-w-md text-xs text-[#68616a] sm:text-sm">
              Productos recién sumados al catálogo. Descúbrelos antes que
              nadie.
            </p>
          </div>

          {newProducts.length === 0 ? (
            <div className="rounded-[26px] border border-white/75 bg-white/60 px-6 py-12 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-[#68616a]">
                Próximamente tendremos nuevos productos por aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {newProducts.map((product) => {
                const favorite = isFavorite(product.id);

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[24px] border border-white/75 bg-white/85 shadow-[0_12px_35px_rgba(70,55,45,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(70,55,45,0.15)]"
                  >
                    <div className="relative aspect-[0.88] overflow-hidden bg-[#efe4da]">
                      <Link href={`/tienda/producto/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#a83cff] shadow-sm backdrop-blur">
                          {product.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product)}
                        aria-label={
                          favorite
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border text-base shadow-sm backdrop-blur transition ${
                          favorite
                            ? "border-[#ff1493]/30 bg-[#ff1493] text-white"
                            : "border-white/70 bg-white/90 text-[#ff1493] hover:bg-white"
                        }`}
                      >
                        {favorite ? "♥" : "♡"}
                      </button>
                    </div>

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
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00bfc0] text-sm font-bold text-white shadow-[0_7px_18px_rgba(0,191,192,0.22)] transition hover:scale-105"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          PRODUCTOS DESTACADOS
      ========================================================= */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Los más queridos
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Destacados de la tienda
              </h2>
            </div>
            <p className="max-w-md text-xs text-[#68616a] sm:text-sm">
              Favoritos y más vendidos que no dejan de enamorar.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="rounded-[26px] border border-white/75 bg-white/60 px-6 py-12 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-[#68616a]">
                Próximamente encontrarás aquí nuestros productos más queridos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const favorite = isFavorite(product.id);

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[24px] border border-white/75 bg-white/85 shadow-[0_12px_35px_rgba(70,55,45,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(70,55,45,0.15)]"
                  >
                    <div className="relative aspect-[0.88] overflow-hidden bg-[#efe4da]">
                      <Link href={`/tienda/producto/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#ff1493] shadow-sm backdrop-blur">
                          {product.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product)}
                        aria-label={
                          favorite
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border text-base shadow-sm backdrop-blur transition ${
                          favorite
                            ? "border-[#ff1493]/30 bg-[#ff1493] text-white"
                            : "border-white/70 bg-white/90 text-[#ff1493] hover:bg-white"
                        }`}
                      >
                        {favorite ? "♥" : "♡"}
                      </button>
                    </div>

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
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00bfc0] text-sm font-bold text-white shadow-[0_7px_18px_rgba(0,191,192,0.22)] transition hover:scale-105"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BANNER FINAL
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#283333] px-7 py-10 text-center shadow-[0_20px_55px_rgba(45,50,45,0.16)] sm:px-12">
          <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#00d9d9]/25 blur-3xl" />
          <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#a83cff]/22 blur-3xl" />

          <div className="pointer-events-none absolute left-1/2 top-5 h-[2px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#a83cff] to-transparent opacity-80" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f0e8]">
              Natt Store
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              ¿Te gustó algo?
              <span className="text-[#a83cff]"> Guárdalo.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/65">
              Marca tus favoritos con el corazón y encuéntralos siempre en un
              solo lugar.
            </p>

            <Link
              href="/favoritos"
              className="mt-7 inline-flex rounded-full bg-[#ff1493] px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(255,20,147,0.2)] transition hover:-translate-y-0.5"
            >
              Ver mis favoritos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}