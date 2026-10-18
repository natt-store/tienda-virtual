"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTarjetasCategorias } from "@/lib/useCategorias";

/* Respaldo con los colores morados y naranjas originales e incluimos Accesorios */
const fallback = [
  {
    id: 1,
    nombre: "Maquillaje",
    subtitulo: "Belleza",
    imagen:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/maquillaje",
    color: "#ff8400",
  },
  {
    id: 2,
    nombre: "Hogar",
    subtitulo: "Espacios",
    imagen:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/hogar",
    color: "#a83cff",
  },
  {
    id: 3,
    nombre: "Papelería",
    subtitulo: "Crear",
    imagen:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/papeleria-kawaii",
    color: "#ff8400",
  },
  {
    id: 4,
    nombre: "Temporada",
    subtitulo: "Especial",
    imagen:
      "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/temporada",
    color: "#a83cff",
  },
  {
    id: 5,
    nombre: "Accesorios",
    subtitulo: "Estilo",
    imagen:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
    enlace: "/tienda/accesorios",
    color: "#00d9d9",
  },
];

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const tags = ["Belleza", "Espacios", "Crear", "Especial", "Estilo"];

export default function StorePage() {
  const { tarjetas } = useTarjetasCategorias();

  const collections = tarjetas.length > 0
    ? tarjetas.map((t, index) => ({
        id: t.id,
        nombre: t.nombre,
        subtitulo: tags[index % tags.length],
        imagen: t.imagen || fallback[index % fallback.length]?.imagen || "",
        enlace: t.enlace,
        color: t.color || (index % 2 === 0 ? "#ff8400" : "#a83cff"),
      }))
    : fallback;

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] bg-[#25162a]">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[var(--natt-pink)]/20 blur-[2px]" />
          <div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-[var(--natt-aqua)]/10" />
          <div className="absolute right-[18%] top-16 h-3 w-3 rounded-full bg-[var(--natt-aqua)] shadow-[0_0_18px_rgba(0,217,217,0.8)]" />
          <div className="absolute left-[48%] top-10 hidden h-2 w-2 rounded-full bg-[var(--natt-pink)] shadow-[0_0_14px_rgba(255,20,147,0.8)] lg:block" />
          <div className="absolute bottom-16 right-[42%] hidden h-2 w-2 rounded-full bg-[var(--natt-purple)] shadow-[0_0_14px_rgba(168,60,255,0.8)] lg:block" />

          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff8400] to-[#a83cff]" />

          <div className="relative z-10 grid min-h-[430px] items-center lg:grid-cols-[1fr_0.65fr]">
            <div className="px-7 py-12 sm:px-12 lg:px-16">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#ff8400]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff8400]">
                  Natt Store
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Todo lo que
                <span className="block text-[#ff8400]">
                  te gusta.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
                Mundos por descubrir en una sola tienda. Explora nuestras colecciones
                y encuentra ese pequeño detalle que estabas buscando.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#colecciones"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[#25162a] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff8400] hover:text-white"
                >
                  Explorar colecciones
                  <ArrowRightIcon />
                </a>

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Belleza · Hogar · Papelería · Temporada · Accesorios
                </span>
              </div>
            </div>

            {/* Composición visual */}
            <div className="relative hidden h-full min-h-[430px] lg:block">
              <div className="absolute right-8 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#ff8400]/15 blur-3xl" />

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

              <div className="absolute right-8 top-16 flex h-16 w-16 rotate-12 items-center justify-center rounded-full bg-[#ff8400] text-white shadow-[0_0_30px_rgba(255,132,0,0.4)]">
                <SparkleIcon />
              </div>

              <div className="absolute bottom-12 left-10 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full bg-[#a83cff] text-white shadow-[0_0_30px_rgba(168,60,255,0.4)]">
                <SparkleIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLECCIONES */}
      <section
        id="colecciones"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff8400]">
                Natt Store
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#a83cff]" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--natt-black)]/40">
                0{collections.length} categorías
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

        {/* GRID DE CATEGORÍAS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((col, index) => {
            const isEven = index % 2 === 0;
            const positionClass = isEven ? "left-5" : "right-5";
            const iconBgClass = isEven
              ? "bg-white/90 text-[#ff8400]"
              : "bg-white/90 text-[#a83cff]";

            return (
              <Link
                key={col.id}
                href={col.enlace}
                className="group relative min-h-[470px] overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(40,20,35,0.10)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(40,20,35,0.16)]"
              >
                <Image
                  src={col.imagen}
                  alt={col.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#241521]/90 via-[#241521]/15 to-transparent" />

                <div
                  className={`absolute top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:rotate-12 ${positionClass} ${iconBgClass}`}
                >
                  {isEven ? <SparkleIcon /> : <PlusIcon />}
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: isEven ? "#ff8400" : "#d99cff" }}>
                    0{index + 1} · {col.subtitulo}
                  </span>

                  <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    {col.nombre}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Ver colección
                    </span>

                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--natt-black)] transition-all duration-300 group-hover:text-white"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isEven ? "#ff8400" : "#a83cff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "var(--natt-black)";
                      }}
                    >
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* FRASE FINAL */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[#ff8400]/40" />
            <SparkleIcon />
            <span className="h-px w-12 bg-[#a83cff]/40" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--natt-black)]/40">
            Detalles que enamoran
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}