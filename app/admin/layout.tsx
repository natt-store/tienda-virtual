"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { supabase } from "@/lib/supabase";

/* =========================================================
   ICONOS SVG
========================================================= */
function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="3" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="16" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 20V10M10 20V4M16 20V13M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M3 7.5L12 3L21 7.5V16.5L12 21L3 16.5V7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 7.5L12 12M12 12L21 7.5M12 12V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 3L21 8L12 13L3 8L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 16L12 21L21 16" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function IconBanner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 18H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24H4V8.83C4 9.36 4.21 9.87 4.59 10.24L14.17 19.83A2 2 0 0 0 15.59 20.41A2 2 0 0 0 17 19.83L20.59 16.24A2 2 0 0 0 20.59 13.41Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M5 8.5H19L18 20H6L5 8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8.5V7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7V8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20C3.6 16.8 6 14.8 9 14.8C12 14.8 14.4 16.8 15 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="17" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.5 14.9C17.5 14.7 20 16.4 20.7 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M15 12H3M7 8L3 12L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4H17C18.1 4 19 4.9 19 6V18C19 19.1 18.1 20 17 20H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   MENÚ
========================================================= */
const menuItems = [
  { label: "Dashboard", href: "/admin", icon: <IconDashboard /> },
  { label: "Estadísticas", href: "/admin/estadisticas", icon: <IconChart /> },
  { label: "Productos", href: "/admin/productos", icon: <IconBox /> },
  { label: "Secciones", href: "/admin/secciones", icon: <IconLayers /> },
  { label: "Banners", href: "/admin/banners", icon: <IconBanner /> },
  { label: "Cupones", href: "/admin/cupones", icon: <IconTag /> },
  { label: "Pedidos", href: "/admin/pedidos", icon: <IconBag /> },
  { label: "Clientes", href: "/admin/clientes", icon: <IconUsers /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { admin, loading, logout } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nuevosPedidos, setNuevosPedidos] = useState(0);

  /* Contar pedidos pendientes */
  useEffect(() => {
    if (!admin) return;

    async function contarPendientes() {
      const { count } = await supabase
        .from("pedidos")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pendiente de pago")
        .eq("devuelto", false);

      setNuevosPedidos(count || 0);
    }

    contarPendientes();

    const interval = setInterval(contarPendientes, 30000);
    return () => clearInterval(interval);
  }, [admin, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--natt-bg)]">
        <p className="text-sm text-[#67545d]">Cargando...</p>
      </div>
    );
  }

  if (!admin) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--natt-bg)] text-[var(--natt-black)]">
      {/* =========================================================
          SIDEBAR DESKTOP
      ========================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col overflow-hidden border-r border-white/60 bg-white/70 backdrop-blur-xl lg:flex">
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
            boxShadow: "0 0 14px rgba(255,20,147,0.4)",
          }}
        />

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#ff1493]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#00d9d9]/10 blur-3xl" />

        <div className="relative border-b border-[#24191f]/8 px-6 py-6">
          <Link href="/admin" className="block">
            <Image
              src="/brand/logo.png"
              alt="Natt Store"
              width={360}
              height={210}
              priority
              className="h-auto w-[140px] object-contain"
            />
          </Link>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-[2px] w-6 rounded-full bg-gradient-to-r from-[#ff1493] to-[#00d9d9]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#ff1493]">
              Panel Admin
            </p>
          </div>
        </div>

        <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const showBadge = item.href === "/admin/pedidos" && nuevosPedidos > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  active
                    ? "bg-[#ff1493] text-white shadow-[0_10px_25px_rgba(255,20,147,0.28)]"
                    : "text-[#67545d] hover:bg-white/70 hover:text-[#ff1493]"
                }`}
              >
                <span
                  className={`transition-colors ${
                    active
                      ? "text-white"
                      : "text-[#67545d] group-hover:text-[#ff1493]"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>

                {showBadge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff1493] px-1.5 text-[10px] font-black text-white shadow-[0_0_10px_rgba(255,20,147,0.6)]">
                    {nuevosPedidos > 99 ? "99+" : nuevosPedidos}
                  </span>
                )}

                {active && !showBadge && (
                  <span
                    className="absolute -right-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#ff1493]"
                    style={{
                      boxShadow: "0 0 10px rgba(255,20,147,0.8)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-[#24191f]/8 px-4 py-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-[#f5eee7] p-4">
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#ff1493]/15 blur-2xl" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#008f91]">
                Administrador
              </p>
              <p className="mt-1 truncate text-sm font-black text-[#24191f]">
                Natalia {/* Nombre actualizado fijo */}
              </p>

              <button
                type="button"
                onClick={logout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#24191f]/10 bg-white px-4 py-2 text-xs font-bold text-[#67545d] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
              >
                <IconLogout />
                Cerrar sesión
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="mt-3 block text-center text-[10px] font-bold text-[#67545d] transition hover:text-[#ff1493]"
          >
            ← Ver la tienda
          </Link>
        </div>
      </aside>

      {/* =========================================================
          HEADER MÓVIL
      ========================================================= */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/60 bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/brand/logo.png"
            alt="Natt Store"
            width={200}
            height={120}
            className="h-auto w-[100px] object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          {nuevosPedidos > 0 && (
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-1.5 rounded-full bg-[#ff1493] px-3 py-1.5 text-[10px] font-black text-white shadow-[0_0_12px_rgba(255,20,147,0.5)]"
            >
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1">
                {nuevosPedidos}
              </span>
              pedidos
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#24191f]/10 bg-white text-[#24191f] transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </header>

      {/* =========================================================
          MENÚ MÓVIL
      ========================================================= */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 max-h-[calc(100vh-60px)] overflow-y-auto border-b border-white/60 bg-white/95 backdrop-blur-xl lg:hidden">
          <div
            className="h-[3px] w-full"
            style={{
              background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
            }}
          />

          <nav className="space-y-1.5 px-4 py-5">
            {menuItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              const showBadge = item.href === "/admin/pedidos" && nuevosPedidos > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-[#ff1493] text-white shadow-[0_10px_25px_rgba(255,20,147,0.25)]"
                      : "text-[#67545d] hover:bg-[#f5eee7] hover:text-[#ff1493]"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff1493] px-1.5 text-[10px] font-black text-white">
                      {nuevosPedidos > 99 ? "99+" : nuevosPedidos}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#24191f]/10 bg-white px-4 py-3 text-xs font-bold text-[#67545d]"
            >
              <IconLogout />
              Cerrar sesión
            </button>
          </nav>
        </div>
      )}

      {/* =========================================================
          CONTENIDO
      ========================================================= */}
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}