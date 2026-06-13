# AIBAPT Organics Prototype - Design System

Esta es la fuente de la verdad para el diseño y configuración visual del proyecto.

## Paleta Principal
- **Primario (Verde orgánico):** `#5a9954` (Color verde principal, base del logo)
- **Secundario (Verde claro):** `#94d98d` (Color verde secundario, detalle del logo)
- **Acento (Rojo sangre):** `#d95858` (Acento del logo)
- **Acento Claro (Naranja):** `#ff7a59` (Luz del degradado en el logo)
- **Degradado Oficial de Acento:** `linear-gradient(to bottom left, #d95858, #ff7a59)`
- **Destacado (Amarillo/Crema):** `#ffd47f` (Acento del logo)
- **Texto Principal:** `#333333` (Lectura óptima en párrafos)
- **Texto Secundario:** `#666666` (Textos de apoyo, etiquetas)
- **Blanco Puro:** `#FFFFFF` (Fondos principales)

## Tipografía (Aller)
Toda la aplicación utilizará la fuente **Aller** (pesos 400 y 700) extraída del manual de identidad de AIBAPT.

## Utilidad de Tailwind CSS (Referencia V4)
Dado que estamos usando Tailwind V4, estas variables deben reflejarse en nuestro archivo `globals.css` (o equivalente) en la raíz del App Router:

```css
@theme {
  --color-primary: #5a9954;      
  --color-secondary: #94d98d;    
  --color-accent: #d95858;       
  --color-accent-light: #ff7a59;
  --color-highlight: #ffd47f;
  --color-text-light: #333333;   
  --color-text-dark: #666666;    
  --color-background-light: #FFFFFF;
  --background-image-accent-gradient: linear-gradient(to bottom left, #d95858, #ff7a59);
}
```

/* Referencia técnica:
   --primary-color: R 90, G 153, B 84
   --secondary-color: R 148, G 217, B 141
   --accent-color: R 217, G 88, B 88
   --highlight-color: R 255, G 212, B 127
*/

## Patrones de Interacción (UI Components)

### Botones con Flecha Dinámica (Estilo Navbar / Portal)
Para mantener consistencia, los botones principales que llevan a la acción deben tener la siguiente estructura interactiva en Tailwind V4:
- Contenedor principal: Usar `rounded-full`, padding adecuado, y `transition-all duration-300 hover:-translate-y-1`.
- Aislamiento de grupo: Agregar `group/btn` al contenedor principal para que los efectos internos no interactúen con otros grupos (como menús desplegables).
- Ícono interno: Un círculo de fondo semi-transparente conteniendo el SVG oficial de la flecha de la marca (con eje horizontal, no un chevron de Lucide):
  ```xml
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
  ```
- Animación del ícono: Agregar `transition-transform duration-300 group-hover/btn:translate-x-1` al contenedor del ícono para que la flecha se mueva a la derecha cuando el usuario interactúe con el botón principal.

### Sistema de Tarjetas (Cards)
Para mantener la consistencia en el diseño de AIBAPT, existen tres tipos principales de tarjetas:

**1. Tarjetas Fijas (Colores Sólidos)**
Para secciones fundamentales de identidad (como Misión y Visión) que deben leerse de arriba a abajo sin requerir interacción:
- No tienen efecto hover de cambio de fondo.
- Utilizan los colores principales de forma directa y permanente: `bg-primary` para tarjetas principales (Misión) y `bg-secondary` para tarjetas secundarias (Visión).
- El texto es invariablemente blanco o claro para asegurar la máxima legibilidad.

**2. Tarjetas Dinámicas (Hover Inversion)**
Para secciones informativas o listas de valor (Pilares, Servicios) que buscan interactividad y dinamismo:
- **Estado Reposo:** Fondo gris muy claro o blanco (`bg-gray-50` o `bg-white`), bordes redondeados amplios (`rounded-[32px]` o `rounded-2xl`), y texto con jerarquía (`text-text-light` para títulos, `text-text-dark` para cuerpo).
- **Transición:** `transition-colors duration-500` (transición larga y suave obligatoria).
- **Estado Hover:** El fondo de la tarjeta cambia a un color sólido de la paleta (`hover:bg-primary`, `hover:bg-secondary`, etc.). Los textos internos invierten su color a blanco o claro (`group-hover:text-white`) para mantener contraste.

**3. Tarjetas de Perfil (Organigrama)**
Específicas para presentar personas o perfiles directivos, donde la foto y la estructura son el foco principal:
- **Estado Reposo:** Fondo inmaculado (`bg-white`) con un borde medio (2px) acentuado utilizando el color Accent (`border-2 border-accent`). La foto de perfil lleva un marco grueso blanco (`border-4 border-white`) y una sombra limpia (`shadow-xl`).
- **Estado Hover:** Al interactuar, el borde de la tarjeta principal cambia sutilmente al Accent Light (`hover:border-accent-light`), añadiendo un resplandor de sombra (`hover:shadow-accent/10`). La fotografía se mantiene limpia y solo reacciona con un levísimo zoom interno (`group-hover/card:scale-105`) para no recargar visualmente el componente.

