import assert from 'node:assert/strict'
import test from 'node:test'
import {
  autoBalanceForStoichiometry,
  parseChemicalEquation,
  solveStoichiometry,
} from '../src/lib/stoichiometry.js'

const closeTo = (actual, expected, tolerance = 0.05) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)

test('parses balanced equations and calculates IUPAC molar masses', () => {
  const parsed = parseChemicalEquation('2H2 + O2 -> 2H2O')
  assert.equal(parsed.reactants.length, 2)
  assert.equal(parsed.products.length, 1)
  assert.equal(parsed.compounds[0].coefficient, 2)
  closeTo(parsed.compounds[2].molarMass, 18.015, 0.01)
})

test('auto-balances unbalanced equations for stoichiometry', () => {
  const parsed = autoBalanceForStoichiometry('Fe + O2 -> Fe2O3')
  assert.equal(parsed.raw, '4Fe + 3O2 -> 2Fe2O3')
  assert.equal(parsed.compounds[0].coefficient, 4)
  assert.equal(parsed.compounds[2].coefficient, 2)
})

test('solves mole-to-mole and gram-to-gram stoichiometry accurately', () => {
  const water = parseChemicalEquation('2H2 + O2 -> 2H2O')
  const molRes = solveStoichiometry({
    parsedEquation: water,
    givenFormula: 'H2',
    givenAmount: 4,
    givenUnit: 'moles',
    targetFormula: 'O2',
    targetUnit: 'moles',
  })
  closeTo(molRes.result, 2, 1e-12)
  assert.equal(molRes.steps.length, 3)

  const gramRes = solveStoichiometry({
    parsedEquation: water,
    givenFormula: 'H2',
    givenAmount: 4.032,
    givenUnit: 'grams',
    targetFormula: 'H2O',
    targetUnit: 'grams',
  })
  closeTo(gramRes.result, 36.03, 0.05)
})

test('handles polyatomic compounds in neutralization equations', () => {
  const parsed = parseChemicalEquation('Ca(OH)2 + 2HCl -> CaCl2 + 2H2O')
  const res = solveStoichiometry({
    parsedEquation: parsed,
    givenFormula: 'Ca(OH)2',
    givenAmount: 1,
    givenUnit: 'moles',
    targetFormula: 'H2O',
    targetUnit: 'grams',
  })
  closeTo(res.result, 36.03, 0.05)
})

test('rejects invalid equations and non-positive amounts', () => {
  assert.throws(() => parseChemicalEquation('2H2 + H2 -> 3H2'), /appears more than once/)
  assert.throws(() => parseChemicalEquation('H2 + O2'), /separate reactants and products/)
  const parsed = parseChemicalEquation('2H2 + O2 -> 2H2O')
  assert.throws(
    () =>
      solveStoichiometry({
        parsedEquation: parsed,
        givenFormula: 'H2',
        givenAmount: 0,
        givenUnit: 'moles',
        targetFormula: 'H2O',
        targetUnit: 'moles',
      }),
    /greater than zero/,
  )
})
