import { useState } from 'react'
import {
  balanceEquation,
  formatSubscriptEquation,
  getAtomCounts,
} from '../lib/balancer.js'
import { formatFormulaSubscripts, formatTimeAgo } from '../lib/format.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconRotateCcw,
  IconTrash,
  LogoChemBalancer,
} from '../components/Icons.jsx'

const EXAMPLES = [
  'H2 + O2 -> H2O',
  'Fe + O2 -> Fe2O3',
  'C3H8 + O2 -> CO2 + H2O',
  'Ca(OH)2 + HCl -> CaCl2 + H2O',
  'Al + CuSO4 -> Al2(SO4)3 + Cu',
]

export function ChemBalancer({ onSendToStoichiometry }) {
  const [equationInput, setEquationInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useLocalStorage('chemkit-balancer-history', [])

  const runBalance = (rawText) => {
    const source = rawText !== undefined ? rawText : equationInput
    setError('')
    setCopied(false)
    if (!source.trim()) {
      setError('Enter a chemical equation to balance.')
      setResult(null)
      return
    }
    try {
      const solution = balanceEquation(source)
      const terms = [...solution.parsed.reactants, ...solution.parsed.products]
      const atomRows = getAtomCounts(solution.parsed, solution.coefficients, solution.elements)
      const subscripted = formatSubscriptEquation(solution.parsed, solution.coefficients, '->')
      setResult({
        id: Date.now(),
        plain: solution.equation,
        subscripted,
        terms: terms.map((term, index) => ({
          formula: term.formula,
          coefficient: solution.coefficients[index].toString(),
        })),
        atomRows: atomRows.map((row) => ({
          ...row,
          reactants: row.reactants.toString(),
          products: row.products.toString(),
        })),
      })
      setHistory((prev) => {
        const current = Array.isArray(prev) ? prev : []
        const deduped = current.filter((item) => item.equation !== solution.equation)
        return [{ equation: solution.equation, time: Date.now() }, ...deduped].slice(0, 8)
      })
    } catch (err) {
      setError(err.message || 'Could not balance that equation. Check the formulas and try again.')
      setResult(null)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <div className="ck-tool-header-identity">
          <span className="ck-tool-header-mark" style={{ '--accent': '#ff8f70' }} aria-hidden="true">
            <LogoChemBalancer />
          </span>
          <div>
            <div className="ck-tool-badge-row">
              <span className="ck-tool-badge-num">26</span>
              <span className="ck-tool-badge-cat">Equations</span>
            </div>
            <h1 className="ck-tool-title">Chemical Equation Balancer</h1>
            <p className="ck-tool-subtitle">
              Enter an unbalanced chemical equation using -&gt;, --&gt;, =, or arrows to compute exact whole-number
              coefficients and verify atom conservation.
            </p>
          </div>
        </div>
      </div>

      <div className="ck-grid-2">
        <div className="ck-stack">
          <form
            className="ck-panel ck-stack"
            onSubmit={(event) => {
              event.preventDefault()
              runBalance()
            }}
            noValidate
          >
            <div className="ck-field">
              <label htmlFor="balancer-input" className="ck-label">
                Chemical equation
              </label>
              <input
                id="balancer-input"
                type="text"
                className={`ck-input mono ${error ? 'is-error' : ''}`}
                placeholder="e.g. C3H8 + O2 -> CO2 + H2O"
                value={equationInput}
                onChange={(event) => {
                  setEquationInput(event.target.value)
                  setError('')
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <p className="ck-help">
                Supports parentheses and square brackets. Existing coefficients are accepted and re-balanced.
              </p>
            </div>

            {error && (
              <div className="ck-alert ck-alert--error" role="alert">
                <IconAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="ck-btn-row">
              <button type="submit" className="ck-btn ck-btn--primary">
                Balance equation
              </button>
              <button
                type="button"
                className="ck-btn ck-btn--secondary"
                onClick={() => {
                  setEquationInput('')
                  setResult(null)
                  setError('')
                }}
              >
                <IconRotateCcw />
                Clear
              </button>
            </div>

            <div className="ck-field">
              <span className="ck-label">Examples</span>
              <div className="ck-chip-row">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="ck-chip mono"
                    onClick={() => {
                      setEquationInput(example)
                      runBalance(example)
                    }}
                  >
                    {formatFormulaSubscripts(example)}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {result && (
            <section className="ck-panel ck-stack" aria-live="polite">
              <div className="ck-panel-head" style={{ marginBottom: 0 }}>
                <h2 className="ck-panel-title">Balanced result</h2>
                <div className="ck-btn-row">
                  <button
                    type="button"
                    className={`ck-btn ck-btn--secondary ck-btn--sm ${copied ? 'ck-success-pulse' : ''}`}
                    onClick={handleCopy}
                  >
                    <span className="ck-icon-swap" aria-hidden="true">
                      <IconCopy data-active={!copied} />
                      <IconCheck data-active={copied} />
                    </span>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    className="ck-btn ck-btn--primary ck-btn--sm"
                    onClick={() => onSendToStoichiometry(result.plain)}
                  >
                    Use in Stoichiometry
                    <IconArrowRight />
                  </button>
                </div>
              </div>

              <div key={result.id} className="ck-readout ck-mask-reveal ck-success-pulse">
                <span className="ck-readout-label">Balanced equation</span>
                <strong className="ck-readout-value" style={{ fontSize: '1.375rem' }}>
                  {result.subscripted}
                </strong>
              </div>

              <div className="ck-field">
                <span className="ck-label">Stoichiometric coefficients</span>
                <div className="ck-coeff-grid">
                  {result.terms.map((term, index) => (
                    <div
                      className="ck-coeff-chip ck-detail-settle"
                      style={{ '--stagger': Math.min(index, 6) }}
                      key={`${result.id}-${term.formula}-${index}`}
                    >
                      <span className="ck-coeff-num">{term.coefficient}</span>
                      <span className="ck-coeff-formula">{formatFormulaSubscripts(term.formula)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ck-field">
                <span className="ck-label">Atom conservation check</span>
                <div className="ck-table-wrap">
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th>Element</th>
                        <th className="num">Reactants</th>
                        <th className="num">Products</th>
                        <th className="num">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.atomRows.map((row, index) => (
                        <tr
                          key={`${result.id}-${row.element}`}
                          className="ck-detail-settle"
                          style={{ '--stagger': Math.min(index, 6) }}
                        >
                          <td className="mono">{row.element}</td>
                          <td className="num">{row.reactants}</td>
                          <td className="num">{row.products}</td>
                          <td className="num" style={{ color: 'var(--status-success)' }}>
                            Equal
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="ck-panel ck-stack">
          <div className="ck-panel-head" style={{ marginBottom: 0 }}>
            <h2 className="ck-panel-title">Recent equations</h2>
            {history.length > 0 && (
              <button
                type="button"
                className="ck-btn ck-btn--ghost ck-btn--sm"
                onClick={() => setHistory([])}
              >
                <IconTrash />
                Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="ck-empty">Balanced equations are saved locally and listed here.</p>
          ) : (
            <ul className="ck-history-list">
              {history.map((item, index) => (
                <li key={`${item.equation}-${index}`}>
                  <button
                    type="button"
                    className="ck-history-item"
                    onClick={() => {
                      setEquationInput(item.equation)
                      runBalance(item.equation)
                    }}
                  >
                    <div className="ck-history-top">
                      <span>Balanced</span>
                      <span className="ck-history-time">{formatTimeAgo(item.time)}</span>
                    </div>
                    <span className="ck-history-result">{formatFormulaSubscripts(item.equation)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