**4. Jerarquía y Conectores (Minimalismo Estructural)**
Regla estricta aprobada para estructuras dependientes (organigramas, jerarquías, listas anidadas):
- **Cero Líneas Conectoras:** Queda prohibido el uso de líneas verticales u horizontales (sólidas o punteadas) para conectar "tarjetas padre" con "tarjetas hijo". Estas líneas restan limpieza y modernidad al diseño.
- **Jerarquía por Indentación:** La pertenencia de un sub-elemento (ej. un comité dentro de una dirección) se representa **únicamente mediante margen izquierdo (indentación)** y proximidad visual. 
- **Sub-tarjetas:** Deben tener una estética limpia (ej. `border-2 border-gray-100`) y al interactuar, deben iluminarse con el color Secondary (`hover:border-secondary`), contrastando armónicamente con el borde Accent de su tarjeta padre.

**5. Tarjetas Premium de Directorio (Portada Red Social)**
Para el directorio de miembros o especialistas, se aplica una estética premium unificada que imita una tarjeta de red social:
- **Vista Cuadrícula (Grid):** Incorporan un "Cover Photo" (franja superior `h-28`) con un degradado vibrante. El avatar se superpone flotando a la mitad de la intersección (`absolute -bottom-12`). El pie de la tarjeta incluye certificaciones minimalistas grises que se iluminan en verde (`group-hover/card:bg-secondary/15 group-hover/card:text-primary`) al interactuar.
- **Vista Lista (Row):** Es el hermano horizontal del Grid. Lleva un bloque izquierdo sólido simulando el Cover Photo, y el avatar se solapa ligeramente usando márgenes negativos (`-ml-12`). El botón final de acción ("Ver perfil") siempre se ilumina con el color `accent` en hover.

## Estructura Visual y Composición de Páginas
Para garantizar la estética premium y etérea en todas las nuevas páginas (como Quiénes Somos), se deben aplicar los siguientes patrones de composición:

### 1. Fondos y Elementos Decorativos (Glassmorphism / Glow)
- El contenedor principal de la página debe usar `bg-background-light`.
- **Glows Decorativos:** Se deben incluir figuras abstractas desenfocadas en el fondo absoluto (`-z-10`) usando colores de la paleta con muy baja opacidad y blur extremo (ej. `bg-primary/10 blur-[100px]` o `bg-secondary/10 blur-[120px]`). Esto rompe la monotonía del fondo blanco dándole una vibra premium.

### 2. Encabezados de Sección (Estándar Anti Falso-Fondo)
Para evitar el efecto de "falso fondo" (donde el usuario no percibe que hay más contenido y abandona), todas las introducciones a secciones principales deben seguir estrictamente este estándar compacto:
- **Padding Superior General (Regla de Oro):** El contenedor principal `<main>` de la página debe tener un padding superior de `pt-8 md:pt-12` (o `pt-10 md:pt-12` como máximo) para despegarse del Navbar.
- **Regla Estricta de Alineación Vertical:** El contenedor interno de ancho (`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`) **NUNCA** debe llevar clases de padding superior (como `pt-6`, `pt-8`, `pt-12` o similares). El primer bloque de contenido (generalmente el badge/etiqueta) debe iniciar directamente heredando el padding únicamente del contenedor `<main>` principal para asegurar que la alineación vertical de la primera línea de texto sea milimétricamente idéntica en todo el sitio.
- **Márgenes de Contenedor:** El contenedor del bloque de texto (título + intro) debe usar como máximo `mb-10` o `mb-6`. **Nunca usar `mb-20`**.
- **Etiqueta (Badge):** Un "pill" superior con fondo sutil (`bg-primary/10`), texto del color de la marca (`text-primary`), en mayúsculas (`uppercase tracking-wider`), con tamaño de fuente estándar **xs** (`text-xs`) y margen inferior controlado (`mb-3`) en todas las páginas (como Quiénes Somos y Contacto) para asegurar total uniformidad visual.
- **Título Principal (H1):** Tamaño estandarizado, elegante y proporcionado: `text-4xl md:text-5xl font-serif text-text-light mb-4 leading-[1.1]`. **Queda prohibido usar tamaños desproporcionados como `text-[60px]`** que empujen el contenido principal debajo del primer pantallazo ("above the fold").
- **Subtítulo (Párrafo descriptivo):** Funciona como una nota aclaratoria fina. Su tamaño estándar debe ser `text-sm md:text-base text-text-dark leading-relaxed`.
- **Regla Estricta de Ancho:** Es **OBLIGATORIO** incluir la regla de ancho máximo `max-w-2xl mx-auto` (o similar) en los subtítulos para evitar que las líneas de texto se estiren de lado a lado de la pantalla, lo cual causa fatiga visual.
- **Énfasis en Títulos:** Se permite destacar palabras clave dentro del título usando cursiva, peso ligero y color primario: `<span className="italic font-light text-primary">Palabra</span>`.

