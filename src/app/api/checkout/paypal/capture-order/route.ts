import { NextResponse } from 'next/server';
import { captureOrder } from '@/lib/paypal';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderID } = body;

        if (!orderID) {
            return NextResponse.json({ error: 'Falta el orderID' }, { status: 400 });
        }

        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        
        // (Aquí registraríamos la compra en la base de datos si fue exitosa)

        return NextResponse.json(jsonResponse, {
            status: httpStatusCode,
        });

    } catch (error: any) {
        console.error("Error capturing PayPal order:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
