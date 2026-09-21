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
SFX sintetizados con WebAudio (sin assets) y apagados por defecto.

## Qué editar

| Qué | Dónde |
|---|---|
| Nombre, rol, email, GitHub | `src/data/profile.ts` |
| Proyectos, stats, misiones, colores | `src/data/projects.ts` |
| Inventario de tecnologías | `src/data/skills.ts` (la rareza se calcula sola según en cuántos proyectos aparece) |
| Logros y XP | `src/data/achievements.ts` |
| Rangos y umbrales de XP | `RANKS` en `src/game/store.ts` |

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
- **SB Estudio**: flujo de reserva → pago → evento de calendario con consola de API en vivo.
- **Mehring**: configurador de silla en SVG con vista explosionada.

Las aseguradoras, clientes, precios y horarios de las demos son ficticios.

## Deploy

Es una SPA estática: `npm run build` y subir `dist/` (Vercel detecta Vite solo).