### 3. Animaciones de Entrada (Framer Motion)
Las páginas no deben ser estáticas al cargar. Todas deben implementar `framer-motion` para presentar el contenido suavemente:
- **Fade In Up:** Los elementos deben aparecer deslizándose suavemente hacia arriba (`initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: "easeOut" }}`).
- **Stagger:** En cuadrículas o listas (como los Pilares o el Organigrama), los elementos deben aparecer en cascada uno tras otro (usando `delay` secuencial o `staggerChildren: 0.1`).

### 4. Micro-interacciones y Botones con Flecha
- **Flechas Animadas:** Por cada interacción hover en un botón o enlace que indique "Ver más", "Ir", o una acción de navegación, si existe un icono de flecha, este **debe desplazarse hacia la derecha** (`group-hover:translate-x-1` o `group-hover/btn:translate-x-1`). La transición debe ser suave (`transition-transform duration-300`).

## Estándares de Interfaz y UX (Botones y Filtros)

### 1. Tipografía en Botones (Casing UX)
- **Prohibido el uso de ALL CAPS:** Queda terminantemente prohibido usar mayúsculas sostenidas (ej. "INSCRIPCIÓN") en los botones de acción principales.
- **Estándar:** Todos los botones deben usar "Sentence case" o "Title Case" (ej. "Inscripción", "Ir a la inscripción", "Ver perfil"). Esto garantiza un diseño más humano, conversacional y estéticamente superior. Las mayúsculas sostenidas se reservan únicamente para etiquetas diminutas (badges).

### 2. Estilos de Botones Premium en Tarjetas
- **Botón Fantasma (Grid View):** Para vistas en cuadrícula, la acción principal utiliza un "Ghost Button". Fondo transparente, borde de color (`border-2 border-accent`), texto de color, y el ícono dentro de un círculo con 10% de opacidad. Al hacer hover, el botón se rellena (`hover:bg-accent`), el texto se vuelve blanco, y el círculo del ícono se ilumina (`bg-white/20`) desplazándose a la derecha.
- **Botón Sólido "Pill-in-Pill" (List View):** Para vistas en lista, se usa un botón sólido completo (fondo `bg-accent` y texto blanco). El ícono interior vive dentro de su propia burbuja (`bg-white/20 rounded-full`). En hover, el fondo cambia sutilmente a la versión *light* y la burbuja del ícono se desplaza a la derecha.

### 3. Filtros y Selectores
- **Pilas vs Dropdowns:** Cuando hay 3 opciones o menos (ej. "Todos", "Oficiales", "Certificados"), se **deben usar Pilas (Pills)** (botones contiguos) dentro de una barra contenedora en lugar de un menú desplegable (`select`). Esto ahorra clics y mejora la usabilidad visual.
- **Barra de Cristal (Glassmorphism):** El contenedor de estas pilas o de la barra de búsqueda superior debe utilizar el efecto cristal unificado: `bg-white/80 backdrop-blur border border-gray-100 rounded-full shadow-sm p-1`. Las pilas activas ganan un color sólido y una pequeña sombra (`shadow-sm scale-105`), y las inactivas quedan transparentes esperando el hover.
- **Dropdowns Largos:** Para listas largas (ej. Países), se acepta el uso de dropdowns personalizados. **Regla de contraste:** El color del texto del trigger (ej. "País (Todos)") debe ser idéntico al color oscuro del ícono (`text-primary`), evitando usar colores claros (`text-secondary`) sobre fondos blancos para no causar choque visual o ilegibilidad.

### 4. Validaciones de Formularios y Estados de Botones (Regla Anti-Bloqueo)
Para garantizar la mejor experiencia de usuario (UX) en AIBAPT, se aplicará el estándar de validación activa en lugar de bloqueo silencioso.
- **Botones Siempre Activos:** Queda prohibido el uso de botones principales "opacados" o deshabilitados (`disabled`) condicionados a rellenar campos. El usuario siempre debe poder hacer clic en el botón de acción principal (ej. "Comenzar", "Pagar", "Continuar").
- **Excepción de Carga:** La única excepción válida para deshabilitar un botón es cuando el formulario ya se envió y está en estado de carga (`isSubmitting === true`), en cuyo caso el botón mostrará un spinner (`Loader2` de lucide-react).
- **Diseño del Mensaje de Error (Alerta de Validación):** Si el usuario hace clic en el botón activo pero faltan campos requeridos o hay un error, se debe mostrar de inmediato una alerta de validación utilizando estrictamente el siguiente diseño:
  ```jsx
  <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
    <span className="material-icons-round mr-2">error_outline</span>
    {mensajeDeError}
  </div>
  ```
- **Flujo de Error:** Las validaciones deben interrumpir el envío a la base de datos (función `onSubmit`) estableciendo un estado de error (`setError('Mensaje descriptivo')`) que renderice la alerta diseñada anteriormente, indicando exactamente qué campo falta o qué acción requiere el usuario.
