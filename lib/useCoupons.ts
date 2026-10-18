"use client";

import { supabase } from "./supabase";

export type CouponType = "porcentaje" | "monto_fijo" | "envio_gratis";

export type AppliedCoupon = {
  id: number;
  codigo: string;
  nombre: string;
  tipo: CouponType;
  valor: number;
  monto_minimo: number;
};

const STORAGE_KEY = "natt-store-cupones";
const MAX_COUPONS = 2;

/* =========================================================
   VALIDAR CUPÓN CONTRA SUPABASE
========================================================= */
export async function validateCoupon(
  code: string,
  subtotal: number,
  existingCoupons: AppliedCoupon[] = []
): Promise<{ ok: boolean; error?: string; coupon?: AppliedCoupon }> {
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { ok: false, error: "Escribe un código." };
  }

  // Verificar si ya está agregado
  if (existingCoupons.some((c) => c.codigo === cleanCode)) {
    return { ok: false, error: "Ya aplicaste este cupón." };
  }

  if (existingCoupons.length >= MAX_COUPONS) {
    return { ok: false, error: `Solo puedes usar un máximo de ${MAX_COUPONS} cupones por compra.` };
  }

  const { data, error } = await supabase
    .from("promociones")
    .select("*")
    .eq("codigo", cleanCode)
    .eq("activa", true)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Ese cupón no existe o no está activo." };
  }

  // Fechas
  const now = new Date();
  if (data.fecha_inicio && new Date(data.fecha_inicio) > now) {
    return { ok: false, error: "Ese cupón todavía no está disponible." };
  }
  if (data.fecha_fin && new Date(data.fecha_fin) < now) {
    return { ok: false, error: "Ese cupón ya venció." };
  }

  // Usos
  if (
    data.usos_maximos !== null &&
    data.usos_actuales >= data.usos_maximos
  ) {
    return { ok: false, error: "Ese cupón ya alcanzó su límite de uso." };
  }

  // Monto mínimo
  if (data.monto_minimo > 0 && subtotal < data.monto_minimo) {
    return {
      ok: false,
      error: `El cupón aplica desde $${data.monto_minimo.toLocaleString(
        "es-CO"
      )}.`,
    };
  }

  return {
    ok: true,
    coupon: {
      id: data.id,
      codigo: data.codigo,
      nombre: data.nombre,
      tipo: data.tipo,
      valor: data.valor,
      monto_minimo: data.monto_minimo,
    },
  };
}

/* =========================================================
   GUARDAR / LEER / BORRAR CUPONES EN localStorage (Soporta lista)
========================================================= */
export function saveCoupon(coupon: AppliedCoupon) {
  try {
    const current = loadCoupons();
    if (current.length >= MAX_COUPONS) return;
    if (current.some((c) => c.codigo === coupon.codigo)) return;
    
    current.push(coupon);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Ignorar
  }
}

// Mantenemos compatibilidad con el nombre anterior cargando la lista y devolviendo el primero (o puedes usar loadCoupons)
export function loadCoupon(): AppliedCoupon | null {
  const list = loadCoupons();
  return list.length > 0 ? list[0] : null;
}

export function loadCoupons(): AppliedCoupon[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

export function removeCoupon(codigo: string) {
  try {
    const current = loadCoupons();
    const updated = current.filter((c) => c.codigo !== codigo);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignorar
  }
}

export function clearCoupon() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar
  }
}

/* =========================================================
   CALCULAR DESCUENTO ACUMULADO (Suma varios cupones)
========================================================= */
export function calculateCouponDiscount(
  coupons: AppliedCoupon | AppliedCoupon[],
  subtotal: number
): { discount: number; freeShipping: boolean } {
  const couponList = Array.isArray(coupons) ? coupons : [coupons];
  
  let totalDiscount = 0;
  let freeShipping = false;

  for (const coupon of couponList) {
    if (coupon.tipo === "porcentaje") {
      totalDiscount += Math.round(subtotal * (coupon.valor / 100));
    } else if (coupon.tipo === "monto_fijo") {
      totalDiscount += coupon.valor;
    } else if (coupon.tipo === "envio_gratis") {
      freeShipping = true;
    }
  }

  // El descuento no puede superar el subtotal de la compra
  return {
    discount: Math.min(totalDiscount, subtotal),
    freeShipping,
  };
}

/* =========================================================
   REGISTRAR USO DE LOS CUPONES EN SUPABASE
========================================================= */
export async function registerCouponUsage(
  couponId: number,
  codigo: string,
  orderNumber: string
) {
  try {
    const { data: promo } = await supabase
      .from("promociones")
      .select("usos_actuales")
      .eq("id", couponId)
      .maybeSingle();

    if (promo) {
      await supabase
        .from("promociones")
        .update({ usos_actuales: (promo.usos_actuales || 0) + 1 })
        .eq("id", couponId);
    }

    await supabase.from("cupones_usados").insert({
      promocion_id: couponId,
      codigo,
      usos_en: new Date().toISOString(),
    });
  } catch {
    // Ignorar
  }
}