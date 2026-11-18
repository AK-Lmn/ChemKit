import { useState } from 'react'
import {
  ChemKitMark,
  IconArrowRight,
  IconAtom,
  IconExternalLink,
  IconGithub,
  IconGraduationCap,
  IconListOrdered,
  LogoChemBalancer,
  LogoElementExplorer,
  LogoGasLab,
  LogoMoleMate,
  LogoPhCalculator,
  LogoSolutionLab,
  LogoStoichiometry,
} from '../components/Icons.jsx'

const REPO_URL = 'https://github.com/AK-Lmn/ChemKit'

const TOOLS = [
  {
    id: 'elements',
    number: '06',
    symbol: 'Ee',
    name: 'Element Explorer',
    category: 'Elements',
    icon: LogoElementExplorer,
    accent: '#00C853',
    description: 'A full interactive periodic table for browsing, searching, and studying every element at a glance.',
    features: [
      'Search elements by name or symbol',
      'Filter by category',
      'Favorite elements for quick recall',
      'View detailed atomic data',
    ],
    repoUrl: 'https://github.com/AK-Lmn/PeriodicTable',
  },
  {
    id: 'moles',
    number: '12',
    symbol: 'Mm',
    name: 'MoleMate',
    category: 'Calculations',
    icon: LogoMoleMate,
    accent: '#00C853',
    description: 'A mole calculator that turns mass and molar mass into moles and particle counts in one step.',
    features: [
      'Calculates moles from mass and molar mass',
      'Supports mg, g, and kg',
      "Shows particle count via Avogadro's number",
      'Saves calculation history locally',
    ],
    repoUrl: 'https://github.com/AK-Lmn/mole-calc',
  },
  {
    id: 'gas-laws',
    number: '18',
    symbol: 'Gl',
    name: 'GasLab',
    category: 'Calculations',
    icon: LogoGasLab,
    accent: '#00C853',
    description: 'A guided gas laws calculator that walks you through the setup and shows the formula behind every answer.',
    features: [
      "Boyle's, Charles's, Gay-Lussac's and Avogadro's Laws",
      'Ideal Gas Law included',
      'Guided inputs with a formula card per law',
      'Built-in validation and clean results',
    ],
    repoUrl: 'https://github.com/AK-Lmn/GasLawCalc',
  },
  {
    id: 'balancer',
    number: '26',
    symbol: 'Eb',
    name: 'Chemical Equation Balancer',
    category: 'Equations',
    icon: LogoChemBalancer,
    accent: '#00C853',
    description: 'Balance chemical equations and compare atom counts without trial-and-error guessing.',
    features: [
      'Supports common formulas and parentheses',
      'Balances equations with exact whole-number coefficients',
      'Shows coefficients and atom count tables',
      'Saves recent equations locally',
    ],
    repoUrl: 'https://github.com/AK-Lmn/Chem-Balancer',
  },
  {
    id: 'stoichiometry',
    number: '07',
    symbol: 'Ss',
    name: 'Stoichiometry Solver',
    category: 'Equations',
    icon: LogoStoichiometry,
    accent: '#00C853',
    description: 'Use balanced equations to convert between moles and grams with guided stoichiometry steps.',
    features: [
      'Supports mole-to-mole and gram-to-gram conversions',
      'Calculates molar mass from formulas',
      'Uses balanced-equation mole ratios',
      'Shows step-by-step solutions',
    ],
    repoUrl: 'https://github.com/AK-Lmn/Stoichiometry-Solver',
  },
  {
    id: 'ph',
    number: '01',
    symbol: 'pH',
    name: 'pH Calculator',
    category: 'Solutions',
    icon: LogoPhCalculator,
    accent: '#00C853',
    description: 'Move between pH, pOH, and ion concentration instantly with a focused calculator built for quick conversions.',
    features: [
      'Convert between pH and pOH',
      'Calculate hydrogen and hydroxide ion concentration',
      'Clean, fast layout for quick checks',
      'Built for classroom and lab use',
    ],
    repoUrl: 'https://github.com/AK-Lmn/pH-Calculator',
  },
  {
    id: 'solutions',
    number: '20',
    symbol: 'Sl',
    name: 'SolutionLab',
    category: 'Solutions',
    icon: LogoSolutionLab,
    accent: '#00C853',
    description: 'Solve common solution concentration problems including molarity, dilution, mass concentration, and percent concentration.',
    features: [
      'Calculate molarity, moles, and volume',
      'Solve dilution problems with M1V1 = M2V2',
      'Work with g/L, % w/w, and % v/v',
      'Includes validation, explanations, and recent history',
    ],
    repoUrl: 'https://github.com/AK-Lmn/Solution-Lab',
  },
]

