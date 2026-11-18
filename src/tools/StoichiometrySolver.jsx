import { useEffect, useState } from 'react'
import {
  autoBalanceForStoichiometry,
  parseChemicalEquation,
  solveStoichiometry,
} from '../lib/stoichiometry.js'
import { formatFormulaSubscripts, formatNumber, formatTimeAgo } from '../lib/format.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Select } from '../components/Select.jsx'
import {
  IconAlertCircle,
  IconCheck,
  IconRotateCcw,
  IconSparkles,
  IconTrash,
} from '../components/Icons.jsx'

const UNIT_OPTIONS = [
  { value: 'moles', label: 'moles (mol)' },
  { value: 'grams', label: 'grams (g)' },
]

const EXAMPLES = [
  '2H2 + O2 -> 2H2O',
  '4Fe + 3O2 -> 2Fe2O3',
  'C3H8 + 5O2 -> 3CO2 + 4H2O',
  'Ca(OH)2 + 2HCl -> CaCl2 + 2H2O',
]

export function StoichiometrySolver({ prefill, onConsumePrefill }) {
  const [equationInput, setEquationInput] = useState('')
  const [parsedEquation, setParsedEquation] = useState(null)
  const [equationStatus, setEquationStatus] = useState(null)
  const [givenFormula, setGivenFormula] = useState('')
  const [givenAmount, setGivenAmount] = useState('')
  const [givenUnit, setGivenUnit] = useState('moles')
  const [targetFormula, setTargetFormula] = useState('')
  const [targetUnit, setTargetUnit] = useState('grams')
  const [solveError, setSolveError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useLocalStorage('chemkit-stoichiometry-history', [])

  const applyParsed = (parsed, message) => {
    setParsedEquation(parsed)
    setGivenFormula(parsed.compounds[0]?.formula || '')
    setTargetFormula(parsed.compounds[parsed.compounds.length - 1]?.formula || parsed.compounds[0]?.formula || '')
    setEquationStatus({ type: 'success', text: message })
    setSolveError('')
    setResult(null)
  }

  const handleParse = (rawOverride) => {
    const source = rawOverride !== undefined ? rawOverride : equationInput
    try {
      const parsed = parseChemicalEquation(source)
      applyParsed(
        parsed,
        `Parsed ${parsed.compounds.length} compounds. Confirm the equation is balanced before solving.`,
      )
    } catch (error) {
      setParsedEquation(null)
      setEquationStatus({ type: 'error', text: error.message })
      setResult(null)
    }
  }

  const handleAutoBalance = () => {
    try {
      const parsed = autoBalanceForStoichiometry(equationInput)
      setEquationInput(parsed.raw)
      applyParsed(parsed, `Balanced and parsed ${parsed.compounds.length} compounds: ${parsed.raw}`)
    } catch (error) {
      setParsedEquation(null)
      setEquationStatus({ type: 'error', text: error.message })
      setResult(null)
    }
  }

  useEffect(() => {
    if (!prefill?.equation) return
    setEquationInput(prefill.equation)
    try {
      const parsed = parseChemicalEquation(prefill.equation)
      applyParsed(parsed, `Loaded balanced equation with ${parsed.compounds.length} compounds.`)
    } catch (error) {
      setEquationStatus({ type: 'error', text: error.message })
    }
    onConsumePrefill?.()
  }, [prefill, onConsumePrefill])

  const handleSolve = (event) => {
    event?.preventDefault()
    setSolveError('')
    const amountNum = Number(givenAmount)
    if (!givenAmount.trim() || !Number.isFinite(amountNum) || amountNum <= 0) {
      setSolveError('Enter a given amount greater than zero.')
      return
    }
    try {
      const solved = solveStoichiometry({
        parsedEquation,
        givenFormula,
        givenAmount: amountNum,
        givenUnit,
        targetFormula,
        targetUnit,
      })
      setResult(solved)
      setHistory((prev) =>
        [
          {
            equation: parsedEquation.raw,
            amount: amountNum,
            given: solved.given.formula,
            givenUnit,
            target: solved.target.formula,
            targetUnit,
            result: solved.result,
            time: Date.now(),
          },
          ...(Array.isArray(prev) ? prev : []),
        ].slice(0, 8),
      )
    } catch (error) {
      setSolveError(error.message)
      setResult(null)
    }
  }

  const compoundOptions = (parsedEquation?.compounds || []).map((item) => ({
    value: item.formula,
    label: `${item.formula}`,
    detail: `coeff ${item.coefficient} (${formatNumber(item.molarMass)} g/mol)`,
  }))

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <h1 className="ck-tool-title">Stoichiometry Solver</h1>
        <p className="ck-tool-subtitle">
          Convert between moles and grams across reactants and products using balanced mole ratios and IUPAC molar
          masses.
        </p>
      </div>

      <div className="ck-grid-2">
        <div className="ck-stack">
          <form
            className="ck-panel ck-stack"
            onSubmit={(event) => {
              event.preventDefault()
              handleParse()
            }}
            noValidate
          >
            <h2 className="ck-panel-title">1. Load equation</h2>
            <div className="ck-field">
              <label htmlFor="stoich-equation" className="ck-label">
                Chemical equation
              </label>
              <input
                id="stoich-equation"
                type="text"
                className="ck-input mono"
                placeholder="e.g. 2H2 + O2 -> 2H2O"
                value={equationInput}
                onChange={(event) => setEquationInput(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="ck-btn-row">
              <button type="submit" className="ck-btn ck-btn--primary">
                Parse equation
              </button>
              <button type="button" className="ck-btn ck-btn--secondary" onClick={handleAutoBalance}>
                <IconSparkles />
                Auto-balance
              </button>
              <button
                type="button"
                className="ck-btn ck-btn--ghost"
                onClick={() => {
                  setEquationInput('')
                  setParsedEquation(null)
                  setEquationStatus(null)
                  setGivenAmount('')
                  setSolveError('')
                  setResult(null)
                }}
              >
                <IconRotateCcw />
                Clear
              </button>
            </div>

            {equationStatus && (
              <div
                className={`ck-alert ${
                  equationStatus.type === 'error' ? 'ck-alert--error' : 'ck-alert--success'
                }`}
                role={equationStatus.type === 'error' ? 'alert' : 'status'}
              >
                {equationStatus.type === 'error' ? <IconAlertCircle /> : <IconCheck />}
                <span>{equationStatus.text}</span>
              </div>
            )}

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
                      handleParse(example)
                    }}
                  >
                    {formatFormulaSubscripts(example)}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <form className="ck-panel ck-stack" onSubmit={handleSolve} noValidate>
            <h2 className="ck-panel-title">2. Set conversion</h2>

            <div className="ck-stat-grid">
              <div className="ck-field">
                <label htmlFor="stoich-given-compound" className="ck-label">
                  Given compound
                </label>
                <Select
                  id="stoich-given-compound"
                  ariaLabel="Given compound"
                  value={givenFormula}
                  options={compoundOptions}
                  disabled={!parsedEquation}
                  placeholder="Parse an equation first"
                  onChange={setGivenFormula}
                />
              </div>

              <div className="ck-field">
                <label htmlFor="stoich-target-compound" className="ck-label">
                  Target compound
                </label>
                <Select
                  id="stoich-target-compound"
                  ariaLabel="Target compound"
                  value={targetFormula}
                  options={compoundOptions}
                  disabled={!parsedEquation}
                  placeholder="Parse an equation first"
                  onChange={setTargetFormula}
                />
              </div>
            </div>

            <div className="ck-stat-grid">
              <div className="ck-field">
                <label htmlFor="stoich-amount" className="ck-label">
                  Given amount
                </label>
                <input
                  id="stoich-amount"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  className="ck-input tabular"
                  placeholder="e.g. 4"
                  disabled={!parsedEquation}
                  value={givenAmount}
                  onChange={(event) => {
                    setGivenAmount(event.target.value)
                    setSolveError('')
                  }}
                />
              </div>

              <div className="ck-field">
                <label htmlFor="stoich-given-unit" className="ck-label">
                  Given unit
                </label>
                <Select
                  id="stoich-given-unit"
                  ariaLabel="Given unit"
                  value={givenUnit}
                  options={UNIT_OPTIONS}
                  disabled={!parsedEquation}
                  onChange={setGivenUnit}
                />
              </div>

              <div className="ck-field">
                <label htmlFor="stoich-target-unit" className="ck-label">
                  Target unit
                </label>
                <Select
                  id="stoich-target-unit"
                  ariaLabel="Target unit"
                  value={targetUnit}
                  options={UNIT_OPTIONS}
                  disabled={!parsedEquation}
                  onChange={setTargetUnit}
                />
              </div>
            </div>

            {solveError && (
              <div className="ck-alert ck-alert--error" role="alert">
                <IconAlertCircle />
                <span>{solveError}</span>
              </div>
            )}

            <button type="submit" className="ck-btn ck-btn--primary" disabled={!parsedEquation}>
              Solve conversion
            </button>
          </form>
        </div>

        <div className="ck-stack">
          <section className="ck-panel ck-stack" aria-live="polite">
            <h2 className="ck-panel-title">Solution</h2>
            {result ? (
              <>
                <div className="ck-readout">
                  <span className="ck-readout-label">Final answer</span>
                  <strong className="ck-readout-value">
                    {formatNumber(result.result)} {result.targetUnit === 'grams' ? 'g' : 'mol'}{' '}
                    {formatFormulaSubscripts(result.target.formula)}
                  </strong>
                  <p className="ck-readout-sub">
                    From {formatNumber(result.amount)} {result.givenUnit === 'grams' ? 'g' : 'mol'}{' '}
                    {formatFormulaSubscripts(result.given.formula)}
                  </p>
                </div>

                <div className="ck-stat-grid">
                  <div className="ck-stat">
                    <span>Mole ratio</span>
                    <strong>{result.moleRatio}</strong>
                  </div>
                  <div className="ck-stat">
                    <span>{result.given.formula} molar mass</span>
                    <strong>{formatNumber(result.given.molarMass)} g/mol</strong>
                  </div>
                  <div className="ck-stat">
                    <span>{result.target.formula} molar mass</span>
                    <strong>{formatNumber(result.target.molarMass)} g/mol</strong>
                  </div>
                </div>

                <ol className="ck-steps">
                  {result.steps.map((stepText, index) => (
                    <li className="ck-step" key={index}>
                      <span className="ck-step-tag">Step {index + 1}</span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="ck-empty">Parse a balanced equation and solve a conversion to see step-by-step work.</p>
            )}
          </section>

          <section className="ck-panel ck-stack">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Recent conversions</h2>
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
              <p className="ck-empty">Solved stoichiometry conversions appear here.</p>
            ) : (
              <ul className="ck-history-list">
                {history.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <div className="ck-history-item">
                      <div className="ck-history-top">
                        <span className="mono">{formatFormulaSubscripts(item.equation)}</span>
                        <span className="ck-history-time">{formatTimeAgo(item.time)}</span>
                      </div>
                      <span className="ck-history-result">
                        {formatNumber(item.amount)} {item.givenUnit === 'grams' ? 'g' : 'mol'} {item.given} -&gt;{' '}
                        {formatNumber(item.result)} {item.targetUnit === 'grams' ? 'g' : 'mol'} {item.target}
                      </span>
                    </div>
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
