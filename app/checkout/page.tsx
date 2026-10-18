"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart, type CartProduct } from "@/components/cart/CartContext";
import { supabase } from "@/lib/supabase";
import {
  loadCoupons,
  calculateCouponDiscount,
  registerCouponUsage,
  type AppliedCoupon,
} from "@/lib/useCoupons";
import { ShieldCheck, ShoppingBag, Gift, MessageCircle, ExternalLink } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

const COLOMBIA_GEO: Record<string, string[]> = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Rionegro", "Apartadó", "Sabaneta"],
  "Arauca": ["Arauca", "Saravena", "Tame", "Arauquita"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia", "Baranoa"],
  "Bolívar": ["Cartagena de Indias", "Magangué", "Turbaco", "El Carmen de Bolívar", "Arjona"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa"],
  "Caldas": ["Manizales", "Villamaría", "Chinchiná", "Anserma", "La Dorada", "Riosucio"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva", "Pore"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía"],
  "Cesar": ["Valledupar", "Aguachica", "Codazzi", "Bosconia"],
  "Chocó": ["Quibdó", "Istmina", "Tadó", "Condoto"],
  "Córdoba": ["Montería", "Cereté", "Sahagún", "Lorica", "Montelíbano"],
  "Cundinamarca": ["Bogotá D.C.", "Soacha", "Facatativá", "Chía", "Zipaquirá", "Girardot", "Mosquera", "Madrid"],
  "Guainía": ["Inírida"],
  "Guaviare": ["San José del Guaviare"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia", "San Juan del Cesar"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Plato"],
  "Meta": ["Villavicencio", "Acacías", "Granada", "Puerto López"],
  "Nariño": ["Pasto", "Ipiales", "Túquerres", "Tumaco"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Villa del Rosario", "Los Patios", "Pamplona"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Orito", "Sibundoy"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Quimbaya"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil"],
  "Sucre": ["Sincelejo", "Corozal", "San Marcos", "Tolú"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Lérida", "Honda"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Buga", "Cartago", "Jamundí", "Yumbo"],
  "Vaupés": ["Mitú"],
  "Vichada": ["Puerto Carreño", "La Primavera"]
};

type OrderBuyer = {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  infoAdicional: string;
  esRegalo: boolean;
  mensajeRegalo: string;
};

type Order = {
  id: string;
  date: string;
  items: CartProduct[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCodes?: string[];
  total: number;
  buyer: OrderBuyer;
  accountEmail?: string;
  status: string;
};

const ORDERS_STORAGE_KEY = "natt-store-pedidos";
const DISCOUNT_STORAGE_KEY = "natt-store-descuento";
const USER_STORAGE_KEY = "natt-store-user";
const DISCOUNT_PERCENT = 5;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<OrderBuyer>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    infoAdicional: "",
    esRegalo: false,
    mensajeRegalo: "",
  });

  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [hasRegDiscount, setHasRegDiscount] = useState(false);
  const [coupons, setCoupons] = useState<AppliedCoupon[]>([]);
  const [saving, setSaving] = useState(false);
  const [wompiUrl, setWompiUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const sessionRaw = window.localStorage.getItem(USER_STORAGE_KEY);
      if (sessionRaw) {
        const sessionData = JSON.parse(sessionRaw);
        if (sessionData?.email) {
          setIsLoggedIn(true);
          setAccountEmail(sessionData.email);

          supabase
            .from("clientes")
            .select("*")
            .eq("email", sessionData.email.toLowerCase())
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                const nameParts = (data.name || "").trim().split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                setForm((current) => ({
                  ...current,
                  nombre: current.nombre || firstName,
                  apellido: current.apellido || lastName,
                  correo: current.correo || data.email,
                  telefono: current.telefono || data.phone || "",
                }));
              }
            });
        }
      }

      const saved = window.localStorage.getItem("natt-store-checkout");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((current) => ({ ...current, ...parsed }));
      }
    } catch {
      // Ignorar
    }

    setHasRegDiscount(!!window.localStorage.getItem(DISCOUNT_STORAGE_KEY));
    setCoupons(loadCoupons());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("natt-store-checkout", JSON.stringify(form));
    } catch {
      // Ignorar
    }
  }, [form]);

  const getDynamicShipping = () => {
    if (subtotal >= 150000 || subtotal === 0) return 0;
    
    const ciudadLower = form.ciudad.trim().toLowerCase();
    const deptoLower = form.departamento.trim().toLowerCase();
    
    if (deptoLower === "caldas" && (ciudadLower.includes("manizales") || ciudadLower.includes("villamaría") || ciudadLower.includes("chinchiná"))) {
      return 8000;
    }
    
    const principales = ["medellín", "medellin", "bogotá", "bogota", "cali", "barranquilla", "cartagena", "bucaramanga", "pereira", "armenia", "manizales"];
    if (principales.some(c => ciudadLower.includes(c))) {
      return 15000;
    }
    
    if (form.departamento) {
      return 20000;
    }

    return 15000;
  };

  const baseShipping = getDynamicShipping();

  const registrationDiscount = hasRegDiscount
    ? Math.round(subtotal * (DISCOUNT_PERCENT / 100))
    : 0;

  const couponResult = calculateCouponDiscount(coupons, subtotal);
  const couponDiscount = couponResult.discount;

  const useRegistration = hasRegDiscount && registrationDiscount >= couponDiscount;
  const shipping = couponResult.freeShipping ? 0 : baseShipping;
  const discount = couponDiscount > 0 ? couponDiscount : useRegistration ? registrationDiscount : 0;

  const total = Math.max(0, subtotal + shipping - discount);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    
    if (name === "departamento") {
      setForm((current) => ({ ...current, departamento: value, ciudad: "" }));
    } else if (type === "checkbox") {
      setForm((current) => ({ ...current, [name]: checked }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
    
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.nombre.trim()) newErrors.nombre = "Escribe tu nombre.";
    if (!form.apellido.trim()) newErrors.apellido = "Escribe tu apellido.";
    if (!form.telefono.trim()) newErrors.telefono = "Escribe tu teléfono.";
    if (!form.correo.trim()) {
      newErrors.correo = "Escribe tu correo.";
    } else if (!/\S+@\S+\.\S+/.test(form.correo)) {
      newErrors.correo = "Correo no válido.";
    }
    if (!form.departamento) newErrors.departamento = "Elige un departamento.";
    if (!form.ciudad.trim()) newErrors.ciudad = "Elige tu ciudad.";
    if (!form.direccion.trim()) newErrors.direccion = "Escribe tu dirección.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;
    if (!validate()) return;

    setSaving(true);

    const orderNumber = `NATT-${Date.now().toString().slice(-6)}`;

    const order: Order = {
      id: orderNumber,
      date: new Date().toISOString(),
      items: [...items],
      subtotal,
      shipping,
      discount,
      couponCodes: coupons.map((c) => c.codigo),
      total,
      buyer: { ...form },
      accountEmail: accountEmail || form.correo,
      status: "Pendiente de pago",
    };

    try {
      const wompiRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          total,
          discount,
          shipping,
          buyerEmail: form.correo,
          items,
        }),
      });

      const wompiData = await wompiRes.json();

      if (!wompiRes.ok || !wompiData.url) {
        throw new Error(wompiData.error || "No se pudo generar el pago con Wompi.");
      }

      const { error: orderError } = await supabase.from("pedidos").insert({
        order_number: orderNumber,
        date: order.date,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        total: order.total,
        buyer: order.buyer,
        status: order.status,
        devuelto: false,
      });

      if (orderError) {
        console.error("ERROR DE SUPABASE:", orderError);
        alert("Error al guardar pedido: " + (orderError.message || JSON.stringify(orderError)));
        return;
      }

      const emailClean = form.correo.trim().toLowerCase();
      try {
        const { data: existingClient } = await supabase
          .from("clientes")
          .select("id, name, phone, es_invitado")
          .eq("email", emailClean)
          .maybeSingle();

        if (!existingClient) {
          await supabase.from("clientes").insert({
            name: `${form.nombre} ${form.apellido}`.trim(),
            email: emailClean,
            phone: form.telefono,
            prefs: { email: true, whatsapp: false, sms: false },
            acepta_politica: false,
            es_invitado: true,
            descuento_activo: 0,
          });
        } else {
          await supabase
            .from("clientes")
            .update({
              name: `${form.nombre} ${form.apellido}`.trim(),
              phone: form.telefono,
              descuento_activo: 0,
            })
            .eq("id", existingClient.id);
        }
      } catch (err) {
        console.error("Error con cliente:", err);
      }

      for (const item of items) {
        try {
          const { data: prod } = await supabase
            .from("productos")
            .select("stock")
            .eq("id", item.id)
            .maybeSingle();

          if (prod) {
            const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
            await supabase
              .from("productos")
              .update({ stock: newStock })
              .eq("id", item.id);
          }
        } catch (err) {
          console.error("Error actualizando stock:", err);
        }
      }

      for (const c of coupons) {
        await registerCouponUsage(c.id, c.codigo, orderNumber);
      }
      window.localStorage.removeItem("natt-store-cupones");

      try {
        const existing = window.localStorage.getItem(ORDERS_STORAGE_KEY);
        const orders: Order[] = existing ? JSON.parse(existing) : [];
        orders.push(order);
        window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        window.localStorage.removeItem(DISCOUNT_STORAGE_KEY);
        window.localStorage.removeItem("natt-store-checkout");
      } catch {
        // Ignorar
      }

      setWompiUrl(wompiData.url);
      setSavedOrder(order);
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      console.error("Error general:", err);
      alert(err.message || "Hubo un error al procesar tu pedido. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
        <Navbar />
        <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pt-14">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[30px] border border-white/70 bg-white/85 px-6 py-16 text-center shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ff1493]/10 text-[#ff1493]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Tu carrito está vacío.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#67545d]">
              Agrega productos antes de ir al checkout.
            </p>
            <Link
              href="/tienda"
              className="mt-7 inline-flex rounded-full bg-[#ff1493] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84]"
            >
              Ir a la tienda
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (submitted && savedOrder) {
    const listaProductos = savedOrder.items
      .map((i) => `• ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`)
      .join("\n");

    const whatsappMessage = encodeURIComponent(
      `¡Hola, Natt Store! 💖 Ya realicé el pago de mi pedido *${savedOrder.id}*.\n\n` +
      `📦 *Resumen de productos:*\n${listaProductos}\n\n` +
      `💰 *Total pagado:* ${formatPrice(savedOrder.total)}\n\n` +
      `📍 *Datos de envío:*\n` +
      `Nombre: ${savedOrder.buyer.nombre} ${savedOrder.buyer.apellido}\n` +
      `Ciudad: ${savedOrder.buyer.ciudad}, ${savedOrder.buyer.departamento}\n` +
      `Dirección: ${savedOrder.buyer.direccion} ${savedOrder.buyer.infoAdicional || ""}\n` +
      `Teléfono: ${savedOrder.buyer.telefono}`
    );

    const whatsappUrl = `https://wa.me/573000000000?text=${whatsappMessage}`;

    return (
      <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
        <Navbar />
        <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pt-14">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[30px] border border-white/70 bg-white/95 px-6 py-10 text-center shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#a83cff]/15 text-[#a83cff]">
              <ExternalLink className="w-8 h-8" />
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              ¡Último paso: Realiza tu pago!
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#67545d]">
              Tu orden <span className="font-bold text-[#24191f]">{savedOrder.id}</span> por <span className="font-bold text-[#ff1493]">{formatPrice(savedOrder.total)}</span> ya está registrada. Completa tu pago aquí abajo en la pasarela oficial de Wompi:
            </p>

            {wompiUrl && (
              <div className="mx-auto mt-6 overflow-hidden rounded-2xl border-2 border-[#a83cff]/30 bg-white shadow-inner">
                <iframe
                  src={wompiUrl}
                  title="Pasarela de pagos Wompi"
                  className="h-[620px] w-full border-0"
                  allow="payment"
                />
              </div>
            )}

            {wompiUrl && (
              <div className="mt-4">
                <a
                  href={wompiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a83cff] underline hover:text-[#7e22ce]"
                >
                  ¿No ves el recuadro de pago? Haz clic aquí para abrir Wompi en pantalla completa <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-[#25D366]/40 bg-[#25D366]/10 p-6 text-center">
              <p className="text-sm font-black text-[#24191f]">
                ¿Ya terminaste de pagar arriba en Wompi?
              </p>
              <p className="mt-1 text-xs text-[#67545d]">
                Haz clic en este botón verde para enviarnos tu pedido a WhatsApp y coordinar tu domicilio:
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#20ba5a]"
              >
                <MessageCircle className="w-5 h-5" /> Confirmar pedido y domicilio por WhatsApp
              </a>
            </div>

            <div className="mt-6">
              <Link
                href="/tienda"
                className="inline-block rounded-full bg-[#f5eee7] px-6 py-2.5 text-xs font-bold text-[#67545d] transition hover:bg-[#e9dfd5]"
              >
                Volver a la tienda
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const isDifferentRecipient = isLoggedIn && accountEmail && form.correo.trim().toLowerCase() !== accountEmail.toLowerCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      <section className="relative px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pb-10 lg:pt-9">
        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[#f7eee7] px-7 py-9 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-10 lg:px-14 lg:py-11">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ff1493]/20 bg-white/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff1493] backdrop-blur-md">
              Natt Store · Checkout
            </span>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Finaliza <br />
              <span className="text-[#ff1493]">tu compra.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#67545d] sm:text-base">
              Selecciona tu ubicación para calcular el costo estimado del envío.
            </p>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="px-4 pb-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-[#ff1493]/30 bg-gradient-to-r from-[#ff1493]/10 via-[#a83cff]/10 to-[#00d9d9]/10 p-6 text-center sm:p-8">
            <h3 className="text-xl font-black sm:text-2xl text-[#24191f]">
              ¿Tienes una cuenta en Natt Store?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-[#67545d]">
              Inicia sesión o crea tu cuenta para guardar tus pedidos y recibir un <span className="font-bold text-[#ff1493]">5% de descuento</span> en tu primer pedido.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/cuenta"
                className="rounded-full bg-[#ff1493] px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#ed0c84]"
              >
                Crear cuenta / Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="relative px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="relative mx-auto max-w-7xl">
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              
              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff1493]/12 text-sm font-black text-[#ff1493]">
                    1
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                      Datos de envío
                    </p>
                    <h2 className="text-xl font-black">¿Quién recibe el pedido?</h2>
                    {isLoggedIn && (
                      <p className="text-xs text-[#008f91] mt-0.5 font-semibold">
                        (Conectada con la cuenta: {accountEmail})
                      </p>
                    )}
                  </div>
                </div>

                {isDifferentRecipient && (
                  <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-bold text-amber-800 leading-5">
                    Aviso: Estás ingresando datos de otra persona. El pedido quedará registrado en tu historial de cuenta ({accountEmail}), pero el paquete se despachará a nombre del destinatario que escribas aquí.
                  </div>
                )}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Nombre del destinatario
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre"
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.nombre ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    />
                    {errors.nombre && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.nombre}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Apellido del destinatario
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Apellido"
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.apellido ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    />
                    {errors.apellido && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.apellido}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="300 000 0000"
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.telefono ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    />
                    {errors.telefono && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.telefono}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Correo de contacto
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.correo ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    />
                    {errors.correo && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.correo}</p>}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50/50 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="esRegalo"
                      checked={form.esRegalo}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#ff1493]"
                    />
                    <span className="text-xs font-bold text-[#24191f] flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#ff1493]" /> Este pedido es un regalo para otra persona
                    </span>
                  </label>

                  {form.esRegalo && (
                    <div className="mt-3">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff1493]">
                        Dedicatoria o especificaciones del regalo (opcional)
                      </label>
                      <textarea
                        name="mensajeRegalo"
                        value={form.mensajeRegalo}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Escribe aquí un mensaje especial o dedicatoria que irá con el regalo..."
                        className="w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#ff1493]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00d9d9]/20 text-sm font-black text-[#008f91]">
                    2
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                      Dirección de envío
                    </p>
                    <h2 className="text-xl font-black">¿A dónde llega?</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Departamento
                    </label>
                    <select
                      name="departamento"
                      value={form.departamento}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.departamento ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    >
                      <option value="">Elige un departamento...</option>
                      {Object.keys(COLOMBIA_GEO).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.departamento && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.departamento}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Ciudad / Municipio
                    </label>
                    <select
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      disabled={!form.departamento}
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.ciudad ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    >
                      <option value="">{form.departamento ? "Elige una ciudad..." : "Primero elige departamento"}</option>
                      {form.departamento &&
                        COLOMBIA_GEO[form.departamento]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {errors.ciudad && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.ciudad}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Dirección exacta
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      placeholder="Calle, carrera, número, barrio..."
                      className={`w-full rounded-2xl border bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${
                        errors.direccion ? "border-[#ff1493]" : "border-[#24191f]/10 focus:border-[#00bfc0]"
                      }`}
                    />
                    {errors.direccion && <p className="mt-1 text-[11px] font-bold text-[#ff1493]">{errors.direccion}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Información adicional (opcional)
                    </label>
                    <textarea
                      name="infoAdicional"
                      value={form.infoAdicional}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Apartamento, torre, indicaciones..."
                      className="w-full resize-none rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_15px_40px_rgba(70,40,50,0.09)] backdrop-blur-sm sm:p-7">
                <div className="h-[3px] rounded-full bg-gradient-to-r from-[#ff1493] via-[#a83cff] to-[#00d9d9]" />

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Resumen del pedido
                </p>
                <h2 className="mt-2 text-2xl font-black">Tu compra</h2>

                <div className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f4e9e2]">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black">{item.name}</p>
                        <p className="text-[11px] text-[#76666e]">{item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-xs font-black">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-[#24191f]/10 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#76666e]">Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#76666e]">Envío estimado</span>
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

                  <div className="rounded-2xl bg-[#00d9d9]/10 px-4 py-3 text-[11px] leading-5 text-[#008f91]">
                    Nota: La tarifa de envío es un estimado basado en tu zona. En caso de alguna variación por peso o lejanía, nos comunicaremos contigo vía WhatsApp antes de despachar.
                  </div>

                  <div className="flex items-end justify-between gap-4 border-t border-[#24191f]/10 pt-5">
                    <span className="text-sm font-bold text-[#76666e]">Total</span>
                    <span className="text-2xl font-black text-[#ff1493]">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-7 flex w-full items-center justify-center rounded-full bg-[#ff1493] px-6 py-3.5 text-sm font-black text-white shadow-[0_10px_28px_rgba(255,20,147,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed0c84] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Generando pasarela..." : "Ir a pagar en Wompi"}
                </button>

                <Link
                  href="/carrito"
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-[#24191f]/10 bg-white px-6 py-3.5 text-sm font-bold text-[#24191f] transition hover:bg-[#f5eee7]"
                >
                  Volver al carrito
                </Link>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#f7eee7] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff1493]/10 text-[#ff1493]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Compra segura con Wompi</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-[#817079]">
                      Pagos cifrados y protegidos.
                    </p>
                  </div>
                </div>

              </div>
            </aside>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}