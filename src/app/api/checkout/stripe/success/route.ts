import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    const slug = searchParams.get('slug');

    if (!session_id) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            // Aquí en un sistema real registraríamos la compra en la base de datos
            // usando session.metadata.userId y session.metadata.webinarSlug
            
            // Redirigir al dashboard con éxito
            const dashboardUrl = new URL('/es/dashboard', req.url);
            dashboardUrl.searchParams.set('payment', 'success');
            return NextResponse.redirect(dashboardUrl);
        } else {
            const failUrl = new URL(`/es/formaciones/${slug}/buy`, req.url);
            failUrl.searchParams.set('error', 'payment_failed');
            return NextResponse.redirect(failUrl);
        }
    } catch (error) {
        console.error("Error retrieving Stripe session:", error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}
