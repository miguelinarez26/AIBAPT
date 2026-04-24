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
  label: string;
  description?: string;
  validator: z.ZodTypeAny;
  typeLabel: string;
  isOptional?: boolean;
};

export type EscenarioEvento = {
  id: string;
  label: string;
  monto: number;
  description: string;
};

export type TramiteConfig = {
  id: string;
  categoria: string;
  title: string;
  description: string;
  monto: number | string | EscenarioEvento[];
  instrucciones_leer: string[];
  descargas: { label: string; url: string }[];
  fields: FieldDefinition[];
  hasModalitySelection?: boolean; // For CCA Online where "Cuestionario de Evaluación" is required
};

export const AIBAPT_TRAMITES: Record<string, TramiteConfig> = {
  "cca": {
    id: "cca",
    categoria: "CCA Y EVENTOS",
    title: "Acreditación de Cursos Avanzados (CCA)",
    description: "Validación de cursos para otorgar créditos oficiales.",
    monto: 50,
    hasModalitySelection: true,
    instrucciones_leer: [
      "Objetivo: Validación de cursos para otorgar créditos oficiales.",
      "Vigencia: 2 años.",
      "Costo: 50 €.",
      "Requisitos Clave: Solo para psicoterapeutas o supervisores certificados por AIBAPT."
    ],
    descargas: [
      { label: "Formulario de Solicitud CCA", url: "#" },
      { label: "Ficha Técnica con cronograma", url: "#" },
      { label: "Plantilla Control de Asistencia", url: "#" }
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
    categoria: "CCA Y EVENTOS",
    title: "Eventos, Congresos y Seminarios",
    description: "Acreditación de eventos puntuales o congresos completos.",
    monto: [
      { id: "2A", label: "2A: Conferencias (Charla única)", monto: 20, description: "Acreditación para una charla individual." },
      { id: "2B", label: "2B: Workshops/Talleres (Práctico)", monto: 30, description: "Acreditación para talleres con enfoque práctico." },
      { id: "2C", label: "2C: Eventos Completos/Congresos", monto: 50, description: "Acreditación para congresos completos." }
    ],
    instrucciones_leer: [
      "Escenarios de Pago: 20€ (Charla), 30€ (Taller), 50€ (Congreso).",
      "Documentos obligatorios incluyen CV del Facilitador, Material del Evento y Agenda.",
      "Asegúrate de seleccionar el escenario correcto para que el comprobante de pago coincida con el monto establecido."
    ],
    descargas: [
      { label: "Ficha de Solicitación", url: "#" },
      { label: "Ficha Técnica", url: "#" },
      { label: "Formularios de Gestión/Registro", url: "#" }
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
    categoria: "CCA Y EVENTOS",
    title: "Emisión de Certificado CCA (Para Estudiantes)",
    description: "Solicitud del certificado tras finalizar un curso acreditado.",
    monto: "10 € (Socios) / 15 € (No Socios) por bloque de 12 créditos",
    instrucciones_leer: [
      "Plazo: Hasta 5 meses después de terminar el curso.",
      "Tarifas: Socio Activo (10 €), No Socio (15 €) por bloque de 12 créditos."
    ],
    descargas: [],
    fields: [
      { name: "certificado_formacion", label: "Certificado de Formación Básica reconocido", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "certificado_curso_avanzado", label: "Certificado del Curso Avanzado", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "renovacion_cca": {
    id: "renovacion_cca",
    categoria: "CCA Y EVENTOS",
    title: "Renovación y Mantenimiento (CCA / Equivalencia)",
    description: "Trámites para renovar certificación CCA o Mantenimiento de Equivalencia.",
    monto: "50 € (Renovación) / 25 € (Mantenimiento Equivalencia)",
    instrucciones_leer: [
      "Costo Renovación Curso: 50 €.",
      "Costo Mantenimiento Equivalencia: 25 €.",
      "Requisito: Haber sumado 12 créditos CCA en los últimos 2 años (mínimo 8 en PsicoTrauma)."
    ],
    descargas: [],
    fields: [
      { name: "evidencia_creditos", label: "Evidencia de los 12 créditos CCA", typeLabel: "PDF o ZIP", validator: FileValidators.pdfOrZip },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_psicoterapeuta": {
    id: "cert_psicoterapeuta",
    categoria: "CERTIFICACIONES EMDR",
    title: "Certificación Inicial - Psicoterapeuta",
    description: "Certificación inicial en EMDR como psicoterapeuta.",
    monto: 20,
    instrucciones_leer: [
      "Costo: 20 €.",
      "Requisitos: 2 años de práctica, 50 sesiones con 25 pacientes, 20h de supervisión AIBAPT."
    ],
    descargas: [
      { label: "Formulario de Solicitud", url: "#" },
      { label: "Plantilla de Carta de Recomendación", url: "#" }
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
    categoria: "CERTIFICACIONES EMDR",
    title: "Certificación Inicial - Supervisor",
    description: "Certificación inicial en EMDR como supervisor.",
    monto: 40,
    instrucciones_leer: [
      "Costo: 40 €.",
      "Requisitos: Psicoterapeuta certificado por 3 años, 300 sesiones con 75 pacientes, 20h de 'supervisión de la supervisión'."
    ],
    descargas: [
      { label: "Formulario de Supervisor", url: "#" }
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
    categoria: "CERTIFICACIONES EMDR",
    title: "Procesos de Equivalencia EMDR",
    description: "Proceso para profesionales con certificación de otras asociaciones reconocidas.",
    monto: "20 € (Psicoterapeuta) / 40 € (Supervisor)",
    instrucciones_leer: [
      "Requisito: Certificación vigente de otras asociaciones reconocidas (EMDRIA, etc.)."
    ],
    descargas: [],
    fields: [
      { name: "certificacion_vigente", label: "Certificación vigente de otras asociaciones", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  },
  "cert_psicotrauma": {
    id: "cert_psicotrauma",
    categoria: "FORMACIONES EN PSICOTRAUMA",
    title: "Certificación Individual (Psicoterapeuta)",
    description: "Certificación en Psicotrauma.",
    monto: 20,
    instrucciones_leer: [
      "Documento Crítico: Caso Clínico. Formato: PDF, máximo 20 páginas, Calibri 12, interlineado 1.5.",
      "Incluir Declaración de Adhesión al Código Ético y Certificados académicos previos."
    ],
    descargas: [
      { label: "Declaración de Adhesión al Código Ético", url: "#" }
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
    categoria: "FORMACIONES EN PSICOTRAUMA",
    title: "Acreditación de Programas de Formación",
    description: "Dirigido a institutos o universidades.",
    monto: 50,
    instrucciones_leer: [
      "Requisitos: Programa de mínimo 5 módulos, contenidos mínimos obligatorios, equipo docente especialista."
    ],
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
    categoria: "FORMACIONES EN PSICOTRAUMA",
    title: "Reconocimiento de Formación Básica",
    description: "Proceso de equivalencia para formación básica externa.",
    monto: "20 € (Alumnos) / 50 € (Formadores)",
    instrucciones_leer: [
      "Requisito: El curso externo debe durar mínimo 1 año y coincidir en contenidos con AIBAPT."
    ],
    descargas: [],
    fields: [
      { name: "programa_curso", label: "Programa del Curso Externo", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "evidencia_duracion", label: "Evidencia de duración y contenidos", typeLabel: "PDF", validator: FileValidators.pdf },
      { name: "comprobante_pago", label: "Comprobante de Pago", typeLabel: "PDF o Imagen", validator: FileValidators.pdfOrImage }
    ]
  }
};
