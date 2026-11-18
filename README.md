# ChemKit

A unified browser-based chemistry suite combining seven interactive tools in one React application with shared IUPAC atomic data and calculation engines.

## Live Site

[chemkit.vercel.app](https://chemkit.vercel.app/)

## Tools

| Tool | Route | Purpose |
| --- | --- | --- |
| Element Explorer | `/elements` | Interactive 18-column periodic table with search, category filters, favorites, and atomic details. |
| MoleMate | `/moles` | Chemical formula molar mass breakdown, mass-to-mole conversion (`mg`, `g`, `kg`), and Avogadro particle counts. |
| GasLab | `/gas-laws` | Boyle, Charles, Gay-Lussac, Avogadro, and Ideal Gas Law solver with automatic unit conversion. |
| Chemical Equation Balancer | `/balancer` | Exact whole-number equation balancing with atom-count verification and one-click handoff to stoichiometry. |
| Stoichiometry Solver | `/stoichiometry` | Mole-to-mole and gram-to-gram conversions with auto-balancing and step-by-step work. |
| pH Calculator | `/ph` | Conversions across pH, pOH, `[H+]`, and `[OH-]`, plus exact quadratic weak acid/base dissociation. |
| SolutionLab | `/solutions` | Molarity, moles, volume, dilution (`M1V1 = M2V2`), mass concentration (`g/L`), `% w/w`, and `% v/v`. |

## Development

```bash
npm install
npm test
npm run dev
npm run build
```

## Architecture

- `src/lib/` holds pure chemistry engines and the single 118-element IUPAC dataset (`elements.js`, `molar-mass.js`, `gas-laws.js`, `balancer.js`, `stoichiometry.js`, `ph.js`, `solutions.js`).
- `src/tools/` holds each tool view, sharing custom accessible controls (`Select.jsx`) and inline Lucide SVGs (`Icons.jsx`).
- `test/` runs 46 unit tests via Node's built-in test runner (`node --test`).

## Author

Made by [@AK-Lmn](https://github.com/AK-Lmn)
