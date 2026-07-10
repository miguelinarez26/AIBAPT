import React from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import { AIBAPT_TRAMITES } from '@/config/aibapt-config';

export default async function CheckoutPage({ 
  params 
}: { 
  params: Promise<{ lang: string; applicationId: string }> 
}) {
  const { lang, applicationId } = await params;
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

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    redirect(`/${lang}/login`);
  }

  const { data: application, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (error || !application) {
    return <div>Error fetching application: {JSON.stringify(error)} | Application ID: {applicationId}</div>;
  }

  // Si ya pagó, no dejarlo pagar de nuevo
  if (application.metadata?.payment_status === 'paid' || application.status === 'under_review' || application.status === 'approved') {
    return <div>Application already processed: status={application.status}, payment_status={application.metadata?.payment_status}</div>;
  }

  const metadata = application.metadata;
  const escenario = metadata.escenario;
  
  const tramite = AIBAPT_TRAMITES["solicitud_membresia"];
  const currentEscenarioObj = tramite.monto.find(m => 
    m.id === escenario || m.subProfiles?.some(sp => sp.id === escenario)
  );

  if (!currentEscenarioObj || currentEscenarioObj.monto === 0) {
    // Si no tiene costo, pasarlo a under_review y mandarlo al dashboard
    await supabase.from('applications').update({ status: 'under_review' }).eq('id', applicationId);
    return <div>Escenario no encontrado o monto 0: {escenario}</div>;
  }

  const amount = currentEscenarioObj.monto;
  const label = currentEscenarioObj.label[(lang || 'es') as 'es' | 'pt'] || currentEscenarioObj.label['es'];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0A0A0A] font-sans pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-text-dark mb-4">
            {lang === 'es' ? 'Finaliza tu afiliación' : 'Finalize sua filiação'}
          </h1>
          <p className="text-lg text-text-light">
            {lang === 'es' 
              ? 'Estás a un solo paso de unirte a la red más grande de psicotraumatología.' 
              : 'Você está a apenas um passo de se juntar à maior rede de psicotraumatologia.'}
          </p>
        </div>

        <CheckoutClient 
          applicationId={applicationId}
          lang={lang as 'es' | 'pt'}
          amount={amount}
          label={label}
        />
      </div>
    </div>
  );
}
