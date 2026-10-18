"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartContext";
import {
  validateCoupon,
  saveCoupon,
  loadCoupons,
  removeCoupon,
  clearCoupon,
  calculateCouponDiscount,
  type AppliedCoupon,
} from "@/lib/useCoupons";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CarritoPage() {
  const {
    items,
    subtotal,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [coupons, setCoupons] = useState<AppliedCoupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setCoupons(loadCoupons());
  }, []);

  // Base de envío estándar por defecto en el carrito
  const baseShipping = subtotal === 0 ? 0 : 12000;

  // Descuento acumulado por los cupones activos
  const couponResult = calculateCouponDiscount(coupons, subtotal);

  const shipping = couponResult.freeShipping ? 0 : baseShipping;
  const discount = couponResult.discount;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    setCouponError("");
    setApplying(true);

    const result = await validateCoupon(couponCode, subtotal, coupons);

    if (!result.ok || !result.coupon) {
      setCouponError(result.error || "No se pudo aplicar el cupón.");
      setApplying(false);
      return;
    }

    saveCoupon(result.coupon);
    setCoupons(loadCoupons());
    setCouponCode("");
    setApplying(false);
  };

  const handleRemoveCoupon = (codigo: string) => {
    removeCoupon(codigo);
    setCoupons(loadCoupons());
    setCouponError("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#eadfd5] text-[#24191f]">
      <Navbar />

      {/* ENCABEZADO */}
      <section className="relative px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pb-10 lg:pt-9">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#ff1493]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#00d9d9]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[#f7eee7] px-7 py-9 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-10 lg:px-14 lg:py-11">
            <div className="pointer-events-none absolute -right-24 -top-28 h-64 w-[480px] rotate-[10deg] rounded-[50%] border-2 border-[#ff1493]/20" />
            <div className="pointer-events-none absolute -right-28 -top-16 h-64 w-[500px] rotate-[10deg] rounded-[50%] border-2 border-[#00d9d9]/25" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ff1493]/20 bg-white/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff1493] backdrop-blur-md">
                Natt Store
              </span>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Tu carrito
                <br />
                <span className="text-[#ff1493]">
                  está lleno de favoritos.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#67545d] sm:text-base">
                Revisa tus productos, ajusta las cantidades y prepárate para
                recibir esos detalles que te encantan.
              </p>

              {items.length > 0 && (
                <div className="mt-6 inline-flex rounded-full border border-[#24191f]/10 bg-white/70 px-4 py-2 text-xs font-bold text-[#67545d] backdrop-blur">
                  {totalItems}{" "}
                  {totalItems === 1 ? "producto" : "productos"} en tu carrito
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="pointer-events-none absolute left-[35%] top-20 h-72 w-72 rounded-full bg-[#a83cff]/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {items.length === 0 ? (
            <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/75 px-6 py-16 text-center shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ff1493]/10 text-[#ff1493]">
                <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
                  <path
                    d="M5 8.5H19L18 20H6L5 8.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8.5V7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7V8.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Tu carrito está vacío.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#67545d]">
                Todavía no has agregado productos. Explora nuestras
                colecciones y encuentra tu próximo favorito.
              </p>

              <Link
                href="/tienda"
                className="mt-7 inline-flex rounded-full bg-[#ff1493] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84]"
              >
                Explorar tienda
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* PRODUCTOS */}
              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-[#24191f]/[0.06] px-5 py-5 sm:px-7">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00aeb0]">
                      Tu selección
                    </p>
                    <h2 className="mt-1 text-xl font-black">Productos</h2>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-[#24191f]/10 bg-white px-4 py-2 text-xs font-bold text-[#75636b] transition hover:border-[#ff1493]/20 hover:text-[#ff1493]"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <div className="divide-y divide-[#24191f]/[0.06]">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group flex gap-4 p-4 sm:gap-5 sm:p-6"
                    >
                      <Link
                        href={`/tienda/producto/${item.id}`}
                        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[22px] bg-[#f4e9e2] sm:h-36 sm:w-32"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#24191f]/10 to-transparent" />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#00aeb0]">
                              {item.category}
                            </p>

                            <Link
                              href={`/tienda/producto/${item.id}`}
                              className="mt-1 block text-sm font-black leading-5 transition hover:text-[#ff1493] sm:text-base"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-xs text-[#8a767e]">
                              {formatPrice(item.price)} c/u
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9a858d] transition hover:bg-[#ff1493]/10 hover:text-[#ff1493]"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4"
                            >
                              <path
                                d="M5 7H19"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7"
                                stroke="currentColor"
                                strokeWidth="1.7"
                              />
                              <path
                                d="M7 7L8 20H16L17 7"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center overflow-hidden rounded-full border border-[#24191f]/10 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-9 w-9 items-center justify-center font-bold transition hover:bg-[#ff1493]/10 hover:text-[#ff1493]"
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-xs font-black">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-9 w-9 items-center justify-center font-bold transition hover:bg-[#00d9d9]/10 hover:text-[#00aeb0]"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sm font-black sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* RESUMEN */}
              <aside className="h-fit overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_15px_40px_rgba(70,40,50,0.09)] backdrop-blur-sm sm:p-7">
                <div className="h-[3px] rounded-full bg-gradient-to-r from-[#ff1493] via-[#a83cff] to-[#00d9d9]" />

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Resumen de compra
                </p>

                <h2 className="mt-2 text-2xl font-black">Tu pedido</h2>

                {/* CUPONES */}
                <div className="mt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00aeb0]">
                    ¿Tienes cupones? (Máx. 2)
                  </p>

                  {/* LISTA DE CUPONES APLICADOS */}
                  {coupons.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {coupons.map((c) => (
                        <div
                          key={c.codigo}
                          className="flex items-center justify-between gap-2 rounded-2xl border border-[#00bfc0]/30 bg-[#00bfc0]/8 px-4 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#008f91]">
                              Cupón aplicado
                            </p>
                            <p className="mt-0.5 truncate text-xs font-black text-[#008f91]">
                              {c.codigo} · {c.nombre}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCoupon(c.codigo)}
                            aria-label={`Quitar cupón ${c.codigo}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#008f91] transition hover:bg-[#008f91]/10 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INPUT PARA AGREGAR SI HAY MENOS DE 2 */}
                  {coupons.length < 2 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Escribe tu cupón"
                        className="flex-1 rounded-2xl border border-[#24191f]/10 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide outline-none transition focus:border-[#00bfc0]"
                      />

                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applying}
                        className="rounded-2xl bg-[#00bfc0] px-4 py-3 text-xs font-black text-white transition hover:bg-[#00a9aa] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {applying ? "..." : "Aplicar"}
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="mt-2 rounded-xl border border-[#ff1493]/20 bg-[#ff1493]/8 px-3 py-2 text-[11px] font-bold text-[#ff1493]">
                      {couponError}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#76666e]">Subtotal</span>
                    <span className="font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#76666e]">Envío (Estimado)</span>
                    <span className="font-bold text-[#00aeb0]">
                      {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#ff1493]">
                        Descuento cupones
                      </span>
                      <span className="font-black text-[#ff1493]">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  {couponResult.freeShipping && (
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#ff1493]">
                        Envío gratis por cupón
                      </span>
                      <span className="font-black text-[#ff1493]">
                        ¡Aplicado!
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#24191f]/10 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm font-bold text-[#76666e]">
                        Total estimado
                      </span>
                      <span className="text-2xl font-black text-[#ff1493]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-7 flex w-full items-center justify-center rounded-full bg-[#ff1493] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84]"
                >
                  Finalizar compra
                </Link>

                <Link
                  href="/tienda"
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-[#24191f]/10 bg-white px-6 py-3.5 text-sm font-bold text-[#24191f] transition hover:border-[#00d9d9]/40 hover:bg-[#00d9d9]/[0.06]"
                >
                  Seguir comprando
                </Link>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#f7eee7] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff1493]/10 text-[#ff1493]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M12 21S4 16.5 4 10.2C4 6.8 6.2 4.5 9.1 4.5C10.6 4.5 11.7 5.2 12 6.2C12.3 5.2 13.4 4.5 14.9 4.5C17.8 4.5 20 6.8 20 10.2C20 16.5 12 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-bold">Compra segura</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-[#817079]">
                      Tus productos están guardados en tu carrito.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}