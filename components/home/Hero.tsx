"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    eyebrow: "BELLEZA & TENDENCIAS",
    title: "Tu próximo",
    highlight: "favorito está aquí.",
    description:
      "Explora productos de maquillaje y pequeños detalles pensados para complementar tu estilo.",
    button: "Ver maquillaje",
    href: "/tienda?categoria=maquillaje",
    background: "bg-[var(--natt-pink-light)]",
    visual: "bg-[var(--natt-cream)]",
    label: "Makeup",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Productos de maquillaje",
  },
  {
    id: 2,
    eyebrow: "DETALLES QUE ENAMORAN",
    title: "Descubre nuestra",
    highlight: "colección de temporada.",
    description:
      "Encuentra detalles especiales para celebrar cada momento y disfrutar cada época del año.",
    button: "Ver temporada",
    href: "/tienda?categoria=temporada",
    background: "bg-[var(--natt-peach)]",
    visual: "bg-[var(--natt-aqua)]",
    label: "Season",
    number: "02",
    image:
      "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Productos de temporada",
  },
  {
    id: 3,
    eyebrow: "LIFESTYLE",
    title: "Haz tus espacios",
    highlight: "más bonitos.",
    description:
      "Encuentra productos para el hogar y detalles especiales que hacen diferente cada rincón.",
    button: "Explorar hogar",
    href: "/tienda?categoria=hogar",
    background: "bg-[var(--natt-aqua)]",
    visual: "bg-[var(--natt-peach)]",
    label: "Home",
    number: "03",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Decoración para el hogar",
  },
  {
    id: 4,
    eyebrow: "KAWAII",
    title: "Pequeños detalles",
    highlight: "para tus días.",
    description:
      "Encuentra papelería y detalles bonitos para darle un toque especial a cada día.",
    button: "Ver papelería",
    href: "/tienda?categoria=papeleria",
    background: "bg-[#DCCEF3]",
    visual: "bg-[var(--natt-cream)]",
    label: "Kawaii",
    number: "04",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Papelería y escritorio",
  },
  {
    id: 5,
    eyebrow: "NUEVA COLECCIÓN",
    title: "Todo lo que amas,",
    highlight: "en un solo lugar.",
    description:
      "Descubre maquillaje, hogar, papelería kawaii y productos especiales seleccionados para ti.",
    button: "Comprar ahora",
    href: "/tienda",
    background: "bg-[var(--natt-peach)]",
    visual: "bg-[var(--natt-aqua)]",
    label: "Natt Store",
    number: "05",
    image: "/brand/logo-natt-store.png",
    imageAlt: "Logo oficial de Natt Store",
    isLogo: true,
  },
];

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M15 5L8 12L15 19"
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
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(4);

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div
        className={`relative min-h-[540px] overflow-hidden rounded-[32px] ${slide.background} transition-colors duration-700 sm:min-h-[580px]`}
      >
        {/* Decoración de fondo */}
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20"
          style={{ backgroundColor: "var(--natt-white)" }}
        />

        <div
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-10"
          style={{ backgroundColor: "var(--natt-brown)" }}
        />

        <div className="relative z-10 grid min-h-[540px] md:grid-cols-2 sm:min-h-[580px]">
          {/* Texto */}
          <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
            <span className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-brown)]">
              {slide.eyebrow}
            </span>

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--natt-brown)] sm:text-5xl lg:text-6xl">
              {slide.title}

              <span className="block text-[var(--natt-pink)]">
                {slide.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-6 text-[var(--natt-brown)]/75 sm:text-base">
              {slide.description}
            </p>

            <div className="mt-8">
              <a
                href={slide.href}
                className="inline-flex items-center gap-3 rounded-full bg-[var(--natt-brown)] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-pink)] hover:shadow-lg"
              >
                {slide.button}

                <ArrowRightIcon />
              </a>
            </div>

            {/* Controles */}
            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Banner anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--natt-brown)]/20 text-[var(--natt-brown)] transition-all hover:bg-white/50"
              >
                <ArrowLeftIcon />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir al banner ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-[var(--natt-brown)]"
                        : "w-2 bg-[var(--natt-brown)]/25"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Siguiente banner"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--natt-brown)]/20 text-[var(--natt-brown)] transition-all hover:bg-white/50"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Área visual del banner */}
          <div className="relative flex min-h-[300px] items-center justify-center p-7 sm:p-10 md:min-h-full">
            <div
              className={`relative flex h-full min-h-[300px] w-full max-w-[500px] items-center justify-center overflow-hidden rounded-[30px] ${slide.visual}`}
            >
              {/* Círculos decorativos */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--natt-pink)]/20" />

              <div className="absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-[var(--natt-brown)]/10" />

              {/* Tarjeta principal */}
              <div className="relative z-10 w-[78%] max-w-[340px] rotate-[-3deg] rounded-[28px] bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--natt-brown)]/60">
                    {slide.label}
                  </span>

                  <span className="text-xs font-semibold text-[var(--natt-pink)]">
                    {slide.number}
                  </span>
                </div>

                <div className="mt-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[22px] bg-[var(--natt-cream)]">
                  {slide.isLogo ? (
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="relative z-10 w-[78%] object-contain"
                    />
                  ) : (
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--natt-brown)]/50">
                      Natt Store
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[var(--natt-brown)]">
                      {slide.label}
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--natt-brown)]/55">
                      Descubre algo bonito
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white">
                    <ArrowRightIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Número del banner */}
        <div className="absolute right-6 top-6 z-20 hidden text-xs font-semibold text-[var(--natt-brown)]/50 sm:block">
          0{currentSlide + 1} / 0{slides.length}
        </div>
      </div>
    </section>
  );
}