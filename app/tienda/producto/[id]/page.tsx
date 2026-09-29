"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const products = [
  {
    id: 1,
    name: "Set de brochas esenciales",
    category: "Brochas",
    price: 45900,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    description:
      "Set de brochas pensado para crear looks completos de manera práctica y sencilla.",
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Paleta de sombras Rosé",
    category: "Ojos",
    price: 58900,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85",
    description:
      "Paleta de sombras con tonos suaves y versátiles para looks de todos los días.",
    badge: "Favorito",
  },
  {
    id: 3,
    name: "Labial rosa natural",
    category: "Labios",
    price: 32900,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85",
    description:
      "Un tono rosa delicado para complementar tus looks con un acabado elegante.",
    badge: "Nuevo",
  },
  {
    id: 4,
    name: "Rubor Soft Pink",
    category: "Rostro",
    price: 37900,
    image:
      "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=85",
    description:
      "Rubor en tono rosado para aportar un acabado fresco y natural al rostro.",
    badge: "Nuevo",
  },
  {
    id: 5,
    name: "Gloss brillo natural",
    category: "Labios",
    price: 28900,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1200&q=85",
    description:
      "Gloss ligero con acabado brillante para darle un toque especial a tus labios.",
    badge: "Favorito",
  },
  {
    id: 6,
    name: "Máscara de pestañas",
    category: "Ojos",
    price: 41900,
    image:
      "https://images.unsplash.com/photo-1631730486572-226d1e3a9c8a?auto=format&fit=crop&w=1200&q=85",
    description:
      "Máscara para destacar la mirada y complementar tus looks de maquillaje.",
    badge: "Más vendido",
  },
  {
    id: 7,
    name: "Base de maquillaje",
    category: "Rostro",
    price: 69900,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
    description:
      "Base de maquillaje para lograr una apariencia uniforme y natural.",
    badge: "Nuevo",
  },
  {
    id: 8,
    name: "Delineador líquido",
    category: "Ojos",
    price: 26900,
    image:
      "https://images.unsplash.com/photo-1590156221820-7f7a2c5f7a39?auto=format&fit=crop&w=1200&q=85",
    description:
      "Delineador práctico para crear líneas definidas y looks de ojos diferentes.",
    badge: "Favorito",
  },
  {
    id: 9,
    name: "Iluminador Glow",
    category: "Rostro",
    price: 44900,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85",
    description:
      "Iluminador para aportar luminosidad y un acabado radiante al rostro.",
    badge: "Nuevo",
  },
];

