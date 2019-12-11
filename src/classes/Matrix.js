class Matrix {
  /**
   * Creates a m * n Matrix
   * @param {number} m - Number of rows
   * @param {number} n - Number of columns
   */
  constructor(m, n) { }

  /**
   * Transpose the matrix
   * @returns {Matrix} - The transposed matrix
   */
  tranpose() { }

  /**
   * Transpose the matrix in place
   * @returns {Matrix} - this
   */
  transposeSelf() { }

  /**
   * Inverse the matrix
   * @returns {Matrix} - The inversed matrix
   */
  inverse() { }

  /**
   * Conjugate the matrix
   * @returns {Matrix} - The matrix conjugate
   * @example
   * const m = eig.Matrix.fromArray([[1, 2], ])
   */
  conjugate() { }

  /**
   * Get the number of rows
   * @returns {number}
   */
  rows() { }

  /**
   * Get the number of columns
   * @returns {number}
   * @example
   * const m = new eig.Matrix(2, 3)
   * return [m.rows(), m.cols()]
   */
  cols() { }
}

export { Matrix }