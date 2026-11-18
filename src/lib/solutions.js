import { formatNumber } from './format.js'

export const UNIT_OPTIONS = Object.freeze({
  vol: ['L', 'mL'],
  mass: ['g', 'mg'],
})

export const DILUTION_VARS = Object.freeze([
  { key: 'M1', label: 'Initial molarity (M1)', short: 'M1', kind: 'conc' },
  { key: 'V1', label: 'Initial volume (V1)', short: 'V1', kind: 'vol' },
  { key: 'M2', label: 'Final molarity (M2)', short: 'M2', kind: 'conc' },
  { key: 'V2', label: 'Final volume (V2)', short: 'V2', kind: 'vol' },
])

export const SOLUTION_MODES = Object.freeze([
  {
    id: 'M-from-n-V',
    label: 'Molarity from moles and volume',
    formulaTag: 'M = mol / L',
    hint: 'Enter the moles of solute and the total volume of solution.',
    fields: [
      { key: 'n', label: 'Moles of solute', kind: 'mol', placeholder: 'e.g. 0.50', helper: 'Amount of solute in moles.' },
      { key: 'V', label: 'Volume of solution', kind: 'vol', placeholder: 'e.g. 2', helper: 'Total volume of the solution.' },
    ],
  },
  {
    id: 'n-from-M-V',
    label: 'Moles from molarity and volume',
    formulaTag: 'mol = M x L',
    hint: 'Enter the molarity and total volume of solution.',
    fields: [
      { key: 'M', label: 'Molarity', kind: 'conc', placeholder: 'e.g. 1.5', helper: 'Concentration in mol/L.' },
      { key: 'V', label: 'Volume of solution', kind: 'vol', placeholder: 'e.g. 0.75', helper: 'Total volume of the solution.' },
    ],
  },
  {
    id: 'V-from-n-M',
    label: 'Volume from moles and molarity',
    formulaTag: 'L = mol / M',
    hint: 'Enter the moles of solute and the target molarity.',
    fields: [
      { key: 'n', label: 'Moles of solute', kind: 'mol', placeholder: 'e.g. 0.25', helper: 'Amount of solute in moles.' },
      { key: 'M', label: 'Molarity', kind: 'conc', placeholder: 'e.g. 0.5', helper: 'Target concentration in mol/L.' },
    ],
  },
  {
    id: 'dilution',
    label: 'Dilution (M1V1 = M2V2)',
    formulaTag: 'M1V1 = M2V2',
    hint: 'Choose the unknown variable, then enter the three known values.',
    isDilution: true,
  },
  {
    id: 'mass-conc',
    label: 'Mass concentration (g/L)',
    formulaTag: 'g/L = mass / volume',
    hint: 'Enter the mass of dissolved solute and the total volume of solution.',
    fields: [
      { key: 'mass', label: 'Mass of solute', kind: 'mass', placeholder: 'e.g. 4', helper: 'Mass of the dissolved solute.' },
      { key: 'V', label: 'Volume of solution', kind: 'vol', placeholder: 'e.g. 0.5', helper: 'Total volume of the solution.' },
    ],
  },
  {
    id: 'percent-ww',
    label: 'Percent by mass (% w/w)',
    formulaTag: '%w/w = (solute / solution) x 100',
    hint: 'Enter the mass of solute and the total mass of the solution.',
    fields: [
      { key: 'massSolute', label: 'Mass of solute', kind: 'mass', placeholder: 'e.g. 5', helper: 'Mass of the dissolved solute.' },
      { key: 'massSolution', label: 'Mass of solution', kind: 'mass', placeholder: 'e.g. 100', helper: 'Total mass of solute plus solvent.' },
    ],
  },
  {
    id: 'percent-vv',
    label: 'Percent by volume (% v/v)',
    formulaTag: '%v/v = (solute / solution) x 100',
    hint: 'Enter the volume of liquid solute and the total volume of the final solution.',
    fields: [
      { key: 'volSolute', label: 'Volume of solute', kind: 'vol', placeholder: 'e.g. 25', helper: 'Volume of the liquid solute.' },
      { key: 'volSolution', label: 'Volume of solution', kind: 'vol', placeholder: 'e.g. 250', helper: 'Total volume of the final solution.' },
    ],
  },
])

export class SolutionValidationError extends Error {
  constructor(fieldKey, message) {
    super(message)
    this.name = 'SolutionValidationError'
    this.fieldKey = fieldKey
  }
}

