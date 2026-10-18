import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, total, discount, shipping, buyerEmail, items } = body;

    // Llave privada de Wompi con respaldo directo para Vercel
    const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY || "prv_prod_Tpw5WXVwsqt5IqTUhpgRi6nxLuxGAwlZ";

    if (!wompiPrivateKey) {
      return NextResponse.json(
        { error: "Falta WOMPI_PRIVATE_KEY en el archivo .env.local" },
        { status: 500 }
      );
    }

    const amountInCents = Math.round(total * 100);
    const reference = `${orderNumber}-${Date.now()}`;
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_prod_tu_llave_publica_real_aqui";

    // Llamada a la API de Wompi para crear el enlace de pago o la transacción
    const wompiResponse = await fetch("https://production.wompi.co/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${wompiPrivateKey}`,
      },
      body: JSON.stringify({
        amount_in_cents: amountInCents,
        currency: "COP",
        customer_email: buyerEmail,
        reference: reference,
        redirect_url: `https://tienda-virtual-eta-beige.vercel.app/tienda?status=success&order=${orderNumber}`,
        payment_source: {
          // Configuración base de Wompi Checkout
        }
      }),
    });

    // Como Wompi genera un enlace de pago o widget, aseguramos devolver la URL oficial o una pasarela integrada
    // Si tu código usa un widget o enlace de checkout de Wompi, adaptamos la respuesta:
    const wompiData = await wompiResponse.json();

    // Si prefieres usar la URL de pago directa de Wompi o el widget personalizado:
    // Generamos la URL de pago de Wompi con los datos correspondientes
    const checkoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}`;

    return NextResponse.json({
      url: checkoutUrl,
      reference: reference,
    });

  } catch (err: any) {
    console.error("Error en API de Wompi:", err);
    return NextResponse.json(
      { error: err.message || "Error al conectar con Wompi" },
      { status: 500 }
    );
  }
}