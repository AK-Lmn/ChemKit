import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChemKitMark,
  IconGithub,
  IconLayoutGrid,
  IconMoon,
  IconSun,
  LogoChemBalancer,
  LogoElementExplorer,
  LogoGasLab,
  LogoMoleMate,
  LogoPhCalculator,
  LogoSolutionLab,
  LogoStoichiometry,
} from './components/Icons.jsx'
import { Overview } from './tools/Overview.jsx'
import { ElementExplorer } from './tools/ElementExplorer.jsx'
import { MoleMate } from './tools/MoleMate.jsx'
import { GasLab } from './tools/GasLab.jsx'
import { ChemBalancer } from './tools/ChemBalancer.jsx'
import { StoichiometrySolver } from './tools/StoichiometrySolver.jsx'
import { PhCalculator } from './tools/PhCalculator.jsx'
import { SolutionLab } from './tools/SolutionLab.jsx'

const REPO_URL = 'https://github.com/AK-Lmn/ChemKit'

const NAV_ITEMS = [
  {
    id: 'overview',
    path: '/',
    shortLabel: 'Home',
    name: 'Home',
    icon: IconLayoutGrid,
  },
  {
    id: 'elements',
    path: '/elements',
    shortLabel: 'Elements',
    name: 'Element Explorer',
    description: 'Interactive 18-column periodic table with search, category filters, favorites, and atomic properties.',
    icon: LogoElementExplorer,
  },
  {
    id: 'moles',
    path: '/moles',
    shortLabel: 'Moles',
    name: 'MoleMate',
    description: 'Formula molar mass calculator, mass-to-mole converter (mg, g, kg), and Avogadro particle counts.',
    icon: LogoMoleMate,
  },
  {
    id: 'gas-laws',
    path: '/gas-laws',
    shortLabel: 'Gas Laws',
    name: 'GasLab',
    description: 'Guided Boyle, Charles, Gay-Lussac, Avogadro, and Ideal Gas Law solver with live unit conversions.',
    icon: LogoGasLab,
  },
  {
    id: 'balancer',
    path: '/balancer',
    shortLabel: 'Balancer',
    name: 'Chemical Equation Balancer',
    description: 'Balances equations into exact whole-number coefficients and verifies atom counts on both sides.',
    icon: LogoChemBalancer,
  },
  {
    id: 'stoichiometry',
    path: '/stoichiometry',
    shortLabel: 'Stoichiometry',
    name: 'Stoichiometry Solver',
    description: 'Mole-to-mole and gram-to-gram conversions with auto-balancing and step-by-step dimensional analysis.',
    icon: LogoStoichiometry,
  },
  {
    id: 'ph',
    path: '/ph',
    shortLabel: 'pH',
    name: 'pH Calculator',
    description: 'Converts between pH, pOH, [H+], and [OH-] and solves monoprotic weak acid or weak base dissociation.',
    icon: LogoPhCalculator,
  },
  {
    id: 'solutions',
    path: '/solutions',
    shortLabel: 'Solutions',
    name: 'SolutionLab',
    description: 'Solves molarity, moles, volume, dilution (M1V1 = M2V2), mass concentration (g/L), % w/w, and % v/v.',
    icon: LogoSolutionLab,
  },
]

const TOOLS_ONLY = NAV_ITEMS.filter((item) => item.id !== 'overview')

function resolveRouteId() {
  const params = new URLSearchParams(window.location.search)
  const queryTool = params.get('tool')
  if (queryTool) {
    const matched = NAV_ITEMS.find((item) => item.id === queryTool)
    if (matched) return matched.id
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const byPath = NAV_ITEMS.find((item) => item.path === pathname)
  if (byPath) return byPath.id

  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash) {
    const byHash = NAV_ITEMS.find((item) => item.id === hash)
    if (byHash) return byHash.id
  }

  return 'overview'
}

