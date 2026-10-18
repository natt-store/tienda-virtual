"use client";

import Link from "next/link";
import Image from "next/image";
import { useBestSellers } from "@/lib/useProducts";

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20.8 8.8C20.8 13.7 12 19 12 19C12 19 3.2 13.7 3.2 8.8C3.2 6.1 5.1 4.2 7.6 4.2C9.3 4.2 10.8 5.1 12 6.5C13.2 5.1 14.7 4.2 16.4 4.2C18.9 4.2 20.8 6.1 20.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkle({
  className = "",
  color = "pink",
}: {
  className?: string;
  color?: "pink" | "aqua" | "purple";
}) {
  const colorClass =
    color === "aqua"
      ? "text-[var(--natt-aqua)]"
      : color === "purple"
        ? "text-[var(--natt-purple)]"
        : "text-[var(--natt-pink)]";

  return (
    <span
      className={`pointer-events-none absolute ${colorClass} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
        <path
          d="M20 1C20.7 11.8 28.2 19.3 39 20C28.2 20.7 20.7 28.2 20 39C19.3 28.2 11.8 20.7 1 20C11.8 19.3 19.3 11.8 20 1Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

const accents = [
  "var(--natt-pink)",
  "var(--natt-aqua)",
  "var(--natt-purple)",
  "var(--natt-pink-bright)",
];

export default function FeaturedProducts() {
  const { products, loading } = useBestSellers();

  return (
    <section className="relative px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        {/* CONTENEDOR DE SECCIÓN */}
        <div
          className="relative overflow-hidden rounded-[34px] border border-[#ff1493]/15 px-5 py-8 shadow-[0_25px_70px_rgba(80,40,60,0.10)] sm:px-8 sm:py-10 lg:px-10 lg:py-12"
          style={{
            background:
              "linear-gradient(160deg, #fff8f5 0%, #fdeef5 45%, #f4e8f1 100%)",
          }}
        >
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
              boxShadow:
                "0 0 14px rgba(255,20,147,0.4), 0 0 20px rgba(0,217,217,0.2)",
            }}
          />

          <div
            className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,20,147,0.15), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,217,217,0.12), transparent 70%)",
            }}
          />

          <div className="pointer-events-none absolute -right-32 top-10 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#ff1493]/15" />
          <div className="pointer-events-none absolute -right-24 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/15" />

          <Sparkle className="right-[8%] top-6 h-4 w-4" color="aqua" />
          <Sparkle className="left-[6%] bottom-8 h-3 w-3" color="pink" />

          {/* ENCABEZADO */}
          <div className="relative mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-[2px] w-9 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #ff1493, #00d9d9)",
                    boxShadow: "0 0 8px rgba(255,20,147,0.45)",
                  }}
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
                  Favoritos de Natt
                </span>
              </div>

              <h2 className="max-w-[650px] text-[30px] font-semibold leading-[1] tracking-[-0.03em] text-[#342b31] sm:text-[42px]">
                Los más
                <span
                  className="ml-2 font-serif italic text-[var(--natt-pink)]"
                  style={{
                    textShadow: "0 0 10px rgba(255,20,147,0.25)",
                  }}
                >
                  vendidos
                </span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#685d64]">
                Los productos que todos eligen una y otra vez.
              </p>
            </div>

            <Link
              href="/tienda"
              className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[var(--natt-black)]/15 bg-white/80 px-5 py-3 text-xs font-bold text-[var(--natt-black)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--natt-pink)] hover:bg-[var(--natt-pink)] hover:text-white"
            >
              Ver toda la tienda
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>

          {/* PRODUCTOS */}
          {loading ? (
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-[20px] border border-white/90 bg-white/60"
                >
                  <div className="aspect-[4/4.6] bg-[#eee4dc]/60" />
                  <div className="space-y-2 p-3 sm:p-4">
                    <div className="h-2 w-16 rounded bg-[#eee4dc]" />
                    <div className="h-3 w-full rounded bg-[#eee4dc]" />
                    <div className="h-3 w-3/4 rounded bg-[#eee4dc]" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product, index) => {
                const accentColor = accents[index % accents.length];

                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[20px] border border-white/90 bg-white shadow-[0_10px_28px_rgba(50,30,40,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(50,30,40,0.15)] sm:rounded-[24px]"
                  >
                    <div
                      className="absolute left-0 right-0 top-0 z-20 h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                        boxShadow: `0 0 10px color-mix(in srgb, ${accentColor} 55%, transparent)`,
                      }}
                    />

                    <div className="relative aspect-[4/4.6] overflow-hidden bg-[#eee4dc]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />

                      {product.badge && (
                        <div
                          className="absolute left-2.5 top-2.5 z-10 rounded-full px-2 py-1 text-[6px] font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[8px]"
                          style={{
                            background: accentColor,
                            boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 40%, transparent)`,
                          }}
                        >
                          {product.badge}
                        </div>
                      )}

                      <button
                        type="button"
                        aria-label={`Agregar ${product.name} a favoritos`}
                        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[var(--natt-black)] shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[var(--natt-pink)] hover:text-white sm:h-9 sm:w-9"
                      >
                        <span className="scale-90">
                          <HeartIcon />
                        </span>
                      </button>

                      <div className="absolute bottom-2.5 right-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[7px] font-bold text-[var(--natt-black)] shadow-md backdrop-blur-md sm:h-7 sm:w-7 sm:text-[9px]">
                        0{index + 1}
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p
                        className="text-[7px] font-bold uppercase tracking-[0.15em] sm:text-[9px]"
                        style={{ color: accentColor }}
                      >
                        {product.category}
                      </p>

                      <h3 className="mt-1.5 line-clamp-2 min-h-[34px] text-[13px] font-bold leading-5 text-[#342b31] sm:min-h-[42px] sm:text-[15px]">
                        {product.name}
                      </h3>

                      <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
                        <span className="text-[12px] font-black text-[var(--natt-black)] sm:text-[15px]">
                          ${product.price.toLocaleString("es-CO")}
                        </span>

                        <Link
                          href={product.href}
                          className="group/button flex h-8 items-center gap-1.5 rounded-full px-3 text-[7px] font-bold uppercase tracking-wide text-white transition-all duration-300 hover:gap-2.5 sm:h-9 sm:text-[9px]"
                          style={{
                            background: accentColor,
                            boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 25%, transparent)`,
                          }}
                          aria-label={`Ver ${product.name}`}
                        >
                          Ver
                          <span className="transition-transform duration-300 group-hover/button:translate-x-0.5">
                            <ArrowRightIcon />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="relative rounded-[20px] border border-white/80 bg-white/70 px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-medium text-[#685d64]">
                Próximamente encontrarás aquí nuestros productos más vendidos.
              </p>
            </div>
          )}

          {/* FRASE INFERIOR */}
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 text-center sm:mt-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ff1493]/40" />
              <Sparkle className="relative h-3 w-3" color="pink" />
              <span className="h-px w-10 bg-[#00d9d9]/40" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#342b31]/50">
              Los favoritos de nuestra tienda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}