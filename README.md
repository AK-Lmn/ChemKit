# ChemKit

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-chemkit.vercel.app-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://chemkit.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-1E1E1E?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.1-1E1E1E?style=for-the-badge&logo=vite&logoColor=646CFF)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-46%20passing-00C853?style=for-the-badge)](test/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1E1E1E?style=for-the-badge)](LICENSE)

**A client-side chemistry workspace combining seven interactive calculation engines, IUPAC datasets, and real-time physical simulations in a unified neobrutalist interface.**

[Launch App](https://chemkit.vercel.app/) • [Report Bug](https://github.com/AK-Lmn/ChemKit/issues) • [View Architecture](#architecture)

</div>

---

## Overview

ChemKit consolidates seven chemistry calculators and reference tools into a single, zero-dependency browser application. All calculations run client-side using validated algorithms and standard IUPAC atomic weights. The interface features neobrutalist typography, tactile micro-interactions, full keyboard navigation, and theme synchronization across light and dark modes.

---

## Included Tools

| Tool | Route | Governing Formulas | Primary Function |
| :--- | :--- | :--- | :--- |
| **Element Explorer** | `/elements` | Periodic Law | 18-column interactive periodic table with category filters, atomic radii, electron configurations, and one-click export to MoleMate. |
| **MoleMate** | `/moles` | $n = \frac{m}{M}$, $N = n \cdot N_A$ | Computes molar mass breakdowns, mass-to-mole conversions across units (`mg`, `g`, `kg`), and particle counts with hydrate support (e.g. `CuSO4·5H2O`). |
| **GasLab** | `/gas-laws` | $PV = nRT$, $\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}$ | Solves Boyle, Charles, Gay-Lussac, Avogadro, and Ideal Gas Law equations with automated multi-unit conversions (`atm`, `kPa`, `bar`, `L`, `mL`, `K`, `°C`). |
| **Chemical Balancer** | `/balancer` | Conservation of Mass | Computes whole-number stoichiometric coefficients via null-space matrix reduction. Verifies atom counts with direct handoff to stoichiometry. |
| **Stoichiometry Solver** | `/stoichiometry` | Mole ratios ($\frac{\text{target}}{\text{given}}$) | Mole-to-mole and gram-to-gram conversions with automatic equation balancing, limiting reactant verification, and step-by-step unit factor work. |
| **pH Calculator** | `/ph` | $\text{pH} = -\log[H^+]$, $K_a = \frac{x^2}{C - x}$ | Conversions between pH, pOH, $[H^+]$, and $[OH^-]$, plus exact quadratic solutions for weak acid ($K_a$) and weak base ($K_b$) dissociation. |
| **SolutionLab** | `/solutions` | $M = \frac{n}{V}$, $M_1V_1 = M_2V_2$ | Molarity, volumetric dilution, mass concentration ($g/L$), and percentage concentrations ($\% \text{ w/w}$, $\% \text{ v/v}$). |

---

## Interactive Physics Simulations

Each calculator integrates visual feedback tied directly to the underlying calculation states:

* **Dynamic pH Beaker**: An SVG volumetric beaker with universal indicator spectrum mapping (crimson acid $\to$ emerald neutral $\to$ royal violet alkali), continuous meniscus wave motion, and rising solute micro-bubbles.
* **Kinetic Gas Chamber**: A cylinder with a movable piston head that raises or lowers based on volume ratios, an analog pressure gauge with active needle deflection, and kinetic gas particles whose velocity scales with temperature in Kelvin.
* **Catalyst Reaction Shimmer**: Equation balancing and stoichiometry solutions trigger an emerald reaction wave across coefficients with animated atom conservation checks.

---

## Keyboard Navigation & Shortcuts

ChemKit is designed for keyboard-first operation:

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Open Command Palette (search tools or jump to any chemical formula) |
| <kbd>1</kbd> – <kbd>7</kbd> | Direct jump to tool tabs (`1: Elements`, `2: Moles`, `3: Gas`, `4: Balancer`, etc.) |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Cycle through interactive inputs and calculation triggers |
| <kbd>Esc</kbd> | Close dialogs, command palette, and clear focused overlays |

---

## Architecture

The codebase separates pure calculation math from UI components to guarantee deterministic results and straightforward unit testing:

```
ChemKit/
├── src/
│   ├── lib/                  # Pure TypeScript/JavaScript chemistry engines
│   │   ├── elements.js       # Complete 118-element IUPAC dataset
│   │   ├── molar-mass.js     # Chemical formula tokenizer and molecular weight calculator
│   │   ├── balancer.js       # Matrix-based linear equation balancer
│   │   ├── gas-laws.js       # Gas law solver and unit transformation tables
│   │   ├── stoichiometry.js  # Stoichiometric conversion solver
│   │   ├── ph.js             # Acid-base equilibrium and dissociation solver
│   │   └── solutions.js      # Solution concentration and dilution engines
│   ├── tools/                # Interactive tool views
│   │   ├── ElementExplorer.jsx
│   │   ├── MoleMate.jsx
│   │   ├── GasLab.jsx
│   │   ├── ChemBalancer.jsx
│   │   ├── StoichiometrySolver.jsx
│   │   ├── PhCalculator.jsx
│   │   └── SolutionLab.jsx
│   ├── components/           # Shared accessible UI primitives (Select, CommandPalette, Icons)
│   ├── hooks/                # Local storage and platform shortcuts
│   ├── App.jsx               # Application shell, router, and tab switcher
│   └── index.css             # Design tokens, neobrutalist utilities, and keyframe animations
├── test/                     # Node.js built-in test runner test suites (46 tests)
└── logo/                     # Brand marks, SVG assets, and design guidelines
```

---

## Development

### Prerequisites

* Node.js 20+
* npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/AK-Lmn/ChemKit.git
cd ChemKit

# Install dependencies
npm install

# Run test suite
npm test

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## Quality Assurance

All engines are tested against textbook chemistry problems:

```bash
$ npm test

✔ balances combustion
✔ balances polyatomic group
✔ ideal gas law solves P, V, n, and T
✔ unit-aware gas law solver handles mixed units
✔ element dataset covers all 118 elements
✔ parses nested grouping with parentheses, brackets, and braces
✔ converts across all 6 standard pH, pOH, [H+], and [OH-] modes
✔ solves weak acid and weak base dissociation using exact quadratic
✔ solves M1V1 = M2V2 dilution for every variable
✔ solves mole-to-mole and gram-to-gram stoichiometry accurately
ℹ tests 46
ℹ pass 46
ℹ fail 0
```

---

## License

MIT © [AK-Lmn](https://github.com/AK-Lmn)
