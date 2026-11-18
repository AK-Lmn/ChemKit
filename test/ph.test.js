import assert from 'node:assert/strict'
import test from 'node:test'
import { solvePhConversion, solveWeakDissociation } from '../src/lib/ph.js'

const closeTo = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`)

test('converts across all 6 standard pH, pOH, [H+], and [OH-] modes', () => {
  const a = solvePhConversion('phToH', 3)
  closeTo(a.primaryValue, 1e-3, 1e-9)
  closeTo(a.pOH, 11, 1e-9)
  assert.equal(a.classification, 'Acidic')

  const b = solvePhConversion('hToPh', 1e-7)
  closeTo(b.primaryValue, 7, 1e-9)
  assert.equal(b.classification, 'Neutral')

  const c = solvePhConversion('pohToOh', 2)
  closeTo(c.primaryValue, 1e-2, 1e-9)
  closeTo(c.pH, 12, 1e-9)
  assert.equal(c.classification, 'Basic')

  const d = solvePhConversion('ohToPoh', 1e-4)
  closeTo(d.primaryValue, 4, 1e-9)
  closeTo(d.pH, 10, 1e-9)

  const e = solvePhConversion('phToPoh', 4.5)
  closeTo(e.primaryValue, 9.5, 1e-9)

  const f = solvePhConversion('pohToPh', 9.5)
  closeTo(f.primaryValue, 4.5, 1e-9)
})

test('solves weak acid and weak base dissociation using exact quadratic', () => {
  // 0.10 M acetic acid, Ka = 1.8e-5 -> [H+] ~ 1.3326e-3 M, pH ~ 2.875
  const acetic = solveWeakDissociation({ type: 'acid', concentration: 0.1, kValue: 1.8e-5 })
  closeTo(acetic.hConcentration, 1.3326e-3, 1e-3)
  closeTo(acetic.pH, 2.8753, 1e-3)
  closeTo(acetic.percentIonization, 1.3326, 1e-3)
  assert.equal(acetic.classification, 'Acidic')

  // 0.10 M ammonia, Kb = 1.8e-5 -> [OH-] ~ 1.3326e-3 M, pOH ~ 2.875, pH ~ 11.125
  const ammonia = solveWeakDissociation({ type: 'base', concentration: 0.1, kValue: 1.8e-5 })
  closeTo(ammonia.ohConcentration, 1.3326e-3, 1e-3)
  closeTo(ammonia.pH, 11.1247, 1e-3)
  assert.equal(ammonia.classification, 'Basic')
})

test('rejects out-of-range pH/pOH and non-positive concentrations or constants', () => {
  assert.throws(() => solvePhConversion('phToH', -1), RangeError)
  assert.throws(() => solvePhConversion('phToPoh', 15), RangeError)
  assert.throws(() => solvePhConversion('hToPh', 0), RangeError)
  assert.throws(() => solveWeakDissociation({ type: 'acid', concentration: 0, kValue: 1e-5 }), RangeError)
  assert.throws(() => solveWeakDissociation({ type: 'base', concentration: 0.1, kValue: -1e-5 }), RangeError)
})
