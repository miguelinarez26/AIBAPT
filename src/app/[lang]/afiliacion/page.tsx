import AfiliacionPortalClient from './AfiliacionPortalClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Afiliação | AIBAPT' : 'Afiliación | AIBAPT',
    description: lang === 'pt'
      ? 'Junte-se à AIBAPT como Membro Pleno, Institucional ou Benfeitor. Conheça os requisitos e inicie sua afiliação.'
      : 'Únete a AIBAPT como Miembro Pleno, Institucional o Bienhechor. Conoce los requisitos e inicia tu afiliación.',
  };
}

export default async function AfiliacionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  // ✅ ACCESO PÚBLICO — No hay redirect a /registro.
  // El portal muestra las tarjetas de membresía a cualquier visitante.
  // La autenticación se solicita solo cuando el usuario intenta avanzar al Paso 2 (documentos).

  return (
    <main className="min-h-screen pt-24">
      {/* Portal Interactivo — Selector de Categorías + Stepper */}
      <AfiliacionPortalClient lang={validLang as 'es' | 'pt'} />
    </main>
  );
}
