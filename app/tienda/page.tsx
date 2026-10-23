"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTarjetasCategorias } from "@/lib/useCategorias";

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 2L13.7 8.3L20 10L13.7 11.7L12 18L10.3 11.7L4 10L10.3 8.3L12 2Z"
        fill="currentColor"
      />
      <path
        d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function StorePage() {
  // Traemos las tarjetas directamente desde Supabase en tiempo real (con los colores que editaste en el admin)
  const { tarjetas, loading } = useTarjetasCategorias();

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] bg-[#25162a]">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[var(--natt-pink)]/20 blur-[2px]" />
          <div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-[var(--natt-aqua)]/10" />
          
          <div className="relative z-10 grid min-h-[430px] items-center lg:grid-cols-[1fr_0.65fr]">
            <div className="px-7 py-12 sm:px-12 lg:px-16">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#ff1493]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff1493]">
                  Natt Store
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Todo lo que
                <span className="block text-[#ff1493]">te gusta.</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
                Mundos por descubrir en una sola tienda. Explora nuestras colecciones
                y encuentra ese pequeño detalle que estabas buscando.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#colecciones"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[#25162a] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff1493] hover:text-white"
                >
                  Explorar colecciones
                </a>
              </div>
            </div>

            <div className="relative hidden h-full min-h-[430px] lg:block">
              <div className="absolute right-12 top-1/2 h-72 w-72 -translate-y-1/2 rotate-3 rounded-[42px] bg-white/95 p-8 shadow-2xl shadow-black/30">
                <div className="flex h-full items-center justify-center rounded-[30px] bg-[var(--natt-bg)]">
                  <Image
                    src="/brand/logo.png"
                    alt="Natt Store"
                    width={360}
                    height={360}
                    className="w-[78%] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLECCIONES — Leyendo dinámicamente los colores desde Supabase */}
      <section
        id="colecciones"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff1493]">
                Natt Store
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d9d9]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--natt-black)]/40">
                {tarjetas.length} categorías
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Encuentra tus favoritos.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[var(--natt-black)]/50">
            Explora nuestras categorías y descubre productos pensados para
            acompañar cada parte de tu día.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-bold text-[#67545d]">
            Cargando colecciones... ✨
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tarjetas.map((col, index) => {
              // Aquí tomamos estrictamente el color que guardaste en Supabase desde el panel admin
              const cardColor = col.color || "#ff1493";

              return (
                <Link
                  key={`${col.id}-${index}`}
                  href={col.enlace}
                  className="group relative min-h-[470px] overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(40,20,35,0.10)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(40,20,35,0.16)]"
                >
                  <Image
                    src={col.imagen || ""}
                    alt={col.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#241521]/90 via-[#241521]/15 to-transparent" />

                  {/* Icono superior con el color exacto editado en el panel */}
                  <div
                    className="absolute top-5 left-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:rotate-12"
                    style={{
                      backgroundColor: cardColor,
                      boxShadow: `0 0 15px ${cardColor}88`,
                    }}
                  >
                    <SparkleIcon />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    {/* Subtítulo con el color exacto editado en el panel */}
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: cardColor }}
                    >
                      0{index + 1} · {col.subtitulo || "Colección"}
                    </span>

                    <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                      {col.nombre}
                    </h3>

                    <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors group-hover:text-white">
                      Ver colección →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}