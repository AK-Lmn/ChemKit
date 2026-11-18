import { formatNumber, formatScientific } from './format.js'

export const KW_25C = 1e-14

export const PH_MODES = Object.freeze([
  {
    id: 'phToH',
    label: 'pH to [H+]',
    inputLabel: 'pH value',
    placeholder: 'Example: 7',
    hint: 'Enter a pH value between 0 and 14.',
    formula: '[H+] = 10^(-pH)',
    resultLabel: '[H+]',
    isConcentrationResult: true,
  },
  {
    id: 'hToPh',
    label: '[H+] to pH',
    inputLabel: '[H+] concentration (mol/L)',
    placeholder: 'Example: 1e-7',
    hint: 'Enter a positive hydrogen ion concentration in M (mol/L).',
    formula: 'pH = -log10([H+])',
    resultLabel: 'pH',
    isConcentrationResult: false,
  },
  {
    id: 'pohToOh',
    label: 'pOH to [OH-]',
    inputLabel: 'pOH value',
    placeholder: 'Example: 7',
    hint: 'Enter a pOH value between 0 and 14.',
    formula: '[OH-] = 10^(-pOH)',
    resultLabel: '[OH-]',
    isConcentrationResult: true,
  },
  {
    id: 'ohToPoh',
    label: '[OH-] to pOH',
    inputLabel: '[OH-] concentration (mol/L)',
    placeholder: 'Example: 1e-7',
    hint: 'Enter a positive hydroxide ion concentration in M (mol/L).',
    formula: 'pOH = -log10([OH-])',
    resultLabel: 'pOH',
    isConcentrationResult: false,
  },
  {
    id: 'phToPoh',
    label: 'pH to pOH',
    inputLabel: 'pH value',
    placeholder: 'Example: 4.5',
    hint: 'Enter a pH value between 0 and 14 (at 25 C).',
    formula: 'pH + pOH = 14',
    resultLabel: 'pOH',
    isConcentrationResult: false,
  },
  {
    id: 'pohToPh',
    label: 'pOH to pH',
    inputLabel: 'pOH value',
    placeholder: 'Example: 9.5',
    hint: 'Enter a pOH value between 0 and 14 (at 25 C).',
    formula: 'pH + pOH = 14',
    resultLabel: 'pH',
    isConcentrationResult: false,
  },
])

export function formatIonConcentration(value) {
  if (!Number.isFinite(value) || value <= 0) return ''
  return value < 0.001 || value >= 1000 ? formatScientific(value, 3) : formatNumber(value)
}

export function classifyPh(pH) {
  if (Math.abs(pH - 7) < 1e-6) return 'Neutral'
  return pH < 7 ? 'Acidic' : 'Basic'
}

/**
 * Solve any of the 6 standard pH/pOH/ion conversions at 25 C (Kw = 1.0 x 10^-14),
 * returning both the requested primary value and all four linked equilibrium quantities.
 */
