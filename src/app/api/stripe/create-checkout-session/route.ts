import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AIBAPT_TRAMITES } from '@/config/aibapt-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Cast to any to avoid version mismatch errors
});

export async function POST(req: Request) {
  try {
    const { applicationId, lang } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch the application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Determine the amount based on the escenario
    const metadata = application.metadata;
    const escenario = metadata.escenario;
    
    // Find the current escenario in the config
    const tramite = AIBAPT_TRAMITES["solicitud_membresia"];
    const currentEscenarioObj = tramite.monto.find(m => 
      m.id === escenario || m.subProfiles?.some(sp => sp.id === escenario)
    );

    if (!currentEscenarioObj) {
      return NextResponse.json({ error: 'Escenario no encontrado' }, { status: 400 });
    }

    const amountInCents = currentEscenarioObj.monto * 100;

    if (amountInCents === 0) {
      return NextResponse.json({ error: 'Monto es 0, no requiere pago' }, { status: 400 });
    }

    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur', // Assuming EUR for AIBAPT
            product_data: {
              name: `Membresía AIBAPT - ${currentEscenarioObj.label[(lang || 'es') as 'es' | 'pt'] || currentEscenarioObj.label['es']}`,
              description: 'Pago de solicitud de membresía',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/${lang || 'es'}/checkout/${applicationId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${lang || 'es'}/checkout/${applicationId}`,
      client_reference_id: applicationId,
      metadata: {
        applicationId: applicationId,
        type: 'solicitud_membresia'
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Error creating stripe session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
