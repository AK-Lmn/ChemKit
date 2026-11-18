# ChemKit: Brand Identity Guidelines

## 1. The Brand Mark

- **Idea**: A high-density carbon nucleus encircled by triple intersecting orbital energy shells with symmetric orbital nodes. Reflects Carbon (atomic number 06, symbol Ck), the foundational backbone of chemistry.
- **Versions**:
  - **Horizontal Lockup**: Primary lockup for headers, documentation, and wide banners.
  - **Stacked Lockup**: Secondary lockup for badges, cards, and vertical placements.
  - **Symbol Only**: Dedicated app icons, avatars, and UI tabs.
  - **Small-Size Cut**: Specially calibrated geometry for 16px to 32px favicons with enlarged nucleus and high-contrast dual orbital rings.
- **Master Files Directory**: `logo/final/dist/`
  - SVG vectors: `-black.svg`, `-white.svg`, `-mono-38d9e8.svg`, `-square.svg`, `-favicon.svg`, `-app-icon.svg`
  - Raster assets: PNGs at 32px, 64px, 128px, 256px, 512px, 1024px
  - Web icon kit: `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`

---

## 2. Clear Space

Keep a clear zone of **1X** around all marks, where **X** equals the diameter of the central carbon nucleus (28% of symbol height).
No graphic elements, text, borders, or page boundaries should intrude inside this isolation boundary.

---

## 3. Minimum Sizing

| Asset Version | Digital (Screen) | Print | Recommended File |
| :--- | :--- | :--- | :--- |
| **Horizontal Lockup** | 120px wide | 32 mm wide | `chemkit-horizontal-*.svg` |
| **Stacked Lockup** | 80px wide | 22 mm wide | `chemkit-stacked-*.svg` |
| **Standard Symbol** | 44px height | 12 mm height | `chemkit-symbol-*.svg` |
| **Micro / Favicon** | 16px to 32px | 5 mm height | `chemkit-symbol-small.svg` / `favicon.ico` |

---

## 4. Color Palette

| Role | Token | HEX | RGB | CMYK Approximation |
| :--- | :--- | :--- | :--- | :--- |
| **Electric Cyan** (Primary Accent) | `--cyan` | `#38d9e8` | `56, 217, 232` | `76, 6, 0, 9` |
| **Laboratory Canvas** (Background) | `--bg-canvas` | `#080d16` | `8, 13, 22` | `64, 41, 0, 91` |
| **Surface Elevated** (Panels) | `--bg-surface` | `#0e1624` | `14, 22, 36` | `61, 39, 0, 86` |
| **Text Primary** (High Contrast) | `--text-primary` | `#eef4fc` | `238, 244, 252` | `6, 3, 0, 1` |
| **Subtle Border** (Hairline) | `--border-subtle` | `rgba(148, 178, 211, 0.14)` | `148, 178, 211` | `30, 16, 0, 17` |

**Approved Color Pairings**:
- Cyan mark (`#38d9e8`) on Dark Canvas (`#080d16` or `#0e1624`).
- White mark (`#ffffff`) on Dark Canvas (`#080d16`).
- Black mark (`#000000`) on Pure White background for print invoices or black-and-white collateral.
- Never use Cyan text on light backgrounds or low-contrast gray surfaces.

---

## 5. Typography

- **Headlines & Display**: Space Grotesk (Weights: 600, 700), tabular numerals, tight letter-spacing (-0.035em to -0.045em).
- **Body & Interface**: Inter (Weights: 400, 500, 600), line-height 1.6 to 1.75.
- **Numbers, Formulas & Units**: JetBrains Mono (Weights: 500, 600), tabular numerals, exact subscript/superscript alignment.

---

## 6. Rules and Misuse

- Do not stretch, skew, or distort the aspect ratio.
- Do not rotate the mark outside its calibrated 0, 60, and 120 degree orbital alignments.
- Do not apply drop shadows, glows, or bevel filters directly onto the logo vectors.
- Do not alter the relative spacing between the orbital symbol and the "ChemKit" wordmark.
- Do not replace the custom vector wordmark with typed standard system text.
- Always preserve the clear space boundary.

---

## 7. Tool Sub-Mark Hierarchy

The master ChemKit mark serves as the umbrella identity. The 7 individual calculators inherit the same geometric line weight and corner radii, each rendered with its designated category accent:

1. **Element Explorer**: `Ee` (Periodic Lattice, Cyan `#4dd8e8`)
2. **MoleMate**: `Mm` (Tetrahedral Molecule, Purple `#a875ff`)
3. **GasLab**: `Gl` (Kinetic Chamber, Blue `#5b9dff`)
4. **Chemical Equation Balancer**: `Eb` (Equilibrium Scale, Coral `#ff8f70`)
5. **Stoichiometry Solver**: `Ss` (Conversion Bridge, Orchid `#d08cff`)
6. **pH Calculator**: `pH` (Logarithmic Droplet, Mint `#7ce6c4`)
7. **SolutionLab**: `Sl` (Volumetric Flask, Amber `#ffcf5a`)
