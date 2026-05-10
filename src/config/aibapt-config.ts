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
    title: { es: "Acreditación de Horas CCA", pt: "Acreditação de Horas CCA" },
    description: { es: "Certifica tus horas de educación continua.", pt: "Certifique suas horas de educação contínua." },
    monto: [
      { id: 'cca_default', label: { es: 'Trámite General', pt: 'Trâmite Geral' }, monto: 20, description: { es: 'Emisión de certificado CCA.', pt: 'Emissão de certificado CCA.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "CCA_Credits",
    instrucciones_leer: {
      es: ["Sube la evidencia de tus créditos CCA (12 créditos)", "Comprobante de pago"],
      pt: ["Suba a evidência de seus créditos CCA (12 créditos)", "Comprovante de pagamento"]
    },
    descargas: [],
    fields: [
      { name: "evidencia_creditos", label: { es: "Evidencia de Créditos CCA", pt: "Evidência de Créditos CCA" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "certificaciones_emdr": {
    id: "certificaciones_emdr",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Acreditación EMDR 2026", pt: "Acreditação EMDR 2026" },
    description: { es: "Certificaciones profesionales Manual 2026.", pt: "Certificações profissionais Manual 2026." },
    monto: [
      { id: 'psico_basico', label: { es: "Psicoterapeuta Básico", pt: "Psicoterapeuta Básico" }, monto: 0, description: { es: "Nivel inicial.", pt: "Nível inicial." } },
      { id: 'psico_certificado', label: { es: "Psicoterapeuta Certificado", pt: "Psicoterapeuta Certificado" }, monto: 20, description: { es: "Nivel profesional.", pt: "Nível profissional." } },
      { id: 'psico_senior', label: { es: "Psicoterapeuta Sénior", pt: "Psicoterapeuta Sénior" }, monto: 40, description: { es: "Nivel avanzado.", pt: "Nível avançado." } },
      { id: 'psico_master', label: { es: "EMDR Máster", pt: "EMDR Máster" }, monto: 50, description: { es: "Máxima distinción.", pt: "Máxima distinção." } },
      { id: 'sup_certificado', label: { es: "Supervisor Certificado", pt: "Supervisor Certificado" }, monto: 40, description: { es: "Capacidad de supervisión.", pt: "Capacidade de supervisão." } },
      { id: 'sup_senior', label: { es: "Supervisor Sénior", pt: "Supervisor Sénior" }, monto: 50, description: { es: "Supervisor avanzado.", pt: "Supervisor avançado." } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Certification",
    instrucciones_leer: {
      es: ["Selecciona tu nivel objetivo", "Prepara el portafolio CCA si aplica", "Asegura archivos menores a 10MB"],
      pt: ["Selecione seu nível objetivo", "Prepare o portfólio CCA se aplicável", "Garanta arquivos menores que 10MB"]
    },
    descargas: [],
    fields: [
      { name: "formulario_solicitud", label: { es: "Formulario de Solicitud", pt: "Formulário de Solicitação" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificados_basicos", label: { es: "Certificados Nivel 1 y 2", pt: "Certificados Nível 1 e 2" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "cartas_recomendacion", label: { es: "Cartas de Recomendación", pt: "Cartas de Recomendação" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "transcripcion_sesion", label: { es: "Transcripción de Sesión", pt: "Transcrição de Sessão" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['psico_senior', 'psico_master'] },
      { name: "portafolio_cca", label: { es: "Portafolio CCA", pt: "Portfólio CCA" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip, dependsOnEscenario: ['psico_certificado', 'psico_senior', 'psico_master', 'sup_certificado', 'sup_senior'] },
      { name: "comprobante_pago", label: { es: "Comprobante de Pago", pt: "Comprovante de Pagamento" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_emdr": {
    id: "equivalencia_emdr",
    categoria: { es: "Certificaciones EMDR", pt: "Certificações EMDR" },
    title: { es: "Equivalencia EMDR", pt: "Equivalência EMDR" },
    description: { es: "Para profesionales de otras asociaciones.", pt: "Para profissionais de outras associações." },
    monto: [
      { id: 'equiv_psico', label: { es: "Equivalencia Psicoterapeuta", pt: "Equivalência Psicoterapeuta" }, monto: 20, description: { es: "Proceso para terapeutas.", pt: "Processo para terapeutas." } },
      { id: 'equiv_sup', label: { es: "Equivalencia Supervisor", pt: "Equivalência Supervisor" }, monto: 40, description: { es: "Proceso para supervisores.", pt: "Processo para supervisores." } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "Equivalencia_EMDR",
    instrucciones_leer: {
      es: ["Certificación vigente de EMDRIA u otras asociaciones", "Comprobante de pago"],
      pt: ["Certificação vigente da EMDRIA ou outras associações", "Comprovante de pagamento"]
    },
    descargas: [],
    fields: [
      { name: "certificacion_vigente", label: { es: "Certificación Externa", pt: "Certificação Externa" }, typeLabel: "PDF", validator: FileValidators.pdf },
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