const TOOL_GUIDE = [
  { need: 'Need element data?', toolName: 'Element Explorer', toolId: 'elements', icon: LogoElementExplorer, accent: '#00C853' },
  { need: 'Need moles or particles?', toolName: 'MoleMate', toolId: 'moles', icon: LogoMoleMate, accent: '#00C853' },
  { need: 'Need gas law variables?', toolName: 'GasLab', toolId: 'gas-laws', icon: LogoGasLab, accent: '#00C853' },
  { need: 'Need to balance a chemical equation?', toolName: 'Chemical Equation Balancer', toolId: 'balancer', icon: LogoChemBalancer, accent: '#00C853' },
  { need: 'Need mole or gram conversions from an equation?', toolName: 'Stoichiometry Solver', toolId: 'stoichiometry', icon: LogoStoichiometry, accent: '#00C853' },
  { need: 'Need pH, pOH, or ion concentration?', toolName: 'pH Calculator', toolId: 'ph', icon: LogoPhCalculator, accent: '#00C853' },
  { need: 'Need molarity, dilution, or percent concentration?', toolName: 'SolutionLab', toolId: 'solutions', icon: LogoSolutionLab, accent: '#00C853' },
]

const WHY_CARDS = [
  {
    icon: IconGraduationCap,
    title: 'Student-friendly',
    accent: '#00C853',
    description: "Written for the moment you are stuck on a problem set, not for people who already know the answer.",
  },
  {
    icon: IconAtom,
    title: 'Built from real study tools',
    accent: '#00C853',
    description: 'Each app started as something used to pass an actual chemistry class, then got refined into a product.',
  },
  {
    icon: IconListOrdered,
    title: 'Clean UI, guided calculations',
    accent: '#00C853',
    description: 'Every calculator shows its formula and its steps, so the answer is never a black box.',
  },
]

const FUTURE_TOOLS = [
  'Formula reference',
  'Unit converter',
  'Percent yield',
  'Limiting reactant',
]

const CATEGORIES = ['All', 'Elements', 'Calculations', 'Equations', 'Solutions']

