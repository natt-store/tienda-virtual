"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBanners } from "@/lib/useBanners";
import { useTarjetasCategorias } from "@/lib/useCategorias";

/* Respaldo completo y forzado sin Accesorios (Actualizado a Belleza) */
const fallbackCategories = [
  {
    id: 1,
    nombre: "Belleza",
    subtitulo: "Brilla todos los días",
    enlace: "/tienda/maquillaje",
    imagen:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=85",
    color: "#ff1493",
  },
  {
    id: 2,
    nombre: "Hogar",
    subtitulo: "Detalles para tu espacio",
    enlace: "/tienda/hogar",
    imagen:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=85",
    color: "#00d9d9",
  },
  {
    id: 3,
    nombre: "Papelería",
    subtitulo: "Organiza tu magia",
    enlace: "/tienda/papeleria-kawaii",
    imagen:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=85",
    color: "#a83cff",
  },
  {
    id: 4,
    nombre: "Temporada",
    subtitulo: "Celebra cada ocasión",
    enlace: "/tienda/temporada",
    imagen:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=85",
    color: "#ff2fa4",
  },
  {
    id: 6,
    nombre: "Mascotas",
    subtitulo: "Para tus peluditos",
    enlace: "/tienda/mascotas",
    imagen:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=85",
    color: "#ff1493",
  },
];

const fallbackSlide = {
  titulo: "Tu mundo",
  subtitulo: "más bonito",
  descripcion: "Belleza, hogar, papelería y temporada en un solo lugar.",
  imagen:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1500&q=90",
  texto_boton: "Explorar ahora",
  enlace_boton: "/tienda",
};

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path
        d="M20.8 8.8C20.8 13.7 12 19 12 19C12 19 3.2 13.7 3.2 8.8C3.2 6.1 5.1 4.2 7.6 4.2C9.3 4.2 10.8 5.1 12 6.5C13.2 5.1 14.7 4.2 16.4 4.2C18.9 4.2 20.8 6.1 20.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 7L18 12L13 17"
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

