"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Product = {
  id: number;
  name: string;
  section: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
  badge: string | null;
  stock: number;
  active: boolean;
  destacado: boolean;
  recomendado: boolean;
  orden: number;
  href: string;
};

export type ProductWithSales = Product & { soldCount: number };

type SupabaseProduct = Omit<Product, "href">;

function addHref(product: SupabaseProduct): Product {
  return {
    ...product,
    href: `/tienda/producto/${product.id}`,
  };
}

/* =========================================================
   TODOS LOS PRODUCTOS ACTIVOS
========================================================= */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("active", true)
        .order("orden", { ascending: true })
        .order("id", { ascending: true });

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        setProducts((data || []).map(addHref));
        setError(null);
      }

      setLoading(false);
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading, error };
}

/* =========================================================
   PRODUCTOS POR SECCIÓN (Soporta múltiples secciones y excluye Accesorios)
========================================================= */
export function useProductsBySection(section: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("active", true)
        .order("orden", { ascending: true })
        .order("id", { ascending: true });

      if (!mounted) return;

      if (!error && data) {
        const filtered = (data || []).filter((p: any) => {
          if (!p.section) return false;
          if (p.section.toLowerCase() === "accesorios") return false;

          const seccionesProducto = p.section
            .split(",")
            .map((s: string) => s.trim().toLowerCase());

          return seccionesProducto.includes(section.toLowerCase());
        });

        setProducts(filtered.map(addHref));
      } else {
        setProducts([]);
      }

      setLoading(false);
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [section]);

  return { products, loading };
}

/* =========================================================
   UN PRODUCTO POR ID
========================================================= */
export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchProduct() {
      setLoading(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .maybeSingle();

      if (!mounted) return;

      if (!error && data && data.section?.toLowerCase() !== "accesorios") {
        setProduct(addHref(data));
      } else {
        setProduct(null);
      }

      setLoading(false);
    }

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading };
}

/* =========================================================
   PRODUCTOS DESTACADOS (destacado = true)
========================================================= */
export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("active", true)
        .eq("destacado", true)
        .order("orden", { ascending: true })
        .order("id", { ascending: true });

      if (!mounted) return;

      if (!error) {
        const filtered = (data || []).filter(
          (p: any) => p.section?.toLowerCase() !== "accesorios"
        );
        setProducts(filtered.map(addHref));
      } else {
        setProducts([]);
      }

      setLoading(false);
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}

/* =========================================================
   PRODUCTOS RECOMENDADOS (recomendado = true)
========================================================= */
export function useRecommendedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("active", true)
        .eq("recomendado", true)
        .order("orden", { ascending: true })
        .order("id", { ascending: true });

      if (!mounted) return;

      if (!error) {
        const filtered = (data || []).filter(
          (p: any) => p.section?.toLowerCase() !== "accesorios"
        );
        setProducts(filtered.map(addHref));
      } else {
        setProducts([]);
      }

      setLoading(false);
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}

/* =========================================================
   MÁS VENDIDOS
========================================================= */
export function useBestSellers() {
  const [products, setProducts] = useState<ProductWithSales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBestSellers() {
      setLoading(true);

      const { data: orders } = await supabase
        .from("pedidos")
        .select("items");

      const counts: Record<number, number> = {};

      (orders || []).forEach((order: any) => {
        const items = (order.items as any[]) || [];

        items.forEach((item: any) => {
          const id = Number(item.id);
          const qty = Number(item.quantity) || 0;

          if (!isNaN(id) && qty > 0) {
            counts[id] = (counts[id] || 0) + qty;
          }
        });
      });

      const topIds = Object.entries(counts)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 4)
        .map(([id]) => Number(id));

      let result: ProductWithSales[] = [];

      if (topIds.length > 0) {
        const { data } = await supabase
          .from("productos")
          .select("*")
          .in("id", topIds)
          .eq("active", true);

        if (data) {
          result = topIds
            .map((id) => data.find((p: any) => p.id === id))
            .filter(Boolean)
            .filter((p: any) => p.section?.toLowerCase() !== "accesorios")
            .map((p: any) => ({
              ...addHref(p),
              soldCount: counts[p.id] || 0,
            }));
        }
      }

      if (result.length < 4) {
        const existingIds = result.map((p) => p.id);

        const { data } = await supabase
          .from("productos")
          .select("*")
          .eq("active", true)
          .eq("badge", "Más vendido")
          .order("orden", { ascending: true })
          .order("id", { ascending: true });

        if (data) {
          const extra = data
            .filter((p: any) => !existingIds.includes(p.id))
            .filter((p: any) => p.section?.toLowerCase() !== "accesorios")
            .slice(0, 4 - result.length)
            .map((p: any) => ({
              ...addHref(p),
              soldCount: counts[p.id] || 0,
            }));

          result = [...result, ...extra];
        }
      }

      if (!mounted) return;
      setProducts(result);
      setLoading(false);
    }

    fetchBestSellers();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}