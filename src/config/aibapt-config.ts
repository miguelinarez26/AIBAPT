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

export type FieldDefinition = {
  name: string;
  label: Record<'es' | 'pt', string> | string;
  description?: string;
  validator: z.ZodTypeAny;
  typeLabel: string;
  isOptional?: boolean;
  dependsOnEscenario?: string[];
};

export type EscenarioEvento = {
  id: string;
  label: Record<'es' | 'pt', string> | string;
  monto: number;
  description: Record<'es' | 'pt', string> | string;
  examples?: Record<'es' | 'pt', string>;
  isContactForm?: boolean;
  subProfiles?: {
    id: string;
    label: Record<'es' | 'pt', string> | string;
    examples?: Record<'es' | 'pt', string>;
    requirements: Record<'es' | 'pt', string[]>;
  }[];
};

export type TramiteConfig = {
  id: string;
  categoria: Record<'es' | 'pt', string>;
  title: Record<'es' | 'pt', string>;
  description: Record<'es' | 'pt', string>;
  monto: number | string | EscenarioEvento[];
  instrucciones_leer: Record<'es' | 'pt', string[]>;
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
    categoria: { es: "MEMBRESÍA", pt: "MEMBRESIA" },
    title: { es: "Solicitud de Membresía AIBAPT", pt: "Solicitação de Membresia AIBAPT" },
    description: { es: "Proceso formal para convertirse en Socio Activo de la asociación.", pt: "Processo formal para se tornar Sócio Ativo da associação." },
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
            examples: { es: 'Psicólogos, Psicoterapeutas, Psiquiatras y médicos con enfoque clínico.', pt: 'Psicólogos, Psicoterapeutas, Psiquiatras e médicos com foco clínico.' },
            requirements: {
              es: ['Diploma de especialidad en abordaje de trauma', 'Hoja y Solicitud firmada', '1 Carta de Recomendación'],
              pt: ['Diploma de especialidade em abordagem de trauma', 'Folha e Solicitação assinada', '1 Carta de Recomendação']
            }
          },
          { 
            id: 'pleno_agente_social', 
            label: { es: 'Agente de Intervención Social', pt: 'Agente de Intervenção Social' },
            examples: { es: 'Trabajadores Sociales, Enfermeros, Socorristas, Policías, Bomberos y consejeros.', pt: 'Assistentes Sociais, Enfermeiros, Socorristas, Policiais, Bombeiros e conselheiros.' },
            requirements: {
              es: ['Taller de 10h sobre Teoría del Trauma', 'Hoja y Solicitud firmada', '1 Carta de Recomendación'],
              pt: ['Oficina de 10h sobre Teoria do Trauma', 'Folha e Solicitação assinada', '1 Carta de Recomendação']
            }
          }
        ]
      },
      { 
        id: 'institucional', 
        label: { es: 'Miembro Institucional', pt: 'Membro Institucional' }, 
        monto: 60, 
        description: { es: 'Persona Jurídica (Organizaciones).', pt: 'Pessoa Jurídica (Organizações).' },
        examples: { es: 'Institutos de entrenamiento, Universidades, Clínicas y centros de salud mental.', pt: 'Institutos de treinamento, Universidades, Clínicas e centros de saúde mental.' }
      },
      { id: 'bienhechor', label: { es: 'Miembro Bienhechor', pt: 'Membro Benfeitor' }, monto: 0, description: { es: 'Personas que desean realizar aportes financieros voluntarios a la asociación.', pt: 'Pessoas que desejam fazer contribuições financeiras voluntárias à associação.' }, isContactForm: true },
      { id: 'simpatizante', label: { es: 'Miembro Simpatizante', pt: 'Membro Simpatizante' }, monto: 0, description: { es: 'Personas que desean apoyar los fines de la asociación sin ser profesionales del trauma.', pt: 'Pessoas que desejam apoiar os fins da associação sem serem profissionais do trauma.' }, isContactForm: true }
    ],
    accreditationTypeKey: "solicitud_membresia",
    hasModalitySelection: false,
    requiresMembership: false,
    instrucciones_leer: {
      es: [
        "Selecciona tu categoría para ver los requisitos específicos.",
        "Miembros Plenos: Serán auditados bajo la norma de 50h de formación específica en psicotrauma y 10h de supervisión.",
        "Aprobación: Una vez verificados los documentos, tu perfil se actualizará automáticamente a Socio Activo con tu categoría elegida."
      ],
      pt: [
        "Selecione sua categoria para ver os requisitos específicos.",
        "Membros Plenos: Serão auditados sob a norma de 50h de formação específica em psicotrauma e 10h de supervisão.",
        "Aprovação: Uma vez verificados os documentos, seu perfil será atualizado automaticamente para Sócio Ativo com a categoria escolhida."
      ]
    },
    descargas: [
      { 
        label_es: "Hoja de Inscripción (Institucional)", label_pt: "Folha de Inscrição (Institucional)", 
        url_es: "https://esp.aibapt.org/38373/files/6476042666b2c_1685455910_esp-hoja-de-inscripci-n-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/6476042666b2c_1685455910_esp-hoja-de-inscripci-n-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['institucional']
      },
      { 
        label_es: "Solicitud de Ingreso (Institucional)", label_pt: "Solicitação de Ingresso (Institucional)", 
        url_es: "https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['institucional']
      },
      { 
        label_es: "Carta de Recomendación (Institucional)", label_pt: "Carta de Recomendação (Institucional)", 
        url_es: "https://esp.aibapt.org/38373/files/64760423d6279_1685455907_esp-carta-de-recomendaci-n-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/64760423d6279_1685455907_esp-carta-de-recomendaci-n-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['institucional']
      },
      // Pleno
      { 
        label_es: "Hoja de Inscripción (Pleno)", label_pt: "Folha de Inscrição (Pleno)", 
        url_es: "https://esp.aibapt.org/38373/files/6476042666b2c_1685455910_esp-hoja-de-inscripci-n-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/6476042666b2c_1685455910_esp-hoja-de-inscripci-n-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social']
      },
      { 
        label_es: "Solicitud de Ingreso (Pleno)", label_pt: "Solicitação de Ingresso (Pleno)", 
        url_es: "https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social']
      },
      { 
        label_es: "Carta de Recomendación (Pleno)", label_pt: "Carta de Recomendação (Pleno)", 
        url_es: "https://esp.aibapt.org/38373/files/64760423d6279_1685455907_esp-carta-de-recomendaci-n-para-miembro-institucional-update.pdf", 
        url_pt: "https://esp.aibapt.org/38373/files/64760423d6279_1685455907_esp-carta-de-recomendaci-n-para-miembro-institucional-update.pdf",
        dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social']
      }
    ],
    fields: [
      { name: "hoja_inscripcion", label: "Hoja de Inscripción firmada", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      { name: "solicitud_ingreso", label: "Solicitud de Ingreso firmada", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      
      { name: "titulo_profesional", label: "Título Profesional (Diploma)", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social'] },
      { name: "cv", label: "Currículum Vitae", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social'] },
      { name: "comprobante_formacion_sm", label: "Diploma especialidad abordaje de trauma", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno_salud_mental'] },
      { name: "comprobante_formacion_as", label: "Certificado taller 10h Teoría del Trauma", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno_agente_social'] },
      { name: "carta_recomendacion_1", label: "Carta de Recomendación (1)", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno', 'pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      
      { name: "registro_legal", label: "Registro Legal de la Institución", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['institucional'] },
      { name: "carta_recomendacion_2", label: "Carta de Recomendación (2)", typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['institucional'] },
      
      { name: "comprobante_pago", label: "Comprobante de Pago Anual", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cca": {
    id: "cca",
    categoria: { es: "CCA Y EVENTOS", pt: "CCA E EVENTOS" },
    title: { es: "Acreditación de Cursos Avanzados (CCA)", pt: "Acreditação de Cursos Avançados (CCA)" },
    description: { es: "Validación de cursos para otorgar créditos oficiales.", pt: "Validação de cursos para concessão de créditos oficiais." },
    monto: 50,
    accreditationTypeKey: "CCA",
    hasModalitySelection: true,
    instrucciones_leer: {
      es: [
        "Objetivo: Validación de cursos para otorgar créditos oficiales.",
        "Vigencia: 2 años.",
        "Costo: 50 €.",
        "Requisitos Clave: Solo para psicoterapeutas o supervisores certificados por AIBAPT."
      ],
      pt: [
        "Objetivo: Validação de cursos para concessão de créditos oficiais.",
        "Validade: 2 anos.",
        "Custo: 50 €.",
        "Requisitos Principais: Apenas para psicoterapeutas ou supervisores certificados pela AIBAPT."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud CCA", label_pt: "Formulário de Solicitação CCA", url_es: "#", url_pt: "#" },
      { label_es: "Ficha Técnica con cronograma", label_pt: "Ficha Técnica com cronograma", url_es: "#", url_pt: "#" },
      { label_es: "Plantilla Control de Asistencia", label_pt: "Modelo de Controle de Presença", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cv_instructor", label: "CV del Instructor", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "formulario_solicitud", label: "Formulario de Solicitud firmado", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "ficha_tecnica", label: "Ficha Técnica con cronograma", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "calendario_marketing", label: "Calendario y Marketing", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage },
      { name: "material_didactico", label: "Material Didáctico", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "control_asistencia", label: "Plantillas de Control de asistencia", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "cuestionario_evaluacion", label: "Cuestionario de Evaluación", description: "Obligatorio (2 preguntas por hora de curso) solo si es Modalidad Online.", typeLabel: "PDF", validator: FileValidators.pdfOptional, isOptional: true },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "eventos": {
    id: "eventos",
    categoria: { es: "CCA Y EVENTOS", pt: "CCA E EVENTOS" },
    title: { es: "Eventos, Congresos y Seminarios", pt: "Eventos, Congressos e Seminários" },
    description: { es: "Acreditación de eventos puntuales o congresos completos.", pt: "Acreditação de eventos pontuais ou congressos completos." },
    monto: [
      { id: "2A", label: { es: "2A: Conferencias (Charla única)", pt: "2A: Conferências (Palestra única)" }, monto: 20, description: { es: "Acreditación para una charla individual.", pt: "Acreditação para uma palestra individual." } },
      { id: "2B", label: { es: "2B: Workshops/Talleres (Práctico)", pt: "2B: Workshops/Oficinas (Prático)" }, monto: 30, description: { es: "Acreditación para talleres con enfoque práctico.", pt: "Acreditação para workshops com foco prático." } },
      { id: "2C", label: { es: "2C: Eventos Completos/Congresos", pt: "2C: Eventos Completos/Congressos" }, monto: 50, description: { es: "Acreditación para congresos completos.", pt: "Acreditação para congressos completos." } }
    ],
    instrucciones_leer: {
      es: [
        "Escenarios de Pago: 20€ (Charla), 30€ (Taller), 50€ (Congreso).",
        "Documentos obligatorios incluyen CV del Facilitador, Material del Evento y Agenda.",
        "Asegúrate de seleccionar el escenario correcto para que el comprobante de pago coincida con el monto establecido."
      ],
      pt: [
        "Cenários de Pagamento: 20€ (Palestra), 30€ (Workshop), 50€ (Congresso).",
        "Documentos obrigatórios incluem CV do Facilitador, Material do Evento e Agenda.",
        "Certifique-se de selecionar o cenário correto para que o comprovante de pagamento corresponda ao valor estabelecido."
      ]
    },
    descargas: [
      { label_es: "Ficha de Solicitación", label_pt: "Ficha de Solicitação", url_es: "#", url_pt: "#" },
      { label_es: "Ficha Técnica", label_pt: "Ficha Técnica", url_es: "#", url_pt: "#" },
      { label_es: "Formularios de Gestión/Registro", label_pt: "Formulários de Gestão/Registro", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cv_facilitador", label: "CV del Facilitador", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "ficha_solicitacion_tecnica", label: "Ficha de Solicitación y Ficha Técnica", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "calendario_evento", label: "Calendario del Evento/Agenda", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "material_evento", label: "Material del Evento", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "formularios_gestion", label: "Formularios de Gestión/Registro", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "emision_cca": {
    id: "emision_cca",
    categoria: { es: "CCA Y EVENTOS", pt: "CCA E EVENTOS" },
    title: { es: "Emisión de Certificado CCA (Para Estudiantes)", pt: "Emissão de Certificado CCA (Para Estudantes)" },
    description: { es: "Solicitud del certificado tras finalizar un curso acreditado.", pt: "Solicitação do certificado após a conclusão de um curso creditado." },
    monto: "10 € (Socios) / 15 € (No Socios) por bloque de 12 créditos",
    accreditationTypeKey: "Emision_CCA",
    instrucciones_leer: {
      es: [
        "Plazo: Hasta 5 meses después de terminar el curso.",
        "Tarifas: Socio Activo (10 €), No Socio (15 €) por bloque de 12 créditos."
      ],
      pt: [
        "Prazo: Até 5 meses após o término do curso.",
        "Tarifas: Sócio Ativo (10 €), Não Sócio (15 €) por bloco de 12 créditos."
      ]
    },
    descargas: [],
    fields: [
      { name: "certificado_formacion", label: "Certificado de Formación Básica reconocido", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_curso_avanzado", label: "Certificado del Curso Avanzado", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "renovacion_cca": {
    id: "renovacion_cca",
    categoria: { es: "CCA Y EVENTOS", pt: "CCA E EVENTOS" },
    title: { es: "Renovación y Mantenimiento (CCA / Equivalencia)", pt: "Renovação e Manutenção (CCA / Equivalência)" },
    description: { es: "Trámites para renovar certificación CCA o Mantenimiento de Equivalencia.", pt: "Procedimentos para renovar a certificação CCA ou Manutenção de Equivalência." },
    monto: "50 € (Renovación) / 25 € (Mantenimiento Equivalencia)",
    accreditationTypeKey: "Renovacion_CCA",
    instrucciones_leer: {
      es: [
        "Costo Renovación Curso: 50 €.",
        "Costo Mantenimiento Equivalencia: 25 €.",
        "Requisito: Haber sumado 12 créditos CCA en los últimos 2 años (mínimo 8 en PsicoTrauma)."
      ],
      pt: [
        "Custo Renovação do Curso: 50 €.",
        "Custo Manutenção de Equivalência: 25 €.",
        "Requisito: Ter somado 12 créditos CCA nos últimos 2 anos (mínimo 8 em Psicotrauma)."
      ]
    },
    descargas: [],
    fields: [
      { name: "evidencia_creditos", label: "Evidencia de los 12 créditos CCA", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_psicoterapeuta": {
    id: "cert_psicoterapeuta",
    categoria: { es: "CERTIFICACIONES EMDR", pt: "CERTIFICAÇÕES EMDR" },
    title: { es: "Certificación Inicial - Psicoterapeuta", pt: "Certificação Inicial - Psicoterapeuta" },
    description: { es: "Certificación inicial en EMDR como psicoterapeuta.", pt: "Certificação inicial em EMDR como psicoterapeuta." },
    monto: 20,
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Psicoterapeuta",
    instrucciones_leer: {
      es: [
        "Costo: 20 €.",
        "Requisitos: 2 años de práctica, 50 sesiones con 25 pacientes, 20h de supervisión AIBAPT."
      ],
      pt: [
        "Custo: 20 €.",
        "Requisitos: 2 anos de prática, 50 sessões com 25 pacientes, 20h de supervisão AIBAPT."
      ]
    },
    descargas: [
      { label_es: "Formulario de Solicitud", label_pt: "Formulário de Solicitação", url_es: "#", url_pt: "#" },
      { label_es: "Plantilla de Carta de Recomendación", label_pt: "Modelo de Carta de Recomendação", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_solicitud", label: "Formulario de Solicitud", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "cartas_recomendacion", label: "2 Cartas de Recomendación (Peer Review)", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "carta_supervisor", label: "Carta de recomendación del Supervisor (Aval de las 20h)", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificados_basicos", label: "Certificados de Entrenamiento Básico (Nivel 1 y 2)", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_supervisor": {
    id: "cert_supervisor",
    categoria: { es: "CERTIFICACIONES EMDR", pt: "CERTIFICAÇÕES EMDR" },
    title: { es: "Certificación Inicial - Supervisor", pt: "Certificação Inicial - Supervisor" },
    description: { es: "Certificación inicial en EMDR como supervisor.", pt: "Certificação inicial em EMDR como supervisor." },
    monto: 40,
    requiresMembership: true,
    accreditationTypeKey: "EMDR_Supervisor",
    instrucciones_leer: {
      es: [
        "Costo: 40 €.",
        "Requisitos: Psicoterapeuta certificado por 3 años, 300 sesiones con 75 pacientes, 20h de 'supervisión de la supervisión'."
      ],
      pt: [
        "Custo: 40 €.",
        "Requisitos: Psicoterapeuta certificado há 3 anos, 300 sessões com 75 pacientes, 20h de 'supervisão da supervisão'."
      ]
    },
    descargas: [
      { label_es: "Formulario de Supervisor", label_pt: "Formulário de Supervisor", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_supervisor", label: "Formulario de Supervisor", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_psicoterapeuta", label: "Certificado vigente de Psicoterapeuta", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "carta_recomendacion_trainer", label: "Carta de recomendación de un Trainer o Supervisor Senior", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_supervision", label: "Registro de las 20h de supervisión de supervisión", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_emdr": {
    id: "equivalencia_emdr",
    categoria: { es: "CERTIFICACIONES EMDR", pt: "CERTIFICAÇÕES EMDR" },
    title: { es: "Procesos de Equivalencia EMDR", pt: "Processos de Equivalência EMDR" },
    description: { es: "Proceso para profesionales con certificación de otras asociaciones reconocidas.", pt: "Processo para profissionais com certificação de outras associações reconhecidas." },
    monto: "20 € (Psicoterapeuta) / 40 € (Supervisor)",
    requiresMembership: true,
    accreditationTypeKey: "Equivalencia_EMDR",
    instrucciones_leer: {
      es: [
        "Requisito: Certificación vigente de otras asociaciones reconocidas (EMDRIA, etc.)."
      ],
      pt: [
        "Requisito: Certificação vigente de outras associações reconhecidas (EMDRIA, etc.)."
      ]
    },
    descargas: [],
    fields: [
      { name: "certificacion_vigente", label: "Certificación vigente de otras asociaciones", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_psicotrauma": {
    id: "cert_psicotrauma",
    categoria: { es: "FORMACIONES EN PSICOTRAUMA", pt: "FORMAÇÕES EM PSICOTRAUMA" },
    title: { es: "Certificación Individual (Psicoterapeuta)", pt: "Certificação Individual (Psicoterapeuta)" },
    description: { es: "Certificación en Psicotrauma.", pt: "Certificação em Psicotrauma." },
    monto: 20,
    instrucciones_leer: {
      es: [
        "Documento Crítico: Caso Clínico. Formato: PDF, máximo 20 páginas, Calibri 12, interlineado 1.5.",
        "Incluir Declaración de Adhesión al Código Ético y Certificados académicos previos."
      ],
      pt: [
        "Documento Crítico: Caso Clínico. Formato: PDF, máximo 20 páginas, Calibri 12, entrelinhas 1.5.",
        "Incluir Declaração de Adesão ao Código Ético e Certificados acadêmicos prévios."
      ]
    },
    descargas: [
      { label_es: "Declaración de Adhesión al Código Ético", label_pt: "Declaração de Adesão ao Código Ético", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "caso_clinico", label: "Caso Clínico (Máx 20 págs, Calibri 12, int. 1.5)", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "declaracion_etico", label: "Declaración de Adhesión al Código Ético", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificados_previos", label: "Certificados académicos previos", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "acred_programas": {
    id: "acred_programas",
    categoria: { es: "FORMACIONES EN PSICOTRAUMA", pt: "FORMAÇÕES EM PSICOTRAUMA" },
    title: { es: "Acreditación de Programas de Formación", pt: "Acreditação de Programas de Formação" },
    description: { es: "Dirigido a institutos o universidades.", pt: "Dirigido a institutos ou universidades." },
    monto: 50,
    instrucciones_leer: {
      es: [
        "Requisitos: Programa de mínimo 5 módulos, contenidos mínimos obligatorios, equipo docente especialista."
      ],
      pt: [
        "Requisitos: Programa de no mínimo 5 módulos, conteúdos mínimos obrigatórios, equipe docente especialista."
      ]
    },
    descargas: [],
    fields: [
      { name: "proyecto_pedagogico", label: "Proyecto Pedagógico", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "cv_docentes", label: "CVs del equipo docente", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "material_evaluacion", label: "Material de Evaluación", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_basica": {
    id: "equivalencia_basica",
    categoria: { es: "FORMACIONES EN PSICOTRAUMA", pt: "FORMAÇÕES EM PSICOTRAUMA" },
    title: { es: "Reconocimiento de Formación Básica", pt: "Reconhecimento de Formação Básica" },
    description: { es: "Proceso de equivalencia para formación básica externa.", pt: "Processo de equivalência para formação básica externa." },
    monto: "20 € (Alumnos) / 50 € (Formadores)",
    instrucciones_leer: {
      es: [
        "Requisito: El curso externo debe durar mínimo 1 año y coincidir en contenidos con AIBAPT."
      ],
      pt: [
        "Requisito: O curso externo deve durar no mínimo 1 ano e coincidir em conteúdos com a AIBAPT."
      ]
    },
    descargas: [],
    fields: [
      { name: "programa_curso", label: "Programa del Curso Externo", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "evidencia_duracion", label: "Evidencia de duración y contenidos", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  }
};
