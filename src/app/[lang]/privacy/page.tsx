import Link from "next/link";
import ScrollToTop from "@/components/ScrollToTop";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isPt = lang === "pt";

  const content = {
    title: isPt ? "Política de Privacidade" : "Política de Privacidad",
    lastUpdated: isPt ? "Última atualização: Junho 2026" : "Última actualización: Junio 2026",
    backBtn: isPt ? "Voltar ao início" : "Volver al inicio",
    tocTitle: isPt ? "Índice do Conteúdo" : "Índice del Contenido",
    sections: [
      {
        id: "intro",
        label: isPt ? "Introdução" : "Introducción",
        title: isPt ? "POLÍTICA DE PRIVACIDADE" : "POLÍTICA DE PRIVACIDAD",
        icon: "gavel",
        text: isPt ? (
          <p>
            Nós entendemos que a privacidade e a segurança de seus dados pessoais são extremamente importantes. Esta política define o que nós fazemos com suas informações e o que nós fazemos para mantê-las seguras. Também explicamos onde e como nós coletamos suas informações pessoais, assim como explanamos seus direitos sobre qualquer informação pessoal que nós armazenamos. Esta política, por fim, explana seus direitos à privacidade e como a lei pode te proteger. Não deixe também de acessar nossa{" "}
            <Link href={`/${lang}/privacy#cookies`} className="text-primary dark:text-secondary hover:underline font-medium">
              Política de Cookies
            </Link>{" "}
            para obter detalhes adicionais sobre a coleta e o uso de informações neste site.
          </p>
        ) : (
          <p>
            Entendemos que la privacidad y la seguridad de sus datos personales son extremadamente importantes. Esta política define lo que hacemos con su información y lo que hacemos para mantenerla segura. También explicamos dónde y cómo recopilamos su información personal, así como sus derechos sobre cualquier información personal que almacenamos. Esta política, por último, explica tus derechos a la privacidad y cómo la ley puede protegerte. No deje de acceder también a nuestra{" "}
            <Link href={`/${lang}/privacy#cookies`} className="text-primary dark:text-secondary hover:underline font-medium">
              Política de Cookies
            </Link>{" "}
            para obtener detalles adicionales sobre la recopilación y el uso de información en este sitio.
          </p>
        )
      },
      {
        id: "collect",
        label: isPt ? "Dados Coletados" : "Datos Recopilados",
        title: isPt ? "Quais dados a AIBAPT coleta sobre você?" : "¿Qué datos recopila AIBAPT sobre usted?",
        icon: "badge",
        text: isPt ? (
          <div className="space-y-4">
            <p>Dados pessoais são qualquer informação capaz de identificar um indivíduo. Não inclui dados anônimos. Podemos coletar e processar seus dados pessoais de diferentes maneiras:</p>
            <ul className="space-y-3 pl-1">
              {[
                { label: "Dados de comunicação", desc: "que incluem qualquer comunicação que você nos envie, seja por meio do formulário de contato em nosso site, por e-mail, texto, mensagens de mídia social, postagem em mídia social ou qualquer outra comunicação que você nos envie;" },
                { label: "Dados de cliente", desc: "que incluem dados relacionados a quaisquer compras de bens e/ou serviços, como seu nome, cargo, endereço de cobrança, endereço de entrega, endereço de e-mail, número de telefone, detalhes de contato, detalhes de compra e detalhes do seu cartão;" },
                { label: "Dados de usuário", desc: "que incluem dados sobre como você usa nosso site e quaisquer serviços online, juntamente com quaisquer dados que você publica para publicação em nosso site ou por meio de outros serviços online. Isso pode incluir produto, conteúdo, arquivos, cursos, questionários, pesquisas ou qualquer outro conteúdo que você enviar ou criar no site;" },
                { label: "Dados técnicos", desc: "que incluem dados sobre o uso do nosso site e de serviços online, como seu endereço IP, seus dados de login, detalhes sobre seu navegador, duração da visita às páginas em nosso site, visualizações de página e caminhos de navegação, detalhes sobre o número de vezes você usa nosso site, configurações de fuso horário e outras tecnologias nos dispositivos que você usa para acessar nosso site. A fonte desses dados é do nosso sistema de rastreamento de análise;" },
                { label: "Dados de marketing", desc: "que incluem dados sobre suas preferências em receber marketing nosso e de nossos terceiros e suas preferências de comunicação." }
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span><strong>{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-text-dark dark:text-gray-400">Podemos usar dados de cliente, dados de usuário, dados técnicos e dados de marketing para fornecer conteúdo e anúncios relevantes do site para você (incluindo anúncios do Facebook ou outros anúncios de exibição) e para medir ou entender a eficácia da publicidade que servimos a você.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Los datos personales son cualquier información capaz de identificar a un individuo. No incluye datos anónimos. Podemos recopilar y procesar sus datos personales de diferentes maneras:</p>
            <ul className="space-y-3 pl-1">
              {[
                { label: "Datos de comunicación", desc: "que incluyen cualquier comunicación que nos envíe, ya sea a través del formulario de contacto en nuestro sitio web, por correo electrónico, texto, mensajes de redes sociales, publicación en redes sociales o cualquier otra comunicación que nos envíe;" },
                { label: "Datos de cliente", desc: "que incluyen datos relacionados con cualquier compra de bienes y/o servicios, como su nombre, cargo, dirección de facturación, dirección de entrega, dirección de correo electrónico, número de teléfono, datos de contacto, detalles de compra y detalles de su tarjeta;" },
                { label: "Datos de usuario", desc: "que incluyen datos sobre cómo utiliza nuestro sitio web y cualquier servicio en línea, junto con los datos que publica para su publicación en nuestro sitio web o a través de otros servicios en línea. Esto puede incluir producto, contenido, archivos, cursos, cuestionarios, encuestas o cualquier otro contenido que usted envíe o cree en el sitio;" },
                { label: "Datos técnicos", desc: "que incluyen datos sobre el uso de nuestro sitio web y de servicios en línea, como su dirección IP, sus datos de inicio de sesión, detalles sobre su navegador, duración de la visita a las páginas de nuestro sitio, vistas de página y rutas de navegación, detalles sobre el número de veces que utiliza nuestro sitio web, ajustes de zona horaria y otras tecnologías en los dispositivos que utiliza para acceder a nuestro sitio web. La fuente de estos datos es de nuestro sistema de seguimiento de análisis;" },
                { label: "Datos de marketing", desc: "que incluyen datos sobre sus preferencias en recibir marketing nuestro y de nuestros terceros y sus preferencias de comunicación." }
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span><strong>{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-text-dark dark:text-gray-400">Podemos usar datos de clientes, datos de usuario, datos técnicos y datos de marketing para proporcionarle contenido y anuncios relevantes del sitio web (incluidos anuncios de Facebook u otros anuncios de exhibición) y para medir o comprender la efectividad de la publicidad que le servimos.</p>
          </div>
        )
      },
      {
        id: "other-info",
        label: isPt ? "Outras Informações" : "Otras Informaciones",
        title: isPt ? "Outras informações coletadas" : "Otra información recopilada",
        icon: "info",
        text: isPt ? (
          <p>
            Podemos coletar dados sobre você enviados por você diretamente para nós (por exemplo, preenchendo formulários em nosso site ou enviando-nos e-mails). Podemos coletar automaticamente certos dados sobre você conforme você usa nosso site usando cookies e tecnologias semelhantes. Consulte nossa política de cookies para obter mais detalhes sobre isso.<br /><br />
            Podemos receber dados de terceiros, como provedores de análise, como o Google, com sede fora da UE, redes de publicidade, como o Facebook, com sede fora da UE, como provedores de informações de pesquisa, como o Google, com sede fora da UE, provedores de serviços técnicos, pagamento, como Stripe e Paypal e serviços de entrega, como corretores ou agregadores de dados.<br /><br />
            Também podemos receber dados de fontes publicamente disponíveis, como o banco de dados de IVA da UE da Comissão Europeia.
          </p>
        ) : (
          <p>
            Podemos recopilar datos sobre usted enviados directamente a nosotros (por ejemplo, rellenando formularios en nuestro sitio web o enviándonos correos electrónicos). Podemos recopilar automáticamente ciertos datos sobre usted mientras utiliza nuestro sitio web utilizando cookies y tecnologías similares. Consulte nuestra política de cookies para obtener más detalles al respecto.<br /><br />
            Podemos recibir datos de terceros, como proveedores de análisis, como Google, con sede fuera de la UE, redes de publicidad, como Facebook, con sede fuera de la UE, como proveedores de información de búsqueda, como Google, con sede fuera de la UE, proveedores de servicios técnicos, pago, como Stripe y Paypal y servicios de entrega, como corredores o agregadores de datos.<br /><br />
            También podemos recibir datos de fuentes públicamente disponibles, como la base de datos del IVA de la UE de la Comisión Europea.
          </p>
        )
      },
      {
        id: "third-parties",
        label: isPt ? "Fontes de Terceiros" : "Fuentes de Terceros",
        title: isPt ? "Fontes de terceiros ou publicidade de terceiros disponível" : "Fuentes de terceros o publicidad de terceros disponible",
        icon: "dns",
        text: isPt ? (
          <div className="space-y-3">
            <p>Podemos receber dados pessoais sobre você de vários terceiros e fontes públicas, conforme estabelecido abaixo. Quando um serviço de terceiros é ativado, estamos autorizados a conectar e acessar outras informações disponibilizadas para nós de acordo com nosso contrato com o provedor de terceiros. No entanto, não recebemos nem armazenamos senhas para nenhum desses serviços de terceiros ao conectá-los aos serviços. As integrações de terceiros podem incluir:</p>
            <ul className="space-y-2 pl-1">
              {["Zapier.com", "MailChimp.com", "Google.com", "Facebook.com", "Segment.io"].map((item, index) => (
                <li key={index} className="flex gap-2 items-center text-sm font-medium">
                  <span className="material-icons-round text-primary text-xs shrink-0">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-3">
            <p>Podemos recibir datos personales sobre usted de varios terceros y fuentes públicas, como se establece a continuación. Cuando se habilita un servicio de terceros, estamos autorizados a conectar y acceder a otra información disponible para nosotros de acuerdo con nuestro contrato con el proveedor de terceros. Sin embargo, no recibimos ni almacenamos contraseñas para ninguno de estos servicios de terceros al conectarlos a los servicios. Las integraciones de terceros pueden incluir:</p>
            <ul className="space-y-2 pl-1">
              {["Zapier.com", "MailChimp.com", "Google.com", "Facebook.com", "Segment.io"].map((item, index) => (
                <li key={index} className="flex gap-2 items-center text-sm font-medium">
                  <span className="material-icons-round text-primary text-xs shrink-0">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      },
      {
        id: "sensitive-data",
        label: isPt ? "Dados Sensíveis" : "Datos Sensibles",
        title: isPt ? "Dados sensíveis" : "Dados sensibles",
        icon: "visibility_off",
        text: isPt ? (
          <p>
            Não coletamos nenhum dado sensível sobre você, a não ser que você forneça. Dados sensíveis são dados que incluem detalhes sobre sua raça ou etnia, crenças religiosas ou filosóficas, vida sexual, orientação sexual, opiniões políticas, filiação sindical, informações sobre sua saúde e dados genéticos e biométricos. Não coletamos nenhuma informação sobre condenações criminais e ofensas.<br /><br />
            Quando formos obrigados a coletar dados pessoais por lei, ou sob os termos do contrato entre nós, e você não nos fornecer esses dados quando solicitados, talvez não possamos cumprir possíveis contratos. Se você não nos fornecer os dados solicitados, podemos ter que cancelar um produto ou serviço que você encomendou, mas se o fizermos, você será prontamente notificado.
          </p>
        ) : (
          <p>
            No recopilamos ningún dato sensible sobre usted a menos que usted proporcione. Los datos sensibles son datos que incluyen detalles sobre su raza o etnia, creencias religiosas o filosóficas, vida sexual, orientación sexual, opiniones políticas, afiliación sindical, información sobre su salud y datos genéticos y biométricos. No recopilamos ninguna información sobre condenas criminales y delitos.<br /><br />
            Cuando estemos obligados a recopilar datos personales por ley, o bajo los términos del contrato entre nosotros, y usted no nos proporcione esos datos cuando se nos solicite, es posible que no podamos cumplir con posibles contratos. Si no nos proporciona los datos solicitados, es posible que tengamos que cancelar un producto o servicio que haya solicitado, pero si lo hacemos, se le notificará inmediatamente.
          </p>
        )
      },
      {
        id: "how-we-use",
        label: isPt ? "Uso dos Dados" : "Uso de Datos",
        title: isPt ? "Como nós usamos seus dados pessoais?" : "¿Cómo utilizamos sus datos personales?",
        icon: "settings",
        text: isPt ? (
          <div className="space-y-4">
            <p>Só usaremos seus dados pessoais dentro do permitido por lei. Os usos mais comuns de seus dados pessoais são:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Onde precisamos cumprir um ou mais contratos entre nós;",
                "Onde precisamos processar dados de acordo com as instruções do cliente;",
                "Quando for necessário para nossos interesses legítimos (ou de terceiros) e quando seus interesses e direitos fundamentais não se sobreponham a esses interesses;",
                "Onde precisamos cumprir uma obrigação legal ou regulatória."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>Geralmente, não contamos com o consentimento como base legal para processar seus dados pessoais, exceto em relação ao envio de comunicações de marketing para você por e-mail ou mensagem de texto. Você tem o direito de retirar o consentimento para marketing a qualquer momento entrando em contato conosco na página de suporte ou usando as configurações de privacidade em seu perfil.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Solo usaremos sus datos personales dentro de lo permitido por la ley. Los usos más comunes de sus datos personales son:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Donde necesitamos cumplir uno o más contratos entre nosotros;",
                "Dónde necesitamos procesar los datos de acuerdo con las instrucciones del cliente;",
                "Cuando sea necesario para nuestros intereses legítimos (o de terceros) y cuando sus intereses y derechos fundamentales no se superpongan a esos intereses;",
                "Donde tenemos que cumplir con una obligación legal o regulatoria."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>En general, no contamos con el consentimiento como base legal para procesar sus datos personales, excepto en relación con el envío de comunicaciones de marketing a usted por correo electrónico o mensaje de texto. Tiene derecho a retirar su consentimiento para el marketing en cualquier momento poniéndose en contacto con nosotros en la página de soporte o utilizando la configuración de privacidad de su perfil.</p>
          </div>
        )
      },
      {
        id: "purposes",
        label: isPt ? "Finalidade e Base Legal" : "Finalidad y Base Legal",
        title: isPt ? "Finalidade e base legítima para o processamento de seus dados pessoais" : "Finalidad y base legítima para el procesamiento de sus datos personales",
        icon: "fact_check",
        text: isPt ? (
          <div className="space-y-4">
            <p>Abaixo está uma descrição das maneiras como pretendemos usar seus dados pessoais e os fundamentos legais sobre os quais processaremos esses dados. Também explicamos quais são nossos interesses legítimos quando relevantes. Podemos processar seus dados pessoais por mais de um motivo legal, dependendo da finalidade específica para a qual estamos usando seus dados.</p>
            <ul className="space-y-3 pl-1">
              {[
                { title: "Dados de comunicação", desc: "processamos esses dados para fins de comunicação com você, para manutenção de registros e para o estabelecimento, prossecução ou defesa de reivindicações legais. Nossa base legal para esse processamento são nossos interesses legítimos que, neste caso, são responder às comunicações enviadas a nós, manter registros e estabelecer, buscar ou defender reivindicações legais;" },
                { title: "Dados do cliente", desc: "processamos esses dados para fornecer os bens e/ou serviços que você adquiriu e para manter registros de tais transações. Nossa base legal para esse processamento é a execução de um contrato entre você e nós e/ou tomar medidas a seu pedido para celebrar tal contrato;" },
                { title: "Dados do usuário", desc: "processamos esses dados para operar nosso site e garantir que o conteúdo relevante seja fornecido a você, para garantir a segurança de nosso site, manter backups de nosso site e/ou bancos de dados e permitir a publicação e administração de nosso site, outros serviços e negócios online. Nossa base legal para esse processamento são nossos interesses legítimos que, neste caso, nos permitem administrar adequadamente nosso site e nossos negócios;" },
                { title: "Dados técnicos", desc: "processamos esses dados para analisar seu uso de nosso site e outros serviços online, para administrar e proteger nossos negócios e site, para fornecer conteúdo e anúncios relevantes do site para você e para entender a eficácia de nossa publicidade. Nossa base legal para esse processamento são nossos interesses legítimos que, neste caso, nos permitem administrar adequadamente nosso site e nossos negócios, expandir nossos negócios e decidir nossa estratégia de marketing;" },
                { title: "Dados de marketing", desc: "processamos esses dados para permitir que você participe de nossas promoções, como competições, sorteios e brindes gratuitos, para fornecer conteúdo e anúncios relevantes do site para você e medir ou entender a eficácia dessa publicidade. Nossa base legal para esse processamento são nossos interesses legítimos que, neste caso, são estudar como os clientes usam nossos produtos/servicios, desenvolvê-los, expandir nossos negócios e decidir nossa estratégia de marketing." }
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span><strong>{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-text-dark dark:text-gray-400">Podemos usar dados do cliente, dados do usuário, dados técnicos e dados de marketing para fornecer conteúdo e anúncios relevantes do site para você (incluindo anúncios do Facebook ou outros anúncios de exibição) e para medir ou entender a eficácia da publicidade que servimos a você. Nossa base legal para esse processamento são interesses legítimos que são o crescimento de nossos negócios. Também podemos usar esses dados para enviar outras comunicações de marketing para você. Nossa base legal para esse processamento é o consentimento ou interesses legítimos (ou seja, para expandir nossos negócios).</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>A continuación se muestra una descripción de las maneras en que pretendemos utilizar sus datos personales y los fundamentos legales sobre los cuales procesaremos dichos datos. También explicamos cuáles son nuestros intereses legítimos cuando son relevantes. Podemos procesar sus datos personales por más de una razón legal, dependiendo de la finalidad específica para la que usamos sus datos.</p>
            <ul className="space-y-3 pl-1">
              {[
                { title: "Datos de comunicación", desc: "procesamos estos datos para fines de comunicación con usted, para el mantenimiento de registros y para el establecimiento, la persecución o la defensa de reclamaciones legales. Nuestra base legal para este procesamiento son nuestros intereses legítimos que, en este caso, son responder a las comunicaciones enviadas a nosotros, mantener registros y establecer, buscar o defender reclamaciones legales;" },
                { title: "Datos de cliente", desc: "procesamos estos datos para proporcionar los bienes y/o servicios que ha adquirido y para mantener registros de dichas transacciones. Nuestra base legal para este procesamiento es la ejecución de un contrato entre usted y nosotros y/o tomar medidas a su solicitud para celebrar dicho contrato;" },
                { title: "Datos de usuario", desc: "procesamos estos datos para operar nuestro sitio web y garantizar que se le proporcione el contenido relevante, para garantizar la seguridad de nuestro sitio web, mantener copias de seguridad de nuestro sitio web y/o bases de datos y permitir la publicación y administración de nuestro sitio web, otros servicios y negocios en línea. Nuestra base legal para este procesamiento son nuestros intereses legítimos que, en este caso, nos permiten administrar adecuadamente nuestro sitio web y nuestro negocio;" },
                { title: "Datos técnicos", desc: "procesamos estos datos para analizar su uso de nuestro sitio web y otros servicios en línea, para administrar y proteger nuestro negocio y sitio web, para proporcionarle contenido y anuncios relevantes del sitio web y para comprender la efectividad de nuestra publicidad. Nuestra base legal para este procesamiento son nuestros intereses legítimos que, en este caso, nos permiten administrar adecuadamente nuestro sitio web y nuestro negocio, expandir nuestro negocio y decidir nuestra estrategia de marketing;" },
                { title: "Datos de marketing", desc: "procesamos estos datos para permitirle participar en nuestras promociones, como concursos, sorteos y regalos gratuitos, para proporcionarle contenido y anuncios relevantes del sitio y para medir o comprender la efectividad de esta publicidad. Nuestra base legal para este procesamiento son nuestros intereses legítimos que, en este caso, son estudiar cómo los clientes utilizan nuestros productos/servicios, desarrollarlos, expandir nuestro negocio y decidir nuestra estrategia de marketing." }
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span><strong>{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-text-dark dark:text-gray-400">Podemos usar datos de clientes, datos de usuario, datos técnicos y datos de marketing para proporcionarle contenido y anuncios relevantes del sitio web (incluidos anuncios de Facebook u otros anuncios de exhibición) y para medir o comprender la efectividad de la publicidad que le servimos. Nuestra base legal para este procesamiento son intereses legítimos que son el crecimiento de nuestro negocio. También podemos usar estos datos para enviarle otras comunicaciones de marketing. Nuestra base legal para este procesamiento es el consentimiento o intereses legítimos (es decir, para expandir nuestro negocio).</p>
          </div>
        )
      },
      {
        id: "marketing",
        label: isPt ? "Marketing" : "Marketing",
        title: isPt ? "Comunicações de marketing" : "Comunicaciones de marketing",
        icon: "email",
        text: isPt ? (
          <p>
            De acordo com os Regulamentos de Privacidade e Comunicações Eletrônicas (PECR), podemos enviar comunicações de marketing nossas se você fizer uma compra (e, consequentemente, criar uma conta de usuário neste site) ou nos solicitar informações sobre nossos produtos ou serviços ou, alvulsamente, se você concordar em receber comunicações de marketing.<br /><br />
            De acordo com esses regulamentos, se você for uma empresa limitada, podemos enviar e-mails de marketing sem o seu consentimento. No entanto, você ainda pode optar por não receber nossos e-mails de marketing a qualquer momento clicando no link de remoção de assinatura em qualquer e-mail enviado.<br /><br />
            Antes de compartilharmos seus dados pessoais com terceiros para fins de marketing, obteremos seu consentimento expresso.<br /><br />
            Você pode solicitar a nós ou a terceiros que parem de enviar mensagens de marketing a qualquer momento fazendo login no site e marcando ou desmarcando as caixas relevantes para ajustar suas preferências de marketing ou seguindo os links de exclusão em qualquer mensagem de marketing enviada a você. Se você optar por não receber comunicações de marketing, essa desativação não se aplica aos dados pessoais fornecidos como resultado de outras transações, como compras, registros de garantia etc.
          </p>
        ) : (
          <p>
            De acuerdo con las Regulaciones de Privacidad y Comunicaciones Electrónicas (PECR), podemos enviarle comunicaciones de marketing si realiza una compra (y, en consecuencia, crea una cuenta de usuario en este sitio web) o solicitarnos información sobre nuestros productos o servicios, o Por supuesto, si acepta recibir comunicaciones de marketing.<br /><br />
            De acuerdo con estas regulaciones, si usted es una empresa limitada, podemos enviar correos electrónicos de marketing sin su consentimiento. Sin embargo, todavía puede optar por no recibir nuestros correos electrónicos de marketing en cualquier momento haciendo clic en el enlace de baja en cualquier correo enviado.<br /><br />
            Antes de compartir sus datos personales con terceros con fines de marketing, obtendremos su consentimiento expreso.<br /><br />
            Puede solicitarnos a nosotros o a terceros que dejen de enviar mensajes de marketing en cualquier momento iniciando sesión en el sitio y marcando o desmarcando las casillas correspondientes para ajustar sus preferencias de marketing o siguiendo el enlace de eliminación en cualquier mensaje de marketing enviado a usted. Si decide no recibir comunicaciones de marketing, esta desactivación no se aplica a los datos personales proporcionados como resultado de otras transacciones, como compras, registros de garantía, etc.
          </p>
        )
      },
      {
        id: "disclosure",
        label: isPt ? "Divulgação de Dados" : "Divulgación de Datos",
        title: isPt ? "Divulgação de seus dados pessoais" : "Divulgación de sus datos personales",
        icon: "share",
        text: isPt ? (
          <div className="space-y-3">
            <p>Possivelmente, pode ser que compartilhemos seus dados pessoais, de acordo com as informações a seguir:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Provedor de plataforma de curso online Zenler.com, que é o processador de dados. Celebramos um adendo de processamento de dados com a Zenler para processar seus dados.",
                "Outras empresas do nosso grupo que prestam serviços de TI e administração de sistemas e realizam relatórios de liderança.",
                "Provedores de serviços que fornecem infraestrutura em nuvem, hospedagem de vídeo, plataformas de vídeo ao vivo (Amazon, Sendgrid, FileStack, Vimeo, Zapier, Zoom).",
                "Consultores profissionais, incluindo advogados, banqueiros, auditores e seguradoras que prestam serviços de consultoria, serviços bancários, jurídicos, de seguros e de contabilidade.",
                "Órgãos governamentais que exigem que relatemos atividades de processamento em determinadas circunstâncias.",
                "Terceiros para quem vendemos, transferimos ou fundimos partes de nossos negócios ou nossos ativos."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">Exigimos que todos os terceiros a quem transferimos seus dados respeitem a segurança de seus dados pessoais e os tratem de acordo com a lei. Apenas permitimos que esses terceiros processem os seus dados pessoais para fins específicos e de acordo com as nossas instruções.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>Es posible que compartamos sus datos personales de acuerdo con la siguiente información:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Proveedor de plataforma de cursos en línea Zenler.com, que es el procesador de datos. Celebramos un apéndice de procesamiento de datos con Zenler para procesar sus datos.",
                "Otras empresas de nuestro grupo que prestan servicios de TI y administración de sistemas y realizan informes de liderazgo.",
                "Proveedores de servicios que proporcionan infraestructura en la nube, alojamiento de video y plataformas de video en vivo (Amazon, Sendgrid, FileStack, Vimeo, Zapier, Zoom).",
                "Asesores profesionales, incluidos abogados, banqueros, auditores y aseguradoras que prestan servicios de consultoría, bancarios, jurídicos, de seguros y contables.",
                "Organismos gubernamentales que requieren que informemos sobre las actividades de procesamiento en determinadas circunstancias.",
                "Terceros a quienes vendemos, transferimos o fusionamos partes de nuestro negocio o nuestros activos."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-start text-sm">
                  <span className="material-icons-round text-primary text-xs shrink-0 mt-1">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">Exigimos que todos los terceros a quienes transferimos sus datos respeten la seguridad de sus datos personales y los traten de acuerdo con la ley. Solo permitimos que estos terceros procesen sus datos personales para fines específicos y de acuerdo con nuestras instrucciones.</p>
          </div>
        )
      },
      {
        id: "international",
        label: isPt ? "Transferências Internacionais" : "Transferencias Internacionales",
        title: isPt ? "Transferências internacionais" : "Transferencias internacionales",
        icon: "public",
        text: isPt ? (
          <p>
            Compartilhamos seus dados pessoais dentro de nosso grupo de empresas, o que envolve a transferência de seus dados para fora do Espaço Econômico Europeu (EEE). Os países fora do EEE nem sempre oferecem os mesmos níveis de proteção aos seus dados pessoais. Sempre que transferimos seus dados pessoais para fora do EEE, fazemos o possível para garantir um grau semelhante de segurança de dados.<br /><br />
            Nosso provedor de plataforma de cursos on-line, Zenler, com sede no Reino Unido, é nosso processador de dados, com o qual firmamos um contrato de processamento de dados. Apenas transferiremos os seus dados pessoais para países que tenham sido considerados como tendo um nível adequado de proteção de dados pessoais pela Comissão Europeia, ou usando contratos específicos aprovados que conferem a mesma proteção. Quando usamos provedores baseados nos EUA (por exemplo, Amazon, Sendgrid), garantimos a proteção necessária por meio de adendos específicos.<br /><br />
            Se nenhuma das salvaguardas acima estiver disponível, podemos solicitar seu consentimento explícito para a transferência específica. Você terá o direito de retirar este consentimento a qualquer momento.
          </p>
        ) : (
          <p>
            Compartimos sus datos personales dentro de nuestro grupo de empresas, lo que implica la transferencia de sus datos fuera del Espacio Económico Europeo (EEE). Los países fuera del EEE no siempre ofrecen los mismos niveles de protección. Cada vez que transferimos sus datos personales fuera del EEE, hacemos todo lo posible para garantizar un grado similar de seguridad.<br /><br />
            Nuestro proveedor de plataforma de cursos en línea, Zenler, con sede en el Reino Unido, es nuestro procesador de datos, con el que firmamos un acuerdo de procesamiento de datos. Solo transferiremos sus datos personales a países que se considere que tienen un nivel adecuado de protección por la Comisión Europea, o utilizando contratos y adendos específicos aprobados. Cuando utilizamos proveedores basados en Estados Unidos (por ejemplo, Amazon, Sendgrid), firmamos adendos de procesamiento de datos homologados.<br /><br />
            Si ninguna de las garantías anteriores está disponible, podemos solicitar su consentimiento explícito para la transferencia específica. Tendrá derecho a retirar este consentimiento en cualquier momento.
          </p>
        )
      },
      {
        id: "security",
        label: isPt ? "Segurança" : "Seguridad",
        title: isPt ? "Segurança de dados" : "Seguridad de datos",
        icon: "security",
        text: isPt ? (
          <p>
            Implementamos medidas de segurança apropriadas para evitar que seus dados pessoais sejam acidentalmente perdidos, usados ou acessados de forma não autorizada, alterados ou divulgados. Além disso, limitamos o acesso aos seus dados pessoais aos funcionários, agentes, contratados e outros terceiros que tenham uma necessidade comercial de conhecer esses dados. Eles apenas processarão seus dados pessoais de acordo com nossas instruções e estão sujeitos a um dever de confidencialidade.<br /><br />
            Implementamos procedimentos para lidar com qualquer suspeita de violação de dados pessoais e notificaremos você e qualquer regulador aplicável sobre uma violação quando formos legalmente obrigados a fazê-lo.
          </p>
        ) : (
          <p>
            Implementamos las medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente, se utilicen o se accedan de forma no autorizada, se modifiquen o se divulguen. Además, limitamos el acceso a sus datos personales a los empleados, agentes, contratistas y otros terceros que tengan una necesidad comercial de conocer dichos datos. Solo procesarán sus datos personales de acuerdo con nuestras instrucciones y están sujetos a un deber de confidencialidad.<br /><br />
            Implementamos procedimientos para hacer frente a cualquier sospecha de violación de datos personales y le notificaremos a usted y a cualquier regulador aplicable sobre una violación cuando estemos legalmente obligados a hacerlo.
          </p>
        )
      },
      {
        id: "retention",
        label: isPt ? "Retenção de Dados" : "Retención de Datos",
        title: isPt ? "Retenção de dados" : "Retención de datos",
        icon: "history",
        text: isPt ? (
          <p>
            Apenas reteremos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais os coletamos, inclusive para atender a quaisquer requisitos legais, contábeis ou de relatórios.<br /><br />
            Ao decidir qual é o momento correto para manter os dados, analisamos sua quantidade, natureza e sensibilidade, risco potencial de danos por uso ou divulgação não autorizados, as finalidades de processamento, se puderem ser alcançadas por outros meios e requisitos legais.<br /><br />
            Para fins fiscais, a lei exige que mantenhamos informações básicas sobre nossos clientes (incluindo Dados de Contato, Identidade, Financeiros e Transações) por seis anos após deixarem de ser clientes.<br /><br />
            Em algumas circunstâncias, podemos anonimizar seus dados pessoais para fins de pesquisa ou estatística, no caso em que podemos usar essas informações indefinidamente sem aviso prévio.
          </p>
        ) : (
          <p>
            Solo conservaremos sus datos personales durante el tiempo necesario para cumplir con los fines para los que los recopilamos, incluso para cumplir con cualquier requisito legal, contable o de información.<br /><br />
            Al decidir cuál es el momento correcto para mantener los datos, analizamos su cantidad, naturaleza y sensibilidad, riesgo potencial de daños por uso o divulgación no autorizados, los fines de procesamiento, si pueden ser alcanzados por otros medios y requisitos legales.<br /><br />
            Para fines fiscales, la ley exige que conservemos información básica sobre nuestros clientes (incluyendo Datos de Contacto, Identidad, Financieros y Transacciones) durante seis años después de dejar de ser clientes.<br /><br />
            En algunas circunstancias, podemos anonimizar sus datos personales con fines de investigación o estadística, en cuyo caso podemos usar dicha información indefinidamente sin previo aviso.
          </p>
        )
      },
      {
        id: "rights",
        label: isPt ? "Direitos Legais" : "Derechos Legales",
        title: isPt ? "Seus direitos legais" : "Sus derechos legales",
        icon: "verified",
        text: isPt ? (
          <div className="space-y-4">
            <p>Sob certas circunstâncias, você tem direitos sob as leis de proteção de dados em relação aos seus dados pessoais. Estes incluem o direito de:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Solicitar acesso aos seus dados pessoais;",
                "Solicitar a correção dos seus dados pessoais;",
                "Solicitar o apagamento dos seus dados pessoais;",
                "Opor-se ao processamento de seus dados pessoais;",
                "Solicitar restrição de processamento de seus dados pessoais;",
                "Solicitar a transferência dos seus dados pessoais;",
                "Retirar o consentimento."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-center text-sm font-medium">
                  <span className="material-icons-round text-primary text-xs shrink-0">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>Você não terá que pagar uma taxa para acessar seus dados pessoais (ou para exercer qualquer um dos outros direitos). No entanto, podemos cobrar uma taxa razoável se sua solicitação for claramente infundada, repetitiva ou excessiva. Alternativamente, podemos nos recusar a atender sua solicitação nessas circunstâncias.<br /><br />
            Podemos precisar solicitar informações específicas de você para nos ajudar a confirmar sua identidade e garantir seu direito de acessar seus dados pessoais. Esta é uma medida de segurança para garantir que os dados pessoais não sejam divulgados a qualquer pessoa que não tenha o direito de recebê-los.<br /><br />
            Tratamos de responder a todas as solicitações legítimas em até 30 dias. Ocasionalmente, pode demorar mais se for particularmente complexa ou se tiver feito várias solicitações.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Bajo ciertas circunstancias, usted tiene derechos bajo las leyes de protección de datos en relación con sus datos personales. Estos incluyen el derecho a:</p>
            <ul className="space-y-2 pl-1">
              {[
                "Solicitar acceso a sus datos personales;",
                "Solicitar la corrección de sus datos personales;",
                "Solicitar la eliminación de sus datos personales;",
                "Oponerse al procesamiento de sus datos personales;",
                "Solicitar restricción de procesamiento de sus datos personales;",
                "Solicitar la transferencia de sus datos personales;",
                "Retirar el consentimiento."
              ].map((item, index) => (
                <li key={index} className="flex gap-2 items-center text-sm font-medium">
                  <span className="material-icons-round text-primary text-xs shrink-0">chevron_right</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>Usted no tendrá que pagar una tarifa para acceder a sus datos personales (o para ejercer cualquiera de los otros derechos). Sin embargo, podemos cobrar una tarifa razonable si su solicitud es claramente infundada, repetitiva o excesiva. Alternativamente, podemos negarnos a atender su solicitud en tales circunstancias.<br /><br />
            Es posible que tengamos que solicitar información específica de usted para ayudarnos a confirmar su identidad y garantizar su derecho a acceder a sus datos personales. Esta es una medida de seguridad para garantizar que los datos personales no sean divulgados a cualquier persona que no tenga el derecho de recibirlos.<br /><br />
            Tratamos de responder a todas las solicitudes legítimas en hasta 30 días. Ocasionalmente, puede tomar más de 30 días si su solicitud es particularmente compleja o si ha realizado varias solicitudes. En este caso, le notificaremos y lo mantendremos actualizado.</p>
          </div>
        )
      },
      {
        id: "links",
        label: isPt ? "Enlaces de Terceiros" : "Enlaces de Terceros",
        title: isPt ? "Enlaces de terceiros" : "Enlaces de terceros",
        icon: "link",
        text: isPt ? (
          <p>
            Es possível que incluamos enlaces a sites web, complementos e aplicativos de terceiros. Fazer clique nestes enlaces ou habilitar estas conexões pode permitir que terceiros coletem ou compartilhem dados sobre você. Não controlamos estes sites web de terceiros e não somos responsáveis pelas suas declarações de privacidade. Ao sair de nosso site web, recomendamos que leia o aviso de privacidade de todos os sites web que visite.
          </p>
        ) : (
          <p>
            Es posible que incluyamos enlaces a sitios web, complementos y aplicaciones de terceros. Hacer clic en estos enlaces o habilitar estas conexiones puede permitir que terceros recopilen o compartan datos sobre usted. No controlamos estos sitios web de terceros y no somos responsables de sus declaraciones de privacidad. Al salir de nuestro sitio web, le recomendamos que lea el aviso de privacidad de todos los sitios web que visite.
          </p>
        )
      },
      {
        id: "cookies",
        label: isPt ? "Cookies" : "Cookies",
        title: isPt ? "Cookies" : "Cookies",
        icon: "cookie",
        text: isPt ? (
          <p>
            Você pode configurar seu navegador para recusar todas ou algumas cookies do navegador ou para avisá-lo quando os sites web estabelecem ou acessam cookies. Se desativar ou recusar cookies, tenha em conta que algumas partes deste site web podem ficar inacessíveis ou não funcionar corretamente. Para obter mais informações sobre as cookies que utilizamos, consulte nossa política de cookies.
          </p>
        ) : (
          <p>
            Puede configurar su navegador para rechazar todas o algunas cookies del navegador o para avisarle cuando los sitios web establezcan o accedan a las cookies. Si desactiva o rechaza las cookies, tenga en cuenta que algunas partes de este sitio web pueden quedar inaccesibles o no funcionar correctamente. Para obtener más información sobre las cookies que utilizamos, consulte nuestra política de cookies.
          </p>
        )
      },
      {
        id: "age-limits",
        label: isPt ? "Limitações de Idade" : "Limitaciones de Edad",
        title: isPt ? "Limitações de idade" : "Limitaciones de edad",
        icon: "child_care",
        text: isPt ? (
          <p>
            Legalmente, você deve ter 13 anos de idade ou mais para fornecer dados virtualmente. No entanto, nosso público-alvo é geralmente de adultos com educação superior completa.
          </p>
        ) : (
          <p>
            Legalmente, usted debe tener 13 años de edad o más para proporcionar datos virtualmente. Sin embargo, nuestro público objetivo es generalmente de adultos con educación superior completa.
          </p>
        )
      }
    ]
  };

  return (
    <main className="pt-8 md:pt-12 min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      <ScrollToTop />
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        
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

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation - Sticky (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            <div className="bg-white/50 dark:bg-surface-dark/40 backdrop-blur-md p-6 rounded-2xl border border-secondary/20 dark:border-gray-800">
              <h3 className="font-serif font-bold text-sm text-text-light dark:text-white uppercase tracking-wider mb-4 border-b border-secondary/20 pb-2">
                {content.tocTitle}
              </h3>
              <nav className="space-y-1">
                {content.sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-dark dark:text-gray-400 rounded-lg hover:bg-primary/5 hover:text-primary transition-all group"
                  >
                    <span className="material-icons-round text-base opacity-75 group-hover:scale-115 transition-transform">{sec.icon}</span>
                    <span className="truncate">{sec.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {content.sections.map((sec) => (
              <section 
                key={sec.id} 
                id={sec.id} 
                className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[32px] border border-secondary/20 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-primary/20 transition-all duration-300 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-icons-round text-xl">{sec.icon}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-text-light dark:text-white">
                    {sec.title}
                  </h2>
                </div>
                <div className="text-sm md:text-base text-text-dark dark:text-gray-300 leading-relaxed font-light pl-0 md:pl-13 space-y-4">
                  {sec.text}
                </div>
              </section>
            ))}
          </div>

        </div>

      </div>
    </main>
  );
}
