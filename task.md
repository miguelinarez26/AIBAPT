# Bitácora de Tareas - AIBAPT

## Información del Contexto
* **Rama Git Actual:** `diseno-nuevo`
* **Rama de Origen (Copia):** `correccion-afiliaciones-y-certificaciones-despues-del-merge`
* **Última Acción:** Configuración e integración de reglas de desarrollo y compactación de memoria en la IDE y en `gemini.md`.

## Lista de Tareas (Checklist)

- [ ] **Fase 1: Traer el directorio de Miembros original de la rama de origen**
  - [ ] Obtener las rutas de archivos de miembros en la rama `correccion-afiliaciones-y-certificaciones-despues-del-merge`.
  - [ ] Copiar/checkout el directorio `miembros` de esa rama al directorio local `src/app/[lang]/miembros/`.
  - [ ] Adaptar rutas e importaciones (localization `[lang]`, layout wrapper) para que no rompa el proyecto.
  - [ ] Ejecutar compilación de prueba (`npm run build`) para verificar que el backend y traducciones funcionan.

- [ ] **Fase 2: Aplicar el nuevo diseño premium al Directorio de Miembros**
  - [ ] Adaptar `MembersClient.tsx` para usar la barra de búsqueda glassmorphic y selector de vistas (Grid/Lista) estilo *Socios*.
  - [ ] Implementar tarjetas premium con portadas degradadas y avatares flotantes.
  - [ ] Ajustar el panel lateral (Drawer) para alinearlo al tema claro y limpio.
  - [ ] Estandarizar el diseño de `MemberProfileClient.tsx` (ficha del perfil dinámico) y remover estilos oscuros redundantes.
