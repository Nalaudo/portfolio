# Logo personal — NB

Monograma "NB" en grilla de píxeles (dos letras de 5×7, generadas a mano en una grilla de 11×7),
con degradé volt→plasma (los mismos colores de acento del portfolio). Conecta con el "NB-OS" de
la pantalla de arranque del sitio.

## Archivos

| Archivo | Fondo | Uso |
|---|---|---|
| `logo.svg` / `logo-512.png` / `logo-180.png` | Cuadrado oscuro (#05060b) | Favicon, avatar de GitHub/LinkedIn, ícono de app — cualquier lugar que pida un cuadrado con fondo. |
| `logo-mark.svg` / `logo-mark-512.png` | Transparente, con el degradé | Superponer sobre fotos, headers, slides, merch — donde el fondo ya lo pone otra cosa. |
| `logo-mono.svg` | Transparente, `fill="currentColor"` | Para usar en un solo color (documentos, sellos, grabado, fondos claros). Heredá el color con CSS o cambiá el `color` del contenedor. |

Todos son SVG vectorial: escalan a cualquier tamaño sin perder nitidez, desde un favicon de 16 px
hasta un banner. Los `.png` de 512×512 (y 180×180 para *apple-touch-icon*) están para plataformas
que todavía no aceptan SVG.

## Regenerar / editar el diseño

El monograma sale de dos bitmaps de 5×7 (una N y una B), definidos en
`portfolio/src/components/ui/Logo.tsx` (constante `PIXELS`) — ese es el componente que usa el
sitio en vivo (en el header). Los archivos de esta carpeta son una exportación estática de esa
misma grilla para usar fuera del proyecto. Si cambiás el diseño en `Logo.tsx`, regenerá estos
archivos con el mismo patrón de coordenadas.
