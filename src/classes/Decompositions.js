/**
 * A class containing various matrix decompositions algorithms
 */
class Decompositions {

  /**
   * Cholesky decomposition consists in decomposing a square, hermitian (or real symmetric), positive definite matrix A as a product A = L L*
   * Where L is lower triangular with real positive diagonal entries
   * @param {Matrix} M 
   * @returns {QRResult} - Result
   * @warning M must be positive definite
   * @example
   * const M = new eig.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
   * const cholesky = eig.Decompositions.cholesky(M);
   * return cholesky;
   */
  static cholesky(M) { }

  /**
   * LU decomposition consists in decomposing a square matrix A as a product A = L U
   * Where U is upper triangular L lower triangular
   * @param {Matrix} M 
   * @returns {QRResult} - Result
   * @warning M must be a square matrix
   * @example
   * const M = new eig.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
   * const lu = eig.Decompositions.lu(M);
   * return lu;
   */
  static lu(M) { }

  /**
   * QR decomposition consists in decomposing any n-by-p matrix A with linearly independent colums as a product A = Q R
   * Where Q is a m-by-m unitary matrix and R is a m-by-n upper triangular matrix
   * @param {Matrix} M 
   * @returns {QRResult} - Result
   * @example
   * const M = new eig.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
   * const qr = eig.Decompositions.qr(M);
   * return qr;
   */
  static qr(M) { }

  /**
   * SVD decomposition consists in decomposing any n-by-p matrix A as a product M = U S V'
   * Where U is a n-by-n unitary, V is a p-by-p unitary, and S is a n-by-p real positive diagonal matrix
   * Singular values are always sorted in decreasing order.
   * The algorithm used is a two-sided jacobi SVD decomposition of rectangular matrices for small matrices (< 16x16), or bidiagonal divide and conquer SVD for large ones.
   * @param {Matrix} M - Matrix of interest
   * @param {boolean} thin - Only keep the non-zero singular values
   * @returns {SVDResult} - Result
   * @example
   * const M = new eig.Matrix([[1, 2, 3], [4, 5, 6]]);
   * const svd = eig.Decompositions.svd(M, true);
   * return svd;
   */
  static svd(M, thin) { }
}