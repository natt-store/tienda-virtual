"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartContext";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { useProduct, type Product } from "@/lib/useProducts";
import { supabase } from "@/lib/supabase";

type Review = {
  id: number;
  nombre: string;
  calificacion: number;
  comentario: string;
  foto: string | null;
  created_at: string;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
      aria-hidden="true"
    >
      <path
        d="M20.84 4.61C19.82 3.59 18.45 3 17 3C15.55 3 14.18 3.59 13.16 4.61L12 5.77L10.84 4.61C9.82 3.59 8.45 3 7 3C5.55 3 4.18 3.59 3.16 4.61C1.05 6.72 1.05 10.14 3.16 12.25L12 21L20.84 12.25C22.95 10.14 22.95 6.72 20.84 4.61Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 3.5L14.63 8.82L20.5 9.67L16.25 13.82L17.25 19.67L12 16.91L6.75 19.67L7.75 13.82L3.5 9.67L9.37 8.82L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Estados para reseñas reales
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhotoFile, setReviewPhotoFile] = useState<File | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { product, loading: loadingProduct } = useProduct(productId);

  // Leer el ID de los params
  useEffect(() => {
    params.then(({ id }) => {
      setProductId(Number(id));
    });
  }, [params]);

  // Cargar reseñas reales de este producto desde Supabase
  useEffect(() => {
    if (!productId) return;

    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reseñas")
        .select("*")
        .eq("producto_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    }

    fetchReviews();
  }, [productId]);

  // Cargar productos relacionados
  useEffect(() => {
    if (!product) return;

    let mounted = true;

    async function fetchRelated() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("active", true)
        .eq("section", product!.section)
        .eq("category", product!.category)
        .neq("id", product!.id)
        .limit(3);

      if (!mounted) return;

      if (!error && data) {
        setRelatedProducts(
          data.map((p) => ({
            ...p,
            href: `/tienda/producto/${p.id}`,
          }))
        );
      } else {
        setRelatedProducts([]);
      }
    }

    fetchRelated();

    return () => {
      mounted = false;
    };
  }, [product]);

  const favorite = product ? isFavorite(product.id) : false;

  const formattedPrice = product
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(product.price)
    : "";

  // Calcular promedio de estrellas real
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setReviewPhotoFile(file);
    setReviewPhotoPreview(URL.createObjectURL(file));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim() || !selectedRating || !reviewText.trim()) {
      alert("Por favor escribe tu nombre, calificación y comentario.");
      return;
    }

    if (!productId) return;

    setSubmittingReview(true);
    let photoUrl: string | null = null;

    // Si subió foto, la guardamos en el Storage de Supabase
    if (reviewPhotoFile) {
      const ext = reviewPhotoFile.name.split(".").pop();
      const fileName = `review-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(fileName, reviewPhotoFile);

      if (!uploadError) {
        const { data: pubData } = supabase.storage
          .from("productos")
          .getPublicUrl(fileName);
        photoUrl = pubData.publicUrl;
      }
    }

    // Insertar reseña en la base de datos
    const { data: newReview, error: insertError } = await supabase
      .from("reseñas")
      .insert({
        producto_id: productId,
        nombre: reviewerName.trim(),
        calificacion: selectedRating,
        comentario: reviewText.trim(),
        foto: photoUrl,
      })
      .select()
      .single();

    setSubmittingReview(false);

    if (insertError) {
      alert("Error al publicar la reseña: " + insertError.message);
      return;
    }

    alert("¡Gracias por compartir tu opinión!");
    setReviews([newReview, ...reviews]);
    setReviewerName("");
    setReviewText("");
    setSelectedRating(5);
    setReviewPhotoFile(null);
    setReviewPhotoPreview(null);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Aquí solo llamamos a addToCart. La notificación bonita (Toast) aparece solita.
    addToCart(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
      },
      quantity
    );
  };

  // =====================================
  // CARGANDO
  // =====================================
  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-[var(--natt-bg)]">
        <Navbar />
        <div className="flex min-h-[55vh] items-center justify-center">
          <p className="text-sm text-[var(--natt-dark)]/60">
            Cargando producto...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  // =====================================
  // NO ENCONTRADO
  // =====================================
  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--natt-bg)]">
        <Navbar />
        <section className="mx-auto flex min-h-[55vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
            Producto no encontrado
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--natt-dark)] sm:text-3xl">
            No encontramos este producto.
          </h1>
          <Link
            href="/tienda"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--natt-pink)] px-6 py-3 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--natt-purple)]"
          >
            Ver tienda
            <ArrowIcon />
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const sectionLower = product.section.toLowerCase();
  const sectionHref =
    sectionLower === "maquillaje"
      ? "/tienda/maquillaje"
      : sectionLower === "hogar"
        ? "/tienda/hogar"
        : sectionLower === "papelería" || sectionLower === "papeleria"
          ? "/tienda/papeleria-kawaii"
          : sectionLower === "temporada"
            ? "/tienda/temporada"
            : "/tienda";

  return (
    <main className="min-h-screen bg-[var(--natt-bg)] text-[var(--natt-dark)]">
      <Navbar />

      {/* =====================================
          PRODUCTO PRINCIPAL
      ====================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-7 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8">
        <div className="mb-4 sm:mb-5">
          <Link
            href={sectionHref}
            className="group inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--natt-dark)]/50 transition-colors hover:text-[var(--natt-pink)]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Volver a {product.section.toLowerCase()}
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-white/70 bg-white/30 p-2.5 shadow-[0_15px_45px_rgba(90,45,65,0.07)] backdrop-blur-sm sm:rounded-[32px] sm:p-4 lg:p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-9">
            {/* IMAGEN DEL PRODUCTO */}
            <div className="relative">
              <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f7d9df] via-[#f1e2d8] to-[#d9eef0] p-2.5 sm:rounded-[27px] sm:p-3.5">
                <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-white/50 shadow-[0_14px_32px_rgba(60,30,50,0.1)] sm:rounded-[21px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover"
                    priority
                  />
                </div>

                {product.badge && (
                  <span className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-[var(--natt-dark)] shadow-sm backdrop-blur-sm sm:left-7 sm:top-7 sm:px-3 sm:py-1.5 sm:text-[8px]">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="relative px-1 py-1 sm:px-2 lg:py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[9px]">
                    {product.section}
                  </p>
                  <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--natt-dark)]/40 sm:text-[10px]">
                    {product.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:h-10 sm:w-10 ${
                    favorite
                      ? "border-[var(--natt-pink)] bg-[var(--natt-pink)]/10 text-[var(--natt-pink)]"
                      : "border-[var(--natt-dark)]/10 bg-white/60 text-[var(--natt-dark)]/55 hover:border-[var(--natt-pink)] hover:text-[var(--natt-pink)]"
                  }`}
                >
                  <HeartIcon filled={favorite} />
                </button>
              </div>

              <h1 className="mt-3 max-w-md text-[clamp(1.65rem,3.2vw,2.8rem)] font-semibold leading-[1] tracking-[-0.03em] text-[var(--natt-dark)] sm:mt-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2 sm:mt-4">
                <div className="flex gap-0.5 text-[var(--natt-pink)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      <StarIcon filled />
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-[var(--natt-dark)]">
                  {averageRating}
                </span>
                <span className="text-[10px] text-[var(--natt-dark)]/40">
                  · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
                </span>
              </div>

              {/* Precio */}
              <div className="mt-4 flex items-end gap-2 sm:mt-5">
                <span className="text-xl font-bold tracking-tight text-[var(--natt-dark)] sm:text-2xl">
                  {formattedPrice}
                </span>
                <span className="mb-0.5 text-[8px] uppercase tracking-[0.1em] text-[var(--natt-dark)]/35 sm:text-[9px]">
                  Precio final
                </span>
              </div>

              <div className="mt-4 h-px w-full bg-gradient-to-r from-[var(--natt-pink)]/30 via-[var(--natt-dark)]/8 to-transparent" />

              {product.description && (
                <p className="mt-4 max-w-md text-[12px] leading-5 text-[var(--natt-dark)]/60 sm:text-[13px] sm:leading-6">
                  {product.description}
                </p>
              )}

              {/* Cantidad y Carrito */}
              <div className="mt-5">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--natt-dark)]/45">
                  Cantidad
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex h-10 items-center overflow-hidden rounded-full border border-[var(--natt-dark)]/10 bg-white/70 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((c) => Math.max(1, c - 1))}
                      className="flex h-10 w-9 items-center justify-center text-base text-[var(--natt-dark)]/55 hover:bg-[var(--natt-pink)]/10 hover:text-[var(--natt-pink)]"
                    >
                      −
                    </button>
                    <span className="flex min-w-8 items-center justify-center text-xs font-bold text-[var(--natt-dark)]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((c) => c + 1)}
                      className="flex h-10 w-9 items-center justify-center text-base text-[var(--natt-dark)]/55 hover:bg-[var(--natt-aqua)]/10 hover:text-[var(--natt-aqua)]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="group relative flex h-10 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--natt-dark)] px-5 text-[10px] font-bold text-white transition-all hover:bg-[var(--natt-pink)] sm:text-xs"
                  >
                    <span className="relative z-10">Agregar al carrito</span>
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          OPINIONES / RESEÑAS REALES
      ====================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[25px] border border-white/60 bg-white/25 p-4 shadow-[0_12px_35px_rgba(90,45,65,0.04)] backdrop-blur-sm sm:rounded-[28px] sm:p-6 lg:p-7">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:gap-7">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[9px]">
                Opiniones
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-[var(--natt-dark)] sm:text-2xl">
                Lo que dicen
              </h2>

              <div className="mt-4 rounded-[18px] border border-white/70 bg-white/55 p-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold text-[var(--natt-dark)]">
                  {averageRating}
                </p>
                <div className="mt-1.5 flex justify-center gap-0.5 text-[var(--natt-pink)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled />
                  ))}
                </div>
                <p className="mt-1.5 text-[9px] text-[var(--natt-dark)]/45">
                  Basado en {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("escribir-resena")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-2.5 w-full rounded-full bg-[var(--natt-dark)] px-4 py-2.5 text-[10px] font-bold text-white transition-all hover:bg-[var(--natt-pink)]"
              >
                Escribir una reseña
              </button>
            </div>

            <div className="space-y-2.5">
              {reviews.length === 0 ? (
                <div className="rounded-[18px] border border-white/70 bg-white/55 p-8 text-center text-xs text-[var(--natt-dark)]/60">
                  Aún no hay reseñas para este producto. ¡Sé el primero en dejar tu opinión! ✨
                </div>
              ) : (
                reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-[18px] border border-white/70 bg-white/55 p-4 backdrop-blur-sm sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-[var(--natt-dark)]">
                          {review.nombre}
                        </p>
                        <div className="mt-1 flex gap-0.5 text-[var(--natt-pink)]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              filled={star <= review.calificacion}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[8px] text-[var(--natt-dark)]/40">
                        {new Date(review.created_at).toLocaleDateString("es-CO")}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-[var(--natt-dark)]/60 sm:text-xs">
                      {review.comentario}
                    </p>

                    {review.foto && (
                      <div className="mt-2.5 relative h-24 w-24 overflow-hidden rounded-[13px]">
                        <Image
                          src={review.foto}
                          alt={`Foto compartida por ${review.nombre}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          ESCRIBIR RESEÑA (FORMULARIO REAL)
      ====================================== */}
      <section
        id="escribir-resena"
        className="mx-auto max-w-4xl px-4 pb-9 sm:px-6 lg:px-8"
      >
        <form
          onSubmit={handleReviewSubmit}
          className="relative overflow-hidden rounded-[25px] border border-white/60 bg-white/25 p-4 shadow-[0_12px_35px_rgba(90,45,65,0.04)] backdrop-blur-sm sm:rounded-[28px] sm:p-6"
        >
          <div className="text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[9px]">
              Comparte tu experiencia
            </p>
            <h2 className="mt-1.5 text-xl font-semibold text-[var(--natt-dark)] sm:text-2xl">
              ¿Qué te pareció este producto?
            </h2>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold text-[var(--natt-dark)]">
              Tu nombre
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Ej: María José"
              className="w-full rounded-[17px] border border-[var(--natt-dark)]/10 bg-white/65 px-4 py-3 text-xs text-[var(--natt-dark)] outline-none transition-all placeholder:text-[var(--natt-dark)]/35 focus:border-[var(--natt-pink)]"
              required
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold text-[var(--natt-dark)]">
              Tu calificación
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className={`transition-all hover:scale-110 ${
                    star <= selectedRating
                      ? "text-[var(--natt-pink)]"
                      : "text-[var(--natt-dark)]/20"
                  }`}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M12 2.8L14.82 8.52L21.13 9.44L16.56 13.9L17.64 20.19L12 17.22L6.36 20.19L7.44 13.9L2.87 9.44L9.18 8.52L12 2.8Z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold text-[var(--natt-dark)]">
              Tu comentario
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Cuéntanos qué te pareció..."
              rows={4}
              className="w-full resize-none rounded-[17px] border border-[var(--natt-dark)]/10 bg-white/65 px-4 py-3 text-xs text-[var(--natt-dark)] outline-none transition-all placeholder:text-[var(--natt-dark)]/35 focus:border-[var(--natt-pink)]"
              required
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold text-[var(--natt-dark)]">
              Agrega una foto (opcional)
            </p>
            <label
              htmlFor="review-photo"
              className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[17px] border-2 border-dashed border-[var(--natt-pink)]/25 bg-white/50 px-4 text-center transition-colors hover:border-[var(--natt-pink)]"
            >
              {reviewPhotoPreview ? (
                <div className="relative">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[13px]">
                    <Image
                      src={reviewPhotoPreview}
                      alt="Vista previa"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <span className="mt-1.5 block text-[9px] font-semibold text-[var(--natt-pink)]">
                    Foto seleccionada
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-2xl text-[var(--natt-pink)]">+</span>
                  <span className="mt-1 text-[10px] font-semibold text-[var(--natt-dark)]">
                    Seleccionar una foto
                  </span>
                </>
              )}
              <input
                id="review-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="mt-5 w-full rounded-full bg-[var(--natt-dark)] px-5 py-3 text-xs font-bold text-white transition-all hover:bg-[var(--natt-pink)] disabled:opacity-50"
          >
            {submittingReview ? "Publicando..." : "Publicar reseña"}
          </button>
        </form>
      </section>

      {/* =====================================
          PRODUCTOS RELACIONADOS
      ====================================== */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[9px]">
                También te puede gustar
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-[var(--natt-dark)] sm:text-2xl">
                Más de {product.category.toLowerCase()}
              </h2>
            </div>
            <Link
              href={sectionHref}
              className="hidden items-center gap-2 text-[10px] font-bold text-[var(--natt-dark)] transition-colors hover:text-[var(--natt-pink)] sm:flex"
            >
              Ver todos
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/tienda/producto/${related.id}`}
                className="group overflow-hidden rounded-[20px] border border-white/60 bg-white/45 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--natt-bg-soft)]">
                  <Image
                    src={related.image}
                    alt={related.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-3.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--natt-pink)]">
                    {related.category}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 text-[var(--natt-dark)] sm:text-sm">
                    {related.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold text-[var(--natt-dark)]">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(related.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}