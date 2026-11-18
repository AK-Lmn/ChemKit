import { calculateMolarMass } from './molar-mass.js'
import { balanceEquation } from './balancer.js'
import { formatNumber } from './format.js'

function parseCompound(raw) {
  const compact = String(raw).trim().replace(/\s+/g, '')
  if (!compact) throw new Error('An empty compound was found in the equation.')
  const match = compact.match(/^(\d+)?(.+)$/)
  if (!match) throw new Error(`Invalid compound "${raw.trim()}".`)
  const coefficient = match[1] ? Number(match[1]) : 1
  const formula = match[2]
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`Invalid coefficient in "${raw.trim()}".`)
  }
  const molarMass = calculateMolarMass(formula)
  if (!Number.isFinite(molarMass) || molarMass <= 0) {
    throw new Error(`Molar mass could not be calculated for ${formula}.`)
  }
  return { coefficient, formula, molarMass }
}

/**
 * Parse a balanced chemical equation into reactants, products, and a flat compound list
 * with each compound's stoichiometric coefficient and IUPAC molar mass.
 */
export function parseChemicalEquation(raw) {
  const text = String(raw ?? '').trim()
  if (!text) throw new Error('Enter a balanced chemical equation.')
  const arrowMatches = text.match(/-->|->|→|⇌|=/g)
  if (!arrowMatches) throw new Error('Use ->, -->, =, →, or ⇌ to separate reactants and products.')
  if (arrowMatches.length !== 1) throw new Error('Use exactly one arrow to separate reactants and products.')
  const sides = text.split(/-->|->|→|⇌|=/)
  if (!sides[0].trim() || !sides[1].trim()) {
    throw new Error('Add compounds on both sides of the arrow.')
  }
  const reactants = sides[0].split('+').map(parseCompound)
  const products = sides[1].split('+').map(parseCompound)
  const compounds = [...reactants, ...products]
  const seen = new Set()
  for (const item of compounds) {
    if (seen.has(item.formula)) {
      throw new Error(`${item.formula} appears more than once. Combine like compounds first.`)
    }
    seen.add(item.formula)
  }
  return { raw: text, reactants, products, compounds }
}

/** Convenience helper: auto-balance an equation string and parse it for stoichiometry. */
export function autoBalanceForStoichiometry(raw) {
  const balanced = balanceEquation(raw)
  return parseChemicalEquation(balanced.equation)
}

/**
 * Solve a stoichiometric conversion between any two compounds in a parsed balanced equation.
 */
export function solveStoichiometry({
  parsedEquation,
  givenFormula,
  givenAmount,
  givenUnit = 'moles',
  targetFormula,
  targetUnit = 'moles',
}) {
  if (!parsedEquation || !Array.isArray(parsedEquation.compounds)) {
    throw new Error('Parse a balanced equation first.')
  }
  if (!Number.isFinite(givenAmount) || givenAmount <= 0) {
    throw new Error('Enter a given amount greater than zero.')
  }
  if (!['moles', 'grams'].includes(givenUnit)) {
    throw new Error(`Unsupported given unit: ${givenUnit}.`)
  }
  if (!['moles', 'grams'].includes(targetUnit)) {
    throw new Error(`Unsupported target unit: ${targetUnit}.`)
  }

  const given = parsedEquation.compounds.find((item) => item.formula === givenFormula)
  const target = parsedEquation.compounds.find((item) => item.formula === targetFormula)
  if (!given || !target) {
    throw new Error('Choose compounds from the parsed equation.')
  }

  const givenMoles = givenUnit === 'grams' ? givenAmount / given.molarMass : givenAmount
  const targetMoles = (givenMoles * target.coefficient) / given.coefficient
  const result = targetUnit === 'grams' ? targetMoles * target.molarMass : targetMoles
  if (!Number.isFinite(result) || result <= 0) {
    throw new Error('The result could not be calculated. Check the amount and formula.')
  }

  const steps = []
  if (givenUnit === 'grams') {
    steps.push(
      `Convert given mass to moles: ${formatNumber(givenAmount)} g ${given.formula} / ${formatNumber(given.molarMass)} g/mol = ${formatNumber(givenMoles)} mol ${given.formula}.`,
    )
  } else {
    steps.push(`Given amount is already in moles: ${formatNumber(givenMoles)} mol ${given.formula}.`)
  }

  if (given.formula === target.formula) {
    steps.push('Given and target compounds match, so the mole ratio is 1:1.')
  } else {
    steps.push(
      `Apply balanced mole ratio: ${formatNumber(givenMoles)} mol ${given.formula} x (${target.coefficient} mol ${target.formula} / ${given.coefficient} mol ${given.formula}) = ${formatNumber(targetMoles)} mol ${target.formula}.`,
    )
  }

  if (targetUnit === 'grams') {
    steps.push(
      `Convert target moles to grams: ${formatNumber(targetMoles)} mol ${target.formula} x ${formatNumber(target.molarMass)} g/mol = ${formatNumber(result)} g ${target.formula}.`,
    )
  } else {
    steps.push(`Target unit is moles: ${formatNumber(result)} mol ${target.formula}.`)
  }

  return {
    amount: givenAmount,
    given,
    target,
    givenUnit,
    targetUnit,
    givenMoles,
    targetMoles,
    result,
    moleRatio: `${target.coefficient} mol ${target.formula} / ${given.coefficient} mol ${given.formula}`,
    steps,
  }
}