export function toLiters(value, unit = 'L') {
  if (unit === 'mL') return value / 1000
  if (unit === 'L') return value
  throw new RangeError(`Unsupported volume unit: ${unit}`)
}

export function fromLiters(value, unit = 'L') {
  if (unit === 'mL') return value * 1000
  if (unit === 'L') return value
  throw new RangeError(`Unsupported volume unit: ${unit}`)
}

export function toGrams(value, unit = 'g') {
  if (unit === 'mg') return value / 1000
  if (unit === 'g') return value
  throw new RangeError(`Unsupported mass unit: ${unit}`)
}

function requirePositive(entry, key, label) {
  if (!entry || !Number.isFinite(entry.value)) {
    throw new SolutionValidationError(key, 'Enter a valid number.')
  }
  if (entry.value <= 0) {
    throw new SolutionValidationError(key, `${label} must be greater than zero.`)
  }
  return entry
}

export function computeVialPercent(value, unit) {
  const v = Math.abs(value)
  if (unit === '%') return Math.max(4, Math.min(100, v))
  if (v <= 0) return 4
  const logv = Math.log10(v)
  const pct = ((logv + 4) / 6) * 100
  return Math.max(4, Math.min(100, pct))
}

export function solveSolution(modeId, values, { dilutionSolveFor = 'V2', volumeResultUnit = 'L' } = {}) {
  switch (modeId) {
    case 'M-from-n-V': {
      const n = requirePositive(values.n, 'n', 'Moles of solute').value
      const vEntry = requirePositive(values.V, 'V', 'Volume of solution')
      const vUnit = vEntry.unit || 'L'
      const vL = toLiters(vEntry.value, vUnit)
      const M = n / vL
      const steps = [{ tag: 'Given', text: `n = ${formatNumber(n)} mol, V = ${formatNumber(vEntry.value)} ${vUnit}` }]
      if (vUnit === 'mL') steps.push({ tag: 'Convert', text: `V = ${formatNumber(vEntry.value)} mL = ${formatNumber(vL)} L` })
      steps.push({ tag: 'Formula', text: 'M = mol / L' })
      steps.push({ tag: 'Substitute', text: `M = ${formatNumber(n)} / ${formatNumber(vL)}` })
      steps.push({ tag: 'Answer', text: `M = ${formatNumber(M)} M` })
      return {
        value: M,
        unit: 'M',
        label: 'Molarity',
        steps,
        summary: `n = ${formatNumber(n)} mol, V = ${formatNumber(vEntry.value)} ${vUnit}`,
      }
    }

    case 'n-from-M-V': {
      const M = requirePositive(values.M, 'M', 'Molarity').value
      const vEntry = requirePositive(values.V, 'V', 'Volume of solution')
      const vUnit = vEntry.unit || 'L'
      const vL = toLiters(vEntry.value, vUnit)
      const n = M * vL
      const steps = [{ tag: 'Given', text: `M = ${formatNumber(M)} M, V = ${formatNumber(vEntry.value)} ${vUnit}` }]
      if (vUnit === 'mL') steps.push({ tag: 'Convert', text: `V = ${formatNumber(vEntry.value)} mL = ${formatNumber(vL)} L` })
      steps.push({ tag: 'Formula', text: 'mol = M x L' })
      steps.push({ tag: 'Substitute', text: `mol = ${formatNumber(M)} x ${formatNumber(vL)}` })
      steps.push({ tag: 'Answer', text: `mol = ${formatNumber(n)} mol` })
      return {
        value: n,
        unit: 'mol',
        label: 'Moles',
        steps,
        summary: `M = ${formatNumber(M)} M, V = ${formatNumber(vEntry.value)} ${vUnit}`,
      }
    }

    case 'V-from-n-M': {
      const n = requirePositive(values.n, 'n', 'Moles of solute').value
      const M = requirePositive(values.M, 'M', 'Molarity').value
      const vL = n / M
      const outputValue = fromLiters(vL, volumeResultUnit)
      const steps = [
        { tag: 'Given', text: `n = ${formatNumber(n)} mol, M = ${formatNumber(M)} M` },
        { tag: 'Formula', text: 'L = mol / M' },
        { tag: 'Substitute', text: `L = ${formatNumber(n)} / ${formatNumber(M)}` },
        { tag: 'Answer', text: `V = ${formatNumber(outputValue)} ${volumeResultUnit}` },
      ]
      return {
        value: outputValue,
        unit: volumeResultUnit,
        label: 'Volume',
        steps,
        summary: `n = ${formatNumber(n)} mol, M = ${formatNumber(M)} M`,
      }
    }

    case 'dilution': {
      const targetMeta = DILUTION_VARS.find((v) => v.key === dilutionSolveFor)
      if (!targetMeta) throw new RangeError(`Unsupported dilution variable: ${dilutionSolveFor}`)
      const known = {}
      const givenParts = []
      const convertParts = []

      for (const variable of DILUTION_VARS) {
        if (variable.key === dilutionSolveFor) continue
        const entry = requirePositive(values[variable.key], variable.key, variable.label)
        if (variable.kind === 'vol') {
          const unit = entry.unit || 'L'
          const L = toLiters(entry.value, unit)
          known[variable.key] = { value: entry.value, unit, L }
          givenParts.push(`${variable.short} = ${formatNumber(entry.value)} ${unit}`)
          if (unit === 'mL') {
            convertParts.push(`${variable.short} = ${formatNumber(entry.value)} mL = ${formatNumber(L)} L`)
          }
        } else {
          known[variable.key] = { value: entry.value, unit: 'M' }
          givenParts.push(`${variable.short} = ${formatNumber(entry.value)} M`)
        }
      }

      let rawValue
      let subText
      if (dilutionSolveFor === 'M1') {
        rawValue = (known.M2.value * known.V2.L) / known.V1.L
        subText = `M1 = (${formatNumber(known.M2.value)} x ${formatNumber(known.V2.L)}) / ${formatNumber(known.V1.L)}`
      } else if (dilutionSolveFor === 'V1') {
        rawValue = (known.M2.value * known.V2.L) / known.M1.value
        subText = `V1 = (${formatNumber(known.M2.value)} x ${formatNumber(known.V2.L)}) / ${formatNumber(known.M1.value)}`
      } else if (dilutionSolveFor === 'M2') {
        rawValue = (known.M1.value * known.V1.L) / known.V2.L
        subText = `M2 = (${formatNumber(known.M1.value)} x ${formatNumber(known.V1.L)}) / ${formatNumber(known.V2.L)}`
      } else {
        rawValue = (known.M1.value * known.V1.L) / known.M2.value
        subText = `V2 = (${formatNumber(known.M1.value)} x ${formatNumber(known.V1.L)}) / ${formatNumber(known.M2.value)}`
      }

      const unit = targetMeta.kind === 'conc' ? 'M' : volumeResultUnit
      const outputValue = targetMeta.kind === 'vol' ? fromLiters(rawValue, unit) : rawValue
      const steps = [{ tag: 'Given', text: givenParts.join(', ') }]
      if (convertParts.length) steps.push({ tag: 'Convert', text: convertParts.join('; ') })
      steps.push({ tag: 'Formula', text: 'M1 x V1 = M2 x V2' })
      steps.push({ tag: 'Substitute', text: subText })
      steps.push({ tag: 'Answer', text: `${targetMeta.short} = ${formatNumber(outputValue)} ${unit}` })

      return {
        value: outputValue,
        unit,
        label: targetMeta.label,
        steps,
        summary: givenParts.join(', '),
      }
    }

    case 'mass-conc': {
      const mEntry = requirePositive(values.mass, 'mass', 'Mass of solute')
      const vEntry = requirePositive(values.V, 'V', 'Volume of solution')
      const mUnit = mEntry.unit || 'g'
      const vUnit = vEntry.unit || 'L'
      const massG = toGrams(mEntry.value, mUnit)
      const vL = toLiters(vEntry.value, vUnit)
      const value = massG / vL
      const steps = [{ tag: 'Given', text: `mass = ${formatNumber(mEntry.value)} ${mUnit}, V = ${formatNumber(vEntry.value)} ${vUnit}` }]
      const conv = []
      if (mUnit === 'mg') conv.push(`mass = ${formatNumber(mEntry.value)} mg = ${formatNumber(massG)} g`)
      if (vUnit === 'mL') conv.push(`V = ${formatNumber(vEntry.value)} mL = ${formatNumber(vL)} L`)
      if (conv.length) steps.push({ tag: 'Convert', text: conv.join('; ') })
      steps.push({ tag: 'Formula', text: 'g/L = mass / volume' })
      steps.push({ tag: 'Substitute', text: `g/L = ${formatNumber(massG)} / ${formatNumber(vL)}` })
      steps.push({ tag: 'Answer', text: `${formatNumber(value)} g/L` })
      return {
        value,
        unit: 'g/L',
        label: 'Mass concentration',
        steps,
        summary: `mass = ${formatNumber(mEntry.value)} ${mUnit}, V = ${formatNumber(vEntry.value)} ${vUnit}`,
      }
    }

    case 'percent-ww': {
      const solute = requirePositive(values.massSolute, 'massSolute', 'Mass of solute')
      const solution = requirePositive(values.massSolution, 'massSolution', 'Mass of solution')
      const soluteUnit = solute.unit || 'g'
      const solutionUnit = solution.unit || 'g'
      const soluteG = toGrams(solute.value, soluteUnit)
      const solutionG = toGrams(solution.value, solutionUnit)
      if (soluteG > solutionG) {
        throw new SolutionValidationError('massSolute', 'Mass of solute cannot exceed the mass of the whole solution.')
      }
      const value = (soluteG / solutionG) * 100
      const steps = [
        { tag: 'Given', text: `solute = ${formatNumber(solute.value)} ${soluteUnit}, solution = ${formatNumber(solution.value)} ${solutionUnit}` },
      ]
      const conv = []
      if (soluteUnit === 'mg') conv.push(`solute = ${formatNumber(solute.value)} mg = ${formatNumber(soluteG)} g`)
      if (solutionUnit === 'mg') conv.push(`solution = ${formatNumber(solution.value)} mg = ${formatNumber(solutionG)} g`)
      if (conv.length) steps.push({ tag: 'Convert', text: conv.join('; ') })
      steps.push({ tag: 'Formula', text: '%w/w = (mass solute / mass solution) x 100' })
      steps.push({ tag: 'Substitute', text: `%w/w = (${formatNumber(soluteG)} / ${formatNumber(solutionG)}) x 100` })
      steps.push({ tag: 'Answer', text: `${formatNumber(value)} %` })
      return {
        value,
        unit: '%',
        label: 'Percent by mass',
        steps,
        summary: `solute = ${formatNumber(solute.value)} ${soluteUnit}, solution = ${formatNumber(solution.value)} ${solutionUnit}`,
      }
    }

    case 'percent-vv': {
      const solute = requirePositive(values.volSolute, 'volSolute', 'Volume of solute')
      const solution = requirePositive(values.volSolution, 'volSolution', 'Volume of solution')
      const soluteUnit = solute.unit || 'L'
      const solutionUnit = solution.unit || 'L'
      const soluteL = toLiters(solute.value, soluteUnit)
      const solutionL = toLiters(solution.value, solutionUnit)
      if (soluteL > solutionL) {
        throw new SolutionValidationError('volSolute', 'Volume of solute cannot exceed the volume of the whole solution.')
      }
      const value = (soluteL / solutionL) * 100
      const steps = [
        { tag: 'Given', text: `solute = ${formatNumber(solute.value)} ${soluteUnit}, solution = ${formatNumber(solution.value)} ${solutionUnit}` },
      ]
      const conv = []
      if (soluteUnit === 'mL') conv.push(`solute = ${formatNumber(solute.value)} mL = ${formatNumber(soluteL)} L`)
      if (solutionUnit === 'mL') conv.push(`solution = ${formatNumber(solution.value)} mL = ${formatNumber(solutionL)} L`)
      if (conv.length) steps.push({ tag: 'Convert', text: conv.join('; ') })
      steps.push({ tag: 'Formula', text: '%v/v = (volume solute / volume solution) x 100' })
      steps.push({ tag: 'Substitute', text: `%v/v = (${formatNumber(soluteL)} / ${formatNumber(solutionL)}) x 100` })
      steps.push({ tag: 'Answer', text: `${formatNumber(value)} %` })
      return {
        value,
        unit: '%',
        label: 'Percent by volume',
        steps,
        summary: `solute = ${formatNumber(solute.value)} ${soluteUnit}, solution = ${formatNumber(solution.value)} ${solutionUnit}`,
      }
    }

    default:
      throw new RangeError(`Unsupported solution mode: ${modeId}`)
  }
}