export function Overview({ onOpenTool }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTools = selectedCategory === 'All'
    ? TOOLS
    : TOOLS.filter((tool) => tool.category === selectedCategory)

  const handleScrollToToolkit = () => {
    const el = document.getElementById('toolkit')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="ck-landing">
      {/* Hero Section */}
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A chemistry toolkit, not a textbook</p>
          <h1>
            Chemistry feels <em>lighter</em>
            <br />
            with the right tools.
          </h1>
          <p className="hero-text">
            ChemKit is a student-built chemistry toolkit for quick calculations, guided practice, and clean study support.
          </p>

          <div className="button-row">
            <button
              type="button"
              className="landing-btn primary"
              onClick={handleScrollToToolkit}
            >
              Explore all 7 tools
              <span aria-hidden="true">&darr;</span>
            </button>
            <a
              className="landing-btn secondary"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <IconGithub />
              View GitHub
            </a>
          </div>

          <div className="hero-meta">
            <span>
              <i className="ck-live-dot" />
              7 active tools
            </span>
            <span>No sign-up</span>
            <span>Free to use</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="flask-card">
            <ChemKitMark className="flask-card-mark" />
            <span className="flask-card-title">Chem<span className="text-emerald">Kit</span></span>
            <span className="flask-card-sub">Reaction Suite</span>
          </div>
          <div className="reaction-ring ring-one" />
          <div className="reaction-ring ring-two" />
          <div className="reaction-ring ring-three" />
        </div>
      </section>

      {/* Story Section */}
      <section className="landing-section compact" id="story">
        <div className="glass-panel story-panel">
          <div>
            <p className="eyebrow">The story</p>
            <h2>
              From capstone project
              <br />
              to ChemKit
            </h2>
          </div>
          <p>
            ChemKit started as my SHS capstone project, originally made as a chemistry guide for incoming Grade 12 students.
            I recently rebuilt and rebranded it into a cleaner set of browser-based tools for elements, moles, gas laws,
            equations, pH, and solution concentration.
          </p>
        </div>
      </section>

      {/* Which tool should I use? */}
      <section className="landing-section guide-section" id="guide">
        <div className="section-heading">
          <p className="eyebrow">Find your tool</p>
          <h2>Which tool should I use?</h2>
          <p>Start with what you need to solve. We will point you in the right direction.</p>
        </div>

        <div className="guide-grid">
          {TOOL_GUIDE.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.toolId}
                type="button"
                className="guide-item"
                style={{ '--accent': item.accent }}
                onClick={() => onOpenTool(item.toolId)}
              >
                <div className="guide-item-content">
                  <span className="guide-item-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="guide-item-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <p>
                    <strong>{item.need}</strong>
                    <br />
                    Use {item.toolName}
                  </p>
                </div>
                <span className="guide-item-cta">
                  Open <IconArrowRight />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* The Toolkit Section */}
      <section className="landing-section" id="toolkit">
        <div className="section-heading centered">
          <p className="eyebrow">The toolkit</p>
          <h2>
            Seven tools. One goal:
            <br />
            get you unstuck.
          </h2>
          <p>Each one solves a single problem well: no clutter, no sign-up walls, no ads.</p>

          <div className="chips" role="group" aria-label="Filter tools by category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className="chip-btn"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <article
                key={tool.id}
                className="tool-card"
                style={{ '--accent': tool.accent }}
              >
                <div className="card-top">
                  <span>{tool.number}</span>
                  <span className="live">
                    <i className="ck-live-dot" />
                    Live
                  </span>
                </div>

                <div className="card-identity">
                  <div className="tool-icon">
                    <Icon />
                  </div>
                  <strong>{tool.symbol}</strong>
                </div>

                <span className="category-badge">{tool.category}</span>
                <h3>{tool.name}</h3>
                <p className="card-description">{tool.description}</p>

                <ul>
                  {tool.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className="card-actions">
                  <button
                    type="button"
                    className="landing-btn primary"
                    onClick={() => onOpenTool(tool.id)}
                  >
                    Open Tool
                    <IconArrowRight />
                  </button>
                  <a
                    className="icon-button"
                    href={tool.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${tool.name} repository`}
                  >
                    <IconGithub />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Why ChemKit */}
      <section className="landing-section" id="why">
        <div className="section-heading">
          <p className="eyebrow">Why ChemKit</p>
          <h2>
            Built for students who struggle
            <br />
            with chemistry, just like I did.
          </h2>
        </div>

        <div className="why-grid">
          {WHY_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.title}
                className="why-card"
                style={{ '--accent': card.accent }}
              >
                <div className="tool-icon">
                  <Icon />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* What's Next / Roadmap */}
      <section className="landing-section compact" id="roadmap">
        <div className="glass-panel future-panel">
          <div>
            <p className="eyebrow">What is next</p>
            <h2>Still growing</h2>
            <p>
              ChemKit will keep expanding with small, focused chemistry tools made for quick checks and guided practice.
            </p>
          </div>
          <div>
            <span className="future-label">Potential future tools</span>
            <ul>
              {FUTURE_TOOLS.map((tool) => (
                <li key={tool}>
                  <i />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
