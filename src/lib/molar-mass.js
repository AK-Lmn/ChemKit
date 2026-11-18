import { ATOMIC_MASSES, ELEMENT_BY_SYMBOL } from './elements.js'

export { ATOMIC_MASSES }

export const AVOGADRO_NUMBER = 6.02214076e23

const OPEN_TO_CLOSE = Object.freeze({ '(': ')', '[': ']', '{': '}' })
const CLOSERS = new Set(Object.values(OPEN_TO_CLOSE))

export class FormulaSyntaxError extends Error {
  constructor(message, position) {
    super(position === undefined ? message : `${message} at position ${position + 1}`)
    this.name = 'FormulaSyntaxError'
    this.position = position
  }
}

function addCounts(target, source, multiplier = 1) {
  for (const [symbol, count] of Object.entries(source)) {
    target[symbol] = (target[symbol] ?? 0) + count * multiplier
  }
}

function readPositiveInteger(source, state, label) {
  const start = state.index
  while (/\d/.test(source[state.index] ?? '')) state.index += 1
  if (start === state.index) return 1
  const value = Number(source.slice(start, state.index))
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new FormulaSyntaxError(`${label} must be a positive integer`, start)
  }
  if (value === 1 && label !== 'Coefficient') {
    throw new FormulaSyntaxError(`${label} '1' is redundant; omit it`, start)
  }
  return value
}

function parseSequence(source, state, expectedCloser) {
  const counts = {}
  let terms = 0

  while (state.index < source.length) {
    const char = source[state.index]
    if (CLOSERS.has(char)) {
      if (!expectedCloser) throw new FormulaSyntaxError(`Unexpected closing bracket '${char}'`, state.index)
      if (char !== expectedCloser) {
        throw new FormulaSyntaxError(`Mismatched bracket: expected '${expectedCloser}' but found '${char}'`, state.index)
      }
      break
    }

    if (OPEN_TO_CLOSE[char]) {
      const openPosition = state.index++
      const inner = parseSequence(source, state, OPEN_TO_CLOSE[char])
      if (state.index >= source.length) {
        throw new FormulaSyntaxError(`Unclosed bracket '${char}'`, openPosition)
      }
      state.index += 1
      const multiplier = readPositiveInteger(source, state, 'Group multiplier')
      addCounts(counts, inner, multiplier)
      terms += 1
      continue
    }

    if (/[A-Z]/.test(char)) {
      const start = state.index++
      while (/[a-z]/.test(source[state.index] ?? '')) state.index += 1
      const symbol = source.slice(start, state.index)
      if (!(symbol in ATOMIC_MASSES)) {
        throw new FormulaSyntaxError(`Unknown chemical symbol '${symbol}'`, start)
      }
      const multiplier = readPositiveInteger(source, state, 'Element subscript')
      counts[symbol] = (counts[symbol] ?? 0) + multiplier
      terms += 1
      continue
    }

    if (/[a-z]/.test(char)) {
      throw new FormulaSyntaxError(`Chemical symbols must start with an uppercase letter (found '${char}')`, state.index)
    }
    throw new FormulaSyntaxError(`Unexpected character '${char}'`, state.index)
  }

  if (terms === 0) throw new FormulaSyntaxError('Expected an element or group', state.index)
  return counts
}

function parsePart(part, offset) {
  const state = { index: 0 }
  const coefficient = readPositiveInteger(part, state, 'Coefficient')
  if (state.index === part.length) {
    throw new FormulaSyntaxError('Expected an element or group after coefficient', offset + state.index)
  }
  try {
    const counts = parseSequence(part, state)
    if (state.index !== part.length) throw new FormulaSyntaxError('Unexpected input', state.index)
    const scaled = {}
    addCounts(scaled, counts, coefficient)
    return scaled
  } catch (error) {
    if (error instanceof FormulaSyntaxError && error.position !== undefined) {
      const baseMessage = error.message.replace(/ at position \d+$/, '')
      throw new FormulaSyntaxError(baseMessage, offset + error.position)
    }
    throw error
  }
}

/** Parse a formula into an element-to-atom-count object. */
export function parseFormula(formula) {
  if (typeof formula !== 'string') throw new TypeError('Formula must be a string')
  const source = formula.trim()
  if (!source) throw new FormulaSyntaxError('Formula cannot be empty')
  if (/\s/.test(source)) throw new FormulaSyntaxError('Whitespace is not allowed', source.search(/\s/))

  const total = {}
  let partStart = 0
  for (let index = 0; index <= source.length; index += 1) {
    if (index !== source.length && !['*', '·', '.'].includes(source[index])) continue
    if (index === partStart) throw new FormulaSyntaxError('Hydrate separator must be followed by a formula', index)
    addCounts(total, parsePart(source.slice(partStart, index), partStart))
    partStart = index + 1
  }
  return Object.freeze(total)
}

/** Calculate molar mass in grams per mole. */
export function calculateMolarMass(formula) {
  return Object.entries(parseFormula(formula)).reduce(
    (mass, [symbol, count]) => mass + ATOMIC_MASSES[symbol] * count,
    0,
  )
}

/** Return per-element contribution breakdown for a chemical formula. */
export function getMolarMassBreakdown(formula) {
  const counts = parseFormula(formula)
  const totalMass = Object.entries(counts).reduce(
    (mass, [symbol, count]) => mass + ATOMIC_MASSES[symbol] * count,
    0,
  )
  const items = Object.entries(counts).map(([symbol, count]) => {
    const atomicMass = ATOMIC_MASSES[symbol]
    const subtotal = atomicMass * count
    return {
      symbol,
      name: ELEMENT_BY_SYMBOL[symbol]?.name ?? symbol,
      count,
      atomicMass,
      subtotal,
      percent: totalMass > 0 ? (subtotal / totalMass) * 100 : 0,
    }
  })
  return { totalMass, items }
}

export function convertMassToGrams(mass, massUnit = 'g') {
  if (!Number.isFinite(mass)) return Number.NaN
  if (massUnit === 'mg') return mass / 1000
  if (massUnit === 'kg') return mass * 1000
  if (massUnit === 'g') return mass
  throw new RangeError(`Unsupported mass unit: ${massUnit}`)
}

export function calculateMoles(massInGrams, molarMass) {
  if (!Number.isFinite(massInGrams) || massInGrams <= 0) {
    throw new RangeError('Mass must be greater than zero.')
  }
  if (!Number.isFinite(molarMass) || molarMass <= 0) {
    throw new RangeError('Molar mass must be greater than zero.')
  }
  return massInGrams / molarMass
}

export function calculateParticles(moles) {
  if (!Number.isFinite(moles) || moles <= 0) {
    throw new RangeError('Moles must be greater than zero.')
  }
  return moles * AVOGADRO_NUMBER
}
