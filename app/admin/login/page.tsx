"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { loginAdmin } from "@/lib/useAdmin";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAdmin(email, password);

    if (!result.ok) {
      setError(result.error || "Error al iniciar sesión.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--natt-bg)] px-4 py-8">
      {/* Luces de marca */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ff1493]/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#00d9d9]/20 blur-[110px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a83cff]/12 blur-[100px]" />

      {/* Curvas decorativas */}
      <div className="pointer-events-none absolute -right-32 top-8 h-56 w-[520px] rotate-[10deg] rounded-[50%] border-[2px] border-[#ff1493]/25" />
      <div className="pointer-events-none absolute -right-24 top-24 h-56 w-[500px] rotate-[10deg] rounded-[50%] border-[2px] border-[#00d9d9]/30" />
      <div className="pointer-events-none absolute bottom-[-130px] left-[18%] h-60 w-[600px] rounded-[50%] border-[2px] border-[#a83cff]/20" />

      {/* Destellos */}
      <span className="pointer-events-none absolute left-[8%] top-[15%] text-2xl text-[#ff1493]">
        ✦
      </span>
      <span className="pointer-events-none absolute right-[10%] top-[20%] text-xl text-[#00bfc0]">
        ✦
      </span>
      <span className="pointer-events-none absolute bottom-[15%] left-[12%] text-lg text-[#a83cff]">
        ✧
      </span>
      <span className="pointer-events-none absolute bottom-[10%] right-[15%] text-xl text-[#ff1493]">
        ✦
      </span>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/85 p-7 shadow-[0_25px_70px_rgba(105,55,65,0.15)] backdrop-blur-sm sm:p-9">
          {/* Línea superior de marca */}
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
              boxShadow:
                "0 0 14px rgba(255,20,147,0.4), 0 0 20px rgba(0,217,217,0.2)",
            }}
          />

          {/* Curvas internas */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#ff1493]/15" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full border border-[#00d9d9]/20" />

          {/* LOGO */}
          <div className="relative flex flex-col items-center">
            <div className="w-[150px] sm:w-[170px]">
              <Image
                src="/brand/logo.png"
                alt="Natt Store"
                width={360}
                height={210}
                priority
                className="h-auto w-full object-contain drop-shadow-[0_5px_14px_rgba(255,20,147,0.15)]"
              />
            </div>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#ff1493]/20 bg-[#ff1493]/8 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
              ✦ Panel de administrador
            </span>

            <p className="mt-3 max-w-xs text-center text-xs leading-5 text-[#67545d]">
              Accede para gestionar productos, pedidos, cupones y más.
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3.5 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#00bfc0] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-[#24191f]/10 bg-[#f5eee7] px-4 py-3.5 text-sm font-medium text-[#24191f] placeholder:text-[#24191f]/30 outline-none transition focus:border-[#00bfc0] focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-[#ff1493]/25 bg-[#ff1493]/8 px-4 py-3 text-xs font-bold text-[#ff1493]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-full bg-[#ff1493] px-6 py-4 text-sm font-black text-white shadow-[0_10px_28px_rgba(255,20,147,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <span className="relative z-10">
                {loading ? "Entrando..." : "Entrar al panel"}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#ff1493] via-[#a83cff] to-[#00d9d9] transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[11px] font-bold text-[#67545d] transition hover:text-[#ff1493]"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>

        {/* Frase inferior */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#ff1493]/40" />
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#67545d]/60">
            Detalles que enamoran
          </span>
          <span className="h-px w-8 bg-[#00d9d9]/40" />
        </div>
      </div>
    </main>
  );
}