export default function App() {
  const [activeId, setActiveId] = useState(resolveRouteId)
  const [molePrefill, setMolePrefill] = useState(null)
  const [stoichPrefill, setStoichPrefill] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, ready: false })
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('chemkit-theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch {}
    return 'dark'
  })
  const tabRefs = useRef({})

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem('chemkit-theme', theme)
    } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const syncIndicator = useCallback(() => {
    const activeNode = tabRefs.current[activeId]
    if (!activeNode) return
    setIndicatorStyle({
      left: activeNode.offsetLeft,
      width: activeNode.offsetWidth,
      ready: true,
    })
  }, [activeId])

  useEffect(() => {
    syncIndicator()
    window.addEventListener('resize', syncIndicator)
    return () => window.removeEventListener('resize', syncIndicator)
  }, [syncIndicator])

  const navigate = useCallback((nextId) => {
    const target = NAV_ITEMS.find((item) => item.id === nextId) || NAV_ITEMS[0]
    setActiveId(target.id)
    if (window.location.pathname !== target.path || window.location.search) {
      window.history.pushState({ tool: target.id }, '', target.path)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const onPopState = () => {
      setActiveId(resolveRouteId())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const activeItem = NAV_ITEMS.find((item) => item.id === activeId) || NAV_ITEMS[0]
    document.title =
      activeItem.id === 'overview'
        ? 'ChemKit: Interactive Chemistry Suite'
        : `${activeItem.name} | ChemKit`
  }, [activeId])

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % NAV_ITEMS.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = NAV_ITEMS.length - 1

    if (nextIndex !== null) {
      event.preventDefault()
      const nextItem = NAV_ITEMS[nextIndex]
      navigate(nextItem.id)
      tabRefs.current[nextItem.id]?.focus()
    }
  }

  const handleSendToMoleMate = useCallback(
    (formula, molarMass) => {
      setMolePrefill({ formula, molarMass })
      navigate('moles')
    },
    [navigate],
  )

  const handleSendToStoichiometry = useCallback(
    (equation) => {
      setStoichPrefill({ equation })
      navigate('stoichiometry')
    },
    [navigate],
  )

  const consumeMolePrefill = useCallback(() => setMolePrefill(null), [])
  const consumeStoichPrefill = useCallback(() => setStoichPrefill(null), [])

  return (
    <div className="ck-app">
      <div className="background" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className="ck-header">
        <div className="ck-shell ck-header-bar">
          <button
            type="button"
            className="ck-brand"
            aria-label="ChemKit home"
            onClick={() => navigate('overview')}
          >
            <ChemKitMark className="ck-brand-mark" />
            <span>Chem<span className="ck-brand-accent">Kit</span></span>
          </button>

          <div className="ck-header-right">
            <button
              type="button"
              className="ck-theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <a
              className="ck-github-link"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="View ChemKit on GitHub"
            >
              <IconGithub />
              <span className="ck-github-text">GitHub</span>
            </a>
          </div>
        </div>

        <nav className="ck-tabbar-wrap" aria-label="Chemistry tools">
          <div className="ck-shell">
            <div className="ck-tablist" role="tablist" aria-label="ChemKit workspace tabs">
              <span
                className="ck-tab-indicator"
                aria-hidden="true"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.ready ? 1 : 0,
                }}
              />
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon
                const isSelected = activeId === item.id
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[item.id] = node
                    }}
                    id={`tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`panel-${item.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    className="ck-tab"
                    onClick={() => navigate(item.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    <Icon />
                    <span>{item.shortLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </header>

      <main className="ck-main">
        <div
          key={activeId}
          id={`panel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
          className="ck-shell ck-panel-enter"
        >
          {activeId === 'overview' && <Overview onOpenTool={navigate} />}
          {activeId === 'elements' && <ElementExplorer onSendToMoleMate={handleSendToMoleMate} />}
          {activeId === 'moles' && (
            <MoleMate prefill={molePrefill} onConsumePrefill={consumeMolePrefill} />
          )}
          {activeId === 'gas-laws' && <GasLab />}
          {activeId === 'balancer' && (
            <ChemBalancer onSendToStoichiometry={handleSendToStoichiometry} />
          )}
          {activeId === 'stoichiometry' && (
            <StoichiometrySolver prefill={stoichPrefill} onConsumePrefill={consumeStoichPrefill} />
          )}
          {activeId === 'ph' && <PhCalculator />}
          {activeId === 'solutions' && <SolutionLab />}
        </div>
      </main>

      <footer className="ck-footer">
        <div className="ck-shell ck-footer-inner">
          <span>ChemKit: unified browser suite for chemistry calculations. History stays in your browser.</span>
          <span>
            Built by{' '}
            <a href="https://github.com/AK-Lmn" target="_blank" rel="noreferrer">
              @AK-Lmn
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
