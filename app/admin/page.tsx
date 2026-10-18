"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/useAdmin";

/* =========================================================
   ICONOS SVG
========================================================= */
function IconMoney() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="2.5" y="6.5" width="19" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 9.5V14.5M18 9.5V14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7H21V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 3L21 20H3L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10V14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
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
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 20V10M10 20V4M16 20V13M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle({ className = "", color = "pink" }: { className?: string; color?: "pink" | "aqua" | "purple" }) {
  const colorClass =
    color === "aqua"
      ? "text-[#00d9d9]"
      : color === "purple"
        ? "text-[#a83cff]"
        : "text-[#ff1493]";

  return (
    <span className={`pointer-events-none absolute ${colorClass} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
        <path d="M20 1C20.7 11.8 28.2 19.3 39 20C28.2 20.7 20.7 28.2 20 39C19.3 28.2 11.8 20.7 1 20C11.8 19.3 19.3 11.8 20 1Z" fill="currentColor" />
      </svg>
    </span>
  );
}

type Stats = {
  totalProductos: number;
  totalPedidos: number;
  totalClientes: number;
  totalCupones: number;
  ventasTotales: number;
  ventasMes: number;
  pedidosMes: number;
  stockBajo: { id: number; name: string; stock: number }[];
  pedidosRecientes: any[];
  productosTop: { id: number; name: string; sold: number }[];
};

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState<Stats>({
    totalProductos: 0,
    totalPedidos: 0,
    totalClientes: 0,
    totalCupones: 0,
    ventasTotales: 0,
    ventasMes: 0,
    pedidosMes: 0,
    stockBajo: [],
    pedidosRecientes: [],
    productosTop: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      const { count: totalProductos } = await supabase
        .from("productos")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      const { data: stockBajoData } = await supabase
        .from("productos")
        .select("id, name, stock, stock_minimo")
        .eq("active", true)
        .order("stock", { ascending: true });

      const stockBajoLista = (stockBajoData || [])
        .filter((p: any) => p.stock <= (p.stock_minimo || 5))
        .slice(0, 5);

      const { data: pedidosData, count: totalPedidos } = await supabase
        .from("pedidos")
        .select("*", { count: "exact" })
        .order("date", { ascending: false });

      const { count: totalClientes } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });

      const { count: totalCupones } = await supabase
        .from("promociones")
        .select("*", { count: "exact", head: true })
        .eq("activa", true);

      const pedidos = pedidosData || [];
      const ventasTotales = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);

      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

      const pedidosMesList = pedidos.filter((p) => new Date(p.date) >= inicioMes);
      const ventasMes = pedidosMesList.reduce((acc, p) => acc + (p.total || 0), 0);

      const counts: Record<number, number> = {};
      pedidos.forEach((order) => {
        const items = order.items || [];
        items.forEach((it: any) => {
          const id = Number(it.id);
          const qty = Number(it.quantity) || 0;
          if (!isNaN(id)) counts[id] = (counts[id] || 0) + qty;
        });
      });

      const productosTopIds = Object.entries(counts)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5);

      const productosTop = await Promise.all(
        productosTopIds.map(async ([id, sold]) => {
          const { data } = await supabase
            .from("productos")
            .select("id, name")
            .eq("id", Number(id))
            .maybeSingle();

          return {
            id: Number(id),
            name: data?.name || "Producto",
            sold: Number(sold),
          };
        })
      );

      setStats({
        totalProductos: totalProductos || 0,
        totalPedidos: totalPedidos || 0,
        totalClientes: totalClientes || 0,
        totalCupones: totalCupones || 0,
        ventasTotales,
        ventasMes,
        pedidosMes: pedidosMesList.length,
        stockBajo: stockBajoLista,
        pedidosRecientes: pedidos.slice(0, 5),
        productosTop,
      });

      setLoading(false);
    }

    fetchStats();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative space-y-5">
      {/* =========================================================
          DECORACIONES DE FONDO
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#ff1493]/10 blur-[100px]" />
        <div className="absolute -right-32 top-[40%] h-80 w-80 rounded-full bg-[#00d9d9]/10 blur-[110px]" />
        <div className="absolute bottom-[10%] left-[40%] h-72 w-72 rounded-full bg-[#a83cff]/8 blur-[110px]" />
      </div>

      {/* =========================================================
          ENCABEZADO
      ========================================================= */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[#f7eee7] px-7 py-8 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#ff1493]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#00d9d9]/15 blur-3xl" />

        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
            boxShadow: "0 0 14px rgba(255,20,147,0.4), 0 0 20px rgba(0,217,217,0.2)",
          }}
        />

        <Sparkle className="right-[12%] top-8 h-4 w-4" color="aqua" />
        <Sparkle className="right-[30%] bottom-8 h-3 w-3" color="pink" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ff1493]/20 bg-white/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff1493] shadow-[0_0_8px_rgba(255,20,147,0.8)]" />
              Panel Natt
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
              {new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.035em] text-[#24191f] sm:text-4xl lg:text-5xl">
            Hola,{" "}
            <span className="font-serif italic text-[#ff1493]">
              Natalia
            </span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-[#67545d]">
            Aquí tienes el resumen de cómo va Natt Store hoy.
          </p>
        </div>
      </div>

      {/* =========================================================
          STATS
      ========================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ventas totales"
          value={formatPrice(stats.ventasTotales)}
          hint={`${stats.totalPedidos} ${stats.totalPedidos === 1 ? "pedido" : "pedidos"}`}
          color="#ff1493"
          icon={<IconMoney />}
        />
        <StatCard
          label="Ventas del mes"
          value={formatPrice(stats.ventasMes)}
          hint={`${stats.pedidosMes} ${stats.pedidosMes === 1 ? "pedido" : "pedidos"} este mes`}
          color="#a83cff"
          icon={<IconTrend />}
        />
        <StatCard
          label="Productos activos"
          value={String(stats.totalProductos)}
          hint={`${stats.stockBajo.length} con stock bajo`}
          color="#00bfc0"
          icon={<IconBox />}
        />
        <StatCard
          label="Clientes"
          value={String(stats.totalClientes)}
          hint={`${stats.totalCupones} cupones activos`}
          color="#ff2fa4"
          icon={<IconUsers />}
        />
      </div>

      {/* =========================================================
          DOS COLUMNAS
      ========================================================= */}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/75 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
              boxShadow: "0 0 12px rgba(255,20,147,0.35)",
            }}
          />

          <div className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff1493]/10 text-[#ff1493]">
                  <IconBag />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                    Actividad
                  </p>
                  <h2 className="mt-0.5 text-lg font-black text-[#24191f]">
                    Pedidos recientes
                  </h2>
                </div>
              </div>

              <Link
                href="/admin/pedidos"
                className="group flex items-center gap-1.5 rounded-full border border-[#24191f]/10 bg-white/70 px-4 py-2 text-[11px] font-bold text-[#67545d] backdrop-blur transition hover:border-[#ff1493]/30 hover:text-[#ff1493]"
              >
                Ver todos
                <span className="transition-transform group-hover:translate-x-0.5">
                  <IconArrow />
                </span>
              </Link>
            </div>

            {loading ? (
              <SkeletonRows />
            ) : stats.pedidosRecientes.length === 0 ? (
              <EmptyState text="Aún no tienes pedidos." />
            ) : (
              <div className="space-y-2">
                {stats.pedidosRecientes.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#24191f]">
                        {order.order_number}
                      </p>
                      <p className="text-[10px] text-[#67545d]">
                        {order.buyer?.nombre} · {formatDate(order.date)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-[#ff1493]">
                        {formatPrice(order.total || 0)}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
                        {order.status || "Pendiente"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/75 backdrop-blur-md">
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #ff1493, #ff2fa4)",
              boxShadow: "0 0 12px rgba(255,20,147,0.35)",
            }}
          />

          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff1493]/10 text-[#ff1493]">
                <IconAlert />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                  Alertas
                </p>
                <h2 className="mt-0.5 text-lg font-black text-[#24191f]">
                  Stock bajo
                </h2>
              </div>
            </div>

            {loading ? (
              <SkeletonRows small />
            ) : stats.stockBajo.length === 0 ? (
              <EmptyState text="Todo tu stock está bien." />
            ) : (
              <div className="space-y-2">
                {stats.stockBajo.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#ff1493]/15 bg-[#ff1493]/6 px-4 py-3"
                  >
                    <p className="truncate text-xs font-bold text-[#24191f]">
                      {p.name}
                    </p>
                    <span className="shrink-0 rounded-full bg-[#ff1493] px-2.5 py-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(255,20,147,0.4)]">
                      {p.stock} uds
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          TOP PRODUCTOS
      ========================================================= */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/75 backdrop-blur-md">
        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #a83cff, #ff1493, #00d9d9)",
            boxShadow: "0 0 12px rgba(168,60,255,0.35)",
          }}
        />

        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#a83cff]/10 text-[#a83cff]">
              <IconChart />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a83cff]">
                Estadísticas
              </p>
              <h2 className="mt-0.5 text-lg font-black text-[#24191f]">
                Productos más vendidos
              </h2>
            </div>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : stats.productosTop.length === 0 ? (
            <EmptyState text="Aún no hay datos de ventas." />
          ) : (
            <div className="space-y-3">
              {stats.productosTop.map((p, i) => {
                const max = stats.productosTop[0].sold || 1;
                const width = Math.max(8, (p.sold / max) * 100);

                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff1493]/10 text-[10px] font-black text-[#ff1493]">
                          0{i + 1}
                        </span>
                        <span className="truncate font-bold text-[#24191f]">
                          {p.name}
                        </span>
                      </span>
                      <span className="shrink-0 font-black text-[#ff1493]">
                        {p.sold} vendidos
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff1493] via-[#a83cff] to-[#00d9d9]"
                        style={{
                          width: `${width}%`,
                          boxShadow: "0 0 10px rgba(255,20,147,0.4)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  color,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/75 backdrop-blur-md">
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
          boxShadow: `0 0 12px ${color}66`,
        }}
      />

      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl"
        style={{ backgroundColor: `${color}25` }}
      />

      <div className="relative p-5 sm:p-6">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>

        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
          {label}
        </p>

        <p
          className="mt-1.5 text-2xl font-black tracking-tight"
          style={{ color }}
        >
          {value}
        </p>

        <p className="mt-1 text-[11px] text-[#67545d]">{hint}</p>
      </div>
    </div>
  );
}

function SkeletonRows({ small = false }: { small?: boolean }) {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`animate-pulse rounded-2xl bg-[#f5eee7] ${
            small ? "h-12" : "h-16"
          }`}
        />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-[#f9f4f0] py-8 text-center">
      <p className="text-xs font-bold text-[#67545d]">{text}</p>
    </div>
  );
}