import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { applicationId, newStatus, adminNotes, actionType } = await request.json();

    if (!applicationId || !newStatus) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
    }

    // Usar Service Role para operaciones críticas administrativas
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Obtener la solicitud actual para saber el type_id y la metadata
    const { data: appData, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email,
          language_preference,
          member_number
        ),
        accreditation_types (
          id,
          name
        )
      `)
      .eq('id', applicationId)
      .single();

    if (fetchError || !appData) {
      console.error('Error fetching app data:', fetchError);
      return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 });
    }

    // 2. Actualizar el estado y las notas
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
      })
      .eq('id', applicationId);

    if (updateError) {
      throw updateError;
    }

    // Double-check de seguridad: Si es membresía pero el frontend envió GENERAL, forzamos el flujo de membresía
    let finalActionType = actionType;
    if (appData.accreditation_types?.name?.includes('membresia')) {
      finalActionType = 'Membresia';
    }

    // 3. Activación Automática de Membresía e Identificación Única
    if (newStatus === 'approved' && finalActionType === 'Membresia') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 365); // 1 año desde hoy
      
      const metadata = appData.metadata as any;
      const memType = metadata?.escenario || 'pleno_salud_mental';
      const profile = Array.isArray(appData.profiles) ? appData.profiles[0] : appData.profiles;
      const userLang = profile?.language_preference || 'es';

      // Generar el número de socio si no tiene uno
      let memberNumber = profile?.member_number;
      if (!memberNumber) {
        const { data: generatedNumber, error: genError } = await supabaseAdmin
          .rpc('generate_member_number', { 
            p_category: memType, 
            p_language: userLang 
          });
        
        if (!genError) {
          memberNumber = generatedNumber;
        } else {
          console.error('Error generando número de socio:', genError);
        }
      }

      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          is_member: true,
          is_public: true,
          membership_type: memType,
          membership_expiry: expirationDate.toISOString(),
          member_number: memberNumber
        })
        .eq('id', appData.user_id);

      if (profileUpdateError) {
        console.error('Error actualizando perfil para membresía:', profileUpdateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en process-application:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
