const categories = [
  {
    name: "Maquillaje Trendy",
    description: "Descubre productos para crear looks que te representen.",
    button: "Ver maquillaje",
    background: "#F3A9B9",
    accent: "#6B3028",
    badge: "BELLEZA",
  },
  {
    name: "Temporada",
    description: "Detalles especiales para celebrar cada momento del año.",
    button: "Ver temporada",
    background: "#E8A27A",
    accent: "#54251F",
    badge: "OCTUBRE",
  },
  {
    name: "Hogar",
    description: "Haz de tus espacios un lugar más bonito y especial.",
    button: "Ver hogar",
    background: "#8BD9D3",
    accent: "#234F4D",
    badge: "LIFESTYLE",
  },
  {
    name: "Papelería Kawaii",
    description:
      "Pequeños detalles para hacer tus días mucho más bonitos.",
    button: "Ver papelería",
    background: "#DCCEF3",
    accent: "#49365F",
    badge: "KAWAII",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="mb-10 text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--natt-pink)]">
          Explora Natt Store
        </span>

        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--natt-brown)] sm:text-5xl">
          Encuentra algo que te encante
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--natt-brown)]/65">
          Cuatro mundos diferentes, una misma tienda creada para encontrar
          esos pequeños detalles que hacen especial cada día.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {categories.map((category) => (
          <article
            key={category.name}
            className="group relative min-h-[360px] overflow-hidden rounded-[30px] p-8 transition-transform duration-300 hover:-translate-y-1 sm:p-10"
            style={{
              backgroundColor: category.background,
              color: category.accent,
            }}
          >

            <div
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-125"
              style={{
                backgroundColor: category.accent,
              }}
            />

            <div
              className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full opacity-10"
              style={{
                backgroundColor: category.accent,
              }}
            />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>

                <span
                  className="inline-flex rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: `${category.accent}18`,
                    color: category.accent,
                  }}
                >
                  {category.badge}
                </span>

                <div
                  className="mt-8 flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed"
                  style={{
                    borderColor: `${category.accent}55`,
                  }}
                >
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{
                      color: `${category.accent}99`,
                    }}
                  >
                    Imagen
                  </span>
                </div>

                <h3
                  className="mt-7 text-3xl font-semibold sm:text-4xl"
                  style={{
                    color: category.accent,
                  }}
                >
                  {category.name}
                </h3>

                <p
                  className="mt-3 max-w-sm text-sm leading-6"
                  style={{
                    color: `${category.accent}CC`,
                  }}
                >
                  {category.description}
                </p>

              </div>

              <div className="mt-8">

                <a
                  href="/tienda"
                  className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-4"
                  style={{
                    backgroundColor: category.accent,
                    color: category.background,
                  }}
                >
                  {category.button}
                  <span aria-hidden="true">→</span>
                </a>

              </div>

            </div>

          </article>
        ))}

      </div>
    </section>
  );
}
