function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M3 6.5C3 5.67 3.67 5 4.5 5H14C14.55 5 15 5.45 15 6V17H3V6.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15 9H18.2C18.7 9 19.17 9.25 19.45 9.67L21 12V17H15V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="7"
        cy="17"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="18"
        cy="17"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11.5C19 15.95 16.1 19.2 12 21C7.9 19.2 5 15.95 5 11.5V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12L10.8 14.3L15.7 9.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M4 10H20V20H4V10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M3 7H21V10H3V7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V20"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 7H8.8C7.25 7 6.25 6.1 6.25 4.9C6.25 3.85 7.05 3 8.15 3C10.15 3 12 7 12 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H15.2C16.75 7 17.75 6.1 17.75 4.9C17.75 3.85 16.95 3 15.85 3C13.85 3 12 7 12 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

const benefits = [
  {
    title: "Envíos a todo el país",
    description: "Recibe tus productos donde estés.",
    color: "var(--natt-aqua)",
    icon: TruckIcon,
  },
  {
    title: "Pagos seguros",
    description: "Compra de forma fácil y segura.",
    color: "var(--natt-pink)",
    icon: ShieldIcon,
  },
  {
    title: "Empaques especiales",
    description: "Detalles preparados con amor.",
    color: "var(--natt-purple)",
    icon: GiftIcon,
  },
  {
    title: "Atención personalizada",
    description: "Estamos aquí para ayudarte.",
    color: "var(--natt-pink-bright)",
    icon: HeartIcon,
  },
];

export default function Benefits() {
  return (
    <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[26px] border border-white/70 bg-white/50 shadow-[0_12px_35px_rgba(50,30,40,0.08)] backdrop-blur-xl">
          {/* Línea decorativa */}
          <div
            className="absolute left-0 right-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, var(--natt-pink), var(--natt-purple), var(--natt-aqua))",
              boxShadow: "0 0 12px rgba(255,20,147,0.25)",
            }}
          />

          {/* Brillos */}
          <div
            className="pointer-events-none absolute -left-20 top-[-80px] h-44 w-44 rounded-full blur-[65px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,20,147,0.10), transparent 68%)",
            }}
          />

          <div
            className="pointer-events-none absolute -right-20 bottom-[-80px] h-48 w-48 rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,217,217,0.10), transparent 68%)",
            }}
          />

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className={`group relative flex items-center gap-4 p-6 transition-all duration-300 hover:bg-white/35 ${
                    index < 3
                      ? "border-b border-[var(--natt-black)]/8 lg:border-b-0 lg:border-r"
                      : ""
                  } ${
                    index === 0
                      ? "sm:border-r sm:border-[var(--natt-black)]/8 lg:border-r"
                      : ""
                  } ${
                    index === 1
                      ? "sm:border-r-0 lg:border-r"
                      : ""
                  } ${
                    index === 2
                      ? "sm:border-r sm:border-[var(--natt-black)]/8 lg:border-r"
                      : ""
                  }`}
                >
                  {/* Icono */}
                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-sm transition-all duration-300 group-hover:scale-105"
                    style={{
                      color: benefit.color,
                      boxShadow: `0 0 18px color-mix(in srgb, ${benefit.color} 16%, transparent)`,
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full opacity-15"
                      style={{
                        background: benefit.color,
                      }}
                    />

                    <span className="relative">
                      <Icon />
                    </span>
                  </div>

                  {/* Texto */}
                  <div>
                    <h2 className="text-[13px] font-bold tracking-[-0.01em] text-[var(--natt-black)]">
                      {benefit.title}
                    </h2>

                    <p className="mt-1 text-[11px] leading-5 text-[#6d636a]">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Pequeño acento */}
                  <span
                    className="absolute bottom-0 left-6 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-10"
                    style={{
                      background: benefit.color,
                      boxShadow: `0 0 8px ${benefit.color}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}