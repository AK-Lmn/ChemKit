import { useEffect, useState } from 'react'
import {
  calculateMoles,
  calculateParticles,
  convertMassToGrams,
  getMolarMassBreakdown,
} from '../lib/molar-mass.js'
import { formatNumber, formatScientific, formatTimeAgo } from '../lib/format.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Combobox } from '../components/Select.jsx'
import { IconAlertCircle, IconCheck, IconCopy, IconRotateCcw, IconTrash, LogoMoleMate } from '../components/Icons.jsx'

const MASS_UNIT_OPTIONS = [
  { value: 'mg', label: 'mg', detail: 'milligrams' },
  { value: 'g', label: 'g', detail: 'grams' },
  { value: 'kg', label: 'kg', detail: 'kilograms' },
]

const FORMULA_EXAMPLES = ['H2O', 'NaCl', 'C6H12O6', 'Ca(OH)2', 'CuSO4·5H2O']

export function MoleMate({ prefill, onConsumePrefill }) {
  const [formula, setFormula] = useState('')
  const [mass, setMass] = useState('')
  const [massUnit, setMassUnit] = useState('g')
  const [molarMass, setMolarMass] = useState('')
  const [breakdown, setBreakdown] = useState(null)
  const [formulaError, setFormulaError] = useState('')
  const [calcError, setCalcError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useLocalStorage('chemkit-molemate-history', [])
  const [undoHistory, setUndoHistory] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!prefill) return
    if (prefill.formula) {
      setFormula(prefill.formula)
      try {
        const info = getMolarMassBreakdown(prefill.formula)
        setBreakdown(info)
        setMolarMass(String(Number(info.totalMass.toFixed(4))))
        setFormulaError('')
      } catch {
        setMolarMass(prefill.molarMass ? String(prefill.molarMass) : '')
      }
    } else if (prefill.molarMass) {
      setMolarMass(String(prefill.molarMass))
    }
    onConsumePrefill?.()
  }, [prefill, onConsumePrefill])

  const applyFormula = (nextFormula) => {
    // Helpful auto-normalization: convert * to middle dot ·
    const normalized = nextFormula.replace(/([A-Za-z0-9\)])\s*[\*]\s*(\d*)/g, '$1·$2')
    setFormula(normalized)
    setFormulaError('')
    const trimmed = normalized.trim()
    if (!trimmed) {
      setBreakdown(null)
      return
    }
    try {
      const info = getMolarMassBreakdown(trimmed)
      setBreakdown(info)
      setMolarMass(String(Number(info.totalMass.toFixed(4))))
    } catch (error) {
      setBreakdown(null)
      let msg = error.message
      if (msg.includes('parenthes') || msg.includes('bracket')) {
        msg = 'Check your parentheses: make sure every "(" has a matching ")". Example: Ca(OH)2'
      } else if (msg.includes('element')) {
        msg = 'Unknown element symbol: capitalize the first letter (e.g. Cl not cl, Na not NA).'
      } else if (msg.includes('hydrate')) {
        msg = 'Hydrate format: use a middle dot (·) before hydrate waters, e.g. CuSO4·5H2O'
      }
      setFormulaError(msg)
    }
  }

  const handleClearHistory = () => {
    setUndoHistory(history)
    setHistory([])
  }

  const handleUndoHistory = () => {
    if (undoHistory) {
      setHistory(undoHistory)
      setUndoHistory(null)
    }
  }

  const handleCalculate = (event) => {
    event?.preventDefault()
    setCalcError('')

    const massValue = Number.parseFloat(mass)
    const molarMassValue = Number.parseFloat(molarMass)
    if (!Number.isFinite(massValue) || massValue <= 0 || !Number.isFinite(molarMassValue) || molarMassValue <= 0) {
      setCalcError('Enter positive numbers for both sample mass and molar mass.')
      setResult(null)
      return
    }

    try {
      const massInGrams = convertMassToGrams(massValue, massUnit)
      const moles = calculateMoles(massInGrams, molarMassValue)
      const particles = calculateParticles(moles)
      const computed = {
        formula: formula.trim() || null,
        mass: massValue,
        massUnit,
        massInGrams,
        molarMass: molarMassValue,
        moles,
        particles,
        time: Date.now(),
      }
      setResult(computed)
      setHistory((prev) => [computed, ...(Array.isArray(prev) ? prev : [])].slice(0, 10))
    } catch (error) {
      setCalcError(error.message)
      setResult(null)
    }
  }

  const handleClear = () => {
    setFormula('')
    setMass('')
    setMassUnit('g')
    setMolarMass('')
    setBreakdown(null)
    setFormulaError('')
    setCalcError('')
    setResult(null)
  }

  const handleCopy = async () => {
    if (!result) return
    const text = `${formatNumber(result.moles)} mol (${formatNumber(result.mass)} ${result.massUnit}${result.formula ? ` of ${result.formula}` : ''} at ${formatNumber(result.molarMass)} g/mol)`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <div className="ck-tool-header-identity">
          <span className="ck-tool-header-mark" style={{ '--accent': '#a875ff' }} aria-hidden="true">
            <LogoMoleMate />
          </span>
          <div>
            <div className="ck-tool-badge-row">
              <span className="ck-tool-badge-num">12</span>
              <span className="ck-tool-badge-cat">Calculations</span>
            </div>
            <h1 className="ck-tool-title">MoleMate</h1>
            <p className="ck-tool-subtitle">
              Calculate molar mass from a chemical formula or enter a known molar mass to convert mass into moles and
              particle counts.
            </p>
          </div>
        </div>
      </div>

      <div className="ck-grid-2">
        <form className="ck-panel ck-stack" onSubmit={handleCalculate} noValidate>
          <div className="ck-panel-head" style={{ marginBottom: 0 }}>
            <div>
              <h2 className="ck-panel-title">Mass and molar mass inputs</h2>
              <p className="ck-panel-note">Formula: moles = mass (g) / molar mass (g/mol)</p>
            </div>
          </div>

          <div className="ck-field">
            <div className="ck-label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="mm-formula" className="ck-label" style={{ marginBottom: 0 }}>
                Chemical formula (optional, auto-fills molar mass)
              </label>
              <div className="ck-symbol-helpers" style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="ck-btn ck-btn--ghost ck-btn--sm"
                  style={{ minHeight: '26px', height: '26px', padding: '0 8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                  onClick={() => applyFormula(formula + '·')}
                  title="Insert Hydrate Dot (·)"
                >
                  + ·
                </button>
                <button
                  type="button"
                  className="ck-btn ck-btn--ghost ck-btn--sm"
                  style={{ minHeight: '26px', height: '26px', padding: '0 8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                  onClick={() => applyFormula(formula + '()')}
                  title="Insert Parentheses ()"
                >
                  ( )
                </button>
              </div>
            </div>
            <input
              id="mm-formula"
              type="text"
              className={`ck-input mono ${formulaError ? 'is-error' : ''}`}
              placeholder="e.g. H2O, Ca(OH)2, CuSO4·5H2O"
              value={formula}
              onChange={(event) => applyFormula(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {formulaError ? (
              <p className="ck-field-error" role="alert">
                {formulaError}
              </p>
            ) : (
              <div className="ck-chip-row" aria-label="Example formulas">
                {FORMULA_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="ck-chip mono"
                    onClick={() => applyFormula(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ck-field">
            <label htmlFor="mm-mass" className="ck-label">
              Sample mass
            </label>
            <div className="ck-input-row">
              <input
                id="mm-mass"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                className="ck-input tabular"
                placeholder="e.g. 18.015"
                value={mass}
                onChange={(event) => {
                  setMass(event.target.value)
                  setCalcError('')
                }}
              />
              <Combobox
                id="mm-mass-unit"
                compact
                ariaLabel="Mass unit"
                value={massUnit}
                options={MASS_UNIT_OPTIONS}
                onChange={setMassUnit}
              />
            </div>
          </div>

          <div className="ck-field">
            <label htmlFor="mm-molar-mass" className="ck-label">
              Molar mass (g/mol)
            </label>
            <div className="ck-input-row">
              <input
                id="mm-molar-mass"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                className="ck-input tabular"
                placeholder="e.g. 18.015"
                value={molarMass}
                onChange={(event) => {
                  setMolarMass(event.target.value)
                  setCalcError('')
                }}
              />
              <span className="ck-unit-tag">g/mol</span>
            </div>
          </div>

          {calcError && (
            <div className="ck-alert ck-alert--error" role="alert">
              <IconAlertCircle />
              <span>{calcError}</span>
            </div>
          )}

          <div className="ck-btn-row">
            <button type="submit" className="ck-btn ck-btn--primary">
              Calculate moles
            </button>
            <button type="button" className="ck-btn ck-btn--secondary" onClick={handleClear}>
              <IconRotateCcw />
              Clear
            </button>
          </div>
        </form>

        <div className="ck-stack">
          <section className="ck-panel ck-stack" aria-live="polite">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Results</h2>
              {result && (
                <button
                  type="button"
                  className={`ck-btn ck-btn--secondary ck-btn--sm ${copied ? 'ck-success-pulse' : ''}`}
                  onClick={handleCopy}
                  title="Copy calculated moles to clipboard"
                  aria-label="Copy calculated moles"
                >
                  <span className="ck-icon-swap" aria-hidden="true">
                    <IconCopy data-active={!copied} />
                    <IconCheck data-active={copied} />
                  </span>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            {result ? (
              <>
                <div key={result.time} className="ck-readout ck-mask-reveal ck-success-pulse">
                  <span className="ck-readout-label">Moles</span>
                  <strong className="ck-readout-value">{formatNumber(result.moles)} mol</strong>
                  <p className="ck-readout-sub">
                    {formatNumber(result.mass)} {result.massUnit}
                    {result.formula ? ` of ${result.formula}` : ''} at {formatNumber(result.molarMass)} g/mol
                  </p>
                </div>
                <div className="ck-stat-grid">
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 0 }}>
                    <span>Estimated particles</span>
                    <strong>{formatScientific(result.particles, 3)}</strong>
                  </div>
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 1 }}>
                    <span>Mass in grams</span>
                    <strong>{formatNumber(result.massInGrams)} g</strong>
                  </div>
                </div>
              </>
            ) : (
              <p className="ck-empty">Enter a mass and molar mass, then select Calculate moles.</p>
            )}
          </section>

          {breakdown && (
            <section className="ck-panel ck-stack">
              <div className="ck-panel-head" style={{ marginBottom: 0 }}>
                <h2 className="ck-panel-title">Formula composition ({formula.trim()})</h2>
                <span className="mono tabular" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>
                  {formatNumber(breakdown.totalMass)} g/mol
                </span>
              </div>
              <div className="ck-table-wrap">
                <table className="ck-table">
                  <thead>
                    <tr>
                      <th>Element</th>
                      <th className="num">Atoms</th>
                      <th className="num">Mass (g/mol)</th>
                      <th className="num">Mass %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.items.map((item, index) => (
                      <tr
                        key={item.symbol}
                        className="ck-stagger-row"
                        style={{ '--stagger': Math.min(index, 6) }}
                      >
                        <td>
                          <strong className="mono">{item.symbol}</strong> {item.name}
                        </td>
                        <td className="num">{item.count}</td>
                        <td className="num">{formatNumber(item.subtotal)}</td>
                        <td className="num">{item.percent.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="ck-panel ck-stack">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Recent history</h2>
              {history.length > 0 && (
                <button
                  type="button"
                  className="ck-btn ck-btn--ghost ck-btn--sm"
                  onClick={handleClearHistory}
                >
                  <IconTrash />
                  Clear
                </button>
              )}
            </div>
            {undoHistory && history.length === 0 && (
              <div className="ck-undo-banner" role="status">
                <span>History cleared.</span>
                <button type="button" className="ck-undo-btn" onClick={handleUndoHistory}>
                  <IconRotateCcw />
                  Undo
                </button>
              </div>
            )}
            {history.length === 0 && !undoHistory ? (
              <p className="ck-empty">Saved mole conversions appear here.</p>
            ) : null}
            {history.length > 0 && (
              <ul className="ck-history-list">
                {history.map((entry, index) => (
                  <li key={`${entry.time}-${index}`}>
                    <button
                      type="button"
                      className="ck-history-item"
                      onClick={() => {
                        setMass(String(entry.mass))
                        setMassUnit(entry.massUnit)
                        setMolarMass(String(entry.molarMass))
                        if (entry.formula) applyFormula(entry.formula)
                      }}
                    >
                      <div className="ck-history-top">
                        <span>
                          {formatNumber(entry.mass)} {entry.massUnit} / {formatNumber(entry.molarMass)} g/mol
                        </span>
                        <span className="ck-history-time">{formatTimeAgo(entry.time)}</span>
                      </div>
                      <span className="ck-history-result">
                        {formatNumber(entry.moles)} mol ({formatScientific(entry.particles, 3)} particles)
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
