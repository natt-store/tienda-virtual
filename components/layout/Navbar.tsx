"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useProducts } from "@/lib/useProducts";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[21px] w-[21px]"
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

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[21px] w-[21px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20C5.7 16.7 8.1 14.8 12 14.8C15.9 14.8 18.3 16.7 19 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M5 8.5H19L18 20H6L5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V7C9 5.3 10.3 4 12 4C13.7 4 15 5.3 15 7V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            d="M6 6L18 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M4 7H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 12H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 17H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { products } = useProducts();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const lock = menuOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSearchOpen(false);
          setQuery("");
        }
      };

      window.addEventListener("keydown", onKey);

      return () => window.removeEventListener("keydown", onKey);
    }
  }, [searchOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.section.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, products]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/30 bg-white/55 shadow-[0_8px_30px_rgba(22,19,26,0.08)] backdrop-blur-xl"
            : "border-b border-[var(--natt-black)]/8 bg-[var(--natt-bg)]/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
          {/* MENÚ RESPONSIVE */}
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--natt-black)]/10 bg-white/70 text-[var(--natt-black)] shadow-sm transition-all duration-300 hover:border-[var(--natt-pink)]/40 hover:text-[var(--natt-pink)] sm:h-11 sm:w-11 lg:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center"
            aria-label="Natt Store - Inicio"
          >
            <Image
              src="/brand/logo.png"
              alt="Natt Store"
              width={360}
              height={210}
              priority
              className="h-auto w-[108px] object-contain transition-transform duration-500 group-hover:scale-[1.04] sm:w-[135px] lg:w-[185px]"
            />
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="group relative py-2 text-sm font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-pink)]"
            >
              Inicio
              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--natt-pink)] shadow-[0_0_8px_rgba(255,20,147,0.6)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/tienda"
              className="group relative py-2 text-sm font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-aqua)]"
            >
              Tienda
              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--natt-aqua)] shadow-[0_0_8px_rgba(0,217,217,0.6)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/novedades"
              className="group relative py-2 text-sm font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-purple)]"
            >
              Novedades
              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--natt-purple)] shadow-[0_0_8px_rgba(168,60,255,0.6)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/nosotros"
              className="group relative py-2 text-sm font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-pink)]"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--natt-pink)] shadow-[0_0_8px_rgba(255,20,147,0.6)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/contacto"
              className="group relative py-2 text-sm font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-aqua)]"
            >
              Contacto
              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--natt-aqua)] shadow-[0_0_8px_rgba(0,217,217,0.6)] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* ACCIONES */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Buscar */}
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--natt-black)]/10 bg-white/70 text-[var(--natt-black)] shadow-sm transition-all duration-300 hover:border-[var(--natt-pink)]/40 hover:bg-white hover:text-[var(--natt-pink)] sm:h-11 sm:w-11 sm:px-4 lg:w-auto"
            >
              <SearchIcon />

              <span className="hidden text-xs font-semibold lg:inline">
                Buscar
              </span>
            </button>

            {/* Favoritos */}
            <Link
              href="/favoritos"
              aria-label="Favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--natt-black)] transition-all duration-300 hover:bg-white/70 hover:text-[var(--natt-pink)] sm:flex"
            >
              <HeartIcon />
            </Link>

            {/* Cuenta */}
            <Link
              href="/cuenta"
              aria-label="Cuenta"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--natt-black)] transition-all duration-300 hover:bg-white/70 hover:text-[var(--natt-aqua)] lg:flex"
            >
              <UserIcon />
            </Link>

            {/* Carrito */}
            <Link
              href="/carrito"
              aria-label={
                totalItems > 0
                  ? `Carrito con ${totalItems} ${
                      totalItems === 1 ? "producto" : "productos"
                    }`
                  : "Carrito vacío"
              }
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white shadow-[0_0_15px_rgba(255,20,147,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-aqua)] hover:text-[var(--natt-black)] hover:shadow-[0_0_20px_rgba(0,217,217,0.35)] sm:h-11 sm:w-11"
            >
              <ShoppingBagIcon />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-[var(--natt-bg)] bg-[var(--natt-black)] px-1 text-[9px] font-bold leading-none text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MENÚ MÓVIL / TABLET */}
        <div
          className={`overflow-hidden border-t border-[var(--natt-black)]/8 bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
            menuOpen
              ? "max-h-[calc(100vh-68px)] opacity-100"
              : "max-h-0 border-t-0 opacity-0"
          }`}
        >
          <div className="max-h-[calc(100vh-68px)] overflow-y-auto px-4 pb-6 pt-3 sm:px-6">
            <nav className="mx-auto max-w-2xl">
              {/* Inicio */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-[var(--natt-black)]/8 py-4 text-[15px] font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-pink)]"
              >
                Inicio
                <span className="text-[var(--natt-pink)]">01</span>
              </Link>

              {/* Tienda con Accesorios integrado */}
              <div className="border-b border-[var(--natt-black)]/8">
                <button
                  type="button"
                  onClick={() => setShopOpen((value) => !value)}
                  className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-aqua)]"
                >
                  <span>Tienda</span>
                  <ChevronIcon open={shopOpen} />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    shopOpen
                      ? "grid-rows-[1fr] pb-3 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/tienda"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-aqua)]/15 hover:text-[var(--natt-aqua)]"
                      >
                        Toda la tienda
                      </Link>

                      <Link
                        href="/tienda/maquillaje"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)]"
                      >
                        Maquillaje
                      </Link>

                      <Link
                        href="/tienda/hogar"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-aqua)]/10 hover:text-[var(--natt-aqua)]"
                      >
                        Hogar
                      </Link>

                      <Link
                        href="/tienda/papeleria-kawaii"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-purple)]/10 hover:text-[var(--natt-purple)]"
                      >
                        Papelería
                      </Link>

                      <Link
                        href="/tienda/temporada"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)]"
                      >
                        Temporada
                      </Link>

                      <Link
                        href="/tienda/accesorios"
                        onClick={closeMenu}
                        className="rounded-2xl bg-[var(--natt-bg)] px-4 py-3 text-xs font-semibold text-[var(--natt-black)] transition-all hover:bg-[var(--natt-aqua)]/10 hover:text-[var(--natt-aqua)]"
                      >
                        Accesorios
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Novedades */}
              <Link
                href="/novedades"
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-[var(--natt-black)]/8 py-4 text-[15px] font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-purple)]"
              >
                Novedades
                <span className="text-[var(--natt-purple)]">03</span>
              </Link>

              {/* Nosotros */}
              <Link
                href="/nosotros"
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-[var(--natt-black)]/8 py-4 text-[15px] font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-pink)]"
              >
                Nosotros
                <span className="text-[var(--natt-pink)]">04</span>
              </Link>

              {/* Contacto */}
              <Link
                href="/contacto"
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-[var(--natt-black)]/8 py-4 text-[15px] font-semibold text-[var(--natt-black)] transition-colors hover:text-[var(--natt-aqua)]"
              >
                Contacto
                <span className="text-[var(--natt-aqua)]">05</span>
              </Link>

              {/* ACCIONES */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href="/favoritos"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--natt-black)]/10 bg-white px-4 py-3 text-xs font-semibold text-[var(--natt-black)] shadow-sm transition-all hover:border-[var(--natt-pink)]/30 hover:text-[var(--natt-pink)]"
                >
                  <HeartIcon />
                  Favoritos
                </Link>

                <Link
                  href="/cuenta"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--natt-black)]/10 bg-white px-4 py-3 text-xs font-semibold text-[var(--natt-black)] shadow-sm transition-all hover:border-[var(--natt-aqua)]/30 hover:text-[var(--natt-aqua)]"
                >
                  <UserIcon />
                  Mi cuenta
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* MODAL DE BÚSQUEDA */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-[var(--natt-black)]/45 px-4 pt-20 backdrop-blur-md sm:pt-24"
          onClick={closeSearch}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_30px_80px_rgba(22,19,26,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER DEL MODAL */}
            <div className="flex items-center gap-3 border-b border-[var(--natt-black)]/8 px-5 py-4">
              <span className="text-[var(--natt-pink)]">
                <SearchIcon />
              </span>

              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar maquillaje, hogar, accesorios..."
                className="flex-1 bg-transparent text-base font-medium text-[var(--natt-black)] placeholder:text-[var(--natt-gray)]/60 focus:outline-none"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Cerrar búsqueda"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--natt-bg)] text-[var(--natt-black)] transition hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)]"
              >
                <CloseIcon />
              </button>
            </div>

            {/* RESULTADOS */}
            <div className="max-h-[60vh] overflow-y-auto px-3 py-3">
              {query.trim().length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-[var(--natt-black)]">
                    ¿Qué estás buscando?
                  </p>
                  <p className="mt-1 text-xs text-[var(--natt-gray)]">
                    Prueba con "labial", "hogar" o "accesorios".
                  </p>
                </div>
              )}

              {query.trim().length > 0 && results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-[var(--natt-black)]">
                    No encontramos productos para "{query}".
                  </p>
                  <p className="mt-1 text-xs text-[var(--natt-gray)]">
                    Intenta con otra palabra.
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/tienda/producto/${product.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[var(--natt-bg)]"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--natt-bg)]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--natt-pink)]">
                            {product.category}
                          </p>
                          <p className="truncate text-sm font-extrabold text-[var(--natt-black)]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-[var(--natt-gray)]">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <span className="hidden text-xs font-bold text-[var(--natt-aqua)] sm:block">
                          Ver →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* FOOTER DEL MODAL */}
            {results.length > 0 && (
              <div className="border-t border-[var(--natt-black)]/8 px-5 py-3 text-center text-[11px] font-semibold text-[var(--natt-gray)]">
                {results.length}{" "}
                {results.length === 1 ? "resultado" : "resultados"}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}