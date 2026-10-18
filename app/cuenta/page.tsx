"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* =========================================================
   TIPOS
========================================================= */
type Mode = "login" | "register";

type OrderItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

type Order = {
  id: number;
  order_number: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  buyer: any;
  status: string;
  devuelto: boolean;
};

type Cliente = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  password_hash: string | null;
  prefs: any;
  acepta_politica: boolean;
  descuento_activo: number;
  es_invitado: boolean;
};

const USER_STORAGE_KEY = "natt-store-user";
const DISCOUNT_STORAGE_KEY = "natt-store-descuento";
const DISCOUNT_PERCENT = 5;

/* =========================================================
   PÁGINA DE CUENTA
========================================================= */
export default function CuentaPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [prefs, setPrefs] = useState({
    email: true,
    whatsapp: false,
    sms: false,
  });

  const [acceptPolicy, setAcceptPolicy] = useState(false);

  /* ========== CARGAR SESIÓN ========== */
  useEffect(() => {
    async function loadSession() {
      try {
        const raw = window.localStorage.getItem(USER_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (!parsed?.email) return;

        // Verificar contra Supabase
        const { data } = await supabase
          .from("clientes")
          .select("*")
          .eq("email", parsed.email.toLowerCase())
          .maybeSingle();

        if (data) {
          setCliente(data);
          loadOrders(data.email);

          // Sincronizar el descuento real de Supabase al localStorage
          if (data.descuento_activo && data.descuento_activo > 0) {
            window.localStorage.setItem(DISCOUNT_STORAGE_KEY, String(data.descuento_activo));
          } else {
            window.localStorage.removeItem(DISCOUNT_STORAGE_KEY);
          }
        }
      } catch {
        // Ignorar
      }
    }

    loadSession();
  }, []);

  /* ========== CARGAR PEDIDOS ========== */
  const loadOrders = async (correo: string) => {
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("date", { ascending: false });

    const clean = correo.toLowerCase().trim();
    const mias = (data || []).filter(
      (p: any) => (p.buyer?.correo || "").toLowerCase().trim() === clean
    );

    setOrders(mias);
  };

  /* ========== LOGIN / REGISTRO ========== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Completa correo y contraseña.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setMessage("Escribe tu nombre para crear la cuenta.");
      return;
    }
    if (mode === "register" && !acceptPolicy) {
      setMessage("Debes aceptar la política de privacidad.");
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    /* ========== REGISTRO ========== */
    if (mode === "register") {
      const { data: existing } = await supabase
        .from("clientes")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      let clienteData: any;

      if (existing) {
        if (existing.password_hash) {
          setLoading(false);
          setMessage("Ya existe una cuenta con ese correo. Inicia sesión.");
          return;
        }

        const { data, error } = await supabase
          .from("clientes")
          .update({
            name: name.trim(),
            phone: phone.trim() || null,
            password_hash: password,
            prefs,
            acepta_politica: true,
            es_invitado: false,
            descuento_activo: DISCOUNT_PERCENT,
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          setLoading(false);
          setMessage("Error: " + error.message);
          return;
        }

        clienteData = data;
      } else {
        const { data, error } = await supabase
          .from("clientes")
          .insert({
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim() || null,
            password_hash: password,
            prefs,
            acepta_politica: true,
            es_invitado: false,
            descuento_activo: DISCOUNT_PERCENT,
          })
          .select()
          .single();

        if (error) {
          setLoading(false);
          setMessage("Error: " + error.message);
          return;
        }

        clienteData = data;
      }

      // Guardar sesión
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({ email: clienteData.email, name: clienteData.name })
      );
      
      if (clienteData.descuento_activo > 0) {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, String(clienteData.descuento_activo));
      } else {
        localStorage.removeItem(DISCOUNT_STORAGE_KEY);
      }

      setCliente(clienteData);
      loadOrders(clienteData.email);

      setMessage("");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setLoading(false);
      return;
    }

    /* ========== LOGIN ========== */
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error || !data) {
      setLoading(false);
      setMessage("No existe una cuenta con ese correo.");
      return;
    }

    if (!data.password_hash) {
      setLoading(false);
      setMessage("Esta cuenta existe como invitado. Crea tu cuenta desde 'Crear cuenta'.");
      return;
    }

    if (data.password_hash !== password) {
      setLoading(false);
      setMessage("Contraseña incorrecta.");
      return;
    }

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({ email: data.email, name: data.name })
    );

    if (data.descuento_activo && data.descuento_activo > 0) {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, String(data.descuento_activo));
    } else {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    }

    setCliente(data);
    loadOrders(data.email);

    setMessage("");
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  /* ========== CERRAR SESIÓN ========== */
  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    setCliente(null);
    setOrders([]);
    setMode("login");
    setMessage("");
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Mostrar el banner de descuento SOLO si el cliente existe y su descuento es mayor a 0
  const hasDiscount = !!cliente && Number(cliente.descuento_activo) > 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f5eee7] shadow-[0_25px_70px_rgba(85,65,55,0.15)]">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ff1493]/12 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-72 w-72 rounded-full bg-[#00d9d9]/15 blur-3xl" />

          <div className="relative px-7 py-12 text-center sm:px-12 lg:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493]">
              Natt Store
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {cliente ? (
                <>
                  Hola,{" "}
                  <span className="text-[#008f91]">
                    {cliente.name || cliente.email.split("@")[0]}
                  </span>
                </>
              ) : (
                <>
                  Tu cuenta,
                  <br />
                  <span className="text-[#008f91]">tu espacio.</span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#675b55] sm:text-base">
              {cliente
                ? "Aquí puedes ver tus pedidos, tus datos y cerrar sesión cuando quieras."
                : "Crea tu cuenta y recibe un 5% de descuento en tu próxima compra."}
            </p>
          </div>
        </div>
      </section>

      {/* BANNER DESCUENTO (SOLO SI TIENE BENEFICIO ACTIVO) */}
      {hasDiscount && (
        <section className="px-4 pb-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-[#ff1493]/25 bg-gradient-to-r from-[#ff1493]/10 via-[#a83cff]/10 to-[#00d9d9]/10 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff1493] text-xl text-white">
                ✦
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Beneficio activo
                </p>
                <p className="mt-1 text-base font-black sm:text-lg">
                  Tienes un{" "}
                  <span className="text-[#ff1493]">
                    {cliente?.descuento_activo}% de descuento
                  </span>{" "}
                  en tu próxima compra.
                </p>
                <p className="mt-1 text-xs text-[#67545d]">
                  Se aplicará automáticamente en el checkout.
                </p>
              </div>

              <Link
                href="/tienda"
                className="rounded-full bg-[#ff1493] px-5 py-2.5 text-xs font-black text-white shadow-[0_10px_24px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5"
              >
                Usar ahora
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTENIDO */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* FORMULARIO / LOGUEADO */}
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm sm:p-8">
            {cliente ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008f91]">
                  Tu cuenta
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  Bienvenido de nuevo
                </h2>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f91]">
                      Nombre
                    </span>
                    <span className="text-sm font-extrabold">
                      {cliente.name || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f91]">
                      Correo
                    </span>
                    <span className="truncate text-sm font-extrabold">
                      {cliente.email}
                    </span>
                  </div>

                  {cliente.phone && (
                    <div className="flex items-center justify-between rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] px-4 py-3">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f91]">
                        Teléfono
                      </span>
                      <span className="text-sm font-extrabold">
                        {cliente.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f91]">
                      Pedidos
                    </span>
                    <span className="text-sm font-extrabold text-[#008f91]">
                      {orders.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f91]">
                      Favoritos
                    </span>
                    <Link
                      href="/favoritos"
                      className="text-sm font-extrabold text-[#ff1493] hover:underline"
                    >
                      Ver
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 w-full rounded-full border border-[#24191f]/10 bg-white px-6 py-3 text-sm font-bold text-[#24191f] transition hover:bg-[#f5eee7]"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div>
                {/* TABS */}
                <div className="mb-6 flex rounded-full bg-[#f5eee7] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                    }}
                    className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                      mode === "login"
                        ? "bg-white text-[#24191f] shadow-sm"
                        : "text-[#68616a] hover:text-[#24191f]"
                    }`}
                  >
                    Iniciar sesión
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setMessage("");
                    }}
                    className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                      mode === "register"
                        ? "bg-white text-[#24191f] shadow-sm"
                        : "text-[#68616a] hover:text-[#24191f]"
                    }`}
                  >
                    Crear cuenta
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                          Teléfono (opcional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="300 000 0000"
                          className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Correo
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                    />
                  </div>

                  {mode === "register" && (
                    <>
                      <div className="rounded-2xl border border-[#24191f]/8 bg-[#f5eee7] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                          ¿Cómo quieres recibir promociones?
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#67545d]">
                          Puedes elegir uno o varios. Es opcional.
                        </p>

                        <div className="mt-3 space-y-2">
                          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2.5">
                            <input
                              type="checkbox"
                              checked={prefs.email}
                              onChange={(e) =>
                                setPrefs({ ...prefs, email: e.target.checked })
                              }
                              className="h-4 w-4 accent-[#ff1493]"
                            />
                            <span className="text-xs font-bold">
                              Correo electrónico
                            </span>
                          </label>

                          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2.5">
                            <input
                              type="checkbox"
                              checked={prefs.whatsapp}
                              onChange={(e) =>
                                setPrefs({
                                  ...prefs,
                                  whatsapp: e.target.checked,
                                })
                              }
                              className="h-4 w-4 accent-[#25d366]"
                            />
                            <span className="text-xs font-bold">WhatsApp</span>
                          </label>

                          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2.5">
                            <input
                              type="checkbox"
                              checked={prefs.sms}
                              onChange={(e) =>
                                setPrefs({ ...prefs, sms: e.target.checked })
                              }
                              className="h-4 w-4 accent-[#00bfc0]"
                            />
                            <span className="text-xs font-bold">SMS</span>
                          </label>
                        </div>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#24191f]/8 bg-white p-4">
                        <input
                          type="checkbox"
                          checked={acceptPolicy}
                          onChange={(e) => setAcceptPolicy(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff1493]"
                        />
                        <span className="text-[11px] leading-5 text-[#4d4d4d]">
                          Acepto la{" "}
                          <Link
                            href="/politica-de-privacidad"
                            className="font-bold text-[#ff1493] hover:underline"
                          >
                            política de privacidad
                          </Link>{" "}
                          y los{" "}
                          <Link
                            href="/terminos-y-condiciones"
                            className="font-bold text-[#ff1493] hover:underline"
                          >
                            términos
                          </Link>
                          .
                        </span>
                      </label>
                    </>
                  )}

                  {message && (
                    <p className="rounded-2xl border border-[#ff1493]/20 bg-[#ff1493]/8 px-4 py-3 text-xs font-bold text-[#ff1493]">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#00bfc0] px-6 py-3 text-sm font-black text-white shadow-[0_10px_28px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5 hover:bg-[#00a9aa] disabled:opacity-60"
                  >
                    {loading
                      ? "Cargando..."
                      : mode === "login"
                        ? "Entrar"
                        : "Crear mi cuenta"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#283333] p-6 text-white shadow-[0_20px_55px_rgba(45,50,45,0.16)] sm:p-8">
            <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#00d9d9]/25 blur-3xl" />
            <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#ff1493]/22 blur-3xl" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f0e8]">
                Ventajas
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                Guarda lo que amas,
                <span className="text-[#00d9d9]"> siempre.</span>
              </h2>

              <ul className="mt-6 space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-[#00d9d9]">✦</span>
                  <span>5% de descuento en tu próxima compra.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00d9d9]">✦</span>
                  <span>Tus favoritos se guardan automáticamente.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00d9d9]">✦</span>
                  <span>Sigue el estado de tus pedidos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00d9d9]">✦</span>
                  <span>Elige por dónde recibir promociones.</span>
                </li>
              </ul>

              <Link
                href="/tienda"
                className="mt-8 inline-flex rounded-full bg-[#ff1493] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MIS PEDIDOS */}
      {cliente && (
        <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Historial
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                  Mis pedidos
                </h2>
              </div>

              {orders.length > 0 && (
                <p className="text-xs text-[#68616a] sm:text-sm">
                  {orders.length}{" "}
                  {orders.length === 1 ? "pedido" : "pedidos"} en total
                </p>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 px-6 py-14 text-center shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff1493]/10 text-2xl text-[#ff1493]">
                  ♥
                </div>

                <h3 className="mt-5 text-xl font-black">
                  Todavía no tienes pedidos
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#67545d]">
                  Cuando hagas tu primera compra aparecerá aquí con todos los
                  detalles.
                </p>

                <Link
                  href="/tienda"
                  className="mt-6 inline-flex rounded-full bg-[#ff1493] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5"
                >
                  Empezar a comprar
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (a, i) => a + i.quantity,
                    0
                  );

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_15px_40px_rgba(70,40,50,0.08)] backdrop-blur-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#24191f]/8 bg-[#f5eee7] px-5 py-4 sm:px-7">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#008f91]">
                            Pedido
                          </p>
                          <p className="text-sm font-black sm:text-base">
                            {order.order_number}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#008f91]">
                            Fecha
                          </p>
                          <p className="text-sm font-black sm:text-base">
                            {formatDate(order.date)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#008f91]">
                            Estado
                          </p>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${
                              order.devuelto
                                ? "bg-[#ff1493]/15 text-[#ff1493]"
                                : "bg-[#00d9d9]/15 text-[#008f91]"
                            }`}
                          >
                            {order.devuelto ? "Devuelto" : order.status}
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-[#24191f]/6">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-5 py-3 sm:px-7"
                          >
                            <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f4e9e2]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-black">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-[#76666e]">
                                {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>

                            <p className="text-sm font-black">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-[#24191f]/8 bg-white/60 px-5 py-4 sm:px-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-4 text-xs">
                            <span className="text-[#76666e]">
                              {totalItems}{" "}
                              {totalItems === 1 ? "ítem" : "ítems"}
                            </span>
                            <span className="text-[#76666e]">
                              Envío:{" "}
                              <span className="font-bold text-[#00aeb0]">
                                {order.shipping === 0
                                  ? "Gratis"
                                  : formatPrice(order.shipping)}
                              </span>
                            </span>
                            {order.discount > 0 && (
                              <span className="text-[#76666e]">
                                Descuento:{" "}
                                <span className="font-bold text-[#ff1493]">
                                  -{formatPrice(order.discount)}
                                </span>
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#008f91]">
                              Total
                            </p>
                            <p className="text-lg font-black text-[#ff1493]">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}