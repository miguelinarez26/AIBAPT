import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/paypal';
import { calculateWebinarPrice } from '@/lib/pricing';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { webinarSlug } = body;

        if (!webinarSlug) {
            return NextResponse.json({ error: 'Falta el webinarSlug' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        );

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;

        // 1. Calcular precio basado 100% en el servidor y la DB
        const pricing = await calculateWebinarPrice(userId, webinarSlug);

        // 2. Si el precio es 0, no creamos orden, simplemente devolvemos éxito para acceso directo
        if (pricing.finalPrice === 0) {
            // (Aquí registraríamos la compra gratis en la DB en un sistema real)
            return NextResponse.json({ 
                success: true, 
                orderID: null, 
                price: 0,
                message: 'Inscripción gratuita procesada con éxito'
            });
        }

        // 3. Crear orden en PayPal por el precio calculado
        const description = `Inscripción: ${pricing.webinarTitle}`;
        const { jsonResponse, httpStatusCode } = await createOrder(pricing.finalPrice, description);
        
        return NextResponse.json(jsonResponse, {
            status: httpStatusCode,
        });

    } catch (error: any) {
        console.error("Error creating PayPal order:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
