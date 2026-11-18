const SUPERSCRIPT_MAP = Object.freeze({
  '-': '⁻',
  '+': '',
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
})

const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉'

export function toSuperscript(value) {
  return String(value)
    .split('')
    .map((char) => (SUPERSCRIPT_MAP[char] !== undefined ? SUPERSCRIPT_MAP[char] : char))
    .join('')
}

export function toSubscript(value) {
  return String(value).replace(/\d/g, (digit) => SUBSCRIPT_DIGITS[Number(digit)])
}

export function formatFormulaSubscripts(formula) {
  return String(formula).replace(/([A-Za-z)\]}])(\d+)/g, (_, prefix, digits) => `${prefix}${toSubscript(digits)}`)
}

export function formatScientific(value, digits = 3) {
  if (!Number.isFinite(value)) return ''
  if (value === 0) return '0'
  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const mantissa = value / 10 ** exponent
  const roundedMantissa = Number(mantissa.toFixed(digits))
  if (roundedMantissa === 10) {
    return `1 x 10${toSuperscript(exponent + 1)}`
  }
  return `${roundedMantissa} x 10${toSuperscript(exponent)}`
}

export function formatNumber(value, { significantDigits = 6, minFixed = 1e-4, maxFixed = 1e6 } = {}) {
  if (!Number.isFinite(value)) return ''
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs < minFixed || abs >= maxFixed) {
    return formatScientific(value, 3)
  }
  const rounded = Number(value.toPrecision(significantDigits))
  const text = String(rounded)
  if (text.includes('e') || text.includes('E')) {
    return rounded.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  }
  return text
}

export function formatTimeAgo(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
