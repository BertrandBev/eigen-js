import { MatrixVector } from './types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eig = require('../../../dist/index.js') // TODO if import is used, it gives error because importing outside module

export const vectorSetZero = (v: MatrixVector) => {
  for (let i = 0, len = v.length(); i < len; ++i) {
    v.vSet(i, 0)
  }
}

export const printVector = (name: string, v: MatrixVector) => {
  const arr: number[] = []
  for (let i = 0, len = v.length(); i < len; ++i) {
    arr.push(v.vGet(i))
  }
  console.log(name + ' = ' + arr.map(_ => _.toFixed(4)).join(', '))
}

// export const printMatrix = (name: string, m: Matrix) => {
//   // get maximum element string length
//   for (let i = 0, cols = m.cols(); i < cols; ++i) {
//     for (let j = 0, rows = m.rows(); j < rows; ++j) {
//     }
//   }
//   const maxLen = m.flat().reduce((a,c) => Math.max(c.length,a), 0);
// const res = grid.map(arr => arr.map(s => s.padEnd(mLen,' ')).join(' ')).join('\n')
// console.log(res)
// }

export const linSpacedColVector = (
  numSteps: number,
  start: number,
  end: number
): MatrixVector => {
  const result = new eig.Matrix(1, numSteps) as MatrixVector
  const dt = (end - start) / (numSteps - 1)
  for (let i = 0; i < numSteps; ++i) {
    result.vSet(i, dt * i)
  }
  return result
}
