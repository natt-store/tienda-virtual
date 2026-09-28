export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid overflow-hidden rounded-2xl border border-[var(--natt-brown)]/10 bg-white/60 sm:grid-cols-2 lg:grid-cols-4">

        {/* Envíos */}
        <div className="flex items-center gap-4 border-b border-[var(--natt-brown)]/10 p-6 lg:border-b-0 lg:border-r">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--natt-aqua)]/40 text-xl">
            ♧
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--natt-brown)]">
              Envíos a todo el país
            </h2>

            <p className="mt-1 text-xs text-[var(--natt-brown)]/65">
              Recibe tus productos donde estés.
            </p>
          </div>
        </div>

        {/* Pagos */}
        <div className="flex items-center gap-4 border-b border-[var(--natt-brown)]/10 p-6 lg:border-b-0 lg:border-r">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--natt-pink-light)]/50 text-xl">
            ♡
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--natt-brown)]">
              Pagos seguros
            </h2>

            <p className="mt-1 text-xs text-[var(--natt-brown)]/65">
              Compra de forma fácil y segura.
            </p>
          </div>
        </div>

        {/* Empaques */}
        <div className="flex items-center gap-4 border-b border-[var(--natt-brown)]/10 p-6 sm:border-b-0 lg:border-r">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--natt-peach)] text-xl">
            ♧
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--natt-brown)]">
              Empaques especiales
            </h2>

            <p className="mt-1 text-xs text-[var(--natt-brown)]/65">
              Detalles preparados con amor.
            </p>
          </div>
        </div>

        {/* Atención */}
        <div className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--natt-aqua)]/40 text-xl">
            ♡
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--natt-brown)]">
              Atención personalizada
            </h2>

            <p className="mt-1 text-xs text-[var(--natt-brown)]/65">
              Estamos aquí para ayudarte.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
