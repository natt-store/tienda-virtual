"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  href: string;
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle({ className = "", color = "pink" }: { className?: string; color?: "pink" | "aqua" | "purple" }) {
  const colorClass =
    color === "aqua" ? "text-[var(--natt-aqua)]" : color === "purple" ? "text-[var(--natt-purple)]" : "text-[var(--natt-pink)]";

  return (
    <span className={`pointer-events-none absolute ${colorClass} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
        <path d="M20 1C20.7 11.8 28.2 19.3 39 20C28.2 20.7 20.7 28.2 20 39C19.3 28.2 11.8 20.7 1 20C11.8 19.3 19.3 11.8 20 1Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function RecommendedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("badge", "Recomendado")
          .limit(3);

        if (error) throw error;
        
        const formatted = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          image: p.image || "/placeholder.png",
          category: p.category || "General",
          badge: p.badge,
          href: `/tienda/producto/${p.id}`,
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Error al cargar recomendados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommended();
  }, []);

  const accents = [
    { color: "var(--natt-pink)", shadow: "rgba(255,20,147,0.45)" },
    { color: "var(--natt-aqua)", shadow: "rgba(0,217,217,0.4)" },
    { color: "var(--natt-purple)", shadow: "rgba(168,60,255,0.4)" },
  ];

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[34px] border border-[#b98ca7]/25 shadow-[0_30px_80px_rgba(45,18,38,0.22)]"
          style={{ background: "linear-gradient(135deg, #3c1733 0%, #4b1c40 45%, #32172e 100%)" }}
        >
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-[3px]"
            style={{
              background: "linear-gradient(90deg, var(--natt-pink), var(--natt-purple), var(--natt-aqua))",
              boxShadow: "0 0 14px rgba(255,20,147,0.7), 0 0 25px rgba(0,217,217,0.25)",
            }}
          />

          <Sparkle className="right-[39%] top-8 h-4 w-4" color="aqua" />
          <Sparkle className="bottom-8 left-[44%] h-3 w-3" color="pink" />

          <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
            {/* LADO IZQUIERDO */}
            <div className="relative flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-12 lg:py-14">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="h-[2px] w-8 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--natt-pink), var(--natt-aqua))",
                    boxShadow: "0 0 8px rgba(255,20,147,0.45)",
                  }}
                />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--natt-aqua)]">
                  Para ti
                </span>
              </div>

              <h2 className="max-w-md text-[36px] font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-[46px]">
                También puedes
                <span
                  className="mt-1 block font-serif italic text-[var(--natt-pink)]"
                  style={{ textShadow: "0 0 8px rgba(255,20,147,0.7), 0 0 22px rgba(255,20,147,0.3)" }}
                >
                  enamorarte de estos.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                Descubre otros productos seleccionados para complementar tus favoritos y encontrar algo nuevo que te encante.
              </p>

              <Link
                href="/tienda"
                className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#3c1733] shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--natt-pink)] hover:text-white"
              >
                Explorar productos
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>

            {/* LADO DERECHO */}
            <div className="relative px-4 pb-5 pt-5 sm:px-5 lg:px-6 lg:py-7">
              <div className="grid grid-cols-2 gap-4">
                {/* PRODUCTO PRINCIPAL */}
                {products[0] && (
                  <article className="group relative row-span-2 min-h-[500px] overflow-hidden rounded-[30px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                    <Image
                      src={products[0].image}
                      alt={products[0].name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160c17]/90 via-transparent to-black/10" />
                    <div className="absolute left-0 right-0 top-0 z-10 h-1" style={{ background: accents[0].color, boxShadow: `0 0 18px ${accents[0].color}` }} />

                    <div className="absolute left-5 top-5 z-10">
                      <span className="rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md" style={{ background: "rgba(255,20,147,0.85)" }}>
                        {products[0].badge ?? "Recomendado"}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 z-10">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffb6c1]">{products[0].category}</p>
                      <h3 className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-white">{products[0].name}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">${products[0].price.toLocaleString("es-CO")}</span>
                        <Link href={products[0].href} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white shadow-[0_0_18px_rgba(255,20,147,0.45)] transition-transform duration-300 hover:scale-110" aria-label={`Ver ${products[0].name}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* PRODUCTO 2 */}
                {products[1] && (
                  <article className="group relative min-h-[240px] overflow-hidden rounded-[30px] border border-white/20 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                    <Image
                      src={products[1].image}
                      alt={products[1].name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160c17]/90 via-transparent to-black/10" />
                    <div className="absolute left-0 right-0 top-0 z-10 h-1" style={{ background: accents[1].color, boxShadow: `0 0 18px ${accents[1].color}` }} />
                    <span className="absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#173333] backdrop-blur-md" style={{ background: "var(--natt-aqua)" }}>
                      {products[1].badge ?? "Recomendado"}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--natt-aqua)]">{products[1].category}</p>
                      <div className="mt-1 flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-[17px] font-bold text-white">{products[1].name}</h3>
                          <p className="mt-1 text-xs font-semibold text-white/80">${products[1].price.toLocaleString("es-CO")}</p>
                        </div>
                        <Link href={products[1].href} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--natt-aqua)] text-[#173333] shadow-[0_0_16px_rgba(0,217,217,0.4)] transition-transform duration-300 hover:scale-110" aria-label={`Ver ${products[1].name}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* PRODUCTO 3 */}
                {products[2] && (
                  <article className="group relative min-h-[240px] overflow-hidden rounded-[30px] border border-white/20 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                    <Image
                      src={products[2].image}
                      alt={products[2].name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160c17]/90 via-transparent to-black/10" />
                    <div className="absolute left-0 right-0 top-0 z-10 h-1" style={{ background: accents[2].color, boxShadow: `0 0 18px ${accents[2].color}` }} />
                    <span className="absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md" style={{ background: "var(--natt-purple)" }}>
                      {products[2].badge ?? "Recomendado"}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#d99cff]">{products[2].category}</p>
                      <div className="mt-1 flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-[17px] font-bold text-white">{products[2].name}</h3>
                          <p className="mt-1 text-xs font-semibold text-white/80">${products[2].price.toLocaleString("es-CO")}</p>
                        </div>
                        <Link href={products[2].href} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--natt-purple)] text-white shadow-[0_0_16px_rgba(168,60,255,0.4)] transition-transform duration-300 hover:scale-110" aria-label={`Ver ${products[2].name}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}