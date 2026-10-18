"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TerminosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--natt-bg)] text-[var(--natt-black)]">
      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f5eee7] px-7 py-10 shadow-[0_25px_70px_rgba(85,65,55,0.15)] sm:px-10 lg:py-12">
          <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-[#a83cff]/15 blur-3xl" />
          <div className="absolute -right-20 bottom-[-40px] h-56 w-56 rounded-full bg-[#00d9d9]/15 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-[#a83cff]/25 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a83cff] backdrop-blur-md">
              Legal
            </span>

            <h1 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Términos y
              <br />
              <span className="text-[#a83cff]">condiciones.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#675b55] sm:text-base">
              Estas son las reglas de uso de la tienda Natt Store. Al comprar
              aquí, aceptas estos términos.
            </p>

            <p className="mt-4 text-[11px] text-[#817079]">
              Última actualización: {new Date().toLocaleDateString("es-CO")}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-5xl space-y-4">
          <Bloque titulo="1. Sobre Natt Store">
            <p>
              Natt Store es una boutique online que ofrece productos de
              maquillaje, cuidado personal, hogar y accesorios. Al navegar y
              comprar en el sitio, aceptas estos términos y condiciones.
            </p>
          </Bloque>

          <Bloque titulo="2. Productos y precios">
            <p>
              Trabajamos para mostrar los productos de la forma más fiel
              posible. Los precios están expresados en pesos colombianos (COP)
              e incluyen los impuestos aplicables.
            </p>
          </Bloque>

          <Bloque titulo="3. Compras y pedidos">
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Puedes comprar de forma rápida o registrando tu cuenta.</li>
              <li>El pedido se procesa y registra una vez completas el formulario de envío.</li>
              <li>Los pagos se completan de manera segura a través de nuestra pasarela oficial Wompi.</li>
            </ul>
          </Bloque>

          <Bloque titulo="4. Pagos">
            <p>
              Los pagos se procesan de forma cifrada a través de <b>Wompi</b> (tarjetas de crédito, PSE, Nequi y DaviPlata). Natt Store no almacena tus datos financieros.
            </p>
          </Bloque>

          <Bloque titulo="5. Envíos">
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Hacemos envíos a todo el territorio colombiano.</li>
              <li>
                El envío es <b>gratis</b> en compras iguales o superiores a $150.000 COP.
              </li>
              <li>
                Para compras inferiores, el costo del envío se calcula de forma dinámica según tu ciudad y departamento al momento del checkout.
              </li>
            </ul>
          </Bloque>

          <Bloque titulo="6. Cambios y devoluciones">
            <p>
              Si tu pedido llega con novedades o daños, escríbenos dentro de los
              5 días siguientes a la entrega para revisar tu caso con gusto.
            </p>
          </Bloque>

          <Bloque titulo="7. Promociones y cupones">
            <p>
              Los cupones de descuento y beneficios de registro están sujetos a
              condiciones de uso, montos mínimos y vigencia especificados en la tienda.
            </p>
          </Bloque>

          <Bloque titulo="8. Propiedad intelectual">
            <p>
              El diseño, logotipos, textos e imágenes de Natt Store son de uso
              exclusivo de la marca y están protegidos por las leyes de propiedad intelectual.
            </p>
          </Bloque>

          <Bloque titulo="9. Contacto">
            <p>
              Si tienes dudas sobre nuestros términos, escríbenos desde la
              página de contacto.
            </p>
            <Link
              href="/contacto"
              className="mt-4 inline-flex rounded-full bg-[#ff1493] px-6 py-3 text-sm font-black text-white shadow-[0_10px_28px_rgba(255,20,147,0.25)] transition hover:-translate-y-0.5"
            >
              Ir a contacto
            </Link>
          </Bloque>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 p-6 shadow-[0_15px_40px_rgba(70,55,45,0.06)] backdrop-blur-sm sm:p-8">
      <h2 className="text-lg font-black sm:text-xl">{titulo}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[#4d4d4d]">
        {children}
      </div>
    </div>
  );
}