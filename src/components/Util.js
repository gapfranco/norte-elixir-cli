import { showBalance } from '~/src/services/balancesApi'

var FormulaParser = require('hot-formula-parser').Parser

function getVariables (str) {
  const rx = /\{.+?\}/g
  const variables = str.match(rx).map(v => v.substring(1, v.length - 1))
  return variables
}

export function calcVariables (str, values) {
  let orig = str
  const varis = getVariables(str)
  for (const itm of varis) {
    const rx = new RegExp(`\\{${itm}\\}`, 'g')
    const vs = values[itm] || ''
    orig = orig.replace(rx, vs)
  }
  // console.log(orig)
  const parser = new FormulaParser()
  const calc = parser.parse(orig)
  return calc.error ? null : calc.result
}

export async function calcVariablesPeriod (str, period) {
  let orig = str
  const varis = getVariables(str)
  for (const itm of varis) {
    try {
      const rx = new RegExp(`\\{${itm}\\}`, 'g')
      const reg = await showBalance(period, itm)
      const vs = reg.data.value || ''
      orig = orig.replace(rx, vs)
    } catch {
      return null
    }
  }
  console.log(orig)
  const parser = new FormulaParser()
  const calc = parser.parse(orig)
  return calc.error ? null : calc.result
}

// module.exports = { getVariables, calcVariables }
