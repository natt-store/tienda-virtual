import Image from "next/image";

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    type: "instagram",
  },
  {
    name: "Facebook",
    href: "#",
    type: "facebook",
  },
  {
    name: "WhatsApp",
    href: "#",
    type: "whatsapp",
  },
  {
    name: "Correo electrónico",
    href: "mailto:contacto@nattstore.com",
    type: "email",
  },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M14 8H16V4.5C15.7 4.4 14.6 4.3 13.4 4.3C10.9 4.3 9.2 5.8 9.2 8.5V11H6.5V14.8H9.2V21H13.3V14.8H16L16.4 11H13.3V8.8C13.3 7.8 13.6 8 14 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.5C20.5 16.2 16.7 20 12 20C10.5 20 9.1 19.6 7.9 18.9L3.5 20L4.7 15.8C3.9 14.5 3.5 13 3.5 11.5C3.5 6.8 7.3 3 12 3C16.7 3 20.5 6.8 20.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 8.2C8.6 7.9 9 7.9 9.3 8.2L10.5 9.5C10.8 9.8 10.8 10.2 10.6 10.5L10 11.2C10.6 12.4 11.6 13.4 12.8 14L13.5 13.4C13.8 13.2 14.2 13.2 14.5 13.5L15.8 14.7C16.1 15 16.1 15.4 15.8 15.7C15.2 16.3 14.3 16.5 13.5 16.2C10.7 15.2 8.3 12.8 7.3 10C7 9.2 7.2 8.8 8.3 8.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  if (type === "instagram") {
    return <InstagramIcon />;
  }

  if (type === "facebook") {
    return <FacebookIcon />;
  }

  if (type === "whatsapp") {
    return <WhatsAppIcon />;
  }

  return <EmailIcon />;
}

function getSocialStyles(type: string) {
  if (type === "instagram") {
    return {
      color: "text-[#E4405F]",
      background: "bg-[#E4405F]/10",
      hover: "hover:bg-[#E4405F]",
    };
  }

  if (type === "facebook") {
    return {
      color: "text-[#1877F2]",
      background: "bg-[#1877F2]/10",
      hover: "hover:bg-[#1877F2]",
    };
  }

  if (type === "whatsapp") {
    return {
      color: "text-[#25D366]",
      background: "bg-[#25D366]/10",
      hover: "hover:bg-[#25D366]",
    };
  }

  return {
    color: "text-[var(--natt-brown)]",
    background: "bg-[var(--natt-peach)]/35",
    hover: "hover:bg-[var(--natt-pink)]",
  };
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--natt-brown)]/10 bg-[var(--natt-cream)]">

      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo y descripción */}
          <div>

            <Image
              src="/brand/logo-natt-store.png"
              alt="Natt Store"
              width={150}
              height={60}
              className="h-auto w-[130px] object-contain"
            />

            <p className="mt-4 max-w-xs text-xs leading-5 text-[var(--natt-brown)]/65">
              Productos bonitos, detalles especiales y todo lo que buscas en
              un solo lugar.
            </p>

          </div>

          {/* Tienda */}
          <div>

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--natt-brown)]">
              Tienda
            </h2>

            <nav className="mt-4 flex flex-col gap-2 text-xs text-[var(--natt-brown)]/65">

              <a
                href="/tienda"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Todos los productos
              </a>

              <a
                href="/tienda"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Maquillaje Trendy
              </a>

              <a
                href="/tienda"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Temporada
              </a>

              <a
                href="/tienda"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Hogar
              </a>

              <a
                href="/tienda"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Papelería Kawaii
              </a>

            </nav>

          </div>

          {/* Información */}
          <div>

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--natt-brown)]">
              Información
            </h2>

            <nav className="mt-4 flex flex-col gap-2 text-xs text-[var(--natt-brown)]/65">

              <a
                href="/"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Inicio
              </a>

              <a
                href="/novedades"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Novedades
              </a>

              <a
                href="/nosotros"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Nosotros
              </a>

              <a
                href="/contacto"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Contacto
              </a>

              <a
                href="/privacidad"
                className="transition-colors hover:text-[var(--natt-pink)]"
              >
                Política de privacidad
              </a>

            </nav>

          </div>

          {/* Redes sociales */}
          <div>

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--natt-brown)]">
              Síguenos
            </h2>

            <p className="mt-4 text-xs leading-5 text-[var(--natt-brown)]/65">
              Encuentra novedades, promociones y nuevos productos en nuestras
              redes.
            </p>

            <div className="mt-5 flex items-center gap-3">

              {socialLinks.map((social) => {
                const styles = getSocialStyles(social.type);

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    title={social.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${styles.background} ${styles.color} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-md ${styles.hover}`}
                  >
                    <SocialIcon type={social.type} />
                  </a>
                );
              })}

            </div>

          </div>

        </div>

        {/* Parte inferior */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--natt-brown)]/10 pt-5 text-[10px] text-[var(--natt-brown)]/45 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} Natt Store. Todos los derechos
            reservados.
          </p>

          <p>
            Sitio web oficial de Natt Store
          </p>

        </div>

      </div>

    </footer>
  );
}