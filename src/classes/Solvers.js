/**
 * A class containing a few useful solver utilities
 */
class Solvers {
  /**
   * SVD decomposition consists in decomposing any n-by-p matrix A as a product M = U S V'
   * Where U is a n-by-n unitary, V is a p-by-p unitary, and S is a n-by-p real positive diagonal matrix
   * Singular values are always sorted in decreasing order.
   * The algorithm used is a two-sided jacobi SVD decomposition of rectangular matrices for small matrices (< 16x16), or bidiagonal divide and conquer SVD for large ones.
   * @param {Matrix} M - Matrix of interest
   * @param {boolean} thin - Only keep the non-zero singular values
   * @returns {SVDResult} - Result
   * @example
   * const M = eig.Matrix.fromArray([[1, 2, 3], [4, 5, 6]]);
   * const svd = eig.Solvers.svd(M, true);
   * return svd;
   */
  static svd(M, thin) { }

  /**
   * Find the eigenvalues of a given matrix
   * Optionally, compute a set of normalized eigenvectors
   * @param {Matrix} M - Matrix of interest
   * @param {boolean} computeEigenvectors - Whether to compute eigenvectors
   * @returns {EigenSolverResult} - Result of the solver
   * @example
   * const M = eig.Matrix.fromArray([[8, 3], [2, 7]]);
   * const result = eig.Solvers.eigenSolve(M, true);
   * delete result.info
   * return result
   */
  static eigenSolve(M, computeEigenvectors) { }

  /**
   * Solve a continuous time algebraic Riccati equation of the form
   * A'*P + P*A - P*B*Rinv*B'*P + Q = 0
   * @param {Matrix} A - State matrix
   * @param {Matrix} B - Input matrix
   * @param {Matrix} Q - Quadratic state cost matrix
   * @param {Matrix} R - Quadratic input cost matrix
   * @returns {CareSolverResult} - Result of the solver
   * @example
   * // Finds the optimal linear quadratic regulator controller of an inverted pendulum 
   * // The state-space dynamic of the pendulum linearized about the upside down state is
   * // xDot = A*x + B*u
   * // With x = [theta, thetaDot]
   * // And dThetaDot/dt = -(m*g*l*sin(theta) + u)/ml^2
   * // Here, we take m = 1, l = 1, g = 10
   * const A = eig.Matrix.fromArray([[0, 1], [-10, 0]])
   * const B = eig.Matrix.fromArray([0, 1])
   * const Q = eig.Matrix.identity(2, 2).mul(10)
   * const R = eig.Matrix.identity(1, 1)
   * 
   * // Solve the CARE equation
   * const result = eig.Solvers.careSolve(A, B, Q, R)
   * delete result.info
   * return result
   */
  static careSolve(A, B, Q, R) { }
}