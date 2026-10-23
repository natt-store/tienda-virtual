"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartContext";
import {
  validateCoupon,
  saveCoupon,
  loadCoupons,
  removeCoupon,
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

// Icono de bolsa corporativo y visible
function IconBagLarge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Icono de papelera visible y elegante
function IconTrashClean() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 7H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 7L8 20H16L17 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

// Icono de escudo corporativo
function IconShieldSafe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
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

  const baseShipping = subtotal === 0 ? 0 : 12000;
  const couponResult = calculateCouponDiscount(coupons, subtotal);

  const shipping = couponResult.freeShipping ? 0 : baseShipping;
  const discount = couponResult.discount;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    setCouponError("");
    setApplying(true);

    const result = await validateCoupon(couponCode, subtotal, coupons);

    if (!result.ok || !result.coupon) {
      setCouponError(result.error || "Cupón no válido.");
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

      {/* ENCABEZADO CON LAS LÍNEAS GEOMÉTRICAS Y BOLSA VISIBLE */}
      <section className="relative px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pb-12 lg:pt-9">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ff1493]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#00d9d9]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[#f7eee7] px-8 py-10 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-10 lg:px-16 lg:py-12">
            
            {/* LÍNEAS GEOMÉTRICAS DIAGONALES DE NATT STORE */}
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-[520px] rotate-[12deg] rounded-[50%] border-[2.5px] border-[#ff1493]/25" />
            <div className="pointer-events-none absolute -right-20 -top-12 h-72 w-[540px] rotate-[12deg] rounded-[50%] border-[2.5px] border-[#00d9d9]/30" />
            
            {/* LÍNEA SUPERIOR DEGRADADA */}
            <div className="absolute inset-x-0 top-0 h-[3.5px]" style={{ background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)" }} />

            <div className="relative">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#ff1493]/35 bg-white/90 px-5 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-[#ff1493] backdrop-blur-md shadow-sm">
                <IconBagLarge />
                Natt Store Exclusivo
              </span>

              <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Tu carrito
                <br />
                <span className="text-[#ff1493]">
                  está lleno de favoritos.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#67545d] sm:text-base font-medium">
                Revisa tus productos, ajusta las cantidades con total comodidad y prepárate para recibir esos detalles que te encantan.
              </p>

              {items.length > 0 && (
                <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#24191f]/10 bg-white/90 px-5 py-2.5 text-xs font-black text-[#67545d] backdrop-blur shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff1493] animate-pulse" />
                  {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="pointer-events-none absolute left-[35%] top-20 h-72 w-72 rounded-full bg-[#a83cff]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {items.length === 0 ? (
            <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[#f7eee7] px-8 py-16 text-center shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ff1493]/12 text-[#ff1493] shadow-inner">
                <IconBagLarge />
              </div>

              <h2 className="mt-6 text-2xl font-black text-[#24191f]">
                Tu carrito está vacío.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#67545d]">
                Todavía no has agregado productos. Explora nuestras colecciones y encuentra tu próximo favorito.
              </p>

              <Link
                href="/tienda"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff1493] px-8 py-3.5 text-sm font-black text-white shadow-[0_10px_28px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4]"
              >
                Explorar tienda
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              
              {/* LISTA DE PRODUCTOS */}
              <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[#f7eee7] shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-[#24191f]/10 px-6 py-5 sm:px-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                      Tu selección
                    </p>
                    <h2 className="mt-1 text-xl font-black text-[#24191f]">
                      Productos ({totalItems})
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-[#24191f]/10 bg-white/80 px-4 py-2 text-xs font-bold text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <div className="divide-y divide-[#24191f]/10">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group flex gap-5 p-5 sm:p-6 transition hover:bg-white/50"
                    >
                      {/* IMAGEN NÍTIDA Y PROPORCIONADA */}
                      <Link
                        href={`/tienda/producto/${item.id}`}
                        className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-[24px] border border-white bg-[#efe4da] shadow-sm"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="128px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ff1493]">
                              {item.category}
                            </p>

                            <Link
                              href={`/tienda/producto/${item.id}`}
                              className="mt-1 block text-base font-black leading-snug text-[#24191f] transition hover:text-[#ff1493]"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-xs font-bold text-[#67545d]">
                              {formatPrice(item.price)} unidad
                            </p>
                          </div>

                          {/* BOTÓN ELIMINAR CON ÍCONO DE PAPELERA VISIBLE */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#67545d] shadow-sm transition hover:bg-[#ff1493] hover:text-white"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <IconTrashClean />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center overflow-hidden rounded-full border border-[#24191f]/10 bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-9 w-9 items-center justify-center font-black text-[#24191f] transition hover:bg-[#ff1493]/10 hover:text-[#ff1493]"
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-xs font-black text-[#24191f]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-9 w-9 items-center justify-center font-black text-[#24191f] transition hover:bg-[#00d9d9]/10 hover:text-[#008f91]"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-base font-black text-[#24191f] sm:text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* RESUMEN DE COMPRA CON LÍNEA DEGRADADA */}
              <aside className="h-fit overflow-hidden rounded-[32px] border border-white/80 bg-[#f7eee7] p-6 shadow-[0_20px_50px_rgba(105,55,65,0.1)] backdrop-blur-md sm:p-7 relative">
                <div className="absolute inset-x-0 top-0 h-[3.5px]" style={{ background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)" }} />

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Resumen de compra
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#24191f]">Tu pedido</h2>

                {/* CUPONES */}
                <div className="mt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                    ¿Tienes cupones? (Máx. 2)
                  </p>

                  {coupons.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {coupons.map((c) => (
                        <div
                          key={c.codigo}
                          className="flex items-center justify-between gap-2 rounded-2xl border border-[#00bfc0]/30 bg-[#00bfc0]/10 px-4 py-2.5 shadow-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#008f91]">
                              Cupón aplicado
                            </p>
                            <p className="mt-0.5 truncate text-xs font-black text-[#008f91]">
                              {c.codigo} · {c.nombre}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCoupon(c.codigo)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#008f91] hover:bg-[#008f91]/20 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {coupons.length < 2 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Escribe tu cupón"
                        className="flex-1 rounded-2xl border border-[#24191f]/10 bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#008f91]"
                      />

                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applying}
                        className="rounded-2xl bg-[#008f91] px-4 py-3 text-xs font-black text-white transition hover:bg-[#007375] disabled:opacity-60 shadow-sm"
                      >
                        {applying ? "..." : "Aplicar"}
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="mt-2 rounded-xl border border-[#ff1493]/20 bg-[#ff1493]/10 px-3 py-2 text-[11px] font-bold text-[#ff1493]">
                      {couponError}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-[#67545d]">Subtotal</span>
                    <span className="font-black text-[#24191f]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-[#67545d]">Envío (Estimado)</span>
                    <span className="font-black text-[#008f91]">
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
                      <span className="text-sm font-black text-[#67545d]">
                        Total estimado
                      </span>
                      <span className="text-3xl font-black text-[#ff1493]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 flex w-full items-center justify-center rounded-full bg-[#ff1493] px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[0_10px_28px_rgba(255,20,147,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4]"
                >
                  Finalizar compra
                </Link>

                <Link
                  href="/tienda"
                  className="mt-3.5 flex w-full items-center justify-center rounded-full border border-[#24191f]/10 bg-white/80 px-6 py-3.5 text-xs font-black text-[#24191f] transition hover:bg-white"
                >
                  Seguir comprando
                </Link>

                <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-white/80 p-4 border border-white shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#008f91]/10 text-[#008f91]">
                    <IconShieldSafe />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#24191f]">Compra segura</p>
                    <p className="mt-0.5 text-[10px] text-[#67545d] font-medium">
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