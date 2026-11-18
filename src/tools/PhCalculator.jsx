import { useEffect, useRef, useState } from 'react'
import {
  PH_MODES,
  formatIonConcentration,
  solvePhConversion,
  solveWeakDissociation,
} from '../lib/ph.js'
import { formatNumber, formatTimeAgo } from '../lib/format.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Combobox } from '../components/Select.jsx'
import { IconAlertCircle, IconCheck, IconCopy, IconTrash, LogoPhCalculator } from '../components/Icons.jsx'

const MODE_OPTIONS = PH_MODES.map((mode) => ({
  value: mode.id,
  label: mode.label,
  detail: mode.formula,
}))

const WEAK_PRESETS = [
  { label: 'Acetic acid (Ka = 1.8e-5)', type: 'acid', concentration: '0.1', kValue: '1.8e-5' },
  { label: 'Formic acid (Ka = 1.8e-4)', type: 'acid', concentration: '0.1', kValue: '1.8e-4' },
  { label: 'Ammonia (Kb = 1.8e-5)', type: 'base', concentration: '0.1', kValue: '1.8e-5' },
]

function getPhColor(ph) {
  if (ph <= 2) return '#EF233C'
  if (ph <= 4) return '#FF5722'
  if (ph <= 6) return '#FFB703'
  if (ph <= 8) return '#00C853'
  if (ph <= 10) return '#00B4D8'
  if (ph <= 12) return '#3A0CA3'
  return '#7209B7'
}

