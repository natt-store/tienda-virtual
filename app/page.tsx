import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--natt-cream)] text-[var(--natt-dark)]">

      {/* Barra superior */}
      <div className="bg-[var(--natt-pink)] px-4 py-2 text-center text-xs font-medium text-white">
        Envíos a todo el país · Compra segura · Todo lo que amas, en un solo lugar
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Banner principal */}
      <Hero />

      {/* Beneficios */}
      <Benefits />

      {/* Categorías */}
      <Categories />

      {/* Productos destacados */}
      <FeaturedProducts />

      {/* Footer */}
      <Footer />

    </main>
  );
}