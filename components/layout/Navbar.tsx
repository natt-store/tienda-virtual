import Image from "next/image";

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
        strokeWidth="1.8"
      />
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
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--natt-brown)]/10 bg-[var(--natt-cream)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

        {/* Logo */}
        <a
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Natt Store - Inicio"
        >
          <Image
            src="/brand/logo-natt-store.png"
            alt="Natt Store"
            width={180}
            height={75}
            priority
            className="h-auto w-[145px] object-contain sm:w-[175px]"
          />
        </a>

        {/* Navegación */}
        <nav className="hidden items-center gap-7 lg:flex">

          <a
            href="/"
            className="relative py-2 text-sm font-semibold text-[var(--natt-brown)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--natt-pink)] after:transition-all hover:text-[var(--natt-pink)] hover:after:w-full"
          >
            Inicio
          </a>

          <a
            href="/tienda"
            className="relative py-2 text-sm font-semibold text-[var(--natt-brown)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--natt-pink)] after:transition-all hover:text-[var(--natt-pink)] hover:after:w-full"
          >
            Tienda
          </a>

          <a
            href="/novedades"
            className="relative py-2 text-sm font-semibold text-[var(--natt-brown)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--natt-pink)] after:transition-all hover:text-[var(--natt-pink)] hover:after:w-full"
          >
            Novedades
          </a>

          <a
            href="/nosotros"
            className="relative py-2 text-sm font-semibold text-[var(--natt-brown)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--natt-pink)] after:transition-all hover:text-[var(--natt-pink)] hover:after:w-full"
          >
            Nosotros
          </a>

          <a
            href="/contacto"
            className="relative py-2 text-sm font-semibold text-[var(--natt-brown)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[var(--natt-pink)] after:transition-all hover:text-[var(--natt-pink)] hover:after:w-full"
          >
            Contacto
          </a>

        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">

          {/* Buscar - protagonista */}
          <button
            type="button"
            aria-label="Buscar"
            className="group flex h-11 items-center gap-2 rounded-full border border-[var(--natt-brown)]/15 bg-white/70 px-4 text-[var(--natt-brown)] shadow-sm transition-all duration-300 hover:border-[var(--natt-pink)]/40 hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)] hover:shadow-md"
          >
            <SearchIcon />

            <span className="hidden text-xs font-semibold sm:inline">
              Buscar
            </span>
          </button>

          {/* Favoritos */}
          <button
            type="button"
            aria-label="Favoritos"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--natt-brown)] transition-all hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)]"
          >
            <HeartIcon />
          </button>

          {/* Cuenta */}
          <button
            type="button"
            aria-label="Cuenta"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--natt-brown)] transition-all hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)] sm:flex"
          >
            <UserIcon />
          </button>

          {/* Carrito - protagonista */}
          <button
            type="button"
            aria-label="Carrito"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white shadow-md shadow-[var(--natt-pink)]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-brown)] hover:shadow-lg"
          >
            <ShoppingBagIcon />

            <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-[var(--natt-cream)] bg-[var(--natt-brown)] px-1 text-[9px] font-bold leading-none text-white">
              0
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}