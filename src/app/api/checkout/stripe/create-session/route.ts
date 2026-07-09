import { NextResponse } from 'next/server';
import { calculateWebinarPrice } from '@/lib/pricing';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { webinarSlug, host } = body;

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

        // 2. Si el precio es 0, no cobramos
        if (pricing.finalPrice === 0) {
            return NextResponse.json({ 
                success: true, 
                url: null, 
                price: 0,
                message: 'Inscripción gratuita procesada con éxito'
            });
        }

        // 3. Crear Checkout Session en Stripe
        // El unit_amount en Stripe es en centavos, así que multiplicamos por 100
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Inscripción: ${pricing.webinarTitle}`,
                        },
                        unit_amount: Math.round(pricing.finalPrice * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Redirecciones al terminar el pago
            success_url: `${host || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/checkout/stripe/success?session_id={CHECKOUT_SESSION_ID}&slug=${webinarSlug}`,
            cancel_url: `${host || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
            metadata: {
                webinarSlug,
                userId: userId || 'guest',
            }
        });
        
        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error("Error creating Stripe session:", error);
        return NextResponse.json({ error: error.message || 'Error interno al crear sesión de Stripe' }, { status: 500 });
    }
}
