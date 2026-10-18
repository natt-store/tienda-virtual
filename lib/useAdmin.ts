"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const ADMIN_STORAGE_KEY = "natt-store-admin";

export type AdminUser = {
  id: number;
  email: string;
  nombre: string | null;
};

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; user?: AdminUser }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { ok: false, error: "Completa correo y contraseña." };
  }

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", cleanEmail)
    .eq("activo", true)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  if (data.password_hash !== password) {
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  const user: AdminUser = {
    id: data.id,
    email: data.email,
    nombre: data.nombre,
  };

  try {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignorar
  }

  return { ok: true, user };
}

export function logoutAdmin() {
  try {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    // Ignorar
  }
}

export function getAdminUser(): AdminUser | null {
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/* Hook para usar el admin en componentes */
export function useAdmin() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdmin(getAdminUser());
    setLoading(false);
  }, []);

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  return { admin, loading, logout };
}

/* Guard para páginas del admin */
export function useRequireAdmin() {
  const { admin, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !admin) {
      window.location.href = "/admin/login";
    }
  }, [admin, loading]);

  return { admin, loading };
}