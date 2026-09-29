"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
};

const makeupProducts: Product[] = [
  {
    id: 1,
    name: "Set de maquillaje esencial",
    category: "Rostro",
    price: 45900,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    badge: "Destacado",
  },
  {
    id: 2,
    name: "Paleta de sombras en tonos suaves",
    category: "Ojos",
    price: 52900,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
    badge: "Nuevo",
  },
  {
    id: 3,
    name: "Kit de belleza para todos los días",
    category: "Rostro",
    price: 39900,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Labial en tono rosado",
    category: "Labios",
    price: 28900,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
    badge: "Favorito",
  },
  {
    id: 5,
    name: "Rubor de acabado natural",
    category: "Rostro",
    price: 31900,
    image:
      "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Brochas para un look perfecto",
    category: "Brochas",
    price: 42900,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Delineador negro de larga duración",
    category: "Ojos",
    price: 26900,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18dbf5f1d8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Gloss rosado efecto brillo",
    category: "Labios",
    price: 24900,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
    badge: "Nuevo",
  },
  {
    id: 9,
    name: "Set de brochas Natt",
    category: "Brochas",
    price: 69900,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = [
  "Todos",
  "Rostro",
  "Ojos",
  "Labios",
  "Brochas",
];

const sortOptions = [
  "Más relevantes",
  "Precio: menor a mayor",
  "Precio: mayor a menor",
];

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

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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

export default function MaquillajePage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Más relevantes");

  const filteredProducts = useMemo(() => {
    let result = [...makeupProducts];

    if (activeCategory !== "Todos") {
      result = result.filter(
        (product) => product.category === activeCategory
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText) ||
          product.category.toLowerCase().includes(searchText)
      );
    }

    if (sort === "Precio: menor a mayor") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Precio: mayor a menor") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, search, sort]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F9E3E9] text-[var(--natt-dark)]">
      <Navbar />

      {/* REGRESAR A LA TIENDA */}
      <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-6 lg:px-8">
        <a
          href="/tienda"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--natt-brown)] shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:bg-[var(--natt-pink-light)]"
        >
          <ArrowLeftIcon />
          Volver a la tienda
        </a>
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-[var(--natt-pink-light)]">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/25" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[var(--natt-pink)]/15" />

          <div className="absolute right-[35%] top-12 h-3 w-3 rounded-full bg-white/50" />

          <div className="absolute bottom-20 right-[45%] h-2 w-2 rounded-full bg-[var(--natt-brown)]/20" />

          <div className="relative z-10 grid min-h-[480px] items-center lg:grid-cols-[1fr_0.9fr]">
            <div className="px-7 py-12 sm:px-12 lg:px-16">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--natt-brown)]/35" />

                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--natt-brown)]/60">
                  Natt Beauty
                </span>
              </div>

              <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--natt-brown)] sm:text-6xl lg:text-7xl">
                Maquillaje
                <span className="block text-[var(--natt-pink)]">
                  para sentirte tú.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-[var(--natt-brown)]/65 sm:text-base">
                Descubre tonos, texturas y pequeños esenciales para crear looks
                que se sientan como tú.
              </p>

              <div className="mt-8">
                <a
                  href="#productos"
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--natt-brown)] px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-pink)]"
                >
                  Explorar productos
                  <ArrowRightIcon />
                </a>
              </div>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center px-7 pb-10 lg:min-h-[480px] lg:px-10 lg:pb-0">
              <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-white/45 blur-sm" />

              <div className="absolute bottom-14 left-10 h-16 w-16 rounded-full bg-[var(--natt-pink)]/25" />

              <div className="relative w-full max-w-[390px] rotate-[-3deg] rounded-[38px] bg-white p-4 shadow-2xl transition-transform duration-700 hover:rotate-0">
                <div className="overflow-hidden rounded-[30px] bg-[#FCECEF]">
                  <img
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1100&q=90"
                    alt="Productos de maquillaje"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>

                <div className="flex items-end justify-between px-3 pb-2 pt-5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)]">
                      Colección
                    </span>

                    <p className="mt-1 text-lg font-semibold text-[var(--natt-brown)]">
                      Beauty Edit
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white">
                    <SparkleIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section
        id="productos"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 pt-10 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
              Descubre tu favorito
            </span>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--natt-brown)] sm:text-5xl">
              Productos de belleza
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[var(--natt-brown)]/50">
            Encuentra productos para crear tu rutina y darle tu propio toque a
            cada look.
          </p>
        </div>

        {/* BUSCADOR Y ORDEN */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--natt-brown)]/45">
              <SearchIcon />
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-[var(--natt-brown)]/10 bg-white py-3.5 pl-12 pr-5 text-sm text-[var(--natt-brown)] outline-none transition-all placeholder:text-[var(--natt-brown)]/35 focus:border-[var(--natt-pink)] focus:ring-4 focus:ring-[var(--natt-pink)]/10"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-full border border-[var(--natt-brown)]/10 bg-white px-5 py-3.5 text-xs font-semibold text-[var(--natt-brown)] outline-none focus:border-[var(--natt-pink)]"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* FILTROS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-xs font-bold transition-all duration-300 ${
                  active
                    ? "bg-[var(--natt-brown)] text-white shadow-md"
                    : "bg-white text-[var(--natt-brown)] hover:-translate-y-0.5 hover:bg-[var(--natt-pink-light)]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* CONTADOR */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-[var(--natt-brown)]/45">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}
          </p>

          {(search || activeCategory !== "Todos") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("Todos");
              }}
              className="text-xs font-bold text-[var(--natt-pink)] transition-colors hover:text-[var(--natt-brown)]"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* PRODUCTOS */}
        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
                badge={product.badge}
                href={`/tienda/producto/${product.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[30px] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--natt-pink-light)] text-[var(--natt-pink)]">
              <SearchIcon />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[var(--natt-brown)]">
              No encontramos productos
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--natt-brown)]/50">
              Prueba con otra búsqueda o selecciona una categoría diferente.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("Todos");
              }}
              className="mt-6 rounded-full bg-[var(--natt-brown)] px-6 py-3 text-xs font-bold text-white transition-all duration-300 hover:bg-[var(--natt-pink)]"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* VER MÁS PRODUCTOS */}
        <div className="mt-14 flex justify-center">
          <a
            href="/tienda"
            className="inline-flex items-center gap-3 rounded-full border border-[var(--natt-brown)]/15 bg-white px-7 py-3.5 text-xs font-bold text-[var(--natt-brown)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-pink-light)]"
          >
            <ArrowLeftIcon />
            Ver más productos
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}