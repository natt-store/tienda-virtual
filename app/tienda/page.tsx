import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function StorePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-cream)] text-[var(--natt-dark)]">
      <Navbar />

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] bg-[var(--natt-brown)]">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[var(--natt-pink)]/20" />

          <div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-[var(--natt-aqua)]/10" />

          <div className="absolute left-[48%] top-10 hidden h-3 w-3 rounded-full bg-[var(--natt-pink-light)]/60 lg:block" />

          <div className="absolute right-[12%] top-28 hidden h-2 w-2 rounded-full bg-white/30 lg:block" />

          <div className="relative z-10 grid min-h-[430px] items-center lg:grid-cols-[1fr_0.65fr]">
            <div className="px-7 py-12 sm:px-12 lg:px-16">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--natt-pink-light)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--natt-pink-light)]">
                  Natt Store
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Todo lo que
                <span className="block text-[var(--natt-pink-light)]">
                  te gusta.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                Cuatro mundos, una sola tienda. Explora nuestras colecciones y
                encuentra ese pequeño detalle que estabas buscando.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#colecciones"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[var(--natt-brown)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-pink-light)]"
                >
                  Explorar colecciones
                  <ArrowRightIcon />
                </a>

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Belleza · Hogar · Kawaii · Temporada
                </span>
              </div>
            </div>

            {/* Composición visual */}
            <div className="relative hidden h-full min-h-[430px] lg:block">
              <div className="absolute right-12 top-1/2 h-72 w-72 -translate-y-1/2 rotate-3 rounded-[42px] bg-[var(--natt-cream)] p-8 shadow-2xl">
                <div className="flex h-full items-center justify-center rounded-[30px] bg-white">
                  <img
                    src="/brand/logo-natt-store.png"
                    alt="Natt Store"
                    className="w-[78%] object-contain"
                  />
                </div>
              </div>

              <div className="absolute right-8 top-16 flex h-16 w-16 rotate-12 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white shadow-xl">
                <SparkleIcon />
              </div>

              <div className="absolute bottom-12 left-10 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full bg-[var(--natt-aqua)] text-[var(--natt-brown)] shadow-xl">
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
        {/* Título */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
                Explora por estilo
              </span>

              <span className="h-1 w-1 rounded-full bg-[var(--natt-pink)]" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--natt-brown)]/35">
                04 colecciones
              </span>
            </div>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--natt-brown)] sm:text-5xl">
              Elige tu mundo.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[var(--natt-brown)]/50">
            Cada colección tiene su propio universo visual. Entra, explora y
            encuentra tus favoritos.
          </p>
        </div>

        {/* MAQUILLAJE */}
        <a
          href="/tienda/maquillaje"
          className="group relative mt-10 block overflow-hidden rounded-[38px] bg-[var(--natt-pink-light)]"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 transition-transform duration-700 group-hover:scale-125" />

          <div className="grid min-h-[500px] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-brown)]/55">
                    01 · Belleza
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[var(--natt-brown)] transition-all duration-300 group-hover:rotate-45">
                    <ArrowRightIcon />
                  </span>
                </div>

                <h3 className="mt-16 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--natt-brown)] sm:text-6xl">
                  Maquillaje
                  <span className="block text-[var(--natt-pink)]">
                    para ti.
                  </span>
                </h3>

                <p className="mt-6 max-w-sm text-sm leading-6 text-[var(--natt-brown)]/60">
                  Tonos, texturas y pequeños esenciales para crear looks que
                  se sientan como tú.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--natt-brown)] text-white">
                  <PlusIcon />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--natt-brown)]">
                  Descubrir maquillaje
                </span>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden lg:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90"
                alt="Colección de maquillaje"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[var(--natt-pink-light)] via-transparent to-transparent opacity-80 lg:w-1/2" />

              <div className="absolute bottom-7 left-7 rounded-[20px] bg-white/90 px-5 py-4 shadow-xl backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--natt-pink)]">
                  Destacado
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--natt-brown)]">
                  Esenciales de belleza
                </p>
              </div>
            </div>
          </div>
        </a>

        {/* HOGAR + PAPELERÍA */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* HOGAR */}
          <a
            href="/tienda/hogar"
            className="group relative min-h-[560px] overflow-hidden rounded-[38px] bg-[var(--natt-aqua)] p-6 sm:p-8"
          >
            <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/20 transition-transform duration-700 group-hover:scale-125" />

            <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-brown)]/55">
                  02 · Hogar
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[var(--natt-brown)] transition-all duration-300 group-hover:rotate-45">
                  <ArrowRightIcon />
                </span>
              </div>

              <div className="relative mx-auto mt-8 w-full max-w-[360px]">
                <div className="absolute -left-5 -top-5 h-20 w-20 rounded-full bg-[var(--natt-peach)] shadow-lg transition-transform duration-700 group-hover:translate-x-8 group-hover:-translate-y-2" />

                <div className="relative overflow-hidden rounded-[34px] bg-white p-3 shadow-2xl rotate-[-3deg] transition-transform duration-700 group-hover:rotate-0 group-hover:translate-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=90"
                    alt="Colección para el hogar"
                    className="aspect-[4/3] w-full rounded-[26px] object-cover"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-4xl font-semibold tracking-tight text-[var(--natt-brown)]">
                  Haz tu
                  <span className="block">espacio bonito.</span>
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--natt-brown)]/60">
                  Detalles para convertir tus espacios en lugares que se
                  sienten realmente tuyos.
                </p>
              </div>
            </div>
          </a>

          {/* PAPELERÍA */}
          <a
            href="/tienda/papeleria-kawaii"
            className="group relative min-h-[560px] overflow-hidden rounded-[38px] bg-[#DCCEF3] p-6 sm:p-8"
          >
            {/* Misma interacción visual de Hogar */}
            <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/20 transition-transform duration-700 group-hover:scale-125" />

            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/25" />

            <div className="absolute bottom-10 right-8 h-3 w-3 rounded-full bg-[var(--natt-pink)] transition-transform duration-700 group-hover:translate-x-4 group-hover:-translate-y-3" />

            <div className="absolute right-16 top-20 h-2 w-2 rounded-full bg-[var(--natt-brown)]/30" />

            <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-brown)]/55">
                  03 · Papelería
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[var(--natt-brown)] transition-all duration-300 group-hover:rotate-45">
                  <ArrowRightIcon />
                </span>
              </div>

              <div className="relative mx-auto mt-8 w-full max-w-[360px]">
                <div className="absolute -left-5 -top-5 h-20 w-20 rounded-full bg-[var(--natt-peach)] shadow-lg transition-transform duration-700 group-hover:translate-x-8 group-hover:-translate-y-2" />

                <div className="relative overflow-hidden rounded-[34px] bg-white p-3 shadow-2xl rotate-[-3deg] transition-transform duration-700 group-hover:rotate-0 group-hover:translate-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=90"
                    alt="Papelería kawaii"
                    className="aspect-[4/3] w-full rounded-[26px] object-cover"
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <SparkleIcon />

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--natt-brown)]/50">
                    Pequeños detalles
                  </span>
                </div>

                <h3 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--natt-brown)]">
                  Haz tu
                  <span className="block text-[var(--natt-pink)]">
                    escritorio bonito.
                  </span>
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--natt-brown)]/60">
                  Papelería para estudiar, crear, organizar y disfrutar cada
                  pequeño momento.
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* TEMPORADA */}
        <a
          href="/tienda/temporada"
          className="group relative mt-5 block min-h-[430px] overflow-hidden rounded-[38px] bg-[var(--natt-peach)]"
        >
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/25" />

          <div className="absolute -bottom-28 right-20 h-72 w-72 rounded-full bg-[var(--natt-pink)]/10" />

          <div className="relative z-10 grid min-h-[430px] items-center lg:grid-cols-[1fr_1fr]">
            <div className="order-2 px-7 pb-10 sm:px-10 lg:order-1 lg:px-14 lg:py-12">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-brown)]/55">
                  04 · Temporada
                </span>

                <span className="h-px w-8 bg-[var(--natt-brown)]/30" />
              </div>

              <h3 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--natt-brown)] sm:text-6xl">
                Halloween
                <span className="block text-[var(--natt-pink)]">
                  para consentirlos.
                </span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-6 text-[var(--natt-brown)]/60">
                Descubre disfraces y detalles especiales para que tu mascota
                también haga parte de la celebración.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-[var(--natt-brown)] px-6 py-3.5 text-xs font-bold text-white transition-all duration-300 group-hover:bg-[var(--natt-pink)]">
                Ver disfraces
                <ArrowRightIcon />
              </div>
            </div>

            <div className="order-1 relative h-[270px] overflow-hidden lg:order-2 lg:h-full">
              <img
                src="https://images.unsplash.com/photo-1509587584298-0f3b3a3a1799?auto=format&fit=crop&w=1400&q=90"
                alt="Disfraces de Halloween para perros"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--natt-peach)] via-transparent to-transparent lg:bg-gradient-to-r" />

              <div className="absolute right-7 top-7 flex h-16 w-16 rotate-12 items-center justify-center rounded-full bg-white/90 text-[var(--natt-pink)] shadow-xl backdrop-blur-sm">
                <SparkleIcon />
              </div>
            </div>
          </div>
        </a>
      </section>

      <Footer />
    </main>
  );
}