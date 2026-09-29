const products = [
  {
    id: 5,
    name: "Soft Beauty Set",
    category: "Maquillaje Trendy",
    price: "$44.900",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Cozy Home",
    category: "Hogar",
    price: "$54.900",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Pretty Desk",
    category: "Papelería Kawaii",
    price: "$34.900",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=85",
  },
];

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

export default function RecommendedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="overflow-hidden rounded-[32px] bg-[var(--natt-brown)]">
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">

          {/* Texto */}
          <div className="flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--natt-pink-light)]">
              Para ti
            </span>

            <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white sm:text-4xl">
              También puedes
              <span className="block text-[var(--natt-pink-light)]">
                enamorarte de estos.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Descubre otros productos seleccionados para complementar tus
              favoritos y encontrar algo nuevo que te encante.
            </p>

            <a
              href="/tienda"
              className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--natt-brown)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--natt-pink)] hover:text-white"
            >
              Explorar productos
              <ArrowRightIcon />
            </a>
          </div>

          {/* Productos */}
          <div className="grid bg-[var(--natt-cream)] sm:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group border-b border-[var(--natt-brown)]/10 last:border-b-0 sm:border-b-0 sm:border-l"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--natt-peach)]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--natt-pink)]">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-sm font-semibold text-[var(--natt-brown)]">
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[var(--natt-brown)]">
                      {product.price}
                    </span>

                    <a
                      href={`/tienda/producto/${product.id}`}
                      aria-label={`Ver ${product.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--natt-pink)] text-white transition-all duration-300 hover:bg-[var(--natt-brown)]"
                    >
                      <ArrowRightIcon />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}