function Flower({
  className = "",
  color = "pink",
}: {
  className?: string;
  color?: "pink" | "aqua";
}) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
    >
      <div className="relative h-full w-full">
        <span
          className={`absolute left-1/2 top-0 h-[45%] w-[32%] -translate-x-1/2 rounded-full ${
            color === "aqua"
              ? "bg-[var(--natt-aqua)]/70"
              : "bg-[var(--natt-pink)]/70"
          }`}
        />
        <span
          className={`absolute bottom-0 left-1/2 h-[45%] w-[32%] -translate-x-1/2 rounded-full ${
            color === "aqua"
              ? "bg-[var(--natt-aqua)]/70"
              : "bg-[var(--natt-pink)]/70"
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 h-[32%] w-[45%] -translate-y-1/2 rounded-full ${
            color === "aqua"
              ? "bg-[var(--natt-aqua)]/70"
              : "bg-[var(--natt-pink)]/70"
          }`}
        />
        <span
          className={`absolute right-0 top-1/2 h-[32%] w-[45%] -translate-y-1/2 rounded-full ${
            color === "aqua"
              ? "bg-[var(--natt-aqua)]/70"
              : "bg-[var(--natt-pink)]/70"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            color === "aqua" ? "bg-white" : "bg-[#ffe7f3]"
          }`}
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const { banners } = useBanners();
  const { tarjetas } = useTarjetasCategorias();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = banners.length > 0 ? banners : [fallbackSlide];
  
  const rawCategories = tarjetas.length > 0 ? tarjetas : fallbackCategories;
  const categories = rawCategories.filter(
    (cat) =>
      cat.nombre?.toLowerCase() !== "accesorios" &&
      !cat.enlace?.includes("accesorios")
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [banners.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative overflow-hidden px-4 pb-7 pt-5 sm:px-6 lg:px-8 lg:pb-9 lg:pt-6">
      <div className="mx-auto max-w-7xl">
        {/* ESCAPARATE */}
        <div className="relative min-h-[440px] overflow-hidden rounded-[30px] border border-white/80 bg-[#f7eee6] shadow-[0_20px_60px_rgba(61,42,37,0.14)] sm:min-h-[490px] lg:min-h-[525px]">
          <div
            className="pointer-events-none absolute -left-20 -top-20 z-0 h-80 w-80 rounded-full blur-[75px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,20,147,0.20), transparent 68%)",
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-28 -right-20 z-0 h-96 w-96 rounded-full blur-[85px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,217,217,0.18), transparent 68%)",
            }}
          />

          <div
            className="pointer-events-none absolute -left-20 top-[-110px] z-10 h-[300px] w-[300px] rounded-full border-[2px] border-[var(--natt-aqua)]/55"
            style={{
              boxShadow:
                "0 0 12px rgba(0,217,217,0.30), inset 0 0 10px rgba(0,217,217,0.12)",
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-40 right-[12%] z-10 h-[390px] w-[390px] rounded-full border-[2px] border-[var(--natt-pink)]/45"
            style={{
              boxShadow: "0 0 14px rgba(255,20,147,0.25)",
            }}
          />

          <div
            className="absolute left-0 right-0 top-0 z-40 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, #ff1493, #00d9d9, #a83cff, #ff1493)",
              boxShadow:
                "0 0 12px rgba(255,20,147,0.55), 0 0 18px rgba(0,217,217,0.25)",
            }}
          />

          <div className="relative z-20 min-h-[440px] sm:min-h-[490px] lg:min-h-[525px]">
            <div className="absolute inset-0">
              <img
                src={slide.imagen || ""}
                alt={slide.subtitulo || "Natt Store"}
                className="h-full w-full object-cover object-center"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(250,241,234,0.97) 0%, rgba(250,241,234,0.91) 27%, rgba(250,241,234,0.40) 52%, rgba(250,241,234,0.04) 76%)",
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 72% 38%, rgba(255,20,147,0.12), transparent 28%), radial-gradient(circle at 88% 70%, rgba(0,217,217,0.10), transparent 25%)",
                }}
              />
            </div>

            <Flower
              className="right-[8%] top-[8%] z-30 h-12 w-12 rotate-12 opacity-80"
              color="pink"
            />

            <Flower
              className="right-[18%] top-[17%] z-30 h-7 w-7 -rotate-12 opacity-75"
              color="aqua"
            />

            <Flower
              className="bottom-[13%] left-[48%] z-30 h-8 w-8 rotate-45 opacity-60"
              color="pink"
            />

            <Sparkle
              className="left-[44%] top-[16%] z-30 h-5 w-5"
              color="aqua"
            />

            <Sparkle
              className="right-[29%] top-[27%] z-30 h-3 w-3"
              color="pink"
            />

            <Sparkle
              className="right-[7%] bottom-[23%] z-30 h-5 w-5"
              color="purple"
            />

            <Sparkle
              className="left-[5%] bottom-[20%] z-30 h-3 w-3"
              color="aqua"
            />

            <div className="relative z-40 flex min-h-[440px] items-center px-7 py-10 sm:min-h-[490px] sm:px-12 lg:min-h-[525px] lg:px-16">
              <div className="max-w-[460px]">
                <div className="mb-5 w-[145px] sm:w-[165px] lg:w-[180px]">
                  <Image
                    src="/brand/logo.png"
                    alt="Natt Store"
                    width={360}
                    height={210}
                    priority
                    className="h-auto w-full object-contain drop-shadow-[0_5px_14px_rgba(255,20,147,0.12)]"
                  />
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-[2px] w-8 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #ff1493, #00d9d9)",
                      boxShadow: "0 0 8px rgba(255,20,147,0.55)",
                    }}
                  />

                  <span className="text-[9px] font-bold tracking-[0.28em] text-[var(--natt-pink)]">
                    NATT STORE
                  </span>
                </div>

                <h1 className="text-[43px] font-semibold leading-[0.92] tracking-[-0.045em] text-[#342b31] sm:text-[53px] lg:text-[60px]">
                  {slide.titulo}
                  {slide.subtitulo && (
                    <span
                      className="block font-serif italic text-[var(--natt-pink)]"
                      style={{
                        textShadow:
                          "0 0 10px rgba(255,20,147,0.28), 0 0 22px rgba(255,20,147,0.12)",
                      }}
                    >
                      {slide.subtitulo}
                    </span>
                  )}
                </h1>

                {slide.descripcion && (
                  <p className="mt-5 max-w-[350px] text-[13px] font-medium leading-6 text-[#645a61] sm:text-sm">
                    {slide.descripcion}
                  </p>
                )}

                <Link
                  href={slide.enlace_boton || "/tienda"}
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--natt-pink)] px-6 py-3 text-xs font-bold text-white shadow-[0_0_16px_rgba(255,20,147,0.35),0_8px_20px_rgba(80,40,60,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--natt-purple)]"
                >
                  {slide.texto_boton || "Explorar ahora"}
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div
              className="absolute right-[8%] top-[12%] z-40 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/80 bg-white/45 p-5 backdrop-blur-md"
              style={{
                color: "var(--natt-pink)",
                boxShadow:
                  "0 0 8px rgba(255,20,147,0.65), 0 0 25px rgba(255,20,147,0.30)",
              }}
            >
              <HeartIcon />
            </div>

            <div
              className="absolute bottom-8 right-[9%] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-center shadow-lg backdrop-blur-md"
              style={{
                boxShadow:
                  "0 0 15px rgba(0,217,217,0.20), 0 8px 25px rgba(50,30,40,0.10)",
              }}
            >
              <div>
                <span className="block text-[17px] font-bold leading-none text-[var(--natt-aqua)]">
                  0{currentSlide + 1}
                </span>
                <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[#776d74]">
                  Natt
                </span>
              </div>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="absolute bottom-5 left-7 z-50 flex items-center gap-2 sm:left-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Ir al banner ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-[var(--natt-pink)] shadow-[0_0_8px_rgba(255,20,147,0.65)]"
                      : "w-2 bg-[#4b4148]/25"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CATEGORÍAS VISUALES — Sin Accesorios */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => {
            const sectionColor = category.color || "#ff1493";

            return (
              <Link
                key={`${category.id}-${index}`}
                href={category.enlace}
                className="group relative block h-[135px] overflow-hidden rounded-[20px] border border-white/80 bg-white shadow-[0_8px_25px_rgba(50,30,40,0.10)]"
              >
                <img
                  src={category.imagen || ""}
                  alt={category.nombre}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <span className="block text-sm font-bold text-white">
                    {category.nombre}
                  </span>

                  <span className="mt-0.5 block text-[9px] font-medium text-white/85">
                    {category.subtitulo}
                  </span>
                </div>

                <span
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: sectionColor,
                    boxShadow: `0 0 12px ${sectionColor}66`,
                  }}
                >
                  <ArrowIcon />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}