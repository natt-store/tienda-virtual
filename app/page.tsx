import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import RecommendedProducts from "@/components/home/RecommendedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <div className="border-b border-[var(--natt-pink)]/10 bg-[var(--natt-black)] px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white">
        Envíos a todo el país · Compra segura · Todo lo que amas, en un solo lugar
      </div>

      <Navbar />

      <Hero />

      <Benefits />

      <FeaturedProducts />

      <RecommendedProducts />

      <Footer />
    </main>
  );
}