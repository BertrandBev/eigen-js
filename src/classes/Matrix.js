
/**
 * A generic dense matrix class holding real number
 */
class Matrix {
  /**
   * - Creates a m * n matrix filled with zeros
   * - Create a matrix from an array
   * - Copy an existing matrix
   * @param {number} arg0 - Number of rows || 1D or 2D array to build matrix from || matrix to be copied
   * @param {number} arg1 - Number of columns
   * @example
   * const m1 = new eig.Matrix(2, 2);
   * const m2 = new eig.Matrix(2);
   * const m3 = new eig.Matrix([[1, 2], [3, 4]]);
   * const m4 = new eig.Matrix(m2);
   * return [m1, m2, m3, m4]
   */
  constructor(arg0, arg1) { }

  /**
   * Get the number of rows
   * @returns {number} - The number of rows
   * @example
   * const m = new eig.Matrix([1, 2]);
   * return m.rows();
   */
  rows() { }

  /**
   * Get the number of columns
   * @returns {number} - The number of columns
   * @example
   * const m = new eig.Matrix([1, 2]);
   * return m.cols();
   */
  cols() { }

  /**
   * Get the value at (i, j)
   * @param {number} i - Row
   * @param {number} j - Col
   * @returns {number} - M[i, j]
   * @example
   * const m = new eig.Matrix([[1, 2], [3, 4]]);
   * return m.get(1, 0);
   */
  get(i, j) { }

  /**
   * Get a vector value at (i)
   * @param {number} i - Row
   * @returns {number} - M[i, 0] or M[0, i]
   * @example
   * const m = new eig.Matrix([1, 2]);
   * return m.get(1);
   */
  get(i) { }

  /**
   * Set the value at (i, j)
   * @param {number} i - Row
   * @param {number} j - Col
   * @param {number} val - value
   * @example
   * const A = new eig.Matrix(2, 2);
   * A.set(0, 1, 3 / 2);
   * return A.get(0, 1);
   */
  set(i, j, val) { }

  /**
   * Set a vector value at (i)
   * @param {number} i - Row
   * @param {number} val - value
   * @example
   * const A = new eig.Matrix(2);
   * A.set(1, 3 / 2);
   * return A.get(1);
   */
  set(i, val) { }

  /**
   * Get a vector length
   * @warning The matrix must be a vector (either single row or column)
   * @returns {number} - V.length
   * @example
   * return (new eig.Matrix(3)).length();
   */
  length() { }

  /**
   * Take the dot product with another vector
   * @warning The matrix must be a vector (either single row or column)
   * @param {Matrix} B - Vector of interest
   * @returns {number} - V.B
   * @example
   * const V = new eig.Matrix([1, 2]);
   * const B = new eig.Matrix([-1, 3]);
   * return V.dot(B);
   */
  dot(B) { }


  /**
   * Get the l2 (Frobenius) norm
   * @returns {number} - The l2 norm
   */
  norm() { }

  /**
   * Get the squared l2 (Frobenius) norm
   * @returns {number} - The l2 norm squared
   */
  normSqr() { }

  /**
   * Get the l1 norm
   * @returns {number} - The l1 norm
   */
  l1Norm() { }

  /**
   * Get the l-Infinity norm
   * @returns {number} - The l-Infinity norm
   * @example
   * const m = new eig.Matrix([[1, 2], [3, 4]]);
   * return [m.norm(), m.normSqr(), m.l1Norm(), m.lInfNorm()];
   */
  lInfNorm() { }

  /**
   * Get the rank
   * @returns {number} - The rank
   * @example
   * const m = new eig.Matrix([[2, 1], [2, 1]]);
   * return m.rank();
   */
  rank() { }

  /**
   * Get the determinant
   * @return {number} - The determinant
   * @example
   * const m = new eig.Matrix([[2, 0], [0, 3]]);
   * return m.det();
   */
  det() { }

  /**
   * Sum all the elements
   * @returns {number} - The sum of all the elements
   * @example
   * const m = new eig.Matrix([1, 2]);
   * return m.sum();
   */
  sum() { }

  /**
   * Get a block
   * @param {number} i - The block top left row
   * @param {number} j - The block top left column
   * @param {number} di - Block rows count
   * @param {number} dj - Block columns count
   * @returns {Matrix} - The resulting block
   * @example
   * const m = new eig.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
   * return m.block(1, 0, 1, 2);
   */
  block(i, j, di, dj) { }

  /**
   * Set a block
   * @param {number} i - The block top left row
   * @param {number} j - The block top left column
   * @param {Matrix} block - Block to be set
   * @example
   * const m = new eig.Matrix(3, 3);
   * const b = new eig.Matrix([[1, 2, 3], [4, 5, 6]]);
   * m.setBlock(1, 0, b);
   * return m;
   */
  setBlock(i, j, block) { }

  /**
   * Multiply by a value
   * @param {number} val - Value to multiply by
   * @returns {Matrix} - M * val
   * @example
   * const m = new eig.Matrix([1, 2]);
   * return m.mul(2);
   */
  mul(val) { }

  /**
   * Multiply by a value in place
   * @param {number} val - Value to multiply by
   * @returns {Matrix} - this (M * val)
   * @example
   * const m = new eig.Matrix([1, 2]);
   * m.mulSelf(2);
   * return m;
   */
  mulSelf(val) { }

  /**
   * Divide by a value
   * @param {number} val - Value to divide by
   * @returns {Matrix} - M / val
   * @example
   * const m = new eig.Matrix([2, 4]);
   * return m.div(2);
   */
  div(val) { }

