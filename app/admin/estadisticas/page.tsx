"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* =========================================================
   TIPOS
========================================================= */
type Producto = {
  id: number;
  name: string;
  section: string;
  category: string;
  price: number;
  precio_costo: number;
  stock: number;
};

type Pedido = {
  id: number;
  order_number: string;
  date: string;
  items: any[];
  total: number;
  buyer: any;
  status: string;
  devuelto: boolean;
};

type ProductoTop = {
  id: number;
  name: string;
  sold: number;
  revenue: number;
  profit: number;
};
type ProductoMuerto = { id: number; name: string; section: string; stock: number };
type VentaDia = { date: string; label: string; total: number; count: number };
type VentaMes = {
  mes: string;
  label: string;
  total: number;
  count: number;
  profit: number;
};
type VentaSeccion = {
  section: string;
  sold: number;
  revenue: number;
  profit: number;
};
type VentaCategoria = {
  category: string;
  sold: number;
  revenue: number;
  profit: number;
};
type ClienteTop = { email: string; name: string; pedidos: number; total: number };
type ProductoDevuelto = {
  id: number;
  name: string;
  devoluciones: number;
  porcentaje: number;
};

/* =========================================================
   PÁGINA
========================================================= */
export default function AdminEstadisticasPage() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [rango, setRango] = useState<"7d" | "30d" | "90d" | "todo">("30d");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: pedidosData } = await supabase
        .from("pedidos")
        .select("*")
        .order("date", { ascending: false });

      const { data: productosData } = await supabase
        .from("productos")
        .select("id, name, section, category, price, precio_costo, stock");

      setPedidos(pedidosData || []);
      setProductos(productosData || []);
      setLoading(false);
    }

    load();
  }, []);

  /* ========== FILTRAR POR RANGO ========== */
  const pedidosFiltrados = (() => {
    if (rango === "todo") return pedidos;
    const dias = rango === "7d" ? 7 : rango === "30d" ? 30 : 90;
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    return pedidos.filter((p) => new Date(p.date) >= desde);
  })();

  /* ========== MÉTRICAS GENERALES ========== */
  const totalVentas = pedidosFiltrados.reduce((a, p) => a + (p.total || 0), 0);
  const totalPedidos = pedidosFiltrados.length;
  const ticketPromedio =
    totalPedidos > 0 ? Math.round(totalVentas / totalPedidos) : 0;

  const totalItems = pedidosFiltrados.reduce((a, p) => {
    const items = p.items || [];
    return a + items.reduce((b: number, i: any) => b + (Number(i.quantity) || 0), 0);
  }, 0);

  /* ========== DEVOLUCIONES ========== */
  const totalDevueltos = pedidos.filter((p) => p.devuelto).length;
  const totalPedidosHistorico = pedidos.length;
  const tasaDevoluciones =
    totalPedidosHistorico > 0
      ? Math.round((totalDevueltos / totalPedidosHistorico) * 100)
      : 0;

  /* ========== FINANZAS ========== */
  const finanzas = (() => {
    let gananciaTotal = 0;
    let costoTotal = 0;
    let ingresoTotal = 0;

    pedidos.forEach((order) => {
      if (order.devuelto) return;
      const items = order.items || [];
      items.forEach((it: any) => {
        const id = Number(it.id);
        const qty = Number(it.quantity) || 0;
        const price = Number(it.price) || 0;
        const prod = productos.find((x) => x.id === id);
        const costoUnit = prod?.precio_costo || 0;

        ingresoTotal += price * qty;
        costoTotal += costoUnit * qty;
        gananciaTotal += (price - costoUnit) * qty;
      });
    });

    const margen =
      ingresoTotal > 0 ? Math.round((gananciaTotal / ingresoTotal) * 100) : 0;

    return { gananciaTotal, costoTotal, ingresoTotal, margen };
  })();

  /* ========== STOCK VALORIZADO ========== */
  const stockValorizado = (() => {
    let valorVenta = 0;
    let valorCosto = 0;
    let totalUnidades = 0;

    productos.forEach((p) => {
      const stock = p.stock || 0;
      valorVenta += p.price * stock;
      valorCosto += (p.precio_costo || 0) * stock;
      totalUnidades += stock;
    });

    return {
      valorVenta,
      valorCosto,
      gananciaPotencial: valorVenta - valorCosto,
      totalUnidades,
    };
  })();

  /* ========== COMPARACIÓN MES ACTUAL vs ANTERIOR ========== */
  const comparacionMes = (() => {
    const ahora = new Date();

    const inicioActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);

    const mesActual = pedidos.filter((p) => {
      const d = new Date(p.date);
      return d >= inicioActual && !p.devuelto;
    });
    const mesAnterior = pedidos.filter((p) => {
      const d = new Date(p.date);
      return d >= inicioAnterior && d <= finAnterior && !p.devuelto;
    });

    const ventasActual = mesActual.reduce((a, p) => a + (p.total || 0), 0);
    const ventasAnterior = mesAnterior.reduce((a, p) => a + (p.total || 0), 0);

    const diff =
      ventasAnterior > 0
        ? Math.round(((ventasActual - ventasAnterior) / ventasAnterior) * 100)
        : 0;

    // Proyección lineal del mes actual
    const diasTranscurridos = ahora.getDate();
    const diasDelMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
    const proyeccion =
      diasTranscurridos > 0
        ? Math.round((ventasActual / diasTranscurridos) * diasDelMes)
        : 0;

    return {
      ventasActual,
      ventasAnterior,
      diff,
      proyeccion,
      pedidosActual: mesActual.length,
      pedidosAnterior: mesAnterior.length,
    };
  })();

  /* ========== VENTAS POR DÍA (14 días) ========== */
  const ventasPorDia: VentaDia[] = (() => {
    const days: VentaDia[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);

      const next = new Date(d);
      next.setDate(next.getDate() + 1);

      const dayOrders = pedidos.filter((p) => {
        const pd = new Date(p.date);
        return pd >= d && pd < next && !p.devuelto;
      });

      days.push({
        date: d.toISOString(),
        label: d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
        total: dayOrders.reduce((a, p) => a + (p.total || 0), 0),
        count: dayOrders.length,
      });
    }
    return days;
  })();

  /* ========== VENTAS POR MES (6 meses con ganancia) ========== */
  const ventasPorMes: VentaMes[] = (() => {
    const months: VentaMes[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - i);

      const next = new Date(d);
      next.setMonth(next.getMonth() + 1);

      const monthOrders = pedidos.filter((p) => {
        const pd = new Date(p.date);
        return pd >= d && pd < next && !p.devuelto;
      });

      let profit = 0;
      monthOrders.forEach((order) => {
        const items = order.items || [];
        items.forEach((it: any) => {
          const id = Number(it.id);
          const qty = Number(it.quantity) || 0;
          const price = Number(it.price) || 0;
          const prod = productos.find((x) => x.id === id);
          const costoUnit = prod?.precio_costo || 0;
          profit += qty * (price - costoUnit);
        });
      });

      months.push({
        mes: d.toISOString(),
        label: d.toLocaleDateString("es-CO", { month: "short" }).toUpperCase(),
        total: monthOrders.reduce((a, p) => a + (p.total || 0), 0),
        count: monthOrders.length,
        profit,
      });
    }
    return months;
  })();

  /* ========== VENTAS POR PRODUCTO ========== */
  const ventasPorProducto: Record<
    number,
    { sold: number; revenue: number; profit: number }
  > = {};

  pedidos.forEach((order) => {
    if (order.devuelto) return;
    const items = order.items || [];
    items.forEach((it: any) => {
      const id = Number(it.id);
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const prod = productos.find((x) => x.id === id);
      const costoUnit = prod?.precio_costo || 0;

      if (!isNaN(id)) {
        if (!ventasPorProducto[id])
          ventasPorProducto[id] = { sold: 0, revenue: 0, profit: 0 };
        ventasPorProducto[id].sold += qty;
        ventasPorProducto[id].revenue += qty * price;
        ventasPorProducto[id].profit += qty * (price - costoUnit);
      }
    });
  });

  const topProductos: ProductoTop[] = Object.entries(ventasPorProducto)
    .map(([id, v]) => {
      const p = productos.find((x) => x.id === Number(id));
      return {
        id: Number(id),
        name: p?.name || "Producto",
        sold: v.sold,
        revenue: v.revenue,
        profit: v.profit,
      };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8);

  const topGanancia: ProductoTop[] = [...topProductos]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const productosMuertos: ProductoMuerto[] = productos
    .filter((p) => !ventasPorProducto[p.id])
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      section: p.section,
      stock: p.stock || 0,
    }));

  /* ========== DEVOLUCIONES POR PRODUCTO ========== */
  const devolucionesPorProducto: ProductoDevuelto[] = (() => {
    const devMap: Record<number, number> = {};

    pedidos.forEach((order) => {
      if (!order.devuelto) return;
      const items = order.items || [];
      items.forEach((it: any) => {
        const id = Number(it.id);
        const qty = Number(it.quantity) || 0;
        if (!isNaN(id)) devMap[id] = (devMap[id] || 0) + qty;
      });
    });

    return Object.entries(devMap)
      .map(([id, devoluciones]) => {
        const p = productos.find((x) => x.id === Number(id));
        const vendidos = ventasPorProducto[Number(id)]?.sold || 0;
        const total = vendidos + devoluciones;
        return {
          id: Number(id),
          name: p?.name || "Producto",
          devoluciones,
          porcentaje: total > 0 ? Math.round((devoluciones / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.devoluciones - a.devoluciones)
      .slice(0, 5);
  })();

  /* ========== VENTAS POR SECCIÓN ========== */
  const ventasPorSeccionMap: Record<
    string,
    { sold: number; revenue: number; profit: number }
  > = {};

  pedidos.forEach((order) => {
    if (order.devuelto) return;
    const items = order.items || [];
    items.forEach((it: any) => {
      const id = Number(it.id);
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const p = productos.find((x) => x.id === id);
      const section = p?.section || "Otros";
      const costoUnit = p?.precio_costo || 0;

      if (!ventasPorSeccionMap[section])
        ventasPorSeccionMap[section] = { sold: 0, revenue: 0, profit: 0 };
      ventasPorSeccionMap[section].sold += qty;
      ventasPorSeccionMap[section].revenue += qty * price;
      ventasPorSeccionMap[section].profit += qty * (price - costoUnit);
    });
  });

  const ventasPorSeccion: VentaSeccion[] = Object.entries(ventasPorSeccionMap)
    .map(([section, v]) => ({ section, ...v }))
    .sort((a, b) => b.revenue - a.revenue);

  /* ========== VENTAS POR CATEGORÍA ========== */
  const ventasPorCategoriaMap: Record<
    string,
    { sold: number; revenue: number; profit: number }
  > = {};

  pedidos.forEach((order) => {
    if (order.devuelto) return;
    const items = order.items || [];
    items.forEach((it: any) => {
      const id = Number(it.id);
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const p = productos.find((x) => x.id === id);
      const cat = p?.category || "Otros";
      const costoUnit = p?.precio_costo || 0;

      if (!ventasPorCategoriaMap[cat])
        ventasPorCategoriaMap[cat] = { sold: 0, revenue: 0, profit: 0 };
      ventasPorCategoriaMap[cat].sold += qty;
      ventasPorCategoriaMap[cat].revenue += qty * price;
      ventasPorCategoriaMap[cat].profit += qty * (price - costoUnit);
    });
  });

  const ventasPorCategoria: VentaCategoria[] = Object.entries(
    ventasPorCategoriaMap
  )
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  /* ========== TOP CLIENTES ========== */
  const clienteMap: Record<
    string,
    { name: string; pedidos: number; total: number }
  > = {};

  pedidos.forEach((order) => {
    if (order.devuelto) return;
    const email = order.buyer?.correo?.toLowerCase();
    if (!email) return;

    const nombre = `${order.buyer?.nombre || ""} ${
      order.buyer?.apellido || ""
    }`.trim();

    if (!clienteMap[email]) {
      clienteMap[email] = {
        name: nombre || email.split("@")[0],
        pedidos: 0,
        total: 0,
      };
    }

    clienteMap[email].pedidos += 1;
    clienteMap[email].total += order.total || 0;
  });

  const topClientes: ClienteTop[] = Object.entries(clienteMap)
    .map(([email, v]) => ({ email, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  /* ========== FORMATO ========== */
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const maxDia = Math.max(...ventasPorDia.map((d) => d.total), 1);
  const maxMes = Math.max(...ventasPorMes.map((m) => m.total), 1);
  const maxTop = topProductos[0]?.sold || 1;
  const maxSeccion = ventasPorSeccion[0]?.revenue || 1;
  const maxCliente = topClientes[0]?.total || 1;
  const maxGanancia = topGanancia[0]?.profit || 1;
  const maxDevolucion = devolucionesPorProducto[0]?.devoluciones || 1;

  return (
    <div className="relative space-y-5">
      {/* ENCABEZADO */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[#f7eee7] px-7 py-7 shadow-[0_20px_55px_rgba(105,55,65,0.12)] sm:px-9 sm:py-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#ff1493]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#00d9d9]/12 blur-3xl" />

        <div
          className="absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
          }}
        />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
              Análisis
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#24191f] sm:text-4xl">
              Estadísticas
            </h1>
            <p className="mt-1 text-sm text-[#67545d]">
              Todo lo que necesitas saber sobre tus ventas y finanzas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "7d", label: "7 días" },
              { key: "30d", label: "30 días" },
              { key: "90d", label: "90 días" },
              { key: "todo", label: "Todo" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRango(r.key as any)}
                className={`rounded-full px-4 py-2 text-[11px] font-bold transition ${
                  rango === r.key
                    ? "bg-[#ff1493] text-white shadow-[0_6px_18px_rgba(255,20,147,0.28)]"
                    : "border border-[#24191f]/10 bg-white text-[#67545d] hover:border-[#ff1493]/30 hover:text-[#ff1493]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMPARACIÓN MES ACTUAL vs ANTERIOR */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
            Comparación mensual
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Este mes vs el anterior
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Este mes
            </p>
            <p className="mt-1 text-xl font-black text-[#ff1493]">
              {formatPrice(comparacionMes.ventasActual)}
            </p>
            <p className="text-[10px] text-[#67545d]">
              {comparacionMes.pedidosActual} pedidos
            </p>
          </div>

          <div className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Mes anterior
            </p>
            <p className="mt-1 text-xl font-black text-[#67545d]">
              {formatPrice(comparacionMes.ventasAnterior)}
            </p>
            <p className="text-[10px] text-[#67545d]">
              {comparacionMes.pedidosAnterior} pedidos
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              comparacionMes.diff >= 0
                ? "border-[#00bfc0]/25 bg-[#00bfc0]/5"
                : "border-[#ff1493]/25 bg-[#ff1493]/5"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Variación
            </p>
            <p
              className={`mt-1 text-xl font-black ${
                comparacionMes.diff >= 0 ? "text-[#008f91]" : "text-[#ff1493]"
              }`}
            >
              {comparacionMes.diff >= 0 ? "▲" : "▼"} {Math.abs(comparacionMes.diff)}%
            </p>
            <p className="text-[10px] text-[#67545d]">
              vs mes anterior
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#a83cff]/20 bg-[#a83cff]/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#a83cff]">
            Proyección fin de mes
          </p>
          <p className="mt-1 text-lg font-black text-[#a83cff]">
            {formatPrice(comparacionMes.proyeccion)}
          </p>
          <p className="text-[10px] text-[#67545d]">
            Basado en el ritmo actual
          </p>
        </div>
      </div>

      {/* FINANZAS */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493]">
          Finanzas generales
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FinanceCard
            label="Ingresos totales"
            value={formatPrice(finanzas.ingresoTotal)}
            color="#ff1493"
          />
          <FinanceCard
            label="Costos totales"
            value={formatPrice(finanzas.costoTotal)}
            color="#a83cff"
          />
          <FinanceCard
            label="Ganancia total"
            value={formatPrice(finanzas.gananciaTotal)}
            color="#00bfc0"
          />
          <FinanceCard
            label="Margen de ganancia"
            value={`${finanzas.margen}%`}
            color="#00bfc0"
          />
        </div>
      </div>

      {/* STOCK VALORIZADO */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
            Inventario
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Valor actual de tu stock
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Unidades en stock
            </p>
            <p className="mt-1 text-xl font-black text-[#24191f]">
              {stockValorizado.totalUnidades}
            </p>
          </div>
          <div className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Costo del inventario
            </p>
            <p className="mt-1 text-xl font-black text-[#a83cff]">
              {formatPrice(stockValorizado.valorCosto)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
              Valor a la venta
            </p>
            <p className="mt-1 text-xl font-black text-[#ff1493]">
              {formatPrice(stockValorizado.valorVenta)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#00bfc0]/25 bg-[#00bfc0]/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#008f91]">
              Ganancia potencial
            </p>
            <p className="mt-1 text-xl font-black text-[#00bfc0]">
              {formatPrice(stockValorizado.gananciaPotencial)}
            </p>
          </div>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#008f91]">
          Ventas
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricBig label="Ventas" value={formatPrice(totalVentas)} />
          <MetricBig label="Pedidos" value={String(totalPedidos)} />
          <MetricBig label="Ticket promedio" value={formatPrice(ticketPromedio)} />
          <MetricBig label="Productos vendidos" value={String(totalItems)} />
        </div>
      </div>

      {/* DEVOLUCIONES */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a83cff]">
            Devoluciones
          </p>
          <div className="space-y-3">
            <FinanceCard
              label="Pedidos devueltos"
              value={String(totalDevueltos)}
              color="#a83cff"
            />
            <FinanceCard
              label="Total de pedidos"
              value={String(totalPedidosHistorico)}
              color="#67545d"
            />
            <FinanceCard
              label="Tasa de devoluciones"
              value={`${tasaDevoluciones}%`}
              color="#a83cff"
            />
          </div>
        </div>

        <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a83cff]">
              Ranking
            </p>
            <h2 className="mt-1 text-lg font-black text-[#24191f]">
              Productos con más devoluciones
            </h2>
          </div>

          {loading ? (
            <Skeleton />
          ) : devolucionesPorProducto.length === 0 ? (
            <Empty text="No hay devoluciones registradas." />
          ) : (
            <div className="space-y-3">
              {devolucionesPorProducto.map((p, i) => {
                const w = Math.max(8, (p.devoluciones / maxDevolucion) * 100);
                return (
                  <div key={p.id}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a83cff]/15 text-[10px] font-black text-[#a83cff]">
                          {i + 1}
                        </span>
                        <span className="truncate text-xs font-bold text-[#24191f]">
                          {p.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-black text-[#a83cff]">
                        {p.devoluciones} dev. · {p.porcentaje}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                      <div
                        className="h-full rounded-full bg-[#a83cff]"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* VENTAS POR DÍA */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
            Últimos 14 días
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Ventas por día
          </h2>
        </div>

        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-[#f5eee7]" />
        ) : (
          <div className="flex h-48 items-end gap-1.5 sm:gap-2">
            {ventasPorDia.map((d, i) => {
              const h = Math.max(4, (d.total / maxDia) * 100);
              const tiene = d.total > 0;
              return (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        tiene
                          ? "bg-gradient-to-t from-[#ff1493] to-[#ff8dcc]"
                          : "bg-[#f5eee7]"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                    <div className="pointer-events-none absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-[#24191f] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg group-hover:block">
                      {formatPrice(d.total)} · {d.count} ped.
                    </div>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#67545d] sm:text-[9px]">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VENTAS Y GANANCIA POR MES */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a83cff]">
              Últimos 6 meses
            </p>
            <h2 className="mt-1 text-lg font-black text-[#24191f]">
              Ventas y ganancia por mes
            </h2>
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#a83cff]" />
              Ventas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00bfc0]" />
              Ganancia
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-[#f5eee7]" />
        ) : (
          <div className="flex h-48 items-end gap-3">
            {ventasPorMes.map((m, i) => {
              const hVentas = Math.max(4, (m.total / maxMes) * 100);
              const hGanancia = Math.max(4, (m.profit / maxMes) * 100);

              return (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex w-full flex-1 items-end gap-0.5">
                    <div
                      className="w-1/2 rounded-t-xl bg-gradient-to-t from-[#a83cff] to-[#c1a0ff] transition-all duration-500"
                      style={{ height: `${hVentas}%` }}
                    />
                    <div
                      className="w-1/2 rounded-t-xl bg-gradient-to-t from-[#00bfc0] to-[#00f0e8] transition-all duration-500"
                      style={{ height: `${hGanancia}%` }}
                    />
                    <div className="pointer-events-none absolute -top-14 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-[#24191f] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg group-hover:block">
                      Ventas: {formatPrice(m.total)} · Ganancia: {formatPrice(m.profit)}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#67545d]">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TOP + NO VENDEN */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00bfc0]/12 text-[#008f91]">
              ▲
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
                Top 8
              </p>
              <h2 className="text-lg font-black text-[#24191f]">
                Los más vendidos
              </h2>
            </div>
          </div>

          {loading ? (
            <Skeleton />
          ) : topProductos.length === 0 ? (
            <Empty text="Aún no hay ventas." />
          ) : (
            <div className="space-y-3">
              {topProductos.map((p, i) => {
                const w = Math.max(8, (p.sold / maxTop) * 100);
                return (
                  <div key={p.id}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00bfc0]/15 text-[10px] font-black text-[#008f91]">
                          {i + 1}
                        </span>
                        <span className="truncate text-xs font-bold text-[#24191f]">
                          {p.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-black text-[#008f91]">
                        {p.sold} · {formatPrice(p.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                      <div
                        className="h-full rounded-full bg-[#00bfc0]"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff1493]/12 text-[#ff1493]">
              ▼
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
                Alerta
              </p>
              <h2 className="text-lg font-black text-[#24191f]">
                No se venden
              </h2>
            </div>
          </div>

          {loading ? (
            <Skeleton />
          ) : productosMuertos.length === 0 ? (
            <Empty text="¡Todos tus productos están vendiendo!" />
          ) : (
            <div className="space-y-2">
              {productosMuertos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#ff1493]/12 bg-[#ff1493]/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#24191f]">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-[#67545d]">
                      {p.section} · {p.stock} en stock
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#ff1493]/15 px-2.5 py-1 text-[10px] font-black text-[#ff1493]">
                    0 ventas
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOP GANANCIA */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00bfc0]">
            Rentabilidad
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Productos que más ganancia generan
          </h2>
        </div>

        {loading ? (
          <Skeleton />
        ) : topGanancia.length === 0 ? (
          <Empty text="Sin datos de ganancias." />
        ) : (
          <div className="space-y-3">
            {topGanancia.map((p, i) => {
              const w = Math.max(8, (p.profit / maxGanancia) * 100);
              const margen =
                p.revenue > 0 ? Math.round((p.profit / p.revenue) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00bfc0]/15 text-[10px] font-black text-[#008f91]">
                        {i + 1}
                      </span>
                      <span className="truncate text-xs font-bold text-[#24191f]">
                        {p.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] font-black text-[#00bfc0]">
                      {formatPrice(p.profit)} · {margen}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00bfc0] to-[#00f0e8]"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VENTAS POR SECCIÓN */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1493]">
            Por sección
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Rendimiento por sección
          </h2>
        </div>

        {loading ? (
          <Skeleton />
        ) : ventasPorSeccion.length === 0 ? (
          <Empty text="Sin datos de ventas." />
        ) : (
          <div className="space-y-3">
            {ventasPorSeccion.map((s) => {
              const w = Math.max(8, (s.revenue / maxSeccion) * 100);
              const margen =
                s.revenue > 0 ? Math.round((s.profit / s.revenue) * 100) : 0;
              return (
                <div key={s.section}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[#24191f]">
                      {s.section}
                    </span>
                    <div className="flex gap-3 text-[11px]">
                      <span className="text-[#67545d]">{s.sold} unds</span>
                      <span className="font-black text-[#ff1493]">
                        {formatPrice(s.revenue)}
                      </span>
                      <span className="font-black text-[#00bfc0]">
                        +{formatPrice(s.profit)}
                      </span>
                      <span className="font-bold text-[#a83cff]">{margen}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff1493] to-[#a83cff]"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VENTAS POR CATEGORÍA */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a83cff]">
            Por categoría
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Rendimiento por categoría
          </h2>
        </div>

        {loading ? (
          <Skeleton />
        ) : ventasPorCategoria.length === 0 ? (
          <Empty text="Sin datos de ventas." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ventasPorCategoria.map((c) => {
              const margen =
                c.revenue > 0 ? Math.round((c.profit / c.revenue) * 100) : 0;
              return (
                <div
                  key={c.category}
                  className="rounded-2xl border border-[#24191f]/6 bg-[#f9f4f0] px-4 py-3"
                >
                  <p className="text-xs font-bold text-[#24191f]">
                    {c.category}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px]">
                    <span className="text-[#67545d]">{c.sold} unds</span>
                    <span className="font-black text-[#a83cff]">
                      {formatPrice(c.revenue)}
                    </span>
                    <span className="font-black text-[#00bfc0]">
                      +{formatPrice(c.profit)}
                    </span>
                    <span className="font-bold text-[#008f91]">{margen}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TOP CLIENTES */}
      <div className="rounded-[26px] border border-white/60 bg-white/80 p-6 backdrop-blur-md">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008f91]">
            Fidelidad
          </p>
          <h2 className="mt-1 text-lg font-black text-[#24191f]">
            Mejores clientes
          </h2>
        </div>

        {loading ? (
          <Skeleton />
        ) : topClientes.length === 0 ? (
          <Empty text="Aún no tienes clientes recurrentes." />
        ) : (
          <div className="space-y-2">
            {topClientes.map((c, i) => {
              const w = Math.max(8, (c.total / maxCliente) * 100);
              return (
                <div key={c.email}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff1493]/10 text-[10px] font-black text-[#ff1493]">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#24191f]">
                          {c.name}
                        </p>
                        <p className="truncate text-[10px] text-[#67545d]">
                          {c.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-[#ff1493]">
                        {formatPrice(c.total)}
                      </p>
                      <p className="text-[9px] text-[#67545d]">
                        {c.pedidos} {c.pedidos === 1 ? "pedido" : "pedidos"}
                      </p>
                    </div>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[#f5eee7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff1493] to-[#00d9d9]"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   AUXILIARES
========================================================= */
function MetricBig({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-md">
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #ff1493, #a83cff, #00d9d9)",
        }}
      />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-[#24191f]">
        {value}
      </p>
    </div>
  );
}

function FinanceCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-md">
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#67545d]">
        {label}
      </p>
      <p
        className="mt-2 text-2xl font-black tracking-tight"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-2xl bg-[#f5eee7]" />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#24191f]/10 bg-[#f9f4f0] py-8 text-center">
      <p className="text-xs font-bold text-[#67545d]">{text}</p>
    </div>
  );
}