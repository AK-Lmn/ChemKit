import { useMemo, useState } from 'react'
import {
  DILUTION_VARS,
  SOLUTION_MODES,
  SolutionValidationError,
  UNIT_OPTIONS,
  computeVialPercent,
  solveSolution,
} from '../lib/solutions.js'
import { formatNumber, formatTimeAgo } from '../lib/format.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Select } from '../components/Select.jsx'
import { IconAlertCircle, IconRotateCcw, IconTrash } from '../components/Icons.jsx'

const DILUTION_OPTIONS = DILUTION_VARS.map((v) => ({
  value: v.key,
  label: `Solve for ${v.short}: ${v.label}`,
}))

const VOLUME_RESULT_OPTIONS = [
  { value: 'L', label: 'L (liters)' },
  { value: 'mL', label: 'mL (milliliters)' },
]

export function SolutionLab() {
  const [modeId, setModeId] = useState(SOLUTION_MODES[0].id)
  const [dilutionSolveFor, setDilutionSolveFor] = useState('V2')
  const [volumeResultUnit, setVolumeResultUnit] = useState('L')
  const [rawValues, setRawValues] = useState({})
  const [fieldUnits, setFieldUnits] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useLocalStorage('solutionlab-history', [])

  const mode = useMemo(
    () => SOLUTION_MODES.find((item) => item.id === modeId) || SOLUTION_MODES[0],
    [modeId],
  )

  const activeFields = useMemo(() => {
    if (!mode.isDilution) return mode.fields
    return DILUTION_VARS.filter((v) => v.key !== dilutionSolveFor).map((v) => ({
      key: v.key,
      label: v.label,
      kind: v.kind,
      placeholder: v.kind === 'conc' ? 'e.g. 1.0' : 'e.g. 100',
      helper: v.kind === 'conc' ? 'Concentration in mol/L.' : 'Volume of solution.',
    }))
  }, [mode, dilutionSolveFor])

  const needsVolumeResultUnit =
    mode.id === 'V-from-n-M' || (mode.isDilution && (dilutionSolveFor === 'V1' || dilutionSolveFor === 'V2'))

  const switchMode = (nextModeId) => {
    setModeId(nextModeId)
    if (nextModeId === 'dilution') setDilutionSolveFor('V2')
    setRawValues({})
    setFieldUnits({})
    setFieldErrors({})
    setGeneralError('')
    setResult(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFieldErrors({})
    setGeneralError('')

    const nextErrors = {}
    const parsedValues = {}

    for (const field of activeFields) {
      const raw = (rawValues[field.key] ?? '').trim()
      const num = Number(raw)
      if (!raw || !Number.isFinite(num)) {
        nextErrors[field.key] = 'Enter a valid number.'
      } else if (num <= 0) {
        nextErrors[field.key] = `${field.label} must be greater than zero.`
      } else {
        const defaultUnit =
          field.kind === 'mol'
            ? 'mol'
            : field.kind === 'conc'
              ? 'M'
              : UNIT_OPTIONS[field.kind][0]
        parsedValues[field.key] = {
          value: num,
          unit: fieldUnits[field.key] || defaultUnit,
        }
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    try {
      const solved = solveSolution(mode.id, parsedValues, { dilutionSolveFor, volumeResultUnit })
      setResult({ ...solved, id: Date.now() })
      setHistory((prev) =>
        [
          {
            modeLabel: mode.label,
            summary: solved.summary,
            resultText: `${formatNumber(solved.value)} ${solved.unit}`,
            time: Date.now(),
          },
          ...(Array.isArray(prev) ? prev : []),
        ].slice(0, 10),
      )
    } catch (error) {
      if (error instanceof SolutionValidationError) {
        setFieldErrors({ [error.fieldKey]: error.message })
      } else {
        setGeneralError(error.message || 'Could not compute result.')
      }
      setResult(null)
    }
  }

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <h1 className="ck-tool-title">SolutionLab</h1>
        <p className="ck-tool-subtitle">
          Calculate molarity, moles, solution volume, dilutions (M1V1 = M2V2), mass concentration (g/L), and percent
          concentrations (% w/w and % v/v).
        </p>
      </div>

      <div className="ck-grid-sidebar">
        <nav className="ck-panel ck-stack" aria-label="Solution calculation modes">
          <h2 className="ck-panel-title">Calculation mode</h2>
          <div className="ck-mode-list">
            {SOLUTION_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ck-mode-btn"
                aria-pressed={mode.id === item.id}
                onClick={() => switchMode(item.id)}
              >
                <span className="ck-mode-btn-title">{item.label}</span>
                <span className="ck-mode-btn-formula">{item.formulaTag}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="ck-stack">
          <form className="ck-panel ck-stack" onSubmit={handleSubmit} noValidate>
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <div>
                <h2 className="ck-panel-title">{mode.label}</h2>
                <p className="ck-panel-note">{mode.hint}</p>
              </div>
              <button
                type="button"
                className="ck-btn ck-btn--secondary ck-btn--sm"
                onClick={() => {
                  setRawValues({})
                  setFieldErrors({})
                  setGeneralError('')
                  setResult(null)
                }}
              >
                <IconRotateCcw />
                Reset
              </button>
            </div>

            {mode.isDilution && (
              <div className="ck-field">
                <label htmlFor="sol-dilution-solve" className="ck-label">
                  Unknown variable
                </label>
                <Select
                  id="sol-dilution-solve"
                  ariaLabel="Dilution variable to solve for"
                  value={dilutionSolveFor}
                  options={DILUTION_OPTIONS}
                  onChange={(next) => {
                    setDilutionSolveFor(next)
                    setFieldErrors({})
                    setResult(null)
                  }}
                />
              </div>
            )}

            <div className="ck-stat-grid">
              {activeFields.map((field) => {
                const hasUnitSelect = field.kind === 'vol' || field.kind === 'mass'
                const unitList = hasUnitSelect ? UNIT_OPTIONS[field.kind] : []
                const currentUnit = fieldUnits[field.key] || (hasUnitSelect ? unitList[0] : field.kind === 'mol' ? 'mol' : 'M')
                const err = fieldErrors[field.key]

                return (
                  <div className="ck-field" key={field.key}>
                    <label htmlFor={`sol-${field.key}`} className="ck-label">
                      {field.label}
                    </label>
                    <div className="ck-input-row">
                      <input
                        id={`sol-${field.key}`}
                        type="text"
                        inputMode="decimal"
                        className={`ck-input tabular ${err ? 'is-error' : ''}`}
                        placeholder={field.placeholder}
                        value={rawValues[field.key] ?? ''}
                        onChange={(event) => {
                          setRawValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                          setFieldErrors((prev) => {
                            if (!prev[field.key]) return prev
                            const next = { ...prev }
                            delete next[field.key]
                            return next
                          })
                        }}
                        autoComplete="off"
                      />
                      {hasUnitSelect ? (
                        <Select
                          id={`sol-unit-${field.key}`}
                          compact
                          ariaLabel={`Unit for ${field.label}`}
                          value={currentUnit}
                          options={unitList.map((u) => ({ value: u, label: u }))}
                          onChange={(nextUnit) =>
                            setFieldUnits((prev) => ({ ...prev, [field.key]: nextUnit }))
                          }
                        />
                      ) : (
                        <span className="ck-unit-tag">{currentUnit}</span>
                      )}
                    </div>
                    {err ? (
                      <p className="ck-field-error" role="alert">
                        {err}
                      </p>
                    ) : (
                      <p className="ck-help">{field.helper}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {needsVolumeResultUnit && (
              <div className="ck-field">
                <label htmlFor="sol-result-unit" className="ck-label">
                  Display volume result in
                </label>
                <Select
                  id="sol-result-unit"
                  ariaLabel="Volume result unit"
                  value={volumeResultUnit}
                  options={VOLUME_RESULT_OPTIONS}
                  onChange={setVolumeResultUnit}
                />
              </div>
            )}

            {generalError && (
              <div className="ck-alert ck-alert--error" role="alert">
                <IconAlertCircle />
                <span>{generalError}</span>
              </div>
            )}

            <button type="submit" className="ck-btn ck-btn--primary">
              Calculate
            </button>
          </form>

          <section className="ck-panel ck-stack" aria-live="polite">
            <h2 className="ck-panel-title">Result and steps</h2>
            {result ? (
              <>
                <div key={result.id} className="ck-readout ck-vial-wrap ck-mask-reveal ck-success-pulse">
                  <div className="ck-vial" aria-hidden="true">
                    <div
                      className="ck-vial-fill"
                      style={{ height: `${computeVialPercent(result.value, result.unit)}%` }}
                    />
                  </div>
                  <div>
                    <span className="ck-readout-label">{result.label}</span>
                    <strong className="ck-readout-value">
                      {formatNumber(result.value)} {result.unit}
                    </strong>
                    <p className="ck-readout-sub">{mode.label}</p>
                  </div>
                </div>

                <ol className="ck-steps">
                  {result.steps.map((stepItem, index) => (
                    <li
                      className="ck-step ck-detail-settle"
                      style={{ '--stagger': Math.min(index, 6) }}
                      key={`${result.id}-${index}`}
                    >
                      <span className="ck-step-tag">{stepItem.tag}</span>
                      <span className="mono">{stepItem.text}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="ck-empty">Enter values and select Calculate to view the solution and steps.</p>
            )}
          </section>

          <section className="ck-panel ck-stack">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Recent calculations</h2>
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
              <p className="ck-empty">Recent solution calculations appear here.</p>
            ) : (
              <ul className="ck-history-list">
                {history.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <div className="ck-history-item">
                      <div className="ck-history-top">
                        <span>{item.modeLabel}</span>
                        <span className="ck-history-time">{formatTimeAgo(item.time)}</span>
                      </div>
                      <span className="ck-history-result">{item.resultText}</span>
                      <span className="ck-help">{item.summary}</span>
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
