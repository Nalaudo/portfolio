# Portfolio jugable · Nicolás Balaudo

Portfolio interactivo con forma de juego: pantalla de *Press Start*, mapa de mundos por el que camina la
mascota **Bit**, un nivel por proyecto con una **demo jugable** de lo que hace el proyecto real, XP, rangos,
logros, estrellas escondidas y un easter egg.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview
```

## Stack

Vite 8 · React 19 · TypeScript · Tailwind CSS v4 · `motion` · lucide-react · fuentes self-hosted
(Unbounded, Inter, JetBrains Mono). Sin backend: el progreso vive en `localStorage`.
SFX sintetizados con WebAudio (sin assets), activados por defecto; el botón de sonido del HUD (o de la pantalla de inicio) los silencia y esa preferencia se recuerda. También se silencian solos en pestañas sin foco (Page Visibility API) — no siguen sonando en segundo plano.

## Qué editar

| Qué | Dónde |
|---|---|
| Nombre, rol, email, GitHub, LinkedIn, idiomas, formación | `src/data/profile.ts` (según el CV y LinkedIn) |
| Proyectos, stats, misiones, colores | `src/data/projects.ts` |
| Inventario de tecnologías | `src/data/skills.ts` (la rareza se calcula sola según en cuántos mundos y trabajos aparece) |
| Trayectoria (Kontari, Crombie, ShineForth, freelance…) | `src/data/experience.ts` |
| Logros y XP | `src/data/achievements.ts` |
| Rangos y umbrales de XP | `RANKS` en `src/game/store.ts` |

## Idiomas (ES / EN / IT)

Todo el sitio está en español, inglés e italiano, sin librerías (`src/lib/i18n.ts`):

- Los textos de datos son objetos `{ es, en, it }` (tipo `Loc`) y se leen con `t.l(valor)`.
- Los textos de UI se escriben en línea con `t('español', 'english', 'italiano')`, con `const t = useT()`.
- Fuera de React (toasts del store) se usa `getT()`.
- El idioma inicial sale de `?lang=es|en|it`, después de la preferencia guardada y, si no hay, del idioma
  del navegador (español → ES, italiano → IT, cualquier otro → EN). Se cambia con el selector ES/EN/IT
  del HUD, de la pantalla de inicio o desde la consola de comandos.
- Para sumar otro idioma: agregalo a `LANGS` y `LOCALE` en `i18n.ts` y a `LANG_OPTIONS` en
  `LangSwitch.tsx`; TypeScript marca cada texto al que le falte la traducción.

Para sumar un proyecto: agregalo a `projects`, un ícono en `src/lib/icons.tsx`, una demo en
`src/components/levels/` y registrala en `DEMOS` (`LevelScreen.tsx`). Ajustá también las coordenadas de
`LAYOUTS` en `Overworld.tsx` (hay una para escritorio y otra para móvil).

## Cosas de juego

- **Mapa**: clic en un mundo, o `←` `→` para caminar y `Enter` para entrar.
- **Ctrl/⌘ + K** (o `/`): consola de comandos.
- **7 estrellas** escondidas repartidas por la página.
- **Konami**: `↑ ↑ ↓ ↓ ← → ← → B A`.
- Enlaces directos a un nivel: `/#/nivel/kontari`, `/#/nivel/polizari`, etc.

## Demos (todas corren en el navegador)

- **Kontari**: vencimientos por CUIT (validación módulo 11 real, corrimiento por fin de semana) y bóveda con
  PBKDF2-SHA256 600k + AES-256-GCM reales vía WebCrypto (requiere HTTPS o localhost).
- **Polizari**: *Renewal Rush*, un arcade de 30 s.
- **Cotizari**: cotizador con el score real 42/38/12/8 y agente de contacto simulado.
- **SB Estudio**: laboratorio de la landing: animación del titular palabra por palabra (con sliders), botón magnético y explorador de servicios y modalidad.
- **Mehring**: configurador de silla en SVG con vista explosionada.

Las aseguradoras, clientes, precios y horarios de las demos son ficticios.

## Logo personal

`src/components/ui/Logo.tsx` es el monograma "NB" en grilla de píxeles (conecta con el "NB-OS"
del boot). Vive también como archivos sueltos en `public/brand/` (SVG + PNG, con fondo,
transparente y en un solo color) para usar fuera del sitio — ver `public/brand/README.md`.

## Deploy

Es una SPA estática: `npm run build` y subir `dist/` (Vercel detecta Vite solo).
