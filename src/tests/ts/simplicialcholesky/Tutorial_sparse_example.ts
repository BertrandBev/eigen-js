import {
  TripletVector,
  Matrix,
  SparseMatrix,
  SimplicialCholesky,
} from '../types'
import { linSpacedColVector, printVector, vectorSetZero } from '../utils'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eig = require('../../../../dist/index.js') // TODO if import is used, it gives error because importing outside module

type Vector = Matrix

const insertCoefficient = (
  id: number,
  i: number,
  j: number,
  w: number,
  coefficients: TripletVector,
  b: Vector,
  boundary: Vector
) => {
  const n = boundary.length()
  const id1 = i + j * n

  if (i === -1 || i === n)
    b.set(id, b.get(id) - w * boundary.get(j)) // constrained coefficient
  else if (j === -1 || j === n)
    b.set(id, b.get(id) - w * boundary.get(i)) // constrained coefficient
  else coefficients.add(id, id1, w) // unknown coefficient
}

const buildProblem = (coefficients: TripletVector, b: Vector, n: number) => {
  vectorSetZero(b)

  // Eigen::ArrayXd boundary = Eigen::ArrayXd::LinSpaced(n, 0,M_PI).sin().pow(2);
  const boundary = linSpacedColVector(n, 0, Math.PI)

  // printVector('buildProblem.boundary', boundary)

  for (let i = 0; i < n; ++i) {
    boundary.set(i, Math.pow(Math.sin(boundary.get(i)), 2))
  }

  for (let j = 0; j < n; ++j) {
    for (let i = 0; i < n; ++i) {
      const id = i + j * n
      insertCoefficient(id, i - 1, j, -1, coefficients, b, boundary)
      insertCoefficient(id, i + 1, j, -1, coefficients, b, boundary)
      insertCoefficient(id, i, j - 1, -1, coefficients, b, boundary)
      insertCoefficient(id, i, j + 1, -1, coefficients, b, boundary)
      insertCoefficient(id, i, j, 4, coefficients, b, boundary)
    }
  }
}

export const testSimplicialCholesky = () => {
  const timeStart = process.hrtime.bigint()

  const n = 10 // size of the image
  const m = n * n // number of unknows (=number of pixels)

  // Assembly:
  const coefficients = new eig.TripletVector(m) as TripletVector // list of non-zeros coefficients
  const b = new eig.Matrix(m) as Vector // the right hand side-vector resulting from the constraints
  buildProblem(coefficients, b, n)

  const A = eig.SparseMatrix(m, m, coefficients) as SparseMatrix

  // Solving:
  const chol = new eig.SimplicialCholesky(A) as SimplicialCholesky // performs a Cholesky factorization of A

  const timeSolveStart = process.hrtime.bigint()

  const x = chol.solve(b) // use the factorization to solve for the given right hand side

  const timeEnd = process.hrtime.bigint()

  printVector('X', x)

  console.log('SimplicalCholesky test elapsed time', timeEnd - timeStart)
  console.log('Solver time', timeEnd - timeSolveStart)
}
