import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];
const ACCEPTED_ZIP_TYPES = ["application/zip", "application/x-zip-compressed", "multipart/x-zip"];

const createValidator = (types: string[], typeError: string, isOptional: boolean = false) => {
  let validator = z.any();
  if (!isOptional) {
    validator = validator.refine((files) => files?.length === 1, "Este archivo es obligatorio.");
  }
  return validator
    .refine((files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE, "El tamaño máximo es de 10MB.")
    .refine((files) => !files?.length || types.includes(files?.[0]?.type), typeError);
};

export const FileValidators = {
  pdf: createValidator(ACCEPTED_PDF_TYPES, "Solo se aceptan archivos PDF."),
  pdfOptional: createValidator(ACCEPTED_PDF_TYPES, "Solo se aceptan archivos PDF.", true),
  pdfOrImage: createValidator([...ACCEPTED_PDF_TYPES, ...ACCEPTED_IMAGE_TYPES], "Solo se aceptan archivos PDF o imágenes."),
  pdfOrZip: createValidator([...ACCEPTED_PDF_TYPES, ...ACCEPTED_ZIP_TYPES], "Solo se aceptan archivos PDF o ZIP."),
};

export type LocalizedText = {
  es: string;
  pt: string;
};

export type FieldDefinition = {
  name: string;
  label: LocalizedText;
  description?: LocalizedText;
  validator: z.ZodTypeAny;
  typeLabel: string;
  isOptional?: boolean;
  dependsOnEscenario?: string[];
};

export type EscenarioEvento = {
  id: string;
  label: LocalizedText;
  monto: number;
  description: LocalizedText;
  examples?: LocalizedText;
  isContactForm?: boolean;
  requirements?: {
    es: string[];
    pt: string[];
  };
  subProfiles?: {
    id: string;
    label: LocalizedText;
    examples?: LocalizedText;
    requirements: {
      es: string[];
      pt: string[];
    };
  }[];
};

export type TramiteConfig = {
  id: string;
  categoria: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  monto: EscenarioEvento[];
  instrucciones_leer: {
    es: string[];
    pt: string[];
  };
  descargas: { 
    label_es: string; 
    label_pt: string; 
    url_es: string; 
    url_pt: string;
    dependsOnEscenario?: string[];
  }[];
  fields: FieldDefinition[];
  hasModalitySelection?: boolean;
  requiresMembership?: boolean;
  accreditationTypeKey?: string;
};

export const AIBAPT_TRAMITES: Record<string, TramiteConfig> = {
  "solicitud_membresia": {
    id: "solicitud_membresia",
    categoria: { es: "Membresía", pt: "Membresia" },
    title: { es: "Solicitud de Membresía", pt: "Solicitação de Membresia" },
    description: { es: "Únete a nuestra red de especialistas en psicotrauma.", pt: "Junte-se à nossa rede de especialistas em psicotrauma." },
    monto: [
      { 
        id: 'pleno', 
        label: { es: 'Miembro Pleno', pt: 'Membro Pleno' }, 
        monto: 45, 
        description: { es: 'Personas físicas con formación profesional.', pt: 'Pessoas físicas com formação profissional.' },
        subProfiles: [
          { 
            id: 'pleno_salud_mental', 
            label: { es: 'Profesional de Salud Mental', pt: 'Profissional de Saúde Mental' },
            examples: { es: 'Psicólogos, Psicoterapeutas, Psiquiatras y médicos.', pt: 'Psicólogos, Psicoterapeutas, Psiquiatras e médicos.' },
            requirements: {
              es: ['Diploma de especialidad', 'Solicitud firmada', '1 Carta de Recomendación'],
              pt: ['Diploma de especialidade', 'Solicitação assinada', '1 Carta de Recomendação']
            }
          },
          { 
            id: 'pleno_agente_social', 
            label: { es: 'Agente de Intervención Social', pt: 'Agente de Intervenção Social' },
            examples: { es: 'Trabajadores Sociales, Enfermeros, Socorristas.', pt: 'Assistentes Sociais, Enfermeiros, Socorristas.' },
            requirements: {
              es: ['Taller de 10h sobre Trauma', 'Solicitud firmada', '1 Carta de Recomendación'],
              pt: ['Oficina de 10h sobre Trauma', 'Solicitação assinada', '1 Carta de Recomendação']
            }
          }
        ]
      },
      { 
        id: 'otros', 
        label: { es: 'Otras Categorías', pt: 'Outras Categorias' }, 
        monto: 45, 
        description: { es: 'Estudiantes, Jubilados o Simpatizantes.', pt: 'Estudantes, Aposentados ou Simpatizantes.' },
        subProfiles: [
          { 
            id: 'otros_estudiante', 
            label: { es: 'Estudiante', pt: 'Estudante' },
            requirements: {
              es: ['Comprobante de estudios vigente', 'Solicitud firmada'],
              pt: ['Comprovante de estudos vigente', 'Solicitação assinada']
            }
          },
          { 
            id: 'otros_jubilado', 
            label: { es: 'Jubilado', pt: 'Aposentado' },
            requirements: {
              es: ['Comprobante de jubilación', 'Solicitud firmada'],
              pt: ['Comprovante de aposentadoria', 'Solicitação assinada']
            }
          }
        ]
      },
      { 
        id: 'institucional', 
        label: { es: 'Miembro Institucional', pt: 'Membro Institucional' }, 
        monto: 60, 
        description: { es: 'Para universidades, clínicas o centros.', pt: 'Para universidades, clínicas ou centros.' },
        requirements: {
          es: ['Estatutos de la institución', 'Solicitud institucional'],
          pt: ['Estatutos da instituição', 'Solicitação institucional']
        }
      }
    ],
    instrucciones_leer: {
      es: ["Prepara tu documentación en PDF", "El pago se realiza al final vía PayPal", "Tu solicitud será revisada en 48-72h"],
      pt: ["Prepare sua documentação em PDF", "O pagamento é feito ao final via PayPal", "Sua solicitação será revisada em 48-72h"]
    },
    descargas: [
      { label_es: "Hoja de Inscripción", label_pt: "Folha de Inscrição", url_es: "#", url_pt: "#" },
      { label_es: "Solicitud de Ingreso", label_pt: "Solicitação de Ingresso", url_es: "#", url_pt: "#" },
      { label_es: "Carta de Recomendación", label_pt: "Carta de Recomendação", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "hoja_inscripcion", label: { es: "Hoja de Inscripción", pt: "Folha de Inscrição" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "solicitud_ingreso", label: { es: "Solicitud de Ingreso", pt: "Solicitação de Ingresso" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "carta_recomendacion", label: { es: "Carta de Recomendación", pt: "Carta de Recomendação" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno'] },
      { name: "comprobante_estudios", label: { es: "Comprobante de Estudios", pt: "Comprovante de Estudos" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['otros_estudiante'] },
      { name: "comprobante_jubilacion", label: { es: "Comprobante de Jubilación", pt: "Comprovante de Aposentadoria" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['otros_jubilado'] },
      { name: "estatutos_institucion", label: { es: "Estatutos de la Institución", pt: "Estatutos da Instituição" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['institucional'] }
    ]
  },
  "acreditacion_cca": {
    id: "acreditacion_cca",
    categoria: { es: "Desarrollo Profesional", pt: "Desenvolvimento Profissional" },
    title: { es: "Emisión de Certificado CCA", pt: "Emissão de Certificado CCA" },
    description: { es: "Solicitud oficial de diploma de créditos tras finalizar un curso.", pt: "Solicitação oficial de diploma de créditos após a conclusão de um curso." },
    monto: [
      { id: 'cca_miembro', label: { es: 'Alumno Miembro de AIBAPT', pt: 'Aluno Membro da AIBAPT' }, monto: 10, description: { es: 'Para estudiantes con membresía anual al día (10 € por bloque de 12 créditos).', pt: 'Para estudantes com anuidade de membro em dia (10 € por bloco de 12 créditos).' } },
      { id: 'cca_no_miembro', label: { es: 'Alumno No Miembro', pt: 'Aluno Não Membro' }, monto: 15, description: { es: 'Público general sin membresía anual (15 € por bloque de 12 créditos).', pt: 'Público geral sem anuidade de membro (15 € por bloco de 12 créditos).' } }
    ],
    accreditationTypeKey: "Emision_CCA",
    instrucciones_leer: {
      es: [
        "El estudiante tiene hasta 5 meses después de terminar el curso para solicitar los créditos.",
        "Si el curso fue online, el instructor debe proveer el aval de evaluación correspondiente.",
        "Las tarifas se aplican por cada bloque de 12 créditos CCA."
      ],
      pt: [
        "O estudante tem até 5 meses após o término do curso para solicitar os créditos.",
        "Se o curso foi online, o instrutor deve fornecer o respectivo aval de avaliação.",
        "As tarifas são aplicadas a cada bloco de 12 créditos CCA."
      ]
    },
    descargas: [
      { label_es: "Declaración de Evaluación (Instructor - Opcional)", label_pt: "Declaração de Avaliação (Instrutor - Opcional)", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "certificado_formacion_basica", label: { es: "Certificado de Formación Básica", pt: "Certificado de Formação Básica" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_curso_avanzado", label: { es: "Diploma del Curso", pt: "Diploma do Curso" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  // ── EMDR: Vía Psicoterapeuta ─────────────────────────────────────────────
  "emdr_basico": {
    id: "emdr_basico",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Psicoterapeuta EMDR — Registro Básico", pt: "Psicoterapeuta EMDR — Registo Básico" },
    description: { es: "Formalización del inicio del proceso de certificación EMDR. Trámite exento de pago.", pt: "Formalização do início do processo de certificação EMDR. Trâmite isento de pagamento." },
    monto: [
      { id: 'emdr_basico_default', label: { es: 'Registro Inicial — Exento de Pago', pt: 'Registo Inicial — Isento de Pagamento' }, monto: 0, description: { es: 'Abre tu expediente oficial en AIBAPT. No requiere abono.', pt: 'Abre seu expediente oficial na AIBAPT. Não requer pagamento.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Requisito: Haber completado la Formación Básica EMDR (Nivel 1 y Nivel 2) con instructor acreditado.",
        "Requisito: Colegiación profesional activa o licencia habilitante vigente.",
        "Este trámite es gratuito — No requiere comprobante de pago.",
        "Una vez validado, podrás acceder al siguiente nivel: Psicoterapeuta Certificado."
      ],
      pt: [
        "Requisito: Ter concluído a Formação Básica EMDR (Nível 1 e Nível 2) com instrutor credenciado.",
        "Requisito: Inscrição profissional ativa ou licença habilitante vigente.",
        "Este trâmite é gratuito — Não requer comprovante de pagamento.",
        "Uma vez validado, você poderá acessar o próximo nível: Psicoterapeuta Certificado."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud Inicial EMDR", label_pt: "Formulário de Solicitação Inicial EMDR", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "certificado_formacion_basica", label: { es: "Certificado de Formación Básica EMDR (Nivel 1 y 2)", pt: "Certificado de Formação Básica EMDR (Nível 1 e 2)" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "licencia_colegiado", label: { es: "Comprobante de Colegiado / Licencia Profesional Activa", pt: "Comprovante de Registro Profissional / Licença Ativa" }, typeLabel: "PDF", validator: FileValidators.pdf }
    ]
  },
  "emdr_psico_certificado": {
    id: "emdr_psico_certificado",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Psicoterapeuta EMDR Certificado", pt: "Psicoterapeuta EMDR Certificado" },
    description: { es: "Certificación oficial para psicoterapeutas que han culminado el proceso de formación y supervisión EMDR.", pt: "Certificação oficial para psicoterapeutas que concluíram o processo de formação e supervisão EMDR." },
    monto: [
      { id: 'psico_cert_default', label: { es: 'Certificación de Psicoterapeuta', pt: 'Certificação de Psicoterapeuta' }, monto: 20, description: { es: 'Evaluación y sello oficial de Psicoterapeuta EMDR (20 €). Pago vía PayPal a financiero@aibapt.org.', pt: 'Avaliação e selo oficial de Psicoterapeuta EMDR (20 €). Pagamento via PayPal a financiero@aibapt.org.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Requisito: Registro Básico EMDR activo en AIBAPT.",
        "Requisito: 2 Cartas de Recomendación de colegas EMDR certificados (Peer Review).",
        "Requisito: Registro de mínimo 50 sesiones de EMDR con al menos 25 pacientes distintos.",
        "Requisito: Aval de 20h de supervisión con supervisor certificado AIBAPT.",
        "Requisito: Portafolio de mínimo 12 Créditos CCA acreditados.",
        "Pago previo: 20 € vía PayPal a financiero@aibapt.org — Adjunta el comprobante en el Paso 2."
      ],
      pt: [
        "Requisito: Registo Básico EMDR ativo na AIBAPT.",
        "Requisito: 2 Cartas de Recomendação de colegas EMDR certificados (Peer Review).",
        "Requisito: Registro de mínimo 50 sessões de EMDR com pelo menos 25 pacientes distintos.",
        "Requisito: Aval de 20h de supervisão com supervisor certificado AIBAPT.",
        "Requisito: Portfólio de mínimo 12 Créditos CCA acreditados.",
        "Pagamento prévio: 20 € via PayPal a financiero@aibapt.org — Anexe o comprovante no Passo 2."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Certificación", label_pt: "Formulário de Solicitação de Certificação", url_es: "#", url_pt: "#" },
      { label_es: "Modelo de Carta de Recomendación (Peer Review)", label_pt: "Modelo de Carta de Recomendação (Peer Review)", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cartas_recomendacion", label: { es: "2 Cartas de Recomendación de Colegas", pt: "2 Cartas de Recomendação de Colegas" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "registro_50_sesiones", label: { es: "Registro de 50 Sesiones (mín. 25 pacientes)", pt: "Registro de 50 Sessões (mín. 25 pacientes)" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "aval_supervision_20h", label: { es: "Aval de 20h de Supervisión", pt: "Aval de 20h de Supervisão" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "portafolio_12_creditos", label: { es: "Portafolio de 12 Créditos CCA", pt: "Portfólio de 12 Créditos CCA" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago (20 €)", pt: "Comprovante de Pagamento (20 €)" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "emdr_psico_senior": {
    id: "emdr_psico_senior",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Psicoterapeuta EMDR Sénior", pt: "Psicoterapeuta EMDR Sênior" },
    description: { es: "Nivel de excelencia clínica que acredita amplia experiencia en EMDR y supervisión avanzada.", pt: "Nível de excelência clínica que acredita ampla experiência em EMDR e supervisão avançada." },
    monto: [
      { id: 'psico_senior_default', label: { es: 'Certificación Sénior', pt: 'Certificação Sênior' }, monto: 40, description: { es: 'Evaluación y sello de Psicoterapeuta EMDR Sénior (40 €). Pago vía PayPal a financiero@aibapt.org.', pt: 'Avaliação e selo de Psicoterapeuta EMDR Sênior (40 €). Pagamento via PayPal a financiero@aibapt.org.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Certificado AIBAPT.",
        "Requisito: Transcripción literal o link de sesión EMDR avalada por supervisor.",
        "Requisito: Aval de 50h de supervisión especializada.",
        "Requisito: Registro acumulado de 250h de atención clínica en EMDR.",
        "Requisito: Constancia de 20h de psicoterapia personal.",
        "Pago previo: 40 € vía PayPal a financiero@aibapt.org — Adjunta el comprobante en el Paso 2."
      ],
      pt: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Certificado AIBAPT.",
        "Requisito: Transcrição literal ou link de sessão EMDR avalada por supervisor.",
        "Requisito: Aval de 50h de supervisão especializada.",
        "Requisito: Registro acumulado de 250h de atendimento clínico em EMDR.",
        "Requisito: Constância de 20h de psicoterapia pessoal.",
        "Pagamento prévio: 40 € via PayPal a financiero@aibapt.org — Anexe o comprovante no Passo 2."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Nivel Sénior", label_pt: "Formulário de Solicitação de Nível Sênior", url_es: "#", url_pt: "#" },
      { label_es: "Guía de Transcripción de Sesión EMDR", label_pt: "Guia de Transcrição de Sessão EMDR", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "transcripcion_sesion", label: { es: "Transcripción / Link de Sesión EMDR", pt: "Transcrição / Link de Sessão EMDR" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "aval_supervision_50h", label: { es: "Aval de 50h de Supervisión", pt: "Aval de 50h de Supervisão" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_250h_atencion", label: { es: "Registro de 250h de Atención Clínica", pt: "Registro de 250h de Atendimento Clínico" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "constancia_psicoterapia_20h", label: { es: "Constancia de 20h de Psicoterapia Personal", pt: "Constância de 20h de Psicoterapia Pessoal" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago (40 €)", pt: "Comprovante de Pagamento (40 €)" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "emdr_psico_master": {
    id: "emdr_psico_master",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Psicoterapeuta EMDR Máster", pt: "Psicoterapeuta EMDR Mestre" },
    description: { es: "El nivel más alto de la vía clínica EMDR. Reconoce la excelencia y trayectoria avanzada.", pt: "O nível mais alto da via clínica EMDR. Reconhece a excelência e trajetória avançada." },
    monto: [
      { id: 'psico_master_default', label: { es: 'Certificación Máster', pt: 'Certificação Mestre' }, monto: 50, description: { es: 'Evaluación y sello de Psicoterapeuta EMDR Máster (50 €). Pago vía PayPal a financiero@aibapt.org.', pt: 'Avaliação e selo de Psicoterapeuta EMDR Mestre (50 €). Pagamento via PayPal a financiero@aibapt.org.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Sénior AIBAPT.",
        "Requisito: Aval firmado acumulando 500 fichas de sesiones de EMDR.",
        "Requisito: Constancia de 40h totales de psicoterapia personal.",
        "Pago previo: 50 € vía PayPal a financiero@aibapt.org — Adjunta el comprobante en el Paso 2."
      ],
      pt: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Sênior AIBAPT.",
        "Requisito: Aval assinado acumulando 500 fichas de sessões de EMDR.",
        "Requisito: Constância de 40h totais de psicoterapia pessoal.",
        "Pagamento prévio: 50 € via PayPal a financiero@aibapt.org — Anexe o comprovante no Passo 2."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Nivel Máster", label_pt: "Formulário de Solicitação de Nível Mestre", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "aval_500_fichas", label: { es: "Aval de 500 Fichas de Sesiones EMDR", pt: "Aval de 500 Fichas de Sessões EMDR" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "constancia_psicoterapia_40h", label: { es: "Constancia de 40h de Psicoterapia Personal", pt: "Constância de 40h de Psicoterapia Pessoal" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago (50 €)", pt: "Comprovante de Pagamento (50 €)" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  // ── EMDR: Vía Supervisor ──────────────────────────────────────────────────
  "emdr_sup_certificado": {
    id: "emdr_sup_certificado",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Supervisor EMDR Certificado", pt: "Supervisor EMDR Certificado" },
    description: { es: "Acreditación para psicoterapeutas certificados que desean supervisar procesos clínicos EMDR de otros profesionales.", pt: "Credenciamento para psicoterapeutas certificados que desejam supervisionar processos clínicos EMDR de outros profissionais." },
    monto: [
      { id: 'sup_cert_default', label: { es: 'Certificación de Supervisor', pt: 'Certificação de Supervisor' }, monto: 40, description: { es: 'Evaluación y sello de Supervisor EMDR (40 €). Pago vía PayPal a financiero@aibapt.org.', pt: 'Avaliação e selo de Supervisor EMDR (40 €). Pagamento via PayPal a financiero@aibapt.org.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Supervisor",
    instrucciones_leer: {
      es: [
        "Requisito: Certificado de Psicoterapeuta EMDR Certificado (o Sénior) vigente de AIBAPT.",
        "Requisito: Certificado de aprobación de Examen Teórico de Supervisión.",
        "Requisito: Registro de 300 fichas de sesiones de EMDR.",
        "Requisito: Registro de 20h de 'supervisión de la supervisión' con Trainer o Supervisor Sénior AIBAPT.",
        "Pago previo: 40 € vía PayPal a financiero@aibapt.org — Adjunta el comprobante en el Paso 2."
      ],
      pt: [
        "Requisito: Certificado de Psicoterapeuta EMDR Certificado (ou Sênior) vigente da AIBAPT.",
        "Requisito: Certificado de aprovação do Exame Teórico de Supervisão.",
        "Requisito: Registro de 300 fichas de sessões de EMDR.",
        "Requisito: Registro de 20h de 'supervisão da supervisão' com Trainer ou Supervisor Sênior AIBAPT.",
        "Pagamento prévio: 40 € via PayPal a financiero@aibapt.org — Anexe o comprovante no Passo 2."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Supervisor EMDR", label_pt: "Formulário de Solicitação de Supervisor EMDR", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cert_examen_teorico", label: { es: "Certificado de Aprobación del Examen Teórico", pt: "Certificado de Aprovação do Exame Teórico" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_300_fichas", label: { es: "Registro de 300 Fichas de Sesiones", pt: "Registro de 300 Fichas de Sessões" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_sup_supervision_20h", label: { es: "Registro de 20h de Supervisión de la Supervisión", pt: "Registro de 20h de Supervisão da Supervisão" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago (40 €)", pt: "Comprovante de Pagamento (40 €)" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "emdr_sup_senior": {
    id: "emdr_sup_senior",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Supervisor EMDR Sénior", pt: "Supervisor EMDR Sênior" },
    description: { es: "El nivel más avanzado de la vía de supervisión EMDR. Acredita experiencia formativa y casos documentados.", pt: "O nível mais avançado da via de supervisão EMDR. Acredita experiência formativa e casos documentados." },
    monto: [
      { id: 'sup_senior_default', label: { es: 'Certificación Supervisor Sénior', pt: 'Certificação Supervisor Sênior' }, monto: 50, description: { es: 'Evaluación y sello de Supervisor EMDR Sénior (50 €). Pago vía PayPal a financiero@aibapt.org.', pt: 'Avaliação e selo de Supervisor EMDR Sênior (50 €). Pagamento via PayPal a financiero@aibapt.org.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Supervisor",
    instrucciones_leer: {
      es: [
        "Requisito: Certificado vigente de Supervisor EMDR Certificado AIBAPT.",
        "Requisito: Registro de mínimo 100h de supervisión efectiva dadas a otros terapeutas.",
        "Requisito: 3 casos de orientación por escrito completamente supervisados.",
        "Pago previo: 50 € vía PayPal a financiero@aibapt.org — Adjunta el comprobante en el Paso 2."
      ],
      pt: [
        "Requisito: Certificado vigente de Supervisor EMDR Certificado AIBAPT.",
        "Requisito: Registro de mínimo 100h de supervisão efetiva realizadas a outros terapeutas.",
        "Requisito: 3 casos de orientação por escrito completamente supervisionados.",
        "Pagamento prévio: 50 € via PayPal a financiero@aibapt.org — Anexe o comprovante no Passo 2."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Supervisor Sénior", label_pt: "Formulário de Solicitação de Supervisor Sênior", url_es: "#", url_pt: "#" },
      { label_es: "Plantilla de Registro de Supervisados", label_pt: "Modelo de Registro de Supervisionados", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "registro_100h_supervision", label: { es: "Registro de 100h de Supervisión Dadas", pt: "Registro de 100h de Supervisão Realizadas" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "casos_orientacion_escrito", label: { es: "3 Casos de Orientación por Escrito", pt: "3 Casos de Orientação por Escrito" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago (50 €)", pt: "Comprovante de Pagamento (50 €)" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "renovacion_cert_emdr": {
    id: "renovacion_cert_emdr",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Renovación de Certificación EMDR", pt: "Renovação de Certificação EMDR" },
    description: { es: "Mantenimiento bienal obligatorio para Psicoterapeutas y Supervisores EMDR.", pt: "Manutenção bienal obrigatória para Psicoterapeutas e Supervisores EMDR." },
    monto: [
      { id: 'renovacion_psicoterapeuta', label: { es: 'Renovación de Psicoterapeuta', pt: 'Renovação de Psicoterapeuta' }, monto: 20, description: { es: 'Mantenimiento bienal para Psicoterapeuta (20 €).', pt: 'Manutenção bienal para Psicoterapeuta (20 €).' } },
      { id: 'renovacion_supervisor', label: { es: 'Renovación de Supervisor', pt: 'Renovação de Supervisor' }, monto: 40, description: { es: 'Mantenimiento bienal para Supervisor (40 €).', pt: 'Manutenção bienal para Supervisor (40 €).' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Acreditar un mínimo de 12 créditos CCA acumulados en los últimos 2 años.",
        "Al menos 8 créditos deben ser específicos en Terapia EMDR.",
        "Tener el pago de la membresía anual al día."
      ],
      pt: [
        "Acreditar um mínimo de 12 créditos CCA acumulados nos últimos 2 anos.",
        "Pelo menos 8 créditos devem ser específicos em Terapia EMDR.",
        "Estar em dia com a anuidade de membro."
      ]
    },
    descargas: [
      { label_es: "Formulario de Renovación de Certificación EMDR", label_pt: "Formulário de Renovação de Certificação EMDR", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_solicitud", label: { es: "Formulario de Renovación", pt: "Formulário de Renovação" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "portafolio_creditos", label: { es: "Portafolio de Créditos (Diplomas de 12 créditos)", pt: "Portfólio de Créditos (Diplomas de 12 créditos)" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "declaracion_etica", label: { es: "Declaración Ética (No tener sanciones)", pt: "Declaração Ética (Não ter sanções)" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_cert_emdr": {
    id: "equivalencia_cert_emdr",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Proceso de Equivalencia EMDR", pt: "Processo de Equivalência EMDR" },
    description: { es: "Convalidación para profesionales certificados por otras organizaciones internacionales.", pt: "Convalidação para profissionais certificados por outras organizações internacionais." },
    monto: [
      { id: 'equivalencia_psicoterapeuta', label: { es: 'Equivalencia Psicoterapeuta', pt: 'Equivalência Psicoterapeuta' }, monto: 20, description: { es: 'Convalidación del sello de Psicoterapeuta (20 €).', pt: 'Convalidação do selo de Psicoterapeuta (20 €).' } },
      { id: 'equivalencia_supervisor', label: { es: 'Equivalencia Supervisor', pt: 'Equivalência Supervisor' }, monto: 40, description: { es: 'Convalidación del sello de Supervisor (40 €).', pt: 'Convalidação del sello de Supervisor (40 €).' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "Equivalencia_EMDR",
    instrucciones_leer: {
      es: [
        "Acreditar el cumplimiento de normas de validación de credenciales externas de AIBAPT.",
        "Presentar copia vigente del certificado por la otra asociación (ej. EMDRIA, EMDR Iberoamérica).",
        "Disponer del aval de membresía de AIBAPT."
      ],
      pt: [
        "Acreditar o cumprimento das normas de validação de credenciais externas da AIBAPT.",
        "Apresentar cópia vigente do certificado pela outra associação (ex. EMDRIA, EMDR Iberoamérica).",
        "Ter o aval de membro da AIBAPT."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud de Equivalencia de Certificación", label_pt: "Formulário de Solicitação de Equivalência de Certificação", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_solicitud", label: { es: "Formulario de Equivalencia", pt: "Formulário de Equivalência" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_externo", label: { es: "Copia de Certificado de otra asociación", pt: "Cópia do Certificado de outra associação" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "aval_membresia", label: { es: "Aval de membresía de AIBAPT", pt: "Aval de membro da AIBAPT" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_psicotrauma": {
    id: "cert_psicotrauma",
    categoria: { es: "Formación", pt: "Formação" },
    title: { es: "Psicotrauma Individual", pt: "Psicotrauma Individual" },
    description: { es: "Acreditación clínica en trauma.", pt: "Acreditação clínica em trauma." },
    monto: [
      { id: 'trauma_default', label: { es: "Certificación Individual", pt: "Certificação Individual" }, monto: 20, description: { es: "Evaluación de caso clínico.", pt: "Avaliação de caso clínico." } }
    ],
    instrucciones_leer: {
      es: ["Caso Clínico (Máx 20 págs)", "Declaración de Ética"],
      pt: ["Caso Clínico (Máx 20 págs)", "Declaração de Ética"]
    },
    descargas: [],
    fields: [
      { name: "caso_clinico", label: { es: "Caso Clínico", pt: "Caso Clínico" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "declaracion_etico", label: { es: "Declaración de Ética", pt: "Declaração de Ética" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_basica": {
    id: "equivalencia_basica",
    categoria: { es: "Formación", pt: "Formação" },
    title: { es: "Equivalencia Básica", pt: "Equivalência Básica" },
    description: { es: "Convalidación de cursos externos.", pt: "Convalidação de cursos externos." },
    monto: [
      { id: 'equiv_alumno', label: { es: "Equivalencia Alumno", pt: "Equivalência Aluno" }, monto: 20, description: { es: "Convalidación para alumnos.", pt: "Convalidação para alunos." } },
      { id: 'equiv_formador', label: { es: "Equivalencia Formador", pt: "Equivalência Formador" }, monto: 50, description: { es: "Convalidación para formadores.", pt: "Convalidação para formadores." } }
    ],
    instrucciones_leer: {
      es: ["Programa del curso externo", "Evidencia de duración"],
      pt: ["Programa do curso externo", "Evidência de duração"]
    },
    descargas: [],
    fields: [
      { name: "programa_curso", label: { es: "Programa del Curso", pt: "Programa do Curso" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "evidencia_duracion", label: { es: "Evidencia de Duración", pt: "Evidência de Duração" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  }
};
