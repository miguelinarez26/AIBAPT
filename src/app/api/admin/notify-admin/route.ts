import { NextResponse } from 'next/server';

/**
 * API para notificar al administrador sobre nuevas solicitudes o contactos.
 * Por ahora actúa como un log centralizado, pero puede integrarse con 
 * servicios de Email (Resend/SendGrid) o WhatsApp en el futuro.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicationId, userName, accreditationName, message, email } = body;

    // Log administrativo (se verá en los logs del servidor/Vercel)
    console.log(`[NOTIFICACIÓN ADMIN]`);
    console.log(`- Tipo: ${accreditationName}`);
    console.log(`- Usuario: ${userName} (${email})`);
    console.log(`- Ref: ${applicationId}`);
    if (message) console.log(`- Mensaje: ${message}`);

    // TODO: Integrar con Resend aquí si se desea envío de correo real
    
    return NextResponse.json({ success: true, message: 'Notificación registrada' });
  } catch (error) {
    console.error('Error en notify-admin:', error);
    // Devolvemos 200 aunque falle el log para no romper el flujo del usuario
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 200 });
  }
}
