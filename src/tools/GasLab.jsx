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

function GasKineticChamber({ calculation, targetVar }) {
  const isVolume = targetVar?.kind === 'volume'
  const isPressure = targetVar?.kind === 'pressure'
  const isTemp = targetVar?.kind === 'temperature'

  let compressionRatio = 0.5
  if (calculation?.status === 'ok' && Number.isFinite(calculation.value)) {
    if (isVolume) {
      compressionRatio = Math.max(0.15, Math.min(0.85, calculation.value / 40))
    } else if (isPressure) {
      compressionRatio = Math.max(0.15, Math.min(0.85, 1 - calculation.value / 250))
    }
  }

  const pistonY = 30 + (1 - compressionRatio) * 45
  const needleAngle =
    isPressure && calculation?.status === 'ok'
      ? Math.max(-55, Math.min(55, ((calculation.value - 100) / 100) * 45))
      : -15

  const particleSpeed =
    isTemp && calculation?.status === 'ok'
      ? Math.max(0.4, Math.min(2.5, 300 / Math.max(50, calculation.value)))
      : 1.0

  return (
    <div className="ck-gas-viz ck-mask-reveal" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="ck-gas-cylinder-svg">
        <defs>
          <clipPath id="cylinder-chamber-clip">
            <rect x="30" y={pistonY + 12} width="70" height={130 - (pistonY + 12)} />
          </clipPath>
        </defs>

        <rect
          x="30"
          y="30"
          width="70"
          height="100"
          rx="6"
          fill="var(--bg-canvas)"
          stroke="var(--border-strong)"
          strokeWidth="3"
        />

        <line x1="34" y1="55" x2="44" y2="55" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="34" y1="80" x2="48" y2="80" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="34" y1="105" x2="44" y2="105" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.4" />

        <g clipPath="url(#cylinder-chamber-clip)">
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed}s` }} cx="45" cy="115" r="4" fill="#FF9100" />
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed * 0.8}s` }} cx="62" cy="95" r="3.5" fill="#00E5FF" />
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed * 1.2}s` }} cx="80" cy="120" r="4" fill="#FF5252" />
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed * 0.9}s` }} cx="52" cy="78" r="3" fill="#00C853" />
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed * 1.1}s` }} cx="72" cy="108" r="4" fill="#E040FB" />
          <circle className="ck-gas-atom" style={{ animationDuration: `${particleSpeed * 0.75}s` }} cx="85" cy="85" r="3.5" fill="#FFD600" />
        </g>

        <g className="ck-gas-piston-assembly" style={{ transform: `translateY(${pistonY - 30}px)` }}>
          <line x1="65" y1="5" x2="65" y2="30" stroke="var(--border-strong)" strokeWidth="6" strokeLinecap="round" />
          <rect
            x="32"
            y="26"
            width="66"
            height="12"
            rx="3"
            fill="var(--surface-2)"
            stroke="var(--border-strong)"
            strokeWidth="2.5"
          />
          <line x1="45" y1="5" x2="85" y2="5" stroke="var(--border-strong)" strokeWidth="4" strokeLinecap="round" />
        </g>

        <circle cx="125" cy="45" r="20" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
        <circle cx="125" cy="45" r="2.5" fill="var(--border-strong)" />
        <line x1="125" y1="28" x2="125" y2="32" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="112" y1="36" x2="115" y2="39" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="138" y1="36" x2="135" y2="39" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line
          className="ck-gas-needle"
          x1="125"
          y1="45"
          x2="125"
          y2="30"
          stroke="#FF3B30"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: '125px 45px', transform: `rotate(${needleAngle}deg)` }}
        />
        <path d="M 100 65 L 125 65 L 125 65" stroke="var(--border-strong)" strokeWidth="3" fill="none" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Piston Chamber Simulation</span>
        <span style={{ fontWeight: '600', color: 'var(--accent)' }}>Kinetic State Active</span>
      </div>
    </div>
  )
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
              <>
                <GasKineticChamber calculation={calculation} targetVar={targetVar} />
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
              </>
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
