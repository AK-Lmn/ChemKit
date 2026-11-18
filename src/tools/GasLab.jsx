import { useMemo, useState } from 'react'
import {
  GAS_LAWS,
  PRESSURE_UNITS,
  TEMPERATURE_UNITS,
  VOLUME_UNITS,
  calculateGasLawWithUnits,
} from '../lib/gas-laws.js'
import { formatNumber } from '../lib/format.js'
import { Combobox } from '../components/Select.jsx'
import { IconAlertCircle, IconCheck, IconCopy, IconRotateCcw, LogoGasLab } from '../components/Icons.jsx'

function unitOptionsFor(kind) {
  if (kind === 'pressure') return PRESSURE_UNITS.map((u) => ({ value: u, label: u }))
  if (kind === 'volume') return VOLUME_UNITS.map((u) => ({ value: u, label: u }))
  if (kind === 'temperature') return TEMPERATURE_UNITS.map((u) => ({ value: u, label: u === 'K' ? 'K' : `${u}` }))
  return [{ value: 'mol', label: 'mol' }]
}

export function GasLab() {
  const [lawId, setLawId] = useState('boyle')
  const [solveIndex, setSolveIndex] = useState(0)
  const [rawInputs, setRawInputs] = useState(['', '', '', ''])
  const [units, setUnits] = useState(() => GAS_LAWS[0].variables.map((v) => v.defaultUnit))
  const [copied, setCopied] = useState(false)

  const law = useMemo(() => GAS_LAWS.find((item) => item.id === lawId) || GAS_LAWS[0], [lawId])

  const selectLaw = (nextLawId) => {
    const nextLaw = GAS_LAWS.find((item) => item.id === nextLawId) || GAS_LAWS[0]
    setLawId(nextLaw.id)
    setSolveIndex(0)
    setRawInputs(['', '', '', ''])
    setUnits(nextLaw.variables.map((v) => v.defaultUnit))
  }

  const solveForOptions = useMemo(
    () => law.variables.map((variable, index) => ({ value: String(index), label: variable.label })),
    [law],
  )

  const calculation = useMemo(() => {
    const missing = []
    const numeric = rawInputs.map((text, index) => {
      if (index === solveIndex) return undefined
      const trimmed = text.trim()
      if (!trimmed) {
        missing.push(law.variables[index].label)
        return Number.NaN
      }
      return Number(trimmed)
    })

    if (missing.length > 0) {
      return { status: 'incomplete', value: null, error: '' }
    }

    for (let index = 0; index < numeric.length; index += 1) {
      if (index === solveIndex) continue
      if (!Number.isFinite(numeric[index])) {
        return { status: 'error', value: null, error: 'Enter valid finite numbers in all known fields.' }
      }
      const kind = law.variables[index].kind
      if (kind !== 'temperature' && numeric[index] <= 0) {
        return {
          status: 'error',
          value: null,
          error: `${law.variables[index].label} must be greater than zero.`,
        }
      }
    }

    try {
      const value = calculateGasLawWithUnits(law.id, numeric, units, solveIndex)
      if (!Number.isFinite(value)) {
        return { status: 'error', value: null, error: 'These values do not produce a valid result.' }
      }
      return { status: 'ok', value, error: '' }
    } catch (error) {
      return { status: 'error', value: null, error: error.message }
    }
  }, [law, rawInputs, units, solveIndex])

  const targetVar = law.variables[solveIndex]
  const targetUnit = units[solveIndex] || targetVar.defaultUnit

  const handleCopy = async () => {
    if (calculation.status !== 'ok') return
    const text = `${targetVar.label} = ${formatNumber(calculation.value)} ${targetUnit} (${law.name}: ${law.formula})`
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
          <span className="ck-tool-header-mark" style={{ '--accent': '#5b9dff' }} aria-hidden="true">
            <LogoGasLab />
          </span>
          <div>
            <div className="ck-tool-badge-row">
              <span className="ck-tool-badge-num">18</span>
              <span className="ck-tool-badge-cat">Calculations</span>
            </div>
            <h1 className="ck-tool-title">GasLab</h1>
            <p className="ck-tool-subtitle">
              Solve Boyle, Charles, Gay-Lussac, Avogadro, and Ideal Gas Law problems with automatic pressure, volume, and
              temperature unit conversion.
            </p>
          </div>
        </div>
      </div>

      <div className="ck-chip-row" role="group" aria-label="Choose gas law">
        {GAS_LAWS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ck-chip"
            aria-pressed={law.id === item.id}
            onClick={() => selectLaw(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="ck-grid-2">
        <section className="ck-panel ck-stack">
          <div className="ck-panel-head" style={{ marginBottom: 0 }}>
            <div>
              <h2 className="ck-panel-title">{law.name}</h2>
              <p className="ck-panel-note">{law.note}</p>
            </div>
            <button
              type="button"
              className="ck-btn ck-btn--secondary ck-btn--sm"
              onClick={() => setRawInputs(['', '', '', ''])}
            >
              <IconRotateCcw />
              Reset
            </button>
          </div>

          <div className="ck-field">
            <label htmlFor="gas-solve-for" className="ck-label">
              Solve for
            </label>
            <Combobox
              id="gas-solve-for"
              ariaLabel="Variable to solve for"
              value={String(solveIndex)}
              options={solveForOptions}
              onChange={(nextValue) => {
                const idx = Number(nextValue)
                setSolveIndex(idx)
                setRawInputs((prev) => prev.map((v, i) => (i === idx ? '' : v)))
              }}
            />
          </div>

          <div className="ck-stack">
            {law.variables.map((variable, index) => {
              const isSolved = index === solveIndex
              const options = unitOptionsFor(variable.kind)
              const displayValue = isSolved
                ? calculation.status === 'ok'
                  ? formatNumber(calculation.value)
                  : ''
                : rawInputs[index]

              return (
                <div className="ck-field" key={variable.key}>
                  <label htmlFor={`gas-var-${variable.key}`} className="ck-label">
                    {variable.label} {isSolved ? '(calculated)' : ''}
                  </label>
                  <div className="ck-input-row">
                    <input
                      id={`gas-var-${variable.key}`}
                      type={isSolved ? 'text' : 'number'}
                      inputMode="decimal"
                      step="any"
                      readOnly={isSolved}
                      className="ck-input tabular"
                      placeholder={isSolved ? 'Result appears here' : 'Enter value'}
                      value={displayValue}
                      onChange={(event) => {
                        const next = [...rawInputs]
                        next[index] = event.target.value
                        setRawInputs(next)
                      }}
                    />
                    {options.length > 1 ? (
                      <Combobox
                        id={`gas-unit-${variable.key}`}
                        compact
                        ariaLabel={`Unit for ${variable.label}`}
                        value={units[index] || variable.defaultUnit}
                        options={options}
                        onChange={(nextUnit) => {
                          const next = [...units]
                          next[index] = nextUnit
                          setUnits(next)
                        }}
                      />
                    ) : (
                      <span className="ck-unit-tag">{variable.defaultUnit}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {calculation.status === 'error' && (
            <div className="ck-alert ck-alert--error" role="alert">
              <IconAlertCircle />
              <span>{calculation.error}</span>
            </div>
          )}
        </section>

        <div className="ck-stack">
          <section className="ck-panel ck-stack" aria-live="polite">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Calculated result</h2>
              {calculation.status === 'ok' && (
                <button
                  type="button"
                  className={`ck-btn ck-btn--secondary ck-btn--sm ${copied ? 'ck-success-pulse' : ''}`}
                  onClick={handleCopy}
                  title="Copy calculated value to clipboard"
                  aria-label="Copy calculated value"
                >
                  <span className="ck-icon-swap" aria-hidden="true">
                    <IconCopy data-active={!copied} />
                    <IconCheck data-active={copied} />
                  </span>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            {calculation.status === 'ok' ? (
              <div
                key={`${law.id}-${solveIndex}-${formatNumber(calculation.value)}-${targetUnit}`}
                className="ck-readout ck-mask-reveal ck-success-pulse"
              >
                <span className="ck-readout-label">{targetVar.label}</span>
                <strong className="ck-readout-value">
                  {formatNumber(calculation.value)} {targetUnit}
                </strong>
                <p className="ck-readout-sub">Solved using {law.name} ({law.formula}).</p>
              </div>
            ) : (
              <p className="ck-empty">Fill in the three known variables to compute {targetVar.label}.</p>
            )}
          </section>

          <section className="ck-panel ck-stack">
            <h2 className="ck-panel-title">Formula reference</h2>
            <div className="ck-readout">
              <span className="ck-readout-label">Active equation</span>
              <strong className="ck-readout-value" style={{ fontSize: '1.375rem' }}>
                {law.formula}
              </strong>
            </div>
            <div className="ck-stat-grid">
              <div className="ck-stat">
                <span>R (L*kPa / mol*K)</span>
                <strong>8.31446</strong>
              </div>
              <div className="ck-stat">
                <span>R (L*atm / mol*K)</span>
                <strong>0.082057</strong>
              </div>
              <div className="ck-stat">
                <span>Standard pressure</span>
                <strong>101.325 kPa</strong>
              </div>
              <div className="ck-stat">
                <span>Absolute zero</span>
                <strong>0 K (-273.15 C)</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
