import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

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
    // 3. Activación Automática de Membresía e Identificación Única
    if (newStatus === 'approved') {
      const metadata = (appData as any).metadata as any || {};
      
      // CASO A: Acreditación CCA (Emisión de créditos)
      if (accType.includes('Emision_CCA') || accType.includes('acreditacion_cca') || (appData as any).accreditation_types?.name === 'Emision_CCA') {
        const creditsAmount = Number(metadata.credits || 12);
        const courseId = metadata.course_id || null;
        const courseTitle = metadata.course_title || 'Curso Acreditado';
        
        // Deducir categoría basado en el título del curso
        const category = courseTitle.toUpperCase().includes('EMDR') ? 'EMDR' : 'Psicotrauma';
        
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 2); // Válido por 2 años desde hoy
        
        const { error: creditInsertError } = await (supabaseAdmin.from('user_credits') as any)
          .insert({
            user_id: (appData as any).user_id,
            application_id: applicationId,
            course_id: courseId,
            amount: creditsAmount,
            category: category as 'EMDR' | 'Psicotrauma',
            expiry_date: expiryDate.toISOString().split('T')[0]
          });
          
        if (creditInsertError) {
          console.error('❌ Error al insertar créditos en user_credits:', creditInsertError);
        }
      }

      // CASO B: Renovación o Mantenimiento (+2 años en membresía)
      const isRenovacion = accType.toLowerCase().includes('renovacion') || 
                           accType.toLowerCase().includes('mantenimiento') || 
                           metadata.nivel_solicitado?.toLowerCase().includes('renovacion') ||
                           metadata.nivel_solicitado?.toLowerCase().includes('mantenimiento');
                           
      if (isRenovacion) {
        const newExpiry = new Date();
        newExpiry.setFullYear(newExpiry.getFullYear() + 2); // +2 Años desde hoy
        
        const { error: profileRenewError } = await (supabaseAdmin.from('profiles') as any)
          .update({
            membership_expiry: newExpiry.toISOString(),
            is_member: true
          })
          .eq('id', (appData as any).user_id);
          
        if (profileRenewError) {
          console.error('❌ Error al renovar membresía en perfil:', profileRenewError);
        }
      }

      // CASO C: Flujo estándar de membresía inicial (1 año desde hoy)
      if (finalActionType === 'Membresia' && !isRenovacion) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 365); // 1 año desde hoy
        
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
    } else if (newStatus === 'rejected') {
      if (finalActionType === 'Membresia') {
        const { error: profileRevertError } = await (supabaseAdmin.from('profiles') as any)
          .update({
            is_member: false,
          })
          .eq('id', (appData as any).user_id);
          
        if (profileRevertError) {
          console.error('Error al revertir membresía en perfil:', profileRevertError);
        }
      }
    }

    // 4. Enviar notificación por correo electrónico al usuario
    if (newStatus === 'approved' || newStatus === 'rejected') {
      const profile = Array.isArray((appData as any).profiles) ? (appData as any).profiles[0] : (appData as any).profiles;
      const userEmail = profile?.email;
      const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
      const userLang = profile?.language_preference || 'es';
      const accType = (appData as any).accreditation_types?.name || 'Trámite';
      
      // Construir la URL del Dashboard
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aibapt.org';
      const dashboardUrl = `${baseUrl}/${userLang}/dashboard`;

      // Textos localizados
      const subject = userLang === 'pt' 
          ? `Atualização da sua solicitação na AIBAPT` 
          : `Actualización de su solicitud en AIBAPT`;
      
      const statusText = newStatus === 'approved' 
          ? (userLang === 'pt' ? 'Aprovada' : 'Aprobada')
          : (userLang === 'pt' ? 'Rejeitada' : 'Rechazada');

      const message = newStatus === 'approved'
          ? (userLang === 'pt' 
              ? 'Temos o prazer de informar que a sua solicitação foi aprovada.' 
              : 'Nos complace informarle que su solicitud ha sido aprobada.')
          : (userLang === 'pt' 
              ? 'Lamentamos informar que a sua solicitação foi rejeitada.' 
              : 'Lamentamos informarle que su solicitud ha sido rechazada.');

      const greeting = userLang === 'pt' ? 'Olá' : 'Hola';
      const statusPrefix = userLang === 'pt' ? 'O status do seu trâmite' : 'El estado de su trámite';
      const changedTo = userLang === 'pt' ? 'mudou para:' : 'ha cambiado a:';
      const notesTitle = userLang === 'pt' ? 'Notas do Administrador:' : 'Notas del Administrador:';
      const checkDetails = userLang === 'pt' 
          ? 'Você pode revisar os detalhes completos e suas notas a partir do seu painel de controle:' 
          : 'Puede revisar los detalles completos y sus notas desde su panel de control:';
      const buttonText = userLang === 'pt' ? 'Ir para o Painel (Dashboard)' : 'Ir al Panel (Dashboard)';
      const sincerely = userLang === 'pt' ? 'Atenciosamente' : 'Atentamente';
      const team = userLang === 'pt' ? 'A equipe da AIBAPT' : 'El equipo de AIBAPT';

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #1a365d;">${subject}</h2>
          <p>${greeting} <b>${userName || 'Usuario'}</b>,</p>
          <p>${statusPrefix} (<b>${accType}</b>) ${changedTo} <strong style="color: ${newStatus === 'approved' ? '#16a34a' : '#dc2626'};">${statusText}</strong></p>
          <p>${message}</p>
          ${adminNotes ? `<div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4b5563; margin: 20px 0; border-radius: 4px;"><p style="margin: 0; color: #374151;"><b>${notesTitle}</b><br/>${adminNotes}</p></div>` : ''}
          <br/>
          <p>${checkDetails}</p>
          <p><a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">${buttonText}</a></p>
          <br/>
          <p>${sincerely},<br/>${team}</p>
        </div>
      `;

      if (userEmail && process.env.RESEND_API_KEY) {
          try {
              await resend.emails.send({
                  from: 'AIBAPT Portal <onboarding@resend.dev>',
                  to: userEmail,
                  subject: subject,
                  html: html,
              });
          } catch (emailError) {
              console.error('Error enviando correo al usuario:', emailError);
          }
      } else if (userEmail) {
          console.log('====================================');
          console.log(`[SIMULACIÓN DE CORREO AL USUARIO] Enviando a: ${userEmail}`);
          console.log(`Asunto: ${subject}`);
          console.log(`Contenido HTML generado correctamente.`);
          console.log('====================================');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en process-application:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