const reviews = [
  {
    id: 1,
    name: "Valentina",
    rating: 5,
    date: "Hace 3 días",
    comment:
      "Me encantó. Las brochas son muy suaves y se sienten de muy buena calidad.",
    photo:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Mariana",
    rating: 5,
    date: "Hace 1 semana",
    comment:
      "El set llegó muy bonito y bien presentado. Definitivamente lo volvería a comprar.",
    photo: null,
  },
  {
    id: 3,
    name: "Laura",
    rating: 4,
    date: "Hace 2 semanas",
    comment:
      "Muy lindas y prácticas. Me gustó mucho la presentación del producto.",
    photo: null,
  },
];

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
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
      className="h-4 w-4"
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
      className="h-5 w-5"
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
  const [favorite, setFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(Number(id));
    });
  }, [params]);

  const product = products.find((item) => item.id === productId);

  const formattedPrice = product
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(product.price)
    : "";

  const relatedProducts = product
    ? products
        .filter(
          (item) => item.category === product.category && item.id !== product.id
        )
        .slice(0, 3)
    : [];

  const averageRating = 4.7;

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setReviewPhoto(imageUrl);
  };

  const handleReviewSubmit = () => {
    if (!selectedRating || !reviewText.trim()) {
      alert("Selecciona una calificación y escribe tu comentario.");
      return;
    }

    alert("¡Gracias por compartir tu opinión!");

    setSelectedRating(0);
    setReviewText("");
    setReviewPhoto(null);
  };

  if (!productId) {
    return (
      <main className="min-h-screen bg-[#F9E3E9]">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[var(--natt-brown)]">
            Cargando producto...
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F9E3E9]">
        <Navbar />

        <section className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
            Producto no encontrado
          </span>

          <h1 className="mt-4 text-3xl font-semibold text-[var(--natt-brown)] sm:text-4xl">
            No encontramos este producto.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--natt-brown)]/65">
            Regresa a la tienda para descubrir todos nuestros productos.
          </p>

          <Link
            href="/tienda/maquillaje"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--natt-brown)] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--natt-pink)]"
          >
            Ver maquillaje
            <ArrowIcon />
          </Link>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9E3E9] text-[var(--natt-dark)]">
      <Navbar />

      {/* Botón regresar */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <Link
          href="/tienda/maquillaje"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--natt-pink)] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-brown)] hover:shadow-md"
        >
          ← Volver a maquillaje
        </Link>
      </section>

      {/* Producto */}
      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Imagen */}
          <div className="relative self-start overflow-hidden rounded-[24px] bg-[#E8B9C9] p-2.5 sm:rounded-[32px] sm:p-5">
            <div className="relative overflow-hidden rounded-[20px] bg-white sm:rounded-[26px]">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>

            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--natt-brown)] shadow-sm sm:left-7 sm:top-7 sm:px-4 sm:py-2 sm:text-[9px] sm:tracking-[0.18em]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--natt-pink)] sm:text-[10px] sm:tracking-[0.3em]">
              {product.category}
            </p>

            <h1 className="mt-2 text-xl font-semibold leading-tight text-[var(--natt-brown)] sm:mt-4 sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-3">
              <div className="flex gap-0.5 text-[var(--natt-pink)] sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="scale-[0.65] sm:scale-100">
                    <StarIcon filled />
                  </span>
                ))}
              </div>

              <span className="text-[10px] font-semibold text-[var(--natt-brown)] sm:text-sm">
                {averageRating}
              </span>

              <span className="text-[9px] text-[var(--natt-brown)]/50 sm:text-xs">
                ({reviews.length})
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-[var(--natt-brown)] sm:mt-6 sm:text-2xl">
              {formattedPrice}
            </p>

            <div className="mt-3 h-px bg-[var(--natt-brown)]/10 sm:mt-7" />

            <p className="mt-3 text-[10px] leading-5 text-[var(--natt-brown)]/70 sm:mt-7 sm:text-sm sm:leading-7">
              {product.description}
            </p>

            {/* Cantidad */}
            <div className="mt-4 sm:mt-8">
              <p className="mb-2 text-[9px] font-bold text-[var(--natt-brown)] sm:mb-3 sm:text-xs">
                Cantidad
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-full border border-[var(--natt-brown)]/15 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-8 w-8 items-center justify-center text-sm text-[var(--natt-brown)] transition-colors hover:bg-[var(--natt-pink-light)] sm:h-11 sm:w-11 sm:text-lg"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span className="flex h-8 min-w-9 items-center justify-center text-[10px] font-semibold text-[var(--natt-brown)] sm:h-11 sm:min-w-12 sm:text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-8 w-8 items-center justify-center text-sm text-[var(--natt-brown)] transition-colors hover:bg-[var(--natt-pink-light)] sm:h-11 sm:w-11 sm:text-lg"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-3 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:gap-3">
              <button
                type="button"
                className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--natt-brown)] px-3 text-[9px] font-bold text-white shadow-md transition-all hover:bg-[var(--natt-pink)] sm:min-h-14 sm:gap-3 sm:px-7 sm:text-sm"
                onClick={() => {
                  alert(`${quantity} producto(s) agregado(s) al carrito.`);
                }}
              >
                Agregar al carrito
                <ArrowIcon />
              </button>

              <button
                type="button"
                onClick={() => setFavorite((current) => !current)}
                className={`flex h-10 w-full shrink-0 items-center justify-center rounded-full border bg-white transition-all hover:scale-105 sm:h-14 sm:w-14 ${
                  favorite
                    ? "border-[var(--natt-pink)] text-[var(--natt-pink)]"
                    : "border-[var(--natt-brown)]/15 text-[var(--natt-brown)]"
                }`}
                aria-label={
                  favorite
                    ? "Quitar producto de favoritos"
                    : "Agregar producto a favoritos"
                }
              >
                <HeartIcon filled={favorite} />
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
          <div className="rounded-[16px] bg-[#E8B9C9] p-3 sm:rounded-[20px] sm:p-4">
            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--natt-brown)] sm:text-[9px] sm:tracking-[0.15em]">
              Envíos
            </p>

            <p className="mt-1 text-[8px] leading-4 text-[var(--natt-brown)]/70 sm:mt-2 sm:text-xs sm:leading-5">
              Envíos a todo el país.
            </p>
          </div>

          <div className="rounded-[16px] bg-[#E8B9C9] p-3 sm:rounded-[20px] sm:p-4">
            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--natt-brown)] sm:text-[9px] sm:tracking-[0.15em]">
              Compra
            </p>

            <p className="mt-1 text-[8px] leading-4 text-[var(--natt-brown)]/70 sm:mt-2 sm:text-xs sm:leading-5">
              Compra segura.
            </p>
          </div>

          <div className="rounded-[16px] bg-[#E8B9C9] p-3 sm:rounded-[20px] sm:p-4">
            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--natt-brown)] sm:text-[9px] sm:tracking-[0.15em]">
              Atención
            </p>

            <p className="mt-1 text-[8px] leading-4 text-[var(--natt-brown)]/70 sm:mt-2 sm:text-xs sm:leading-5">
              Estamos para ayudarte.
            </p>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#E8B9C9] p-4 sm:rounded-[32px] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[280px_1fr] lg:gap-10">
            {/* Resumen */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[10px] sm:tracking-[0.3em]">
                Opiniones
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[var(--natt-brown)] sm:text-3xl">
                Lo que dicen
              </h2>

              <div className="mt-5 rounded-[22px] bg-white p-5 text-center">
                <p className="text-4xl font-bold text-[var(--natt-brown)]">
                  {averageRating}
                </p>

                <div className="mt-2 flex justify-center gap-1 text-[var(--natt-pink)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled />
                  ))}
                </div>

                <p className="mt-2 text-[10px] text-[var(--natt-brown)]/55">
                  Basado en {reviews.length} reseñas
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("escribir-resena")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-3 w-full rounded-full bg-[var(--natt-brown)] px-5 py-3 text-xs font-bold text-white transition-all hover:bg-[var(--natt-pink)]"
              >
                Escribir una reseña
              </button>
            </div>

            {/* Comentarios */}
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[22px] bg-white p-4 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[var(--natt-brown)]">
                        {review.name}
                      </p>

                      <div className="mt-1 flex gap-1 text-[var(--natt-pink)]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            filled={star <= review.rating}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-[9px] text-[var(--natt-brown)]/45">
                      {review.date}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-[var(--natt-brown)]/70 sm:text-sm">
                    {review.comment}
                  </p>

                  {review.photo && (
                    <div className="mt-3 overflow-hidden rounded-[16px]">
                      <img
                        src={review.photo}
                        alt={`Foto compartida por ${review.name}`}
                        className="h-28 w-28 object-cover"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Escribir reseña */}
      <section
        id="escribir-resena"
        className="mx-auto max-w-5xl px-3 pb-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-[28px] bg-[#E8B9C9] p-5 sm:rounded-[32px] sm:p-8">
          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[10px] sm:tracking-[0.3em]">
              Comparte tu experiencia
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[var(--natt-brown)] sm:text-3xl">
              ¿Qué te pareció este producto?
            </h2>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold text-[var(--natt-brown)]">
              Tu calificación
            </p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className={`transition-all hover:scale-110 ${
                    star <= selectedRating
                      ? "text-[var(--natt-pink)]"
                      : "text-[var(--natt-brown)]/20"
                  }`}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M12 2.8L14.82 8.52L21.13 9.44L16.56 13.9L17.64 20.19L12 17.22L6.36 20.19L7.44 13.9L2.87 9.44L9.18 8.52L12 2.8Z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="review"
              className="mb-3 block text-xs font-bold text-[var(--natt-brown)]"
            >
              Tu comentario
            </label>

            <textarea
              id="review"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder="Cuéntanos qué te pareció..."
              rows={5}
              className="w-full resize-none rounded-[20px] border border-[var(--natt-brown)]/10 bg-white px-5 py-4 text-sm text-[var(--natt-brown)] outline-none transition-all placeholder:text-[var(--natt-brown)]/35 focus:border-[var(--natt-pink)]"
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold text-[var(--natt-brown)]">
              Agrega una foto
            </p>

            <label
              htmlFor="review-photo"
              className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[var(--natt-pink)]/30 bg-white px-5 text-center transition-colors hover:border-[var(--natt-pink)]"
            >
              {reviewPhoto ? (
                <div className="relative">
                  <img
                    src={reviewPhoto}
                    alt="Vista previa de la foto"
                    className="h-24 w-24 rounded-[16px] object-cover"
                  />

                  <span className="mt-2 block text-[10px] font-semibold text-[var(--natt-pink)]">
                    Foto seleccionada
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-3xl text-[var(--natt-pink)]">+</span>

                  <span className="mt-1 text-xs font-semibold text-[var(--natt-brown)]">
                    Seleccionar una foto
                  </span>

                  <span className="mt-1 text-[10px] text-[var(--natt-brown)]/45">
                    JPG, PNG o WEBP
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
            type="button"
            onClick={handleReviewSubmit}
            className="mt-6 w-full rounded-full bg-[var(--natt-brown)] px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--natt-pink)]"
          >
            Publicar reseña
          </button>
        </div>
      </section>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-3 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--natt-pink)] sm:text-[10px] sm:tracking-[0.3em]">
                También te puede gustar
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[var(--natt-brown)] sm:text-3xl">
                Más de {product.category.toLowerCase()}
              </h2>
            </div>

            <Link
              href="/tienda/maquillaje"
              className="hidden items-center gap-2 text-xs font-bold text-[var(--natt-brown)] transition-colors hover:text-[var(--natt-pink)] sm:flex"
            >
              Ver todos
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/tienda/producto/${related.id}`}
                className="group overflow-hidden rounded-[24px] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-[var(--natt-cream)]">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--natt-pink)]">
                    {related.category}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[var(--natt-brown)]">
                    {related.name}
                  </h3>

                  <p className="mt-3 text-sm font-bold text-[var(--natt-brown)]">
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