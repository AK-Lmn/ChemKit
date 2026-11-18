# Contributing to ChemKit

Thank you for your interest in improving ChemKit. Whether you are fixing a chemical calculation edge case, adding unit tests, or refining accessibility, your contributions are welcome.

---

## Code of Conduct

ChemKit is an open educational project designed for students and educators. Please keep interactions constructive, welcoming, and respectful.

---

## Ways to Contribute

1. **Scientific Accuracy**: Verify formulas, constants, and edge cases against IUPAC standards.
2. **Bug Fixes**: Resolve calculation inaccuracies, layout glitches, or broken input parsing.
3. **Accessibility**: Audit against WCAG AA standards (keyboard navigation, screen reader labels, high-contrast visibility).
4. **Test Coverage**: Add test cases to `test/` for newly discovered edge cases.
5. **New Chemistry Tools**: Propose or implement standalone calculators that fit within client-side browser execution.

---

## Local Development Workflow

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/ChemKit.git
cd ChemKit

# Add upstream remote
git remote add upstream https://github.com/AK-Lmn/ChemKit.git
```

### 2. Install & Run

Ensure you have Node.js 20+ installed:

```bash
npm install
npm test
npm run dev
```

The app will be available locally at `http://localhost:5173`.

---

## Architectural Guidelines

To maintain speed, determinism, and maintainability, ChemKit enforces strict architectural separation:

### 1. Pure Calculation Engines (`src/lib/`)
* **Zero UI Dependencies**: Logic in `src/lib/` must never import React, DOM elements, or browser-specific globals.
* **Deterministic Math**: Given identical inputs, calculations must always return identical outputs.
* **Input Sanitization**: Always guard against division by zero, non-finite values, and negative absolute temperatures (below $0\text{ K}$).
* **Units & Constants**: Use standardized IUPAC values. Document sources for any new physical constants.

### 2. User Interface Views (`src/tools/` & `src/components/`)
* **Accessible Inputs**: Every input must have an associated `<label>` or explicit `aria-label`.
* **Design Consistency**: Follow the neobrutalist style tokens in `src/index.css`. Support both light and dark modes (`data-theme="light"` and `data-theme="dark"`).
* **Tactile Feedback**: Use existing interactive classes (`.ck-btn`, `.ck-chip`, `.ck-readout`) for predictable focus and active states.

### 3. Constraints (What Not to Add)
* **No Backends or Databases**: ChemKit is intentionally a zero-latency static client application. Do not introduce servers, user logins, tracking, or remote database calls.
* **No Heavy Dependencies**: Check if an algorithm can be implemented cleanly with plain JavaScript before installing external npm packages.

---

## Testing Requirements

Before opening a pull request, verify that all existing tests pass and add new test cases covering your changes:

```bash
# Run unit test suite
npm test

# Verify production bundle builds cleanly
npm run build
```

Tests use Node.js's built-in test runner (`node --test test/*.test.js`). Add new tests to the appropriate file in `test/` (e.g. `test/balancer.test.js`, `test/ph.test.js`).

---

## Commit Guidelines

Use Conventional Commits for clear Git history:

* `feat:` A new tool, solver capability, or interactive visualizer
* `fix:` A bug fix or corrected calculation formula
* `test:` Adding or updating unit tests
* `docs:` Documentation updates, README refinements, or brand guidelines
* `refactor:` Code improvements without altering external behavior
* `perf:` Performance or bundle size optimizations

*Example:*
```bash
git commit -m "fix(gas-laws): correct pressure conversion factor for mmHg to kPa"
```

---

## Pull Request Checklist

When submitting a pull request, verify:

- [ ] Branch is up to date with `upstream/main`.
- [ ] `npm test` passes with 0 failures.
- [ ] `npm run build` exits with code 0.
- [ ] Code follows existing formatting and architectural rules.
- [ ] No API keys, credentials, or generated build directories are committed.
- [ ] PR description clearly explains the problem solved and any relevant chemical formulas.

---

## Need Help?

If you have questions about calculation implementations or proposed tools, open an issue on [GitHub Issues](https://github.com/AK-Lmn/ChemKit/issues) to discuss before writing code.
