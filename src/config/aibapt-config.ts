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
            examples: { es: 'Psicólogos, Psicoterapeutas, Psiquiatras y médicos con formación en trauma.', pt: 'Psicólogos, Psicoterapeutas, Psiquiatras e médicos com formação em trauma.' },
            requirements: {
              es: [
                'Datos de contacto y dirección',
                'Currículum (PDF)',
                'Comprobante de formación en tratamiento del trauma reconocida por la AIBAPT (PDF)',
                'Carta de Recomendación o realizar la solicitud a la AIBAPT'
              ],
              pt: [
                'Dados de contato e endereço',
                'Currículo (PDF)',
                'Comprovante de formação em tratamento do trauma reconhecida pela AIBAPT (PDF)',
                'Carta de Recomendação ou realizar a solicitação à AIBAPT'
              ]
            }
          },
          { 
            id: 'pleno_agente_social', 
            label: { es: 'Agente de Intervención Social', pt: 'Agente de Intervenção Social' },
            examples: { es: 'Trabajadores Sociales, Enfermeros, Socorristas con formación en trauma.', pt: 'Assistentes Sociais, Enfermeiros, Socorristas com formação em trauma.' },
            requirements: {
              es: [
                'Datos de contacto y dirección',
                'Currículum (PDF)',
                'Comprobante de formación en tratamiento del trauma reconocida por la AIBAPT (PDF)',
                'Carta de Recomendación o realizar la solicitud a la AIBAPT'
              ],
              pt: [
                'Dados de contato e endereço',
                'Currículo (PDF)',
                'Comprovante de formação em tratamento do trauma reconhecida pela AIBAPT (PDF)',
                'Carta de Recomendação ou realizar a solicitação à AIBAPT'
              ]
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
          es: [
            'Datos de contacto y dirección',
            'Currículum (PDF)',
            'Comprobante de formación en tratamiento del trauma reconocida por la AIBAPT (PDF)',
            'Carta de Recomendación o realizar la solicitud a la AIBAPT'
          ],
          pt: [
            'Dados de contato e endereço',
            'Currículo (PDF)',
            'Comprovante de formação em tratamento do trauma reconhecida pela AIBAPT (PDF)',
            'Carta de Recomendação ou realizar a solicitação à AIBAPT'
          ]
        }
      },
      {
        id: 'bienhechor',
        label: { es: 'Miembro Bienhechor', pt: 'Membro Benfeitor' },
        monto: 45,
        description: { es: 'Apoya nuestra labor de forma activa y altruista.', pt: 'Apoie nosso trabalho de forma ativa e altruísta.' },
        requirements: {
          es: [
            'Datos de contacto y dirección',
            'Carta de Recomendación o realizar la solicitud a la AIBAPT'
          ],
          pt: [
            'Dados de contato e endereço',
            'Carta de Recomendação ou realizar a solicitação à AIBAPT'
          ]
        }
      },
      {
        id: 'simpatizante',
        label: { es: 'Miembro Simpatizante', pt: 'Membro Simpatizante' },
        monto: 45,
        description: { es: 'Para interesados en el área de trauma sin práctica clínica.', pt: 'Para interessados na área do trauma sem prática clínica.' },
        requirements: {
          es: [
            'Datos de contacto y dirección',
            'Carta de Recomendación o realizar la solicitud a la AIBAPT'
          ],
          pt: [
            'Dados de contato e endereço',
            'Carta de Recomendação ou realizar a solicitação à AIBAPT'
          ]
        }
      }
    ],
    instrucciones_leer: {
      es: ["Prepara tu documentación en PDF", "El pago se realiza al final vía PayPal", "Tu solicitud será revisada en 48-72h"],
      pt: ["Prepare sua documentação em PDF", "O pagamento é feito ao final via PayPal", "Sua solicitação será revisada em 48-72h"]
    },
    descargas: [
      { label_es: "file.hoja_inscripcion", label_pt: "file.hoja_inscripcion", url_es: "#", url_pt: "#", dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social'] },
      { label_es: "file.hoja_inscripcion_juridica", label_pt: "file.hoja_inscripcion_juridica", url_es: "#", url_pt: "#", dependsOnEscenario: ['institucional'] },
      { label_es: "file.solicitud_ingreso", label_pt: "file.solicitud_ingreso", url_es: "#", url_pt: "#", dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      { label_es: "file.modelo_recomendacion", label_pt: "file.modelo_recomendacion", url_es: "#", url_pt: "#", dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social', 'institucional'] }
    ],
    fields: [
      { name: "hoja_inscripcion_firmada", label: { es: "file.hoja_inscripcion_firmada", pt: "file.hoja_inscripcion_firmada" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      { name: "solicitud_ingreso_firmada", label: { es: "file.solicitud_ingreso_firmada", pt: "file.solicitud_ingreso_firmada" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social', 'institucional'] },
      { name: "carta_recomendacion_1", label: { es: "file.carta_recomendacion", pt: "file.carta_recomendacion" }, typeLabel: "PDF", validator: FileValidators.pdf, dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social'] },
      { name: "comprobante_formacion_psicotrauma", label: { es: "file.comprobante_formacion_psicotrauma", pt: "file.comprobante_formacion_psicotrauma" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage, dependsOnEscenario: ['pleno_salud_mental', 'pleno_agente_social'] },
      { name: "cartas_recomendacion_institucional", label: { es: "file.cartas_recomendacion_institucional", pt: "file.cartas_recomendacion_institucional" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip, dependsOnEscenario: ['institucional'] },
      { name: "registro_legal_institucion", label: { es: "file.registro_legal_institucion", pt: "file.registro_legal_institucion" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage, dependsOnEscenario: ['institucional'] }
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
    requiresMembership: true,
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
    descargas: [],
    fields: [
      { name: "certificado_formacion_basica", label: { es: "file.certificado_formacion_basica_cca", pt: "file.certificado_formacion_basica_cca" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_curso_avanzado", label: { es: "file.diploma_curso_docente", pt: "file.diploma_curso_docente" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "acreditacion_curso_docente": {
    id: "acreditacion_curso_docente",
    categoria: { es: "Desarrollo Profesional", pt: "Desenvolvimento Profissional" },
    title: { es: "Acreditación de Curso (CCA - Para Docentes)", pt: "Acreditação de Curso (CCA - Para Docentes)" },
    description: { es: "Certifica tus propios cursos para otorgar créditos oficiales CCA AIBAPT.", pt: "Certifique seus próprios cursos para conceder créditos oficiais CCA AIBAPT." },
    monto: [
      { id: 'cca_docente_default', label: { es: 'Acreditación de Curso', pt: 'Acreditação de Curso' }, monto: 0, description: { es: 'Evaluación y registro de curso para docentes. Exento de pago.', pt: 'Avaliação e registro de curso para docentes. Isento de pagamento.' } }
    ],
    requiresMembership: true,
    accreditationTypeKey: "Psicotrauma_Programa",
    instrucciones_leer: {
      es: [
        "Completa el formulario de solicitud CCA y la Ficha Técnica con el cronograma.",
        "Prepara el material didáctico del curso en formato ZIP.",
        "Una vez aprobado, podrás emitir créditos oficiales a tus alumnos."
      ],
      pt: [
        "Preencha o formulário de solicitação CCA e a Ficha Técnica com o cronograma.",
        "Prepare o material didático do curso em formato ZIP.",
        "Uma vez aprovado, você poderá emitir créditos oficiais aos seus alunos."
      ]
    },
    descargas: [
      { label_es: "file.formulario_solicitud_cca", label_pt: "file.formulario_solicitud_cca", url_es: "#", url_pt: "#" },
      { label_es: "file.ficha_tecnica_cronograma", label_pt: "file.ficha_tecnica_cronograma", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cv_instructor", label: { es: "file.cv_instructor", pt: "file.cv_instructor" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "ficha_tecnica_llena", label: { es: "file.ficha_tecnica_llena", pt: "file.ficha_tecnica_llena" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "material_didactico", label: { es: "file.material_didactico_zip", pt: "file.material_didactico_zip" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "plantilla_lista_asistencia", label: { es: "file.plantilla_lista_asistencia", pt: "file.plantilla_lista_asistencia" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "cuestionario_evaluacion", label: { es: "file.cuestionario_evaluacion", pt: "file.cuestionario_evaluacion" }, typeLabel: "PDF", validator: FileValidators.pdf }
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
        "Este trámite es gratuito — No requiere comprobante de pago."
      ],
      pt: [
        "Requisito: Ter concluído a Formação Básica EMDR (Nível 1 e Nível 2) com instrutor credenciado.",
        "Requisito: Inscrição profissional ativa ou licença habilitante vigente.",
        "Este trâmite é gratuito — Não requer comprovante de pagamento."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_inicial_emdr", label_pt: "file.solicitud_inicial_emdr", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "certificado_formacion_basica", label: { es: "file.certificado_formacion_basica", pt: "file.certificado_formacion_basica" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "licencia_colegiado", label: { es: "file.licencia_colegiado", pt: "file.licencia_colegiado" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
      { label_es: "file.solicitud_certificacion", label_pt: "file.solicitud_certificacion", url_es: "#", url_pt: "#" },
      { label_es: "file.modelo_carta_recomendacion_peer", label_pt: "file.modelo_carta_recomendacion_peer", url_es: "#", url_pt: "#" },
      { label_es: "file.declaracion_atendimientos", label_pt: "file.declaracion_atendimientos", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cartas_recomendacion", label: { es: "file.recomendaciones_colegas", pt: "file.recomendaciones_colegas" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "aval_supervision_20h", label: { es: "file.aval_supervision_20h", pt: "file.aval_supervision_20h" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_50_sesiones", label: { es: "file.registro_50_sesiones", pt: "file.registro_50_sesiones" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "portafolio_12_creditos", label: { es: "file.portafolio_cca", pt: "file.portafolio_cca" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
        "Requisito: Transcripción de sesión EMDR.",
        "Requisito: Aval de 50h de supervisión.",
        "Requisito: Registro acumulado de 250h de atención clínica.",
        "Requisito: Constancia de terapia personal.",
        "Pago previo: 40 € vía PayPal a financiero@aibapt.org."
      ],
      pt: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Certificado AIBAPT.",
        "Requisito: Transcrição de sessão EMDR.",
        "Requisito: Aval de 50h de supervisão.",
        "Requisito: Registro acumulado de 250h de atendimento clínico.",
        "Requisito: Constância de terapia pessoal.",
        "Pagamento prévio: 40 € via PayPal a financiero@aibapt.org."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_nivel_superior", label_pt: "file.solicitud_nivel_superior", url_es: "#", url_pt: "#" },
      { label_es: "file.guia_transcripcion", label_pt: "file.guia_transcripcion", url_es: "#", url_pt: "#" },
      { label_es: "file.registro_terapia_personal", label_pt: "file.registro_terapia_personal", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "transcripcion_sesion", label: { es: "file.transcripcion_grabacion_sesion", pt: "file.transcripcion_grabacion_sesion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "aval_supervision_50h", label: { es: "file.aval_supervision_50h", pt: "file.aval_supervision_50h" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_atencion", label: { es: "file.registro_atencion", pt: "file.registro_atencion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "constancia_psicoterapia_20h", label: { es: "file.constancia_terapia_personal", pt: "file.constancia_terapia_personal" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
        "Requisito: Transcripción de sesión EMDR.",
        "Requisito: Aval de 50h de supervisión.",
        "Requisito: Registro acumulado de 500h de atención clínica.",
        "Requisito: Constancia de 40h totales de psicoterapia personal.",
        "Pago previo: 50 € vía PayPal a financiero@aibapt.org."
      ],
      pt: [
        "Requisito: Certificado vigente de Psicoterapeuta EMDR Sênior AIBAPT.",
        "Requisito: Transcrição de sessão EMDR.",
        "Requisito: Aval de 50h de supervisão.",
        "Requisito: Registro acumulado de 500h de atendimento clínico.",
        "Requisito: Constância de 40h totais de psicoterapia pessoal.",
        "Pagamento prévio: 50 € via PayPal a financiero@aibapt.org."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_nivel_superior", label_pt: "file.solicitud_nivel_superior", url_es: "#", url_pt: "#" },
      { label_es: "file.guia_transcripcion", label_pt: "file.guia_transcripcion", url_es: "#", url_pt: "#" },
      { label_es: "file.registro_terapia_personal", label_pt: "file.registro_terapia_personal", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "transcripcion_sesion", label: { es: "file.transcripcion_grabacion_sesion", pt: "file.transcripcion_grabacion_sesion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "aval_supervision_50h", label: { es: "file.aval_supervision_50h", pt: "file.aval_supervision_50h" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_atencion", label: { es: "file.registro_atencion", pt: "file.registro_atencion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "constancia_psicoterapia_40h", label: { es: "file.constancia_terapia_personal", pt: "file.constancia_terapia_personal" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
        "Requisito: Registro de 300 sesiones propias.",
        "Pago previo: 40 € vía PayPal a financiero@aibapt.org."
      ],
      pt: [
        "Requisito: Certificado de Psicoterapeuta EMDR Certificado (ou Sênior) vigente da AIBAPT.",
        "Requisito: Certificado de aprovação do Exame Teórico de Supervisão.",
        "Requisito: Registro de 300 sessões próprias.",
        "Pagamento prévio: 40 € via PayPal a financiero@aibapt.org."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_supervisor", label_pt: "file.solicitud_supervisor", url_es: "#", url_pt: "#" },
      { label_es: "file.registro_horas_supervision", label_pt: "file.registro_horas_supervision", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cert_examen_teorico", label: { es: "file.certificado_examen_teorico", pt: "file.certificado_examen_teorico" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_300_sesiones", label: { es: "file.registro_300_sesiones", pt: "file.registro_300_sesiones" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
        "Requisito: Registro de 300 sesiones propias.",
        "Requisito: Registro de 100h de supervisión dadas a otros (Sénior).",
        "Pago previo: 50 € vía PayPal a financiero@aibapt.org."
      ],
      pt: [
        "Requisito: Certificado vigente de Supervisor EMDR Certificado AIBAPT.",
        "Requisito: Registro de 300 sessões próprias.",
        "Requisito: Registro de 100h de supervisão realizadas a outros (Sênior).",
        "Pagamento prévio: 50 € via PayPal a financiero@aibapt.org."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_supervisor", label_pt: "file.solicitud_supervisor", url_es: "#", url_pt: "#" },
      { label_es: "file.registro_horas_supervision", label_pt: "file.registro_horas_supervision", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "cert_examen_teorico", label: { es: "file.certificado_examen_teorico", pt: "file.certificado_examen_teorico" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_300_sesiones", label: { es: "file.registro_300_sesiones", pt: "file.registro_300_sesiones" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "registro_100h_supervision_dadas", label: { es: "file.registro_100h_supervision_dadas", pt: "file.registro_100h_supervision_dadas" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
      { label_es: "file.solicitud_certificacion", label_pt: "file.solicitud_certificacion", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_solicitud", label: { es: "file.solicitud_certificacion", pt: "file.solicitud_certificacion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "portafolio_creditos", label: { es: "file.portafolio_cca", pt: "file.portafolio_cca" }, typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "declaracion_etica", label: { es: "tramite.trauma.field.etica", pt: "tramite.trauma.field.etica" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
        "Presentar copia de la certificación externa y aval de membresía."
      ],
      pt: [
        "Acreditar o cumprimento das normas de validação de credenciais externas da AIBAPT.",
        "Apresentar cópia da certificação externa e aval de membro."
      ]
    },
    descargas: [
      { label_es: "file.solicitud_certificacion", label_pt: "file.solicitud_certificacion", url_es: "#", url_pt: "#" }
    ],
    fields: [
      { name: "formulario_solicitud", label: { es: "file.solicitud_certificacion", pt: "file.solicitud_certificacion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_externo", label: { es: "tramite.emdr.field.cert_ext", pt: "tramite.emdr.field.cert_ext" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
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
    requiresMembership: true,
    instrucciones_leer: {
      es: ["Caso Clínico (Máx 20 págs)", "Declaración de Ética"],
      pt: ["Caso Clínico (Máx 20 págs)", "Declaração de Ética"]
    },
    descargas: [],
    fields: [
      { name: "caso_clinico", label: { es: "tramite.trauma.field.caso", pt: "tramite.trauma.field.caso" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "declaracion_etico", label: { es: "tramite.trauma.field.etica", pt: "tramite.trauma.field.etica" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "equivalencia_basica": {
    id: "equivalencia_basica",
    categoria: { es: "Formación", pt: "Formação" },
    title: { es: "Equivalencia Básica", pt: "Equivalência Básica" },
    description: { es: "Convalidación de cursos externos.", pt: "Convalidação de cursos externos." },
    monto: [
      { id: 'equiv_alumno', label: { es: "Equivalencia Alumno", pt: "Equivalência Aluno" }, monto: 20, description: { es: "Convalidación para alumnos.", pt: "Convalidação para alumnos." } },
      { id: 'equiv_formador', label: { es: "Equivalencia Formador", pt: "Equivalência Formador" }, monto: 50, description: { es: "Convalidación para formadores.", pt: "Convalidação para formadores." } }
    ],
    requiresMembership: true,
    instrucciones_leer: {
      es: ["Programa del curso externo", "Evidencia de duración"],
      pt: ["Programa do curso externo", "Evidência de duração"]
    },
    descargas: [],
    fields: [
      { name: "programa_curso", label: { es: "tramite.equiv_basica.field.programa", pt: "tramite.equiv_basica.field.programa" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "evidencia_duracion", label: { es: "tramite.equiv_basica.field.duracion", pt: "tramite.equiv_basica.field.duracion" }, typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: { es: "tramite.emdr.field.pago", pt: "tramite.emdr.field.pago" }, typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  }
};
