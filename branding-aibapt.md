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
  --color-highlight: #ffd47f;
  --color-text-light: #333333;   
  --color-text-dark: #666666;    
  --color-background-light: #FFFFFF;
}
```

/* Referencia técnica:
   --primary-color: R 90, G 153, B 84
   --secondary-color: R 148, G 217, B 141
   --accent-color: R 217, G 88, B 88
   --highlight-color: R 255, G 212, B 127
*/
