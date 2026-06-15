import Link from "next/link";
import ScrollToTop from "@/components/ScrollToTop";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isPt = lang === "pt";

  const content = {
    title: isPt ? "Termos de Uso" : "Términos de Uso",
    lastUpdated: isPt ? "Última atualização: Junho 2026" : "Última actualización: Junio 2026",
    backBtn: isPt ? "Voltar ao início" : "Volver al inicio",
    intro: isPt 
      ? "Ao desfrutar do conteúdo de nosso site, você aceita que:"
      : "Al disfrutar del contenido de nuestro sitio, usted acepta que:",
    sections: [
      {
        icon: "hourglass_empty",
        title: isPt ? "1. Período de Acesso aos Conteúdos" : "1. Período de Acceso a Contenidos",
        text: isPt
          ? "Seu período de acesso aos produtos deste site de cursos e eventos não é vitalício e depende dos planos de aquisição escolhidos ou disponibilizados. Após a expiração do número de dias dos planos adquiridos, seu acesso aos produtos é automaticamente revogado, obrigando-o a realizar uma nova aquisição se desejar acessar novamente o conteúdo expirado (incluindo a possibilidade de baixar o certificado dos cursos, caso sejam oferecidos);"
          : "Su período de acceso a los productos de este sitio de cursos y eventos no es de por vida y depende de los planes de adquisición elegidos o puestos a disposición. Después de que expire el número de días de los planes adquiridos, su acceso a los productos es automáticamente revocado, obligándolo a realizar una nueva adquisición si desea volver a acceder al contenido caducado (incluyendo la posibilidad de descargar el certificado de los cursos, si ofrecen);"
      },
      {
        icon: "videocam",
        title: isPt ? "2. Direitos de Imagem e Áudio" : "2. Derechos de Imagen y Audio",
        text: isPt
          ? "Ao participar de eventos ao vivo online, você concede automaticamente o direito de uso da imagem se decidir abrir sua câmera e/ou seu microfone, sabendo que a maior parte de nossos eventos ao vivo online é posteriormente transformada em cursos gravados para venda on demand;"
          : "Al participar en eventos en vivo online, usted otorga automáticamente el derecho de uso de la imagen si decide abrir su cámara y/o su micrófono, sabiendo que la mayor parte de nuestros eventos en vivo online se transforma posteriormente en cursos grabados para la venta on demand;"
      },
      {
        icon: "verified_user",
        title: isPt ? "3. Aceitação de Políticas" : "3. Aceptación de Políticas",
        text: isPt
          ? "Aceita automaticamente nossa política de privacidade e nossa política de cookies."
          : "Automáticamente acepta nuestra política de privacidad y nuestra política de cookies."
      }
    ]
  };

  return (
    <main className="pt-8 md:pt-12 min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      <ScrollToTop />
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pb-24 relative z-10">
        
        {/* Header Back Button */}
        <div className="mb-8">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-text-dark dark:text-gray-400 hover:text-primary transition-all group"
          >
            <span className="material-icons-round text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
            {content.backBtn}
          </Link>
        </div>

        {/* Title Block */}
        <div className="mb-12">
          <span className="bg-primary/10 text-primary text-xs uppercase tracking-wider font-bold px-4 py-1.5 rounded-full inline-block mb-3">
            AIBAPT Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-text-light dark:text-white leading-[1.1] mb-3">
            {content.title}
          </h1>
          <p className="text-xs text-text-dark dark:text-gray-400 italic">
            {content.lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <div className="p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-12 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <span className="material-icons-round text-lg">gavel</span>
          </div>
          <p className="text-sm md:text-base text-text-light dark:text-gray-200 leading-relaxed font-normal">
            {content.intro}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {content.sections.map((sec, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[32px] border border-secondary/20 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-xl">{sec.icon}</span>
                </div>
                <h2 className="text-lg md:text-xl font-serif font-bold text-text-light dark:text-white">
                  {sec.title}
                </h2>
              </div>
              <div className="text-sm text-text-dark dark:text-gray-300 leading-relaxed font-light pl-0 md:pl-13">
                {i === 2 ? (
                  isPt ? (
                    <span>
                      Aceita automaticamente nossa{" "}
                      <Link href={`/${lang}/privacy`} className="text-primary dark:text-secondary hover:underline font-medium">
                        política de privacidade
                      </Link>{" "}
                      e nossa política de cookies.
                    </span>
                  ) : (
                    <span>
                      Automáticamente acepta nuestra{" "}
                      <Link href={`/${lang}/privacy`} className="text-primary dark:text-secondary hover:underline font-medium">
                        política de privacidad
                      </Link>{" "}
                      y nuestra política de cookies.
                    </span>
                  )
                ) : (
                  sec.text
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
