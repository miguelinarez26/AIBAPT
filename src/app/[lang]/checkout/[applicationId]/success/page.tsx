import React from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function CheckoutSuccessPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: string; applicationId: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang, applicationId } = await params;
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect(`/${lang}/dashboard`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role to safely update status
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { data: application } = await supabase
        .from('applications')
        .select('metadata')
        .eq('id', applicationId)
        .single();

      if (application) {
        const newMetadata = { 
          ...application.metadata, 
          payment_status: 'paid',
          stripe_session_id: sessionId, 
          paid_at: new Date().toISOString() 
        };
        
        await supabase
          .from('applications')
          .update({ 
            status: 'under_review',
            metadata: newMetadata
          })
          .eq('id', applicationId);
      }
    } else {
      // Payment didn't actually succeed
      redirect(`/${lang}/checkout/${applicationId}`);
    }
  } catch (error) {
    console.error("Error retrieving Stripe session", error);
    redirect(`/${lang}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto p-8 bg-white dark:bg-dark-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-serif text-text-dark mb-4">
          {lang === 'es' ? '¡Pago Exitoso!' : 'Pagamento Efetuado!'}
        </h2>
        <p className="text-lg text-text-light mb-8">
          {lang === 'es' 
            ? 'Tu pago ha sido procesado correctamente y tu solicitud ya se encuentra en proceso de revisión.' 
            : 'Seu pagamento foi processado com sucesso e sua solicitação já está em processo de revisão.'}
        </p>
        <Link
          href={`/${lang}/dashboard`}
          className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-colors"
        >
          {lang === 'es' ? 'Ir al Dashboard' : 'Ir para o Dashboard'}
        </Link>
      </div>
    </div>
  );
}
