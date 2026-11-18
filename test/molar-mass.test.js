import test from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, ATOMIC_MASSES } from '../src/lib/elements.js'
import {
  AVOGADRO_NUMBER,
  FormulaSyntaxError,
  calculateMolarMass,
  calculateMoles,
  calculateParticles,
  convertMassToGrams,
  getMolarMassBreakdown,
  parseFormula,
} from '../src/lib/molar-mass.js'

const closeTo = (actual, expected, tolerance = 0.02) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('element dataset covers all 118 elements with unique symbols and valid masses', () => {
  assert.equal(ELEMENTS.length, 118)
  const symbols = new Set(ELEMENTS.map((item) => item.symbol))
  assert.equal(symbols.size, 118)
  assert.equal(Object.keys(ATOMIC_MASSES).length, 118)
  assert.equal(ELEMENTS[0].symbol, 'H')
  assert.equal(ELEMENTS[117].symbol, 'Og')
})

test('calculates simple molecules and ionic compounds', () => {
  closeTo(calculateMolarMass('H2'), 2.016)
  closeTo(calculateMolarMass('O2'), 31.998)
  closeTo(calculateMolarMass('NaCl'), 58.44)
  closeTo(calculateMolarMass('H2O'), 18.015)
})

test('parses nested grouping with parentheses, brackets, and braces', () => {
  assert.deepEqual(parseFormula('(NH4)2HPO4'), { N: 2, H: 9, P: 1, O: 4 })
  assert.deepEqual(parseFormula('Ca3(PO4)2'), { Ca: 3, P: 2, O: 8 })
  assert.deepEqual(parseFormula('K4[Fe(CN)6]'), { K: 4, Fe: 1, C: 6, N: 6 })
  assert.deepEqual(parseFormula('{[H2O]2}3'), { H: 12, O: 6 })
})

test('supports hydrate separators and hydrate coefficients', () => {
  closeTo(calculateMolarMass('CuSO4*5H2O'), 249.68)
  closeTo(calculateMolarMass('CuSO4·5H2O'), 249.68)
  closeTo(calculateMolarMass('CuSO4.5H2O'), 249.68)
  closeTo(calculateMolarMass('MgSO4*7H2O'), 246.47)
})

test('scales the whole formula with a leading coefficient', () => {
  assert.deepEqual(parseFormula('2H2O'), { H: 4, O: 2 })
  closeTo(calculateMolarMass('2H2O'), 36.03)
})

test('returns per-element molar mass breakdown summing to 100%', () => {
  const breakdown = getMolarMassBreakdown('H2O')
  closeTo(breakdown.totalMass, 18.015)
  assert.equal(breakdown.items.length, 2)
  const percentSum = breakdown.items.reduce((sum, item) => sum + item.percent, 0)
  closeTo(percentSum, 100, 1e-9)
})

test('converts mass units and calculates moles and particles', () => {
  assert.equal(convertMassToGrams(500, 'mg'), 0.5)
  assert.equal(convertMassToGrams(18.015, 'g'), 18.015)
  assert.equal(convertMassToGrams(2, 'kg'), 2000)
  closeTo(calculateMoles(18.015, 18.015), 1, 1e-12)
  closeTo(calculateParticles(2), 2 * AVOGADRO_NUMBER, 1e15)
  assert.throws(() => calculateMoles(0, 18), RangeError)
  assert.throws(() => calculateMoles(10, -1), RangeError)
})

test('rejects malformed input with explicit syntax errors', () => {
  const cases = [
    ['H2O+', /Unexpected character '\+'/],
    ['123', /Expected an element or group after coefficient/],
    ['(H2O', /Unclosed bracket '\('/],
    ['NaC1', /Element subscript '1' is redundant; omit it/],
    ['Xx', /Unknown chemical symbol 'Xx'/],
    ['c', /must start with an uppercase letter/],
  ]
  for (const [formula, message] of cases) {
    assert.throws(() => calculateMolarMass(formula), (error) => {
      assert.ok(error instanceof FormulaSyntaxError)
      assert.match(error.message, message)
      return true
    })
  }
})

test('rejects zero multipliers, mismatched brackets, and empty hydrate parts', () => {
  assert.throws(() => parseFormula('H0'), /Element subscript must be a positive integer/)
  assert.throws(() => parseFormula('[H2O)'), /Mismatched bracket/)
  assert.throws(() => parseFormula('CuSO4*'), /Hydrate separator must be followed by a formula/)
})
