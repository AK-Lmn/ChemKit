# ChemKit Brand Guidelines (v3.0 Muse AI Synergy)

## 1. Brand Concept: Glassware & Reaction
The ChemKit identity combines functional chemistry glassware with punchy digital product design:
- **Erlenmeyer Flask Geometry**: Built on exact 60-degree conical slope geometry (120-degree interior reflection).
- **Reaction Meniscus**: Liquid fill in vivid emerald green (`#00C853`) displaying active meniscus curvature.
- **Kinetic Bubbles**: Staggered reaction bubbles representing real-time computation and chemical transformation.
- **Graduation Ticks**: Clean measurement lines on the left shoulder denoting mathematical precision.

## 2. Color Architecture: Baseten 60:30:10
- **60% Canvas / Neutrals**: Pure White (`#FFFFFF`) in light mode / Near-Black (`#111111`) in dark mode.
- **30% Structure**: Strong contrasting borders (`#111111` in light / `#FFFFFF` in dark) with chunky neo-brutalist block shadows (`5px 5px 0 #111111` or `#000000`).
- **10% Vivid Punch**: Vivid Emerald Green (`#00C853`), soft mint backgrounds (`#D9F2E6` in light / `#123527` in dark), and pastel category accents (lavender `#C7B8F5`, peach `#FFD9A3`, sky `#A9C6FF`).

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--accent` | `#00C853` | `#00C853` | Primary brand punch, live state, solve buttons |
| `--accent-strong` | `#00913C` | `#00C853` | High-contrast text highlights |
| `--mint` | `#D9F2E6` | `#123527` | Soft accent backgrounds, active indicator |
| `--bg` | `#FFFFFF` | `#111111` | Application canvas |
| `--surface` | `#FFFFFF` | `#1E1E1E` | Tool cards, dialogs, panels |
| `--border-strong`| `#111111` | `#FFFFFF` | Structural borders, neo-brutalist strokes |
| `--shadow-block` | `5px 5px 0 #111111` | `5px 5px 0 #000000` | Chunky cards and buttons |

## 3. Motion & Animation
- **Brand Mark Floaty**: Subtle organic floating idle animation (`floaty 5s ease-in-out infinite alternate`).
- **Hero Stagger**: Step-staggered entrance on hero elements (`heroUp 0.55s`).
- **Live Pulse**: Pulsing status dot on active tools (`livePulse 2.4s ease-in-out infinite`).
- **Neo-Brutalist Lift**: Tool cards shift `-2px, -4px` with expanded solid shadow on hover.
- **Report Reveal**: Pop animation on calculated chemistry reports (`repPop 0.35s`).

## 4. Logo Assets Directory
All production-ready vectors and raster exports are located in `logo/flask/dist/`:
- `chemkit-flask-black.svg` & PNGs (32, 64, 128, 256, 512)
- `chemkit-flask-white.svg` & PNGs
- `chemkit-flask-mono-00c853.svg` & PNGs
- `chemkit-flask-square.svg` & PNGs
- `chemkit-flask-app-icon.svg` & PNGs
- `chemkit-flask-favicon.svg` & PNGs
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png`, `maskable-512.png`
- `site.webmanifest`
