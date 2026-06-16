# Bitácora de Tareas - AIBAPT

## Información del Contexto
* **Rama Git Actual:** `diseno-nuevo`
* **Rama de Origen (Copia):** `correccion-afiliaciones-y-certificaciones-despues-del-merge`
* **Última Acción:** Configuración e integración de reglas de desarrollo y compactación de memoria en la IDE y en `gemini.md`.

## Lista de Tareas (Checklist)

- [ ] **Fase 1: Traer el directorio de Miembros original de la rama de origen** (Pendiente)
- [ ] **Fase 2: Aplicar el nuevo diseño premium al Directorio de Miembros** (Pendiente)
- [x] **Fase Externa: Inversión de hover en botones de redes sociales** (Completado)
- [x] **Fase 3: Integración de Configuración y traducción bilingüe de Trámites (Normativa 2026)** (Completado)
  - [x] Registrar llaves de traducción `file.*` y `stepper.*` en `translations.ts` (ES/PT)
  - [x] Saneamiento de `aibapt-config.ts` aplicando llaves de traducción, `requiresMembership: true`, y nuevos campos
  - [x] Añadir el trámite de docentes `acreditacion_curso_docente` en `aibapt-config.ts`
  - [x] Adaptar `UniversalStepper.tsx` para usar `t()` en `getTranslation` e i18n en toda la interfaz
  - [x] Modificar `AfiliacionPortalClient.tsx` para redireccionar a contacto si `isContactForm: true`
  - [x] Validar con `npm run build`
