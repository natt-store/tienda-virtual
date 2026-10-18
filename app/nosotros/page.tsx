"use client";

import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NosotrosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* =========================================================
          HERO NOSOTROS (AQUA)
      ========================================================= */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-[#eaf6f5] shadow-[0_25px_70px_rgba(30,90,90,0.15)]">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#00d9d9]/25 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-80 w-80 rounded-full bg-[#00bfc0]/20 blur-3xl" />
          <div className="absolute left-[45%] top-[-100px] h-64 w-64 rounded-full bg-[#8ff8f1]/40 blur-3xl" />

          <div className="pointer-events-none absolute -right-28 top-8 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00bfc0]/35" />
          <div className="pointer-events-none absolute -right-20 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/35" />

          <div className="relative grid min-h-[420px] items-center gap-8 px-7 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-16">
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-[#00bfc0]/30 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#008f91] backdrop-blur-md">
                Sobre Natt Store
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Detalles que
                <br />
                <span className="text-[#008f91]">enamoran.</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#4d6666] sm:text-base">
                Natt Store es una boutique online pensada para quienes aman
                rodearse de cosas bonitas, útiles y con personalidad.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tienda"
                  className="rounded-full bg-[#00bfc0] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,191,192,0.28)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa]"
                >
                  Explorar tienda
                </Link>

                <Link
                  href="/contacto"
                  className="rounded-full border border-[#24191f]/10 bg-white/80 px-6 py-3 text-sm font-bold text-[#24191f] backdrop-blur transition hover:bg-white"
                >
                  Contacto
                </Link>
              </div>
            </div>

            {/* COMPOSICIÓN VISUAL CON LOGO */}
            <div className="relative mx-auto h-[300px] w-full max-w-[480px] lg:h-[360px]">
              <div className="absolute left-1/2 top-1/2 h-[225px] w-[225px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#ffffff] via-[#c9efec] to-[#7fd4d1] shadow-[0_28px_60px_rgba(30,90,90,0.18)] sm:h-[270px] sm:w-[270px]" />

              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#00bfc0]/45 sm:h-[295px] sm:w-[295px]" />

              <div className="absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00d9d9]/30 sm:h-[330px] sm:w-[330px]" />

              <div className="absolute left-[8%] top-[12%] text-2xl text-[#00bfc0]">✦</div>
              <div className="absolute right-[9%] top-[18%] text-xl text-[#008f91]">✦</div>
              <div className="absolute bottom-[14%] left-[12%] text-lg text-[#00d9d9]">✧</div>
              <div className="absolute bottom-[10%] right-[15%] text-xl text-[#00bfc0]">✦</div>

              <div className="absolute left-[6%] top-[42%] flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border border-[#00bfc0]/30 bg-white/85 text-2xl text-[#00bfc0] shadow-md backdrop-blur-md">
                ♥
              </div>

              <div className="absolute right-[6%] top-[55%] flex h-12 w-12 rotate-[12deg] items-center justify-center rounded-full border border-[#008f91]/25 bg-white/85 text-xl text-[#008f91] shadow-md backdrop-blur-md">
                ✦
              </div>

              {/* LOGO EN EL CENTRO */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[36px] border-4 border-white/85 bg-white/85 shadow-[0_24px_50px_rgba(30,90,90,0.25)] backdrop-blur-md sm:h-[220px] sm:w-[220px]">
                <Image
                  src="/brand/logo.png"
                  alt="Natt Store"
                  width={360}
                  height={210}
                  priority
                  className="h-auto w-[150px] object-contain sm:w-[175px]"
                />
              </div>

              <div className="absolute bottom-[2%] left-1/2 h-[8px] w-[180px] -translate-x-1/2 rounded-full bg-[#00bfc0]/75 blur-[2px] shadow-[0_0_20px_rgba(0,191,192,0.55)]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HISTORIA
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
              Nuestra historia
            </p>

            <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Todo lo que amas,
              <span className="text-[#00bfc0]"> en un solo lugar.</span>
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-[#675b55] sm:text-base">
              <p>
                Natt Store nació de una idea sencilla: reunir en un solo
                espacio esas cosas pequeñas que hacen la vida más linda.
              </p>

              <p>
                Empezamos con maquillaje, luego llegaron la papelería, el
                hogar y los detalles de temporada. Poco a poco se fue
                armando una colección pensada para acompañarte en lo
                cotidiano y en lo especial.
              </p>

              <p>
                Cada producto lo elegimos con cuidado: que sea bonito, útil
                y que tenga ese algo que te haga sonreír al abrirlo.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-white/70 bg-[#eaf6f5] p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Nuestra filosofía
              </p>

              <ul className="mt-5 space-y-4 text-sm leading-7 text-[#4d6666] sm:text-base">
                <li className="flex gap-3">
                  <span className="text-[#00bfc0]">♥</span>
                  <span>
                    Creemos en los detalles: lo pequeño también transforma.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#008f91]">✦</span>
                  <span>
                    Elegimos con cuidado cada pieza de nuestra colección.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00d9d9]">✧</span>
                  <span>
                    Queremos que comprar aquí se sienta cercano y especial.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Experiencia Natt
              </p>

              <p className="mt-4 text-sm leading-7 text-[#675b55] sm:text-base">
                Navega, guarda tus favoritos, arma tu carrito y recibe tus
                productos donde estés. Queremos que cada paso se sienta
                fácil, bonito y tuyo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          NUESTRO ENFOQUE (3 tarjetas)
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
              Nuestro enfoque
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Qué nos mueve y en qué creemos
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00bfc0]/18 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00bfc0]/15 text-xl text-[#008f91]">
                  ♥
                </div>
                <h3 className="mt-4 text-lg font-black">Cuidado en cada detalle</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Seleccionamos cada producto pensando en que sea bonito,
                  útil y especial. Nos importa lo que llega a tus manos.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00d9d9]/20 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00d9d9]/18 text-xl text-[#008f91]">
                  ✦
                </div>
                <h3 className="mt-4 text-lg font-black">Cercanía contigo</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Queremos que comprar aquí se sienta como hablar con
                  alguien de confianza: claro, fácil y cálido.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8ff8f1]/40 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8ff8f1]/50 text-xl text-[#008f91]">
                  ✧
                </div>
                <h3 className="mt-4 text-lg font-black">Crecer contigo</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Vamos sumando categorías y mejorando cada vez, sin perder
                  la esencia que hace única a Natt Store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BANNER FINAL
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#0f2e2e] px-7 py-10 text-center shadow-[0_20px_55px_rgba(15,46,46,0.25)] sm:px-12">
          <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#00d9d9]/30 blur-3xl" />
          <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#00bfc0]/25 blur-3xl" />

          <div className="pointer-events-none absolute left-1/2 top-5 h-[2px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00d9d9] to-transparent opacity-90" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8ff8f1]">
              Natt Store
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Gracias por estar
              <span className="text-[#00d9d9]"> aquí.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
              Explora la tienda y descubre esos detalles que hacen la
              diferencia.
            </p>

            <Link
              href="/tienda"
              className="mt-7 inline-flex rounded-full bg-[#00bfc0] px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa]"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}