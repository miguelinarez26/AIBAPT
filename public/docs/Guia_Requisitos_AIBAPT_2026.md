# Contenido del archivo .md generado
md_content = """# Guía Maestra de Requisitos y Lógica de Negocio: AIBAPT 2026

Este documento sirve como la especificación técnica oficial para el desarrollo del portal de acreditaciones de la Asociación IberoAmericana de PsicoTrauma (AIBAPT).

---

## 🛠 Notas de Implementación Técnica (Estándar CarMiDev)

- **Validación de Archivos:** Límite estricto de **10MB** por archivo en el frontend.
- **Formatos Permitidos:** Mayoritariamente PDF y ZIP. Imágenes solo para comprobantes de pago o material de marketing.
- **Estructura de UI:** Implementación obligatoria de **Steppers** o pestañas para dividir el flujo en:
  1. **Información (A. Leer):** Requisitos y normativa.
  2. **Descarga (B. Bajar):** Plantillas oficiales en blanco.
  3. **Acción (C. Subir):** Carga de documentos y validación con Zod.

---

## 📚 SECCIÓN 1: CURSOS AVANZADOS Y EVENTOS (CCA)

### 1.1 Acreditación de Cursos Avanzados (CCA)
- **Objetivo:** Validación de cursos para otorgar créditos oficiales.
- **Vigencia:** 2 años.
- **Costo:** 50 €.
- **Requisitos Clave:** Solo para psicoterapeutas o supervisores certificados por AIBAPT.
- **Documentos a Subir:**
  - CV del Instructor (PDF).
  - Formulario de Solicitud firmado (PDF).
  - Ficha Técnica con cronograma (PDF).
  - Calendario y Marketing (PDF/Imagen).
  - Material Didáctico (PDF/ZIP).
  - Plantillas de Control de asistencia (PDF).
  - **Cuestionario de Evaluación (Solo si es Online):** Obligatorio (2 preguntas por hora de curso).
  - Comprobante de Pago (PDF/Imagen).

### 1.2 Eventos, Congresos y Seminarios
- **Escenarios de Pago:**
  - **2A: Conferencias (Charla única):** 20 €.
  - **2B: Workshops/Talleres (Práctico):** 30 €.
  - **2C: Eventos Completos/Congresos:** 50 €.
- **Documentos a Subir:**
  - CV del Facilitador (PDF).
  - Ficha de Solicitación y Ficha Técnica (PDF).
  - Calendario del Evento/Agenda (PDF).
  - Material del Evento (PDF/ZIP).
  - Formularios de Gestión/Registro (PDF).
  - Comprobante de Pago según el escenario elegido.

### 1.3 Emisión de Certificado CCA (Para Estudiantes)
- **Plazo:** Hasta 5 meses después de terminar el curso.
- **Tarifas:** - **Socio Activo:** 10 € (por bloque de 12 créditos).
  - **No Socio:** 15 € (por bloque de 12 créditos).
- **Documentos a Subir:**
  - Certificado de Formación Básica reconocido (PDF).
  - Certificado del Curso Avanzado (PDF).
  - Comprobante de Pago.

### 1.4 Renovación y Mantenimiento (CCA / Equivalencia)
- **Costo Renovación Curso:** 50 €.
- **Costo Mantenimiento Equivalencia:** 25 €.
- **Requisito:** Haber sumado 12 créditos CCA en los últimos 2 años (mínimo 8 en PsicoTrauma).

---

## 🧠 SECCIÓN 2: CERTIFICACIONES EMDR

### 2.1 Certificación Inicial - Psicoterapeuta
- **Costo:** 20 €.
- **Requisitos:** 2 años de práctica, 50 sesiones con 25 pacientes, 20h de supervisión AIBAPT.
- **Documentos a Subir:**
  - Formulario de Solicitud.
  - 2 Cartas de Recomendación (Peer Review).
  - 1 Carta de recomendación del Supervisor (Aval de las 20h).
  - Certificados de Entrenamiento Básico (Nivel 1 y 2).
  - Comprobante de Pago.

### 2.2 Certificación Inicial - Supervisor
- **Costo:** 40 €.
- **Requisitos:** Psicoterapeuta certificado por 3 años, 300 sesiones con 75 pacientes, 20h de "supervisión de la supervisión".
- **Documentos a Subir:**
  - Formulario de Supervisor.
  - Certificado vigente de Psicoterapeuta.
  - Carta de recomendación de un Trainer o Supervisor Senior.
  - Registro de las 20h de supervisión de supervisión.
  - Comprobante de Pago.

### 2.3 Procesos de Equivalencia EMDR
- **Costo Psicoterapeuta:** 20 €.
- **Costo Supervisor:** 40 €.
- **Requisito:** Certificación vigente de otras asociaciones reconocidas (EMDRIA, etc.).

---

## 🏥 SECCIÓN 3: FORMACIONES EN PSICOTRAUMA

### 3.1 Certificación Individual (Psicoterapeuta de Psicotrauma)
- **Costo:** 20 €.
- **Documento Crítico:** **Caso Clínico**.
  - **Formato:** PDF, máximo 20 páginas, Calibri 12, interlineado 1.5.
- **Otros Documentos:** Declaración de Adhesión al Código Ético, Certificados académicos previos.

### 3.2 Acreditación de Programas de Formación
- **Dirigido a:** Institutos o universidades.
- **Costo:** 50 €.
- **Requisitos:** Programa de mínimo 5 módulos, contenidos mínimos obligatorios, equipo docente especialista.
- **Documentos a Subir:** Proyecto Pedagógico, CVs del equipo docente, Material de Evaluación.

### 3.3 Reconocimiento de Formación Básica (Equivalencia)
- **Costo:** 20 € (Alumnos) / 50 € (Formadores).
- **Requisito:** El curso externo debe durar mínimo 1 año y coincidir en contenidos con AIBAPT.
"""