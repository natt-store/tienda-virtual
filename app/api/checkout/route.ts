import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, total, discount = 0, shipping = 0, buyerEmail, items } = body;

    const privateKey = process.env.WOMPI_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        { error: "Falta WOMPI_PRIVATE_KEY en el archivo .env.local" },
        { status: 500 }
      );
    }

    const isTest = privateKey.startsWith("prv_test_");
    const baseUrl = isTest
      ? "https://sandbox.wompi.co/v1"
      : "https://production.wompi.co/v1";

    // Wompi exige un monto mínimo por transacción (ej: $2.000 COP) para procesar pagos
    const MIN_WOMPI_AMOUNT = 2000;
    const calculatedTotal = Number(total);
    const finalTotal = calculatedTotal < MIN_WOMPI_AMOUNT ? MIN_WOMPI_AMOUNT : calculatedTotal;
    
    const amountInCents = Math.round(finalTotal * 100);

    // Creamos el link de pago oficial en Wompi con el precio correcto ya descontado
    const response = await fetch(`${baseUrl}/payment_links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privateKey}`,
      },
      body: JSON.stringify({
        name: `Pedido ${orderNumber} - Natt Store`,
        description: `Compra en Natt Store (${orderNumber}) - Descuento aplicado`,
        single_use: true,
        collect_shipping: false,
        currency: "COP",
        amount_in_cents: amountInCents,
        sku: orderNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.data?.id) {
      console.error("Error devuelto por Wompi:", data);
      return NextResponse.json(
        {
          error:
            data?.error?.messages
              ? JSON.stringify(data.error.messages)
              : "Wompi rechazó la creación del pago.",
        },
        { status: 400 }
      );
    }

    const checkoutUrl = `https://checkout.wompi.co/l/${data.data.id}`;

    return NextResponse.json({
      url: checkoutUrl,
      linkId: data.data.id,
    });
  } catch (err: any) {
    console.error("Error interno en API checkout:", err);
    return NextResponse.json(
      { error: "Error interno del servidor al conectar con Wompi." },
      { status: 500 }
    );
  }
}