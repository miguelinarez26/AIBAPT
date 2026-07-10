import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { applicationId, orderId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Using service role to securely update
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch first to preserve metadata
    const { data: application } = await supabase
      .from('applications')
      .select('metadata')
      .eq('id', applicationId)
      .single();

    if (application) {
      const newMetadata = { ...application.metadata, payment_status: 'paid', paypal_order_id: orderId, paid_at: new Date().toISOString() };
      await supabase
        .from('applications')
        .update({ 
          status: 'under_review',
          metadata: newMetadata
        })
        .eq('id', applicationId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating application via paypal:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