export function solvePhConversion(modeId, value) {
  const mode = PH_MODES.find((item) => item.id === modeId)
  if (!mode) throw new RangeError(`Unsupported pH mode: ${modeId}.`)
  if (!Number.isFinite(value)) throw new RangeError('Enter a valid number, like 7 or 1e-7.')

  if ((modeId === 'hToPh' || modeId === 'ohToPoh') && value <= 0) {
    throw new RangeError('Concentrations must be greater than 0.')
  }
  if ((modeId === 'phToPoh' || modeId === 'pohToPh' || modeId === 'phToH' || modeId === 'pohToOh') && (value < 0 || value > 14)) {
    throw new RangeError('pH and pOH values must be between 0 and 14.')
  }

  let pH
  let pOH
  let hConcentration
  let ohConcentration
  let primaryValue
  let steps

  switch (modeId) {
    case 'phToH':
      pH = value
      pOH = 14 - pH
      hConcentration = 10 ** -pH
      ohConcentration = 10 ** -pOH
      primaryValue = hConcentration
      steps = [
        'Formula: [H+] = 10^(-pH)',
        `Substitution: [H+] = 10^(-${formatNumber(pH)})`,
        `Result: [H+] = ${formatIonConcentration(hConcentration)} M`,
      ]
      break
    case 'hToPh':
      hConcentration = value
      pH = -Math.log10(hConcentration)
      pOH = 14 - pH
      ohConcentration = KW_25C / hConcentration
      primaryValue = pH
      steps = [
        'Formula: pH = -log10([H+])',
        `Substitution: pH = -log10(${formatIonConcentration(hConcentration)})`,
        `Result: pH = ${formatNumber(pH)}`,
      ]
      break
    case 'pohToOh':
      pOH = value
      pH = 14 - pOH
      ohConcentration = 10 ** -pOH
      hConcentration = 10 ** -pH
      primaryValue = ohConcentration
      steps = [
        'Formula: [OH-] = 10^(-pOH)',
        `Substitution: [OH-] = 10^(-${formatNumber(pOH)})`,
        `Result: [OH-] = ${formatIonConcentration(ohConcentration)} M`,
      ]
      break
    case 'ohToPoh':
      ohConcentration = value
      pOH = -Math.log10(ohConcentration)
      pH = 14 - pOH
      hConcentration = KW_25C / ohConcentration
      primaryValue = pOH
      steps = [
        'Formula: pOH = -log10([OH-])',
        `Substitution: pOH = -log10(${formatIonConcentration(ohConcentration)})`,
        `Result: pOH = ${formatNumber(pOH)}`,
      ]
      break
    case 'phToPoh':
      pH = value
      pOH = 14 - pH
      hConcentration = 10 ** -pH
      ohConcentration = 10 ** -pOH
      primaryValue = pOH
      steps = [
        'Formula: pH + pOH = 14',
        `Substitution: pOH = 14 - ${formatNumber(pH)}`,
        `Result: pOH = ${formatNumber(pOH)}`,
      ]
      break
    case 'pohToPh':
      pOH = value
      pH = 14 - pOH
      hConcentration = 10 ** -pH
      ohConcentration = 10 ** -pOH
      primaryValue = pH
      steps = [
        'Formula: pH + pOH = 14',
        `Substitution: pH = 14 - ${formatNumber(pOH)}`,
        `Result: pH = ${formatNumber(pH)}`,
      ]
      break
  }

  return {
    mode,
    input: value,
    primaryValue,
    primaryDisplay: mode.isConcentrationResult
      ? `${formatIonConcentration(primaryValue)} M`
      : formatNumber(primaryValue),
    pH,
    pOH,
    hConcentration,
    ohConcentration,
    classification: classifyPh(pH),
    steps,
  }
}

/**
 * Solve monoprotic weak acid (HA <-> H+ + A-) or weak base (B + H2O <-> BH+ + OH-)
 * dissociation using the exact quadratic solution: x = (-K + sqrt(K^2 + 4*K*C)) / 2.
 */
export function solveWeakDissociation({ type = 'acid', concentration, kValue }) {
  if (!['acid', 'base'].includes(type)) {
    throw new RangeError(`Unsupported dissociation type: ${type}.`)
  }
  if (!Number.isFinite(concentration) || concentration <= 0) {
    throw new RangeError('Initial concentration must be greater than 0 M.')
  }
  if (!Number.isFinite(kValue) || kValue <= 0) {
    throw new RangeError(`${type === 'acid' ? 'Ka' : 'Kb'} must be greater than 0.`)
  }

  // Exact positive root of x^2 + K*x - K*C = 0
  const x = (-kValue + Math.sqrt(kValue * kValue + 4 * kValue * concentration)) / 2
  const percentIonization = (x / concentration) * 100
  const kSymbol = type === 'acid' ? 'Ka' : 'Kb'
  const ionLabel = type === 'acid' ? '[H+]' : '[OH-]'

  let pH
  let pOH
  let hConcentration
  let ohConcentration

  if (type === 'acid') {
    hConcentration = x
    pH = -Math.log10(hConcentration)
    pOH = 14 - pH
    ohConcentration = KW_25C / hConcentration
  } else {
    ohConcentration = x
    pOH = -Math.log10(ohConcentration)
    pH = 14 - pOH
    hConcentration = KW_25C / ohConcentration
  }

  const steps = [
    `Equilibrium expression: ${kSymbol} = x^2 / (C - x), where C = ${formatNumber(concentration)} M and ${kSymbol} = ${formatIonConcentration(kValue)}.`,
    `Quadratic form: x^2 + ${kSymbol}*x - ${kSymbol}*C = 0.`,
    `Solve for ${ionLabel}: x = (-${kSymbol} + sqrt(${kSymbol}^2 + 4*${kSymbol}*C)) / 2 = ${formatIonConcentration(x)} M.`,
    `Percent ionization: (${formatIonConcentration(x)} / ${formatNumber(concentration)}) x 100 = ${formatNumber(percentIonization)}%.`,
    type === 'acid'
      ? `pH = -log10(${formatIonConcentration(hConcentration)}) = ${formatNumber(pH)}, pOH = ${formatNumber(pOH)}.`
      : `pOH = -log10(${formatIonConcentration(ohConcentration)}) = ${formatNumber(pOH)}, pH = ${formatNumber(pH)}.`,
  ]

  return {
    type,
    concentration,
    kValue,
    ionizedConcentration: x,
    percentIonization,
    pH,
    pOH,
    hConcentration,
    ohConcentration,
    classification: classifyPh(pH),
    steps,
  }
}
