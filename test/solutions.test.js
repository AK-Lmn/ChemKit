import assert from 'node:assert/strict'
import test from 'node:test'
import { SolutionValidationError, solveSolution } from '../src/lib/solutions.js'

const closeTo = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`)

test('solves molarity, moles, and volume with L and mL unit conversions', () => {
  const m = solveSolution('M-from-n-V', { n: { value: 0.5 }, V: { value: 500, unit: 'mL' } })
  closeTo(m.value, 1)
  assert.equal(m.unit, 'M')

  const n = solveSolution('n-from-M-V', { M: { value: 2 }, V: { value: 250, unit: 'mL' } })
  closeTo(n.value, 0.5)
  assert.equal(n.unit, 'mol')

  const vMl = solveSolution(
    'V-from-n-M',
    { n: { value: 0.25 }, M: { value: 0.5 } },
    { volumeResultUnit: 'mL' },
  )
  closeTo(vMl.value, 500)
  assert.equal(vMl.unit, 'mL')
})

test('solves M1V1 = M2V2 dilution for every variable', () => {
  const v2 = solveSolution(
    'dilution',
    { M1: { value: 2 }, V1: { value: 100, unit: 'mL' }, M2: { value: 0.5 } },
    { dilutionSolveFor: 'V2', volumeResultUnit: 'mL' },
  )
  closeTo(v2.value, 400)
  assert.equal(v2.unit, 'mL')

  const m2 = solveSolution(
    'dilution',
    { M1: { value: 2 }, V1: { value: 100, unit: 'mL' }, V2: { value: 0.4, unit: 'L' } },
    { dilutionSolveFor: 'M2' },
  )
  closeTo(m2.value, 0.5)
  assert.equal(m2.unit, 'M')

  const v1 = solveSolution(
    'dilution',
    { M1: { value: 2 }, M2: { value: 0.5 }, V2: { value: 400, unit: 'mL' } },
    { dilutionSolveFor: 'V1', volumeResultUnit: 'L' },
  )
  closeTo(v1.value, 0.1)
  assert.equal(v1.unit, 'L')

  const m1 = solveSolution(
    'dilution',
    { V1: { value: 100, unit: 'mL' }, M2: { value: 0.5 }, V2: { value: 400, unit: 'mL' } },
    { dilutionSolveFor: 'M1' },
  )
  closeTo(m1.value, 2)
})

test('solves mass concentration, % w/w, and % v/v', () => {
  const mc = solveSolution('mass-conc', {
    mass: { value: 500, unit: 'mg' },
    V: { value: 250, unit: 'mL' },
  })
  closeTo(mc.value, 2)
  assert.equal(mc.unit, 'g/L')

  const ww = solveSolution('percent-ww', {
    massSolute: { value: 500, unit: 'mg' },
    massSolution: { value: 10, unit: 'g' },
  })
  closeTo(ww.value, 5)
  assert.equal(ww.unit, '%')

  const vv = solveSolution('percent-vv', {
    volSolute: { value: 25, unit: 'mL' },
    volSolution: { value: 0.25, unit: 'L' },
  })
  closeTo(vv.value, 10)
  assert.equal(vv.unit, '%')
})

test('rejects solute exceeding solution and non-positive values', () => {
  assert.throws(
    () =>
      solveSolution('percent-ww', {
        massSolute: { value: 120, unit: 'g' },
        massSolution: { value: 100, unit: 'g' },
      }),
    SolutionValidationError,
  )
  assert.throws(
    () =>
      solveSolution('percent-vv', {
        volSolute: { value: 500, unit: 'mL' },
        volSolution: { value: 0.25, unit: 'L' },
      }),
    SolutionValidationError,
  )
  assert.throws(
    () => solveSolution('M-from-n-V', { n: { value: -1 }, V: { value: 1, unit: 'L' } }),
    SolutionValidationError,
  )
})
