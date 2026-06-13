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

    // 1. Obtener la solicitud actual
    const { data: appData, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !appData) {
      console.error('Error fetching app data:', fetchError);
      return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 });
    }

    // 2. Obtener el perfil del usuario y el tipo de acreditación en paralelo
    const [profileResult, accTypeResult] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, email, language_preference, member_number')
        .eq('id', (appData as any).user_id)
        .single(),
      supabaseAdmin
        .from('accreditation_types')
        .select('id, name')
        .eq('id', (appData as any).type_id)
        .single(),
    ]);

    // Combinar en un solo objeto para mantener compatibilidad con el resto del código
    (appData as any).profiles = profileResult.data || null;
    (appData as any).accreditation_types = accTypeResult.data || null;

    // 2. Actualizar el estado y las notas
    const { error: updateError } = await (supabaseAdmin.from('applications') as any)
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
      })
      .eq('id', applicationId);

    if (updateError) {
      throw updateError;
    }

    // Double-check de seguridad: Si es membresía o trámite EMDR, forzamos el flujo de membresía
    let finalActionType = actionType;
    const accType = (appData as any).accreditation_types?.name || '';
    if (accType.includes('membresia') || accType === 'EMDR_Psicoterapeuta' || accType === 'EMDR_Supervisor') {
      finalActionType = 'Membresia';
    }

    // 3. Activación Automática de Membresía e Identificación Única
    if (newStatus === 'approved' && finalActionType === 'Membresia') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 365); // 1 año desde hoy
      
      const metadata = (appData as any).metadata as any;
      const memType = metadata?.escenario || 'pleno_salud_mental';
      const profile = Array.isArray((appData as any).profiles) ? (appData as any).profiles[0] : (appData as any).profiles;
      const userLang = profile?.language_preference || 'es';

      // Generar el número de socio si no tiene uno o si cambió de nivel/categoría
      let memberNumber = profile?.member_number;
      let shouldGenerateNewNumber = !memberNumber;

      if (memberNumber) {
        const currentPrefix = memberNumber.split('.')[0];
        let expectedPrefix = '999';
        
        if (['pleno_salud_mental'].includes(memType)) expectedPrefix = '201';
        else if (['pleno_agente_social'].includes(memType)) expectedPrefix = '202';
        else if (['institucional'].includes(memType)) expectedPrefix = '700';
        else if (['simpatizante'].includes(memType)) expectedPrefix = '800';
        else if (['bienhechor'].includes(memType)) expectedPrefix = '500';
        else if (['certificado', 'psico_cert_default', 'psico_senior_default', 'psico_master_default', 'renovacion_psicoterapeuta', 'equivalencia_psicoterapeuta', 'EMDR_Psicoterapeuta'].includes(memType)) expectedPrefix = '301';
        else if (['emdr_basico_default'].includes(memType)) expectedPrefix = '302';
        else if (['supervisor', 'sup_cert_default', 'sup_senior_default', 'renovacion_supervisor', 'equivalencia_supervisor', 'EMDR_Supervisor'].includes(memType)) expectedPrefix = '401';

        if (currentPrefix !== expectedPrefix) {
          shouldGenerateNewNumber = true;
        }
      }

      if (shouldGenerateNewNumber) {
        const { data: generatedNumber, error: genError } = await (supabaseAdmin.rpc as any)('generate_member_number', { 
            p_category: memType, 
            p_language: userLang 
          });
        
        if (!genError) {
          memberNumber = generatedNumber;
        } else {
          console.error('Error generando número de socio:', genError);
        }
      }

      const { error: profileUpdateError } = await (supabaseAdmin.from('profiles') as any)
        .update({
          is_member: true,
          is_public: true,
          membership_type: memType,
          membership_expiry: expirationDate.toISOString(),
          member_number: memberNumber
        })
        .eq('id', (appData as any).user_id);

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
