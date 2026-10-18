import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, total, buyerEmail } = body;

    // Llaves reales de Wompi con respaldo directo para Vercel
    const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY || "prv_prod_Tpw5WXVwsqt5IqTUhpgRi6nxLuxGAwlZ";
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_prod_zDQs8r6jYCeOfBCOUI8wLcnPEPRC7fie";

    const amountInCents = Math.round(total * 100);
    const reference = `${orderNumber}-${Date.now()}`;

    // Enlace oficial de la pasarela de pago de Wompi
    const checkoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&redirect-url=https://tienda-virtual-eta-beige.vercel.app/tienda?status=success&order=${orderNumber}`;

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