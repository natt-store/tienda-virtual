export type Product = {
  id: number;
  name: string;
  section: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge?: string;
  href: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Set de brochas esenciales",
    section: "Maquillaje",
    category: "Brochas",
    price: 45900,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    description:
      "Set de brochas pensado para crear looks completos de manera práctica y sencilla.",
    badge: "Más vendido",
    href: "/tienda/producto/1",
  },
  {
    id: 2,
    name: "Paleta de sombras Rosé",
    section: "Maquillaje",
    category: "Ojos",
    price: 58900,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85",
    description:
      "Paleta de sombras con tonos suaves y versátiles para looks de todos los días.",
    badge: "Favorito",
    href: "/tienda/producto/2",
  },
  {
    id: 3,
    name: "Labial rosa natural",
    section: "Maquillaje",
    category: "Labios",
    price: 32900,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85",
    description:
      "Un tono rosa delicado para complementar tus looks con un acabado elegante.",
    badge: "Nuevo",
    href: "/tienda/producto/3",
  },
  {
    id: 4,
    name: "Rubor Soft Pink",
    section: "Maquillaje",
    category: "Rostro",
    price: 37900,
    image:
      "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=85",
    description:
      "Rubor en tono rosado para aportar un acabado fresco y natural al rostro.",
    badge: "Nuevo",
    href: "/tienda/producto/4",
  },
  {
    id: 5,
    name: "Gloss brillo natural",
    section: "Maquillaje",
    category: "Labios",
    price: 28900,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1200&q=85",
    description:
      "Gloss ligero con acabado brillante para darle un toque especial a tus labios.",
    badge: "Favorito",
    href: "/tienda/producto/5",
  },
  {
    id: 6,
    name: "Máscara de pestañas",
    section: "Maquillaje",
    category: "Ojos",
    price: 41900,
    image:
      "https://images.unsplash.com/photo-1631730486572-226d1e3a9c8a?auto=format&fit=crop&w=1200&q=85",
    description:
      "Máscara para destacar la mirada y complementar tus looks de maquillaje.",
    badge: "Más vendido",
    href: "/tienda/producto/6",
  },
  {
    id: 7,
    name: "Base de maquillaje",
    section: "Maquillaje",
    category: "Rostro",
    price: 69900,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
    description:
      "Base de maquillaje para lograr una apariencia uniforme y natural.",
    badge: "Nuevo",
    href: "/tienda/producto/7",
  },
  {
    id: 8,
    name: "Delineador líquido",
    section: "Maquillaje",
    category: "Ojos",
    price: 26900,
    image:
      "https://images.unsplash.com/photo-1590156221820-7f7a2c5f7a39?auto=format&fit=crop&w=1200&q=85",
    description:
      "Delineador práctico para crear líneas definidas y looks de ojos diferentes.",
    badge: "Favorito",
    href: "/tienda/producto/8",
  },
  {
    id: 9,
    name: "Iluminador Glow",
    section: "Maquillaje",
    category: "Rostro",
    price: 44900,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85",
    description:
      "Iluminador para aportar luminosidad y un acabado radiante al rostro.",
    badge: "Nuevo",
    href: "/tienda/producto/9",
  },

  {
    id: 201,
    name: "Set de stickers Kawaii",
    section: "Papelería",
    category: "Stickers",
    price: 15900,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    description:
      "Stickers adorables para decorar cuadernos, agendas y mucho más.",
    badge: "Favorito",
    href: "/tienda/producto/201",
  },
  {
    id: 202,
    name: "Cuaderno Kawaii",
    section: "Papelería",
    category: "Cuadernos",
    price: 28900,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85",
    description:
      "Cuaderno bonito y práctico para tus notas e ideas.",
    badge: "Nuevo",
    href: "/tienda/producto/202",
  },
  {
    id: 203,
    name: "Set de marcadores pastel",
    section: "Papelería",
    category: "Marcadores",
    price: 22900,
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=85",
    description:
      "Marcadores de colores suaves para estudiar y crear.",
    badge: "Más vendido",
    href: "/tienda/producto/203",
  },
  {
    id: 204,
    name: "Agenda Kawaii",
    section: "Papelería",
    category: "Agendas",
    price: 34900,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=85",
    description:
      "Agenda ideal para organizar tus días con mucho estilo.",
    badge: "Nuevo",
    href: "/tienda/producto/204",
  },

  // TEMPORADA · HALLOWEEN

  {
    id: 301,
    name: "Disfraz Fantasma para Perrito",
    section: "Temporada",
    category: "Disfraces",
    price: 49900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,ghost?lock=301",
    description:
      "Disfraz de fantasma para celebrar Halloween junto a tu mascota.",
    badge: "Halloween",
    href: "/tienda/producto/301",
  },
  {
    id: 302,
    name: "Disfraz Vampiro para Perrito",
    section: "Temporada",
    category: "Disfraces",
    price: 55900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,vampire?lock=302",
    description:
      "Un look de vampiro divertido y perfecto para las noches de Halloween.",
    badge: "Favorito",
    href: "/tienda/producto/302",
  },
  {
    id: 303,
    name: "Disfraz Calabaza para Perrito",
    section: "Temporada",
    category: "Disfraces",
    price: 52900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,pumpkin?lock=303",
    description:
      "Disfraz de calabaza para convertir a tu mascota en la estrella de Halloween.",
    badge: "Más vendido",
    href: "/tienda/producto/303",
  },
  {
    id: 304,
    name: "Disfraz Murciélago para Perrito",
    section: "Temporada",
    category: "Disfraces",
    price: 57900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,bat?lock=304",
    description:
      "Disfraz de murciélago con un estilo divertido para tu mascota.",
    badge: "Nuevo",
    href: "/tienda/producto/304",
  },
  {
    id: 305,
    name: "Disfraz Diablito para Perrito",
    section: "Temporada",
    category: "Disfraces",
    price: 51900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,devil?lock=305",
    description:
      "Un disfraz rojo de diablito para darle un toque divertido al look de tu mascota.",
    badge: "Favorito",
    href: "/tienda/producto/305",
  },
  {
    id: 306,
    name: "Disfraz Brujita para Perrita",
    section: "Temporada",
    category: "Mascotas",
    price: 58900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,witch?lock=306",
    description:
      "Disfraz inspirado en una pequeña brujita para celebrar Halloween.",
    badge: "Nuevo",
    href: "/tienda/producto/306",
  },
  {
    id: 307,
    name: "Pañuelo Halloween para Mascota",
    section: "Temporada",
    category: "Accesorios",
    price: 19900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,bandana?lock=307",
    description:
      "Pañuelo temático para darle un toque especial al look de tu mascota.",
    badge: "Favorito",
    href: "/tienda/producto/307",
  },
  {
    id: 308,
    name: "Collar Halloween para Mascota",
    section: "Temporada",
    category: "Accesorios",
    price: 25900,
    image:
      "https://loremflickr.com/1200/1200/dog,halloween,collar?lock=308",
    description:
      "Collar temático para complementar los disfraces y looks de Halloween.",
    badge: "Nuevo",
    href: "/tienda/producto/308",
  },
  {
    id: 309,
    name: "Set Decorativo Halloween",
    section: "Temporada",
    category: "Decoración",
    price: 36900,
    image:
      "https://loremflickr.com/1200/1200/halloween,decoration?lock=309",
    description:
      "Set de decoración para crear un ambiente especial durante Halloween.",
    badge: "Temporada",
    href: "/tienda/producto/309",
  },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}

export function getProductsBySection(section: string) {
  return products.filter(
    (product) => product.section.toLowerCase() === section.toLowerCase()
  );
}

export function getProductsByCategory(category: string) {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}