function PhFluidBeaker({ ph, classification }) {
  const color = getPhColor(ph)
  return (
    <div className="ck-ph-viz ck-mask-reveal" aria-hidden="true">
      <svg viewBox="0 0 100 120" className="ck-ph-beaker-svg">
        <defs>
          <clipPath id="beaker-clip">
            <path d="M 22 20 L 22 96 A 12 12 0 0 0 34 108 L 66 108 A 12 12 0 0 0 78 96 L 78 20 Z" />
          </clipPath>
        </defs>

        <line x1="28" y1="40" x2="38" y2="40" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="28" y1="60" x2="42" y2="60" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="28" y1="80" x2="38" y2="80" stroke="var(--border-strong)" strokeWidth="1.5" strokeOpacity="0.5" />

        <g clipPath="url(#beaker-clip)">
          <rect
            className="ck-ph-fluid"
            x="15"
            y="42"
            width="70"
            height="70"
            fill={color}
            fillOpacity="0.78"
          />
          <path
            className="ck-ph-wave"
            d="M 15 42 Q 32 38, 50 42 T 85 42"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          <circle className="ck-ph-bubble ck-ph-b1" cx="36" cy="92" r="2.5" fill="#FFFFFF" />
          <circle className="ck-ph-bubble ck-ph-b2" cx="62" cy="85" r="2" fill="#FFFFFF" />
          <circle className="ck-ph-bubble ck-ph-b3" cx="48" cy="98" r="3" fill="#FFFFFF" />
        </g>

        <path
          d="M 16 16 L 24 16 L 24 96 A 10 10 0 0 0 34 106 L 66 106 A 10 10 0 0 0 76 96 L 76 16 L 82 16"
          stroke="var(--border-strong)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color }}>
          {classification}
        </span>
        <span style={{ fontSize: '1.375rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
          pH {formatNumber(ph)}
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Universal indicator spectrum simulation
        </span>
      </div>
    </div>
  )
}

export function PhCalculator() {
  const [subMode, setSubMode] = useState('conversions')
  const [modeId, setModeId] = useState('phToH')
  const [inputValue, setInputValue] = useState('')
  const [weakType, setWeakType] = useState('acid')
  const [weakConc, setWeakConc] = useState('')
  const [weakK, setWeakK] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [markerMoving, setMarkerMoving] = useState(false)
  const [markerTimerRef] = [useRef(null)]
  const [history, setHistory] = useLocalStorage('chemkit-ph-calculator-history', [])
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return
    const text = `pH ${formatNumber(result.data.pH)}, pOH ${formatNumber(result.data.pOH)}, [H+] ${formatIonConcentration(result.data.hConcentration)} M, [OH-] ${formatIonConcentration(result.data.ohConcentration)} M (${result.data.classification})`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const triggerMarkerStretch = () => {
    setMarkerMoving(true)
    if (markerTimerRef.current) window.clearTimeout(markerTimerRef.current)
    markerTimerRef.current = window.setTimeout(() => {
      setMarkerMoving(false)
      markerTimerRef.current = null
    }, 220)
  }

  useEffect(() => () => {
    if (markerTimerRef.current) window.clearTimeout(markerTimerRef.current)
  }, [])

  const activeMode = PH_MODES.find((item) => item.id === modeId) || PH_MODES[0]

  const handleSolveConversion = (event) => {
    event?.preventDefault()
    setError('')
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setError('Enter a value to calculate.')
      return
    }
    const num = Number(trimmed)
    if (!Number.isFinite(num)) {
      setError('Enter a valid number, like 7 or 1e-7.')
      return
    }
    try {
      const solved = solvePhConversion(modeId, num)
      setResult({ id: Date.now(), kind: 'conversion', data: solved })
      triggerMarkerStretch()
      setHistory((prev) =>
        [
          {
            label: solved.mode.label,
            detail: `${formatNumber(num)} -> ${solved.mode.resultLabel} = ${solved.primaryDisplay}`,
            time: Date.now(),
          },
          ...(Array.isArray(prev) ? prev : []),
        ].slice(0, 8),
      )
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  const handleSolveWeak = (event) => {
    event?.preventDefault()
    setError('')
    const conc = Number(weakConc.trim())
    const kVal = Number(weakK.trim())
    if (!weakConc.trim() || !weakK.trim() || !Number.isFinite(conc) || !Number.isFinite(kVal)) {
      setError('Enter valid numbers for initial concentration and dissociation constant.')
      return
    }
    try {
      const solved = solveWeakDissociation({ type: weakType, concentration: conc, kValue: kVal })
      setResult({ id: Date.now(), kind: 'weak', data: solved })
      triggerMarkerStretch()
      setHistory((prev) =>
        [
          {
            label: `Weak ${weakType === 'acid' ? 'acid (Ka)' : 'base (Kb)'}`,
            detail: `C = ${formatNumber(conc)} M, K = ${formatIonConcentration(kVal)} -> pH ${formatNumber(solved.pH)}`,
            time: Date.now(),
          },
          ...(Array.isArray(prev) ? prev : []),
        ].slice(0, 8),
      )
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  const clampedPhPercent = result ? Math.max(0, Math.min(100, (result.data.pH / 14) * 100)) : 50

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <div className="ck-tool-header-identity">
          <span className="ck-tool-header-mark" style={{ '--accent': '#7ce6c4' }} aria-hidden="true">
            <LogoPhCalculator />
          </span>
          <div>
            <div className="ck-tool-badge-row">
              <span className="ck-tool-badge-num">01</span>
              <span className="ck-tool-badge-cat">Solutions</span>
            </div>
            <h1 className="ck-tool-title">pH Calculator</h1>
            <p className="ck-tool-subtitle">
              Convert between pH, pOH, [H+], and [OH-] at 25 C, or solve monoprotic weak acid and weak base dissociation
              equilibria with exact quadratic roots.
            </p>
          </div>
        </div>
      </div>

      <div className="ck-chip-row" role="group" aria-label="Calculator mode">
        <button
          type="button"
          className="ck-chip"
          aria-pressed={subMode === 'conversions'}
          onClick={() => {
            setSubMode('conversions')
            setError('')
          }}
        >
          pH / pOH / Ion conversions
        </button>
        <button
          type="button"
          className="ck-chip"
          aria-pressed={subMode === 'weak'}
          onClick={() => {
            setSubMode('weak')
            setError('')
          }}
        >
          Weak acid / base dissociation
        </button>
      </div>

      <div className="ck-grid-2">
        {subMode === 'conversions' ? (
          <form className="ck-panel ck-stack" onSubmit={handleSolveConversion} noValidate>
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Equilibrium conversion</h2>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                25 C (Kw = 1e-14)
              </span>
            </div>

            <div className="ck-field">
              <label htmlFor="ph-mode" className="ck-label">
                Conversion mode
              </label>
              <Combobox
                id="ph-mode"
                ariaLabel="pH conversion mode"
                value={modeId}
                options={MODE_OPTIONS}
                onChange={(next) => {
                  setModeId(next)
                  setError('')
                }}
              />
            </div>

            <div className="ck-field">
              <label htmlFor="ph-input" className="ck-label">
                {activeMode.inputLabel}
              </label>
              <input
                id="ph-input"
                type="text"
                inputMode="decimal"
                className="ck-input tabular"
                placeholder={activeMode.placeholder}
                value={inputValue}
                onChange={(event) => {
                  setInputValue(event.target.value)
                  setError('')
                }}
                autoComplete="off"
              />
              <p className="ck-help">{activeMode.hint}</p>
            </div>

            {error && (
              <div className="ck-alert ck-alert--error" role="alert">
                <IconAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="ck-btn ck-btn--primary">
              Calculate
            </button>
          </form>
        ) : (
          <form className="ck-panel ck-stack" onSubmit={handleSolveWeak} noValidate>
            <h2 className="ck-panel-title">Weak acid or base dissociation</h2>

            <div className="ck-chip-row" role="group" aria-label="Species type">
              <button
                type="button"
                className="ck-chip"
                aria-pressed={weakType === 'acid'}
                onClick={() => setWeakType('acid')}
              >
                Weak acid (Ka)
              </button>
              <button
                type="button"
                className="ck-chip"
                aria-pressed={weakType === 'base'}
                onClick={() => setWeakType('base')}
              >
                Weak base (Kb)
              </button>
            </div>

            <div className="ck-field">
              <label htmlFor="weak-conc" className="ck-label">
                Initial concentration C (M)
              </label>
              <div className="ck-input-row">
                <input
                  id="weak-conc"
                  type="text"
                  inputMode="decimal"
                  className="ck-input tabular"
                  placeholder="e.g. 0.1"
                  value={weakConc}
                  onChange={(event) => {
                    setWeakConc(event.target.value)
                    setError('')
                  }}
                />
                <span className="ck-unit-tag">M</span>
              </div>
            </div>

            <div className="ck-field">
              <label htmlFor="weak-k" className="ck-label">
                Dissociation constant ({weakType === 'acid' ? 'Ka' : 'Kb'})
              </label>
              <input
                id="weak-k"
                type="text"
                inputMode="decimal"
                className="ck-input tabular"
                placeholder="e.g. 1.8e-5"
                value={weakK}
                onChange={(event) => {
                  setWeakK(event.target.value)
                  setError('')
                }}
              />
              <p className="ck-help">Scientific notation such as 1.8e-5 is supported.</p>
            </div>

            <div className="ck-field">
              <span className="ck-label">Presets</span>
              <div className="ck-chip-row">
                {WEAK_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="ck-chip"
                    onClick={() => {
                      setWeakType(preset.type)
                      setWeakConc(preset.concentration)
                      setWeakK(preset.kValue)
                      setError('')
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="ck-alert ck-alert--error" role="alert">
                <IconAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="ck-btn ck-btn--primary">
              Solve dissociation
            </button>
          </form>
        )}

        <div className="ck-stack">
          <section className="ck-panel ck-stack" aria-live="polite">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Equilibrium readout</h2>
              {result && (
                <button
                  type="button"
                  className={`ck-btn ck-btn--secondary ck-btn--sm ${copied ? 'ck-success-pulse' : ''}`}
                  onClick={handleCopy}
                  title="Copy pH values to clipboard"
                  aria-label="Copy pH values"
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
                <PhFluidBeaker ph={result.data.pH} classification={result.data.classification} />
                <div key={result.id} className="ck-readout ck-mask-reveal ck-success-pulse">
                  <span className="ck-readout-label">
                    {result.kind === 'conversion'
                      ? `${result.data.mode.resultLabel} (${result.data.classification})`
                      : `Solution pH (${result.data.classification})`}
                  </span>
                  <strong className="ck-readout-value">
                    {result.kind === 'conversion'
                      ? `${result.data.mode.resultLabel} = ${result.data.primaryDisplay}`
                      : `pH = ${formatNumber(result.data.pH)}`}
                  </strong>
                  <div className="ck-ph-scale" aria-hidden="true">
                    <div
                      className={`ck-ph-marker ${markerMoving ? 'is-moving' : ''}`}
                      style={{ left: `${clampedPhPercent}%` }}
                    />
                  </div>
                  <div className="ck-ph-ticks" aria-hidden="true">
                    <span>0 Acidic</span>
                    <span>7 Neutral</span>
                    <span>14 Basic</span>
                  </div>
                </div>

                <div className="ck-stat-grid">
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 0 }}>
                    <span>pH</span>
                    <strong>{formatNumber(result.data.pH)}</strong>
                  </div>
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 1 }}>
                    <span>pOH</span>
                    <strong>{formatNumber(result.data.pOH)}</strong>
                  </div>
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 2 }}>
                    <span>[H+]</span>
                    <strong>{formatIonConcentration(result.data.hConcentration)} M</strong>
                  </div>
                  <div className="ck-stat ck-detail-settle" style={{ '--stagger': 3 }}>
                    <span>[OH-]</span>
                    <strong>{formatIonConcentration(result.data.ohConcentration)} M</strong>
                  </div>
                  {result.kind === 'weak' && (
                    <div className="ck-stat ck-detail-settle" style={{ '--stagger': 4 }}>
                      <span>Percent ionization</span>
                      <strong>{formatNumber(result.data.percentIonization)}%</strong>
                    </div>
                  )}
                </div>

                <ol className="ck-steps">
                  {result.data.steps.map((stepText, index) => (
                    <li
                      className="ck-step ck-detail-settle"
                      style={{ '--stagger': Math.min(index + 1, 6) }}
                      key={`${result.id}-${index}`}
                    >
                      <span className="ck-step-tag">Step {index + 1}</span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="ck-empty">Choose a mode and calculate to see pH, pOH, ion concentrations, and steps.</p>
            )}
          </section>

          <section className="ck-panel ck-stack">
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <h2 className="ck-panel-title">Recent history</h2>
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
              <p className="ck-empty">Calculated pH results are listed here.</p>
            ) : (
              <ul className="ck-history-list">
                {history.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <div className="ck-history-item">
                      <div className="ck-history-top">
                        <span>{item.label}</span>
                        <span className="ck-history-time">{formatTimeAgo(item.time)}</span>
                      </div>
                      <span className="ck-history-result">{item.detail}</span>
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
