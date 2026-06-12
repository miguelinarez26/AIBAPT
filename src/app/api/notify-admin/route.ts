import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { tipo, userName, archivos } = await request.json();

    if (!tipo || !archivos) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Generar enlaces públicos para que el administrador pueda descargar los archivos fácilmente
    const archivoLinks = Object.entries(archivos)
      .map(([key, path]) => `<li><b>${key}:</b> <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/solicitudes-archivos/${path}">${path}</a></li>`)
      .join('');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aibapt.org';

    // Si no hay API key configurada, simplemente logueamos en consola para desarrollo
    if (!process.env.RESEND_API_KEY) {
      console.log('====================================');
      console.log(`[SIMULACIÓN DE CORREO] Enviando a: ${adminEmail}`);
      console.log(`Asunto: Nueva solicitud de acreditación (${tipo})`);
      console.log(`Usuario: ${userName}`);
      console.log(`Archivos:\n${Object.entries(archivos).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`);
      console.log('====================================');
      return NextResponse.json({ success: true, mocked: true });
    }

    const data = await resend.emails.send({
      from: 'AIBAPT Portal <onboarding@resend.dev>',
      to: adminEmail,
      subject: `Nueva solicitud de acreditación (${tipo})`,
      html: `
        <h2>Nueva solicitud de acreditación de ${tipo}</h2>
        <p><b>Usuario:</b> ${userName || 'Usuario'}</p>
        <p><b>Tipo de Trámite:</b> ${tipo}</p>
        <br/>
        <h3>Documentos Subidos a Supabase:</h3>
        <ul>
          ${archivoLinks}
        </ul>
        <br/>
        <p>Por favor revise el panel de Supabase para más detalles o utilice los enlaces de arriba para descargar los archivos directamente.</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error enviando notificación:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
