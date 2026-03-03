# Documento Maestro de Requerimientos: Sitio Web AIBAPT

## 1. Visión General
El objetivo es el desarrollo de una plataforma robusta para la **Asociación Iberoamericana de Psicotrauma (AIBAPT)** que gestione membresías, certificaciones, eventos formativos y contenido educativo, con un alto grado de automatización.

## 2. Automatizaciones Core (Backend & Notificaciones)
El sistema debe ser autónomo en la gestión de flujos críticos:

* **Membresía:**
    * Proceso de afiliación con pausa de 15 días para revisión.
    * Notificación automática a Erika sobre solicitudes y su estatus.
    * Renovación anual automatizada (TDC, PayPal, etc.).
    * Bloqueo automático de acceso para socios morosos.
* **Formación y Webinars:**
    * Verificación automática de estatus del socio para inscripción/acceso.
    * Generación automática de certificados tras evaluación de conocimientos (cuestionario de 2 preguntas, 4 opciones).
    * Cobro de tasa (1 euro) para acreditación de créditos avanzados.
    * Notificaciones automáticas sobre disponibilidad de videos y formularios.
* **Gestión de Usuarios:**
    * Perfil autogestionable (datos personales, currículum, contacto).
    * "Mis eventos grabados": Acceso estipulado según perfil (socio vs. no socio).

## 3. Arquitectura del Sitio (Frontend)
### Inicio (Landing Page)
* Video de bienvenida.
* Estrategia corporativa, misión y visión.
* Calendario de webinars 2025 (visible en primera entrada).
* Estructura funcional, organigrama y contacto de comités.

### Gestión de Formación
* Lista de cursos avanzados.
* Sección "Mis eventos grabados" con control de tiempo de visualización.
* Calendario anual de webinars.

### Descargas y Documentación
* Manuales profesionales (maquetación editorial) en español y portugués.
* Formularios editables para solicitudes de membresía y certificación.
* Emisión de facturación digital automatizada.

## 4. Gestión de Datos y Contenido
* **Organización:** Clasificación de socios por categoría, país y ciudad.
* **Backoffice:** Posibilidad de que Daniel Oliveira realice actualizaciones manuales si el sistema principal requiere intervención.

## 5. Directrices Técnicas para Antigravity
* **Autenticación:** El sistema debe verificar en tiempo real si el socio está al corriente de su anualidad para permitir el acceso a recursos.
* **UI/UX:** Diseño profesional, enfocado en facilitar la navegación. La información de los cargos directivos debe estar claramente vinculada a su experiencia y número de miembro.
* **Escalabilidad:** Las automatizaciones deben ser modulares para permitir cambios futuros en la Junta Directiva o nuevos comités.
* **Idioma:** Toda la plataforma y comunicación deben ser en español.