  /**
   * Divide by a value in place
   * @param {number} val - Value to divide by
   * @returns {Matrix} - this (M / val)
   * @example
   * const m = new eig.Matrix([2, 4]);
   * m.divSelf(2);
   * return m;
   */
  divSelf(val) { }

  /**
   * Add B
   * @param {Matrix} B - Matrix to be added
   * @returns {Matrix} M + B
   * @example
   * const M = new eig.Matrix([1, 2]);
   * const B = new eig.Matrix([3, 4]);
   * return M.matAdd(B);
   */
  matAdd(B) { }

  /**
   * Add B in place
   * @param {Matrix} B - Matrix to be added
   * @returns {Matrix} - this
   * @example
   * const M = new eig.Matrix([1, 2]);
   * const B = new eig.Matrix([3, 4]);
   * M.matAddSelf(B);
   * return M;
   */
  matAddSelf(B) { }

  /**
   * Substract B
   * @param {Matrix} B - Matrix to be substracted
   * @returns {Matrix} - M - B
   * @example
   * const M = new eig.Matrix([3, 4]);
   * const B = new eig.Matrix([1, 2]);
   * return M.matSub(B);
   */
  matSub(B) { }

  /**
   * Substract B in place
   * @param {Matrix} B - Matrix to be substracted
   * @returns {Matrix} - this (M - B)
   * @example
   * const M = new eig.Matrix([3, 4]);
   * const B = new eig.Matrix([1, 2]);
   * M.matSubSelf(B);
   * return M;
   */
  matSubSelf(B) { }

  /**
   * Multiply by a matrix B
   * @param {Matrix} B - Matrix to multiply M by
   * @returns {Matrix} - M * B
   * @example
   * const M = new eig.Matrix([3, 4]);
   * const B = new eig.Matrix([[1, 2]]);
   * return M.matMul(B);
   */
  matMul(B) { }

  /**
   * Multiplyby a matrix B in place
   * @param {Matrix} B - Matrix to multiply M by
   * @returns {Matrix} - this (M * B)
   * @example
   * const M = new eig.Matrix([3, 4]);
   * const B = new eig.Matrix([[1, 2]]);
   * M.matMulSelf(B);
   * return M;
   */
  matMulSelf(B) { }

  /**
   * Concatenate B horizontally
   * @param {Matrix} B - Matrix to be concatenated
   * @returns {Matrix} - [M, B]
   * @example
   * const M = new eig.Matrix([[1], [2]]);
   * const B = new eig.Matrix([[3], [4]]);
   * return M.hcat(B);
   */
  hcat(B) { }

  /**
   * Concatenate B vertically
   * @param {Matrix} B - Matrix to be concatenated
   * @returns {Matrix} - [M; B]
   * @example
   * const M = new eig.Matrix([[1], [2]]);
   * const B = new eig.Matrix([[3], [4]]);
   * return M.vcat(B);
   */
  vcat(B) { }

  /**
   * Get the transpose
   * @returns {Matrix} - M'
   * @example
   * const m = new eig.Matrix([[0, 1], [3, 0]]);
   * return m.transpose();
   */
  tranpose() { }

  /**
   * Transpose in place
   * @returns {Matrix} - this (M')
   * @example
   * const m = new eig.Matrix([[0, 1], [3, 0]]);
   * m.transpose();
   * return m;
   */
  transposeSelf() { }

  /**
   * Get the inverse of a square matrix
   * The inverse is the matrix Minv such that M * Minv = In
   * With In the n * n identity matrix
   * @warning The matrix must be square and invertible (full rank)
   * @returns {Matrix} - The inverse
   * @example
   * const m = new eig.Matrix([[4, 9], [3, 7]]);
   * return m.inverse();
   */
  inverse() { }

  /**
   * Create a m * n identity matrix
   * @param {number} m - Rows count
   * @param {number} n - Columns count
   * @returns {Matrix} - m * n identity matrix
   * @example
   * return eig.Matrix.identity(2, 2);
   */
  static identity(m, n) { }

  /**
   * Create a m * n matrix filled with ones
   * @param {number} m - Rows count
   * @param {number} n - Columns count
   * @returns {Matrix} - m * n matrix filled with ones
   * @example
   * return eig.Matrix.ones(2, 3);
   */
  static ones(m, n) { }

  /**
   * Create a m * n matrix filled with some value
   * @param {number} m - Rows count
   * @param {number} n - Columns count
   * @param {number} val - Value to fill the matrix with
   * @returns {Matrix} - m * n matrix filled with val
   * @example
   * return eig.Matrix.constant(2, 3, 3 / 2);
   */
  static constant(m, n, val) { }

  /**
   * Create a m * n random matrix
   * @param {number} m - Rows count
   * @param {number} n - Columns count
   * @returns {Matrix} - m * n random matrix
   * @example
   * return eig.Matrix.random(3, 2);
   */
  static random(m, n) { }

  /**
   * Create a diagonal matrix from a vector
   * @param {Matrix} vec - Vector from which to populate the diagonal
   * @returns {Matrix} - Diagonal matrix
   * @example
   * const vec = new eig.Matrix([1, 2, 3]);
   * return eig.Matrix.diagonal(vec);
   */
  static diagonal(vec) { }

  /**
   * Create a matrix from an array
   * A 1D array will create a column vector
   * A 2D array will create a matrix
   * @param {Array} arr - 1D or 2D array to build matrix from
   * @returns {Matrix} - Matrix initialized from the array
   * @example
   * return new eig.Matrix([[1, 2], [3, 4]]);
   */
  static fromArray(arr) { }
}

export { Matrix }