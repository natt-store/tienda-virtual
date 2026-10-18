"use client";

import Link from "next/link";
import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* =========================================================
   ICONOS DE REDES
========================================================= */
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.5 3.5c.4 2.2 1.8 3.6 4 3.9v2.6c-1.4.1-2.7-.3-4-1v6.5c0 3.6-2.9 6.5-6.5 6.5S3.5 19.1 3.5 15.5 6.4 9 10 9c.3 0 .7 0 1 .1v2.7c-.3-.1-.7-.2-1-.2-2.1 0-3.8 1.7-3.8 3.9S7.9 19.4 10 19.4s3.8-1.7 3.8-3.9V3.5h2.7Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4V14h2.4v7h3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 1.8a7.2 7.2 0 0 1 6.1 11 7.2 7.2 0 0 1-9.7 2.4l-.4-.2-2.5.7.7-2.5-.2-.4A7.2 7.2 0 0 1 12 4.8Zm3.9 9.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a5.9 5.9 0 0 1-2.9-2.5c-.2-.3 0-.5.1-.6l.4-.5c.1-.1.1-.3 0-.4l-.6-1.5c-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3-.2.2-.7.7-.7 1.7 0 1 .7 2 1 2.3 1.2 1.5 2.8 2.3 3.1 2.4.4.1.6.1.8 0 .2-.1.9-.7 1-1 .1-.3.1-.5 0-.6l-.6-.4Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   REDES CON ENLACES REALES
========================================================= */
const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/nattstore.boutique",
    color: "#ff1493",
    icon: <InstagramIcon />,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@nattstore.boutique",
    color: "#16131a",
    icon: <TikTokIcon />,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/16FTQRMze7d/",
    color: "#1877f2",
    icon: <FacebookIcon />,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/573104492871",
    color: "#25d366",
    icon: <WhatsAppIcon />,
  },
  {
    name: "Correo",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=nattstore.boutique@gmail.com",
    color: "#00bfc0",
    icon: <MailIcon />,
  },
];

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Por favor completa todos los campos.");
      setSent(false);
      return;
    }

    setError("");
    setSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "e237eb97-a60f-46f2-aa1b-30fd95812047",
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError("Hubo un problema al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f5eee7] shadow-[0_25px_70px_rgba(85,65,55,0.15)]">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#00d9d9]/18 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-80 w-80 rounded-full bg-[#ff1493]/15 blur-3xl" />

          <div className="pointer-events-none absolute -right-28 top-8 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/35" />
          <div className="pointer-events-none absolute -right-20 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#ff1493]/20" />

          <div className="relative px-7 py-12 text-center sm:px-10 lg:py-16">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#00bfc0]/20 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#008f91] backdrop-blur-md">
              Hablemos
            </div>

            <h1 className="mx-auto max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              ¿Tienes alguna
              <br />
              <span className="text-[#008f91]">pregunta?</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#675b55] sm:text-base">
              Escríbenos y te responderemos lo antes posible. También puedes
              encontrarnos en nuestras redes.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* FORMULARIO */}
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00bfc0]">
              Formulario
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Cuéntanos en qué te ayudamos
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                  Asunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="¿Sobre qué quieres hablar?"
                  required
                  className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#008f91]">
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  className="w-full resize-none rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#00bfc0] focus:bg-white"
                />
              </div>

              {error && (
                <p className="rounded-2xl border border-[#ff1493]/20 bg-[#ff1493]/8 px-4 py-3 text-xs font-bold text-[#ff1493]">
                  {error}
                </p>
              )}

              {sent && (
                <p className="rounded-2xl border border-[#00bfc0]/20 bg-[#00bfc0]/8 px-4 py-3 text-xs font-bold text-[#008f91]">
                  ¡Gracias! Tu mensaje fue enviado. Te responderemos pronto.
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-[#ff1493] px-6 py-3 text-sm font-black text-white shadow-[0_10px_28px_rgba(255,20,147,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff2fa4] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>

              <p className="text-center text-[11px] text-[#68616a]">
                Tus datos serán enviados a nuestro correo de contacto.
              </p>
            </form>
          </div>

          {/* INFO + REDES */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[28px] bg-[#283333] p-7 text-white shadow-[0_20px_55px_rgba(45,50,45,0.16)] sm:p-8">
              <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#00d9d9]/25 blur-3xl" />
              <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#ff1493]/22 blur-3xl" />

              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f0e8]">
                  Síguenos
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  Estamos en
                  <span className="text-[#00d9d9]"> tus redes.</span>
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Síguenos para ver novedades, lanzamientos y más.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: s.color }}
                      >
                        {s.icon}
                      </span>
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-[#f5eee7] p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a83cff]">
                Información
              </p>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#675b55]">
                <li className="flex gap-3">
                  <span className="text-[#00bfc0]">✦</span>
                  <span>Respondemos normalmente en menos de 24 horas.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ff1493]">♥</span>
                  <span>También puedes escribirnos por WhatsApp o redes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#a83cff]">✧</span>
                  <span>Envíos a todo el país.</span>
                </li>
              </ul>

              <Link
                href="/tienda"
                className="mt-6 inline-flex rounded-full bg-[#00bfc0] px-6 py-3 text-sm font-black text-white shadow-[0_10px_28px_rgba(0,191,192,0.25)] transition hover:-translate-y-0.5"
              >
                Ir a la tienda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN EXTRA */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff1493]">
              Sobre Natt Store
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Detalles que enamoran
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#ff1493]/12 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff1493]/12 text-xl text-[#ff1493]">
                  ♥
                </div>
                <h3 className="mt-4 text-lg font-black">Quiénes somos</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Natt Store es una boutique online femenina y moderna que
                  reúne maquillaje, hogar, papelería y productos de
                  temporada.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00d9d9]/15 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00d9d9]/15 text-xl text-[#008f91]">
                  ✦
                </div>
                <h3 className="mt-4 text-lg font-black">A dónde vamos</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Queremos crecer sin perder nuestra esencia y convertirnos
                  en esa tienda de confianza donde siempre encuentras algo
                  que te enamore.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_15px_40px_rgba(70,55,45,0.08)] backdrop-blur-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#a83cff]/15 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a83cff]/15 text-xl text-[#a83cff]">
                  ✧
                </div>
                <h3 className="mt-4 text-lg font-black">Nuestro enfoque</h3>
                <p className="mt-2 text-sm leading-6 text-[#675b55]">
                  Cuidamos cada detalle: selección de productos,
                  presentación, atención y experiencia de compra. Que cada
                  pedido se sienta hecho con cariño.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[30px] bg-[#283333] px-7 py-10 text-center shadow-[0_20px_55px_rgba(45,50,45,0.16)] sm:px-12">
            <div className="absolute -left-16 top-[-80px] h-48 w-48 rounded-full bg-[#00d9d9]/25 blur-3xl" />
            <div className="absolute -right-16 bottom-[-90px] h-56 w-56 rounded-full bg-[#ff1493]/22 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-5 h-[2px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00d9d9] to-transparent opacity-80" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f0e8]">
                Natt Store
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Todo lo que amas,
                <span className="text-[#00d9d9]"> en un solo lugar.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/65">
                Gracias por acompañarnos. Explora la tienda y descubre esos
                detalles que hacen la diferencia.
              </p>

              <Link
                href="/tienda"
                className="mt-7 inline-flex rounded-full bg-[#ff1493] px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(255,20,147,0.2)] transition hover:-translate-y-0.5"
              >
                Explorar tienda
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}