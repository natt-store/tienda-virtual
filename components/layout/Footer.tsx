"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/nattstore.boutique",
    type: "instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@nattstore.boutique",
    type: "tiktok",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/16FTQRMze7d/",
    type: "facebook",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/573104492871",
    type: "whatsapp",
  },
  {
    name: "Correo electrónico",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=nattstore.boutique@gmail.com",
    type: "email",
  },
];

const storeLinks = [
  { label: "Todos los productos", href: "/tienda", color: "pink" },
  { label: "Maquillaje", href: "/tienda/maquillaje", color: "pink" },
  { label: "Hogar", href: "/tienda/hogar", color: "aqua" },
  {
    label: "Papelería",
    href: "/tienda/papeleria-kawaii",
    color: "purple",
  },
  { label: "Temporada", href: "/tienda/temporada", color: "pink" },
];

const infoLinks = [
  { label: "Inicio", href: "/", color: "pink" },
  { label: "Novedades", href: "/novedades", color: "aqua" },
  { label: "Nosotros", href: "/nosotros", color: "purple" },
  { label: "Contacto", href: "/contacto", color: "pink" },
  { label: "Mi cuenta", href: "/cuenta", color: "aqua" },
];

const legalLinks = [
  {
    label: "Política de privacidad",
    href: "/politica-de-privacidad",
    color: "pink",
  },
  {
    label: "Términos y condiciones",
    href: "/terminos-y-condiciones",
    color: "aqua",
  },
  {
    label: "Política de devoluciones",
    href: "/politica-de-devoluciones",
    color: "purple",
  },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.5 3.5c.4 2.2 1.8 3.6 4 3.9v2.6c-1.4.1-2.7-.3-4-1v6.5c0 3.6-2.9 6.5-6.5 6.5S3.5 19.1 3.5 15.5 6.4 9 10 9c.3 0 .7 0 1 .1v2.7c-.3-.1-.7-.2-1-.2-2.1 0-3.8 1.7-3.8 3.9S7.9 19.4 10 19.4s3.8-1.7 3.8-3.9V3.5h2.7Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4V14h2.4v7h3Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  const icons = {
    instagram: <InstagramIcon />,
    tiktok: <TikTokIcon />,
    facebook: <FacebookIcon />,
    whatsapp: <WhatsAppIcon />,
    email: <EmailIcon />,
  };
  return icons[type as keyof typeof icons] ?? <EmailIcon />;
}

function socialStyle(type: string) {
  const styles = {
    instagram: "text-[#E4405F] bg-[#E4405F]/10 hover:bg-[#E4405F]",
    tiktok: "text-[#16131a] bg-[#16131a]/10 hover:bg-[#16131a]",
    facebook: "text-[#1877F2] bg-[#1877F2]/10 hover:bg-[#1877F2]",
    whatsapp: "text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]",
    email: "text-[var(--natt-pink)] bg-[var(--natt-pink)]/10 hover:bg-[var(--natt-pink)]",
  };
  return styles[type as keyof typeof styles] ?? styles.email;
}

function linkColor(color: string) {
  const colors = {
    pink: "hover:text-[var(--natt-pink)]",
    aqua: "hover:text-[var(--natt-aqua)]",
    purple: "hover:text-[var(--natt-purple)]",
    black: "hover:text-[var(--natt-black)]",
  };
  return colors[color as keyof typeof colors] ?? colors.pink;
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; color: string }[];
}) {
  return (
    <div>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--natt-black)]">
        {title}
      </h2>
      <nav className="mt-4 flex flex-col gap-2.5 text-xs text-[var(--natt-black)]/55">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`transition-colors ${linkColor(link.color)}`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function Footer() {
  const router = useRouter();

  const handleSecretAdminAccess = () => {
    router.push("/admin/login");
  };

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[var(--natt-bg)]">
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-[var(--natt-pink)] via-[var(--natt-purple)] to-[var(--natt-aqua)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-9 sm:px-6 sm:py-11 lg:px-8">
        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.9fr_0.9fr] lg:gap-8">
          <div>
            <Image
              src="/brand/logo.png"
              alt="Natt Store"
              width={170}
              height={75}
              className="h-auto w-[160px]"
            />
            <p className="mt-3 max-w-xs text-xs leading-5 text-[var(--natt-black)]/55">
              Productos bonitos, detalles especiales y todo lo que buscas en un solo lugar.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:text-white ${socialStyle(
                    social.type
                  )}`}
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinks title="Tienda" links={storeLinks} />
          <FooterLinks title="Información" links={infoLinks} />
          <FooterLinks title="Legal" links={legalLinks} />

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--natt-black)]">
              Síguenos
            </h2>
            <p className="mt-4 max-w-xs text-xs leading-6 text-[var(--natt-black)]/55">
              Encuentra novedades, promociones y nuevos productos en nuestras redes.
            </p>
            <div className="mt-5 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--natt-pink)] to-[var(--natt-aqua)]" />
          </div>
        </div>

        {/* MOBILE / TABLET */}
        <div className="lg:hidden">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/brand/logo.png"
              alt="Natt Store"
              width={170}
              height={75}
              className="h-auto w-[145px] sm:w-[160px]"
            />
            <p className="mt-3 max-w-sm text-xs leading-5 text-[var(--natt-black)]/55">
              Productos bonitos, detalles especiales y todo lo que buscas en un solo lugar.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:text-white ${socialStyle(
                    social.type
                  )}`}
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
            <FooterLinks title="Tienda" links={storeLinks} />
            <FooterLinks title="Información" links={infoLinks} />
            <FooterLinks title="Legal" links={legalLinks} />
          </div>
        </div>

        {/* Copyright con DOBLE CLIC SECRETO A LA IZQUIERDA */}
        <div className="mt-8 h-px bg-black/10" />

        <div className="flex flex-col items-center gap-2 pt-5 text-center text-[9px] text-[var(--natt-black)]/40 sm:flex-row sm:justify-between">
          <p 
            onDoubleClick={handleSecretAdminAccess} 
            className="select-none cursor-default"
            title=""
          >
            © {new Date().getFullYear()} Natt Store. Todos los derechos reservados.
          </p>

          <p>Sitio web oficial de Natt Store</p>
        </div>
      </div>
    </footer>
  );
}