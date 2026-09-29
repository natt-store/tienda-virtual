const products = [
  {
    id: 1,
    name: "Beauty Essentials",
    category: "Maquillaje Trendy",
    price: "$49.900",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
    tag: "Destacado",
  },
  {
    id: 2,
    name: "Makeup Collection",
    category: "Maquillaje Trendy",
    price: "$59.900",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    tag: "Nuevo",
  },
  {
    id: 3,
    name: "Home Details",
    category: "Hogar",
    price: "$39.900",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    tag: "Favorito",
  },
  {
    id: 4,
    name: "Desk Essentials",
    category: "Papelería Kawaii",
    price: "$29.900",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
    tag: "Nuevo",
  },
];

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20.8 8.8C20.8 13.7 12 19 12 19C12 19 3.2 13.7 3.2 8.8C3.2 6.1 5.1 4.2 7.6 4.2C9.3 4.2 10.8 5.1 12 6.5C13.2 5.1 14.7 4.2 16.4 4.2C18.9 4.2 20.8 6.1 20.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
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

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
            Favoritos de Natt
          </span>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--natt-brown)] sm:text-5xl">
            Productos destacados
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--natt-brown)]/65">
            Descubre algunos de los productos que hacen parte de nuestro
            universo Natt Store.
          </p>
        </div>

        <a
          href="/tienda"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--natt-brown)]/20 px-5 py-2.5 text-xs font-semibold text-[var(--natt-brown)] transition-all hover:border-[var(--natt-pink)] hover:bg-[var(--natt-pink)] hover:text-white"
        >
          Ver toda la tienda
          <ArrowRightIcon />
        </a>
      </div>

      {/* Productos */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[26px] border border-[var(--natt-brown)]/10 bg-white/75 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Imagen */}
            <div className="relative aspect-[4/4.5] overflow-hidden bg-[var(--natt-cream)]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Etiqueta */}
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--natt-brown)] shadow-sm backdrop-blur-sm">
                {product.tag}
              </div>

              {/* Favoritos */}
              <button
                type="button"
                aria-label={`Agregar ${product.name} a favoritos`}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--natt-brown)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[var(--natt-pink)] hover:text-white"
              >
                <HeartIcon />
              </button>
            </div>

            {/* Información */}
            <div className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--natt-pink)]">
                {product.category}
              </p>

              <h3 className="mt-2 text-base font-semibold text-[var(--natt-brown)]">
                {product.name}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-base font-bold text-[var(--natt-brown)]">
                  {product.price}
                </span>

                <a
                  href={`/tienda/producto/${product.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white transition-all duration-300 hover:bg-[var(--natt-brown)]"
                  aria-label={`Ver ${product.name}`}
                >
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Nota temporal */}
      <div className="mt-8 rounded-[24px] border border-dashed border-[var(--natt-brown)]/15 bg-[var(--natt-peach)]/25 px-6 py-5 text-center">
        <p className="text-xs text-[var(--natt-brown)]/60">
          Las fotografías mostradas son referencias temporales. Aquí irán las
          fotografías oficiales de los productos de Natt Store.
        </p>
      </div>
    </section>
  );
}