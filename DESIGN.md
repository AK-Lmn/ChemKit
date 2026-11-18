---
name: ChemKit
description: Interactive Chemistry Suite for STEM Students
colors:
  accent: "#00C853"
  accent-strong: "#007A33"
  accent-ink: "#111111"
  accent-soft-dark: "#123527"
  accent-soft-light: "#D9F2E6"
  surface-dark: "#1E1E1E"
  surface-light: "#FFFFFF"
  surface-2-dark: "#262626"
  surface-2-light: "#EDEDED"
  bg-dark: "#0C0D0E"
  bg-light: "#FFFFFF"
  border-strong: "#111111"
  border-subtle: "#E0E0E0"
  border-dark: "#333333"
  ink-primary-dark: "#FFFFFF"
  ink-primary-light: "#111111"
  ink-secondary-dark: "#CCCCCC"
  ink-secondary-light: "#5C5C5C"
  status-error: "#B3261E"
  status-warning: "#8A6100"
typography:
  display:
    fontFamily: "Archivo, Space Grotesk, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.88rem"
    fontWeight: 600
rounded:
  sm: "6px"
  md: "11px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  landing-btn:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "44px"
  tool-card:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    padding: "22px"
---

# ChemKit Design System

## 1. Overview
ChemKit is a high-utility browser suite designed specifically for incoming STEM and chemistry students.
Its design philosophy is built on three pillars:
1. **Zero Fluff**: Instant answers without sign-up walls, paywalls, or advertisements.
2. **Pedagogical Transparency**: Step-by-step dimensional analysis and atom conservation tracking that reinforces classroom learning rather than obscuring calculations behind a black box.
3. **Tactile Clarity**: A high-contrast Baseten 60:30:10 aesthetic combining neo-brutalist block shadows (`5px 5px 0 #111111`) with vivid catalytic emerald accents (`#00C853`).

---

## 2. Colors

### The Baseten 60:30:10 Contrast Model
- **60% Canvas & Surfaces**: Deep obsidian (`#0C0D0E` / `#1E1E1E`) in dark mode; pure white (`#FFFFFF` / `#EDEDED`) in light mode.
- **30% Structural Elements**: Heavy 2px solid ink borders (`#111111`), pill tags, and typography.
- **10% Catalytic Accent**: Vivid Emerald (`#00C853`). Used strictly for primary action buttons, active route highlights, balanced equations, and eureka reaction moments.

### WCAG AA Accessibility Contrast Enforcement
- In dark mode, emerald text (`#00C853`) on dark backgrounds yields an **8.5:1** contrast ratio.
- In light mode, normal text using the accent color MUST resolve to `--accent-text: #007A33` (contrast ratio **5.1:1** on white), exceeding the WCAG AA 4.5:1 requirement.
- Never use unadapted `#00C853` for body or small label copy on white surfaces.

---

## 3. Typography

- **Display & Section Headers**: `Archivo`, `Space Grotesk` (Weight: 800/900). Heavy geometric grotesque delivering authority and energy.
- **Body & Explanatory UI**: `Inter` (Weight: 400 Regular, 600 SemiBold, 700 Bold). Crisp, scannable, high x-height for readability.
- **Scientific Notation & Equations**: `JetBrains Mono` (Weight: 500, 600, 700). Fixed-width glyphs ensure numbers, exponents, coefficients, and atom matrices align precisely.

---

## 4. Layout & Spacing

- **Desktop Shell**: Maximum width `1200px` (`.ck-shell`), centered with `24px` horizontal gutters.
- **Toolkit Grid**: Responsive CSS Grid (`repeat(auto-fill, minmax(320px, 1fr))`) ensuring natural card flow across mobile, tablet, and desktop viewports.
- **Two-Column Calculator Panel**: Workspaces pair an interactive input form on the left with instant live readouts and history on the right.

---

## 5. Elevation & Depth

- **Tactile Neo-Brutalism**: Avoid soft blurry diffuse drop-shadows. Use crisp solid block shadows (`5px 5px 0 var(--border-strong)`) that visually compress on click (`1px 1px 0`).
- **Interactive Planes**: Cards hover upward by `2px–4px` with an expanded shadow (`7px 9px 0`).
- **Surface Elevation**: Modals and dropdowns employ high-contrast 2px solid outlines with subtle backdrop-blur (`8px–18px`).

---

## 6. Shapes & Radii

- **Cards & Modals**: `16px` rounded corners (`var(--radius-lg)`).
- **Buttons & Form Fields**: `11px` rounded corners (`var(--radius-md)`).
- **Status Pills & Tags**: `999px` full capsule pill fillet.

---

## 7. Components & States

### Interactive Elements: The 8-State Rule
Every interactive control (buttons, comboboxes, cards, tabs) implements complete state coverage:
1. `default`: Clear boundary and legible text.
2. `hover`: Surface brightness shift and tactile lift (`translateY(-2px)`).
3. `focus-visible`: 2px solid focus ring (`var(--accent)`) with 2px offset.
4. `active`: Tactile press compression (`scale(0.97)`).
5. `disabled`: Reduced opacity (0.5), `not-allowed` cursor, zero hover response.
6. `loading`: Non-blocking indicator, preserved button dimensions.
7. `error`: Explicit red outline (`var(--status-error)`) with inline text explanation.
8. `success`: Emerald accent border with confirmation checkmark.

### Global Command Palette (`Cmd+K`)
- Instant keyboard navigation dialog for power-user switching between tools.
- Single-key number shortcuts (`1`–`8`).
- Live search query filtering and keyboard arrow key traversal.

---

## 8. Do's and Don'ts

### Do:
- **Always provide dimensional step breakdowns** when displaying mathematical or chemical results.
- **Always include an undo path** for destructive history clearing.
- **Always use standard IUPAC symbols** with correct chemical case (e.g., `NaCl`, `Ca(OH)2`).
- **Always support both light and dark mode** with zero color flash on initial page load.

### Don't:
- **Never use decorative grid lines or generic AI gradient slop** on plain content surfaces.
- **Never force students through multi-step onboarding or sign-up gates** before letting them calculate.
- **Never hide calculation units** (always display `g`, `mol`, `L`, `K`, `atm`).
- **Never leave calculation errors vague**; always provide constructive recovery suggestions.
