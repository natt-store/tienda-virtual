"use client";

import { useState } from "react";

type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  href?: string;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20.84 4.61C19.82 3.59 18.45 3 17 3C15.55 3 14.18 3.59 13.16 4.61L12 5.77L10.84 4.61C9.82 3.59 8.45 3 7 3C5.55 3 4.18 3.59 3.16 4.61C1.05 6.72 1.05 10.14 3.16 12.25L12 21L20.84 12.25C22.95 10.14 22.95 6.72 20.84 4.61Z"
        stroke="currentColor"
        strokeWidth="1.7"
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

export default function ProductCard({
  name,
  category,
  price,
  image,
  badge,
  href = "#",
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-[28px] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        {/* Toda la tarjeta lleva al producto */}
        <a href={href} className="block">
          {/* Imagen */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--natt-cream)]">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Etiqueta */}
            {badge && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--natt-brown)] shadow-sm backdrop-blur-sm">
                {badge}
              </span>
            )}

            {/* Botón flotante */}
            <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--natt-brown)] px-5 py-3.5 text-xs font-bold text-white shadow-lg transition-colors duration-300 hover:bg-[var(--natt-pink)]">
                Ver producto
                <ArrowRightIcon />
              </span>
            </div>
          </div>

          {/* Información */}
          <div className="p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--natt-pink)]">
              {category}
            </p>

            <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-5 text-[var(--natt-brown)] transition-colors duration-300 group-hover:text-[var(--natt-pink)]">
              {name}
            </h3>

            <p className="mt-4 text-sm font-bold text-[var(--natt-brown)]">
              {formattedPrice}
            </p>
          </div>
        </a>

        {/* Favorito */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setFavorite((current) => !current);
          }}
          aria-label={
            favorite
              ? `Quitar ${name} de favoritos`
              : `Agregar ${name} a favoritos`
          }
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            favorite
              ? "text-[var(--natt-pink)]"
              : "text-[var(--natt-brown)]"
          }`}
        >
          <HeartIcon filled={favorite} />
        </button>
      </div>
    </article>
  );
}