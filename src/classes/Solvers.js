/**
 * A class containing a few useful solver utilities
 */
class Solvers {
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
   * A' P + P A - P B Rinv B' P + Q = 0
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

  /**
   * Solve quadratic program of the form
   * Min 0.5 x' P x + q' x
   * Suject to l <= Ax <= u
   * Using operator splitting quadratic programming https://osqp.org/docs/
   * @warning The problem needs to be convex
   * @param {SparseMatrix} P - Quadratic cost matrix
   * @param {Matrix} q - Linear cost vector
   * @param {SparseMatrix} A - Linear constraint matrix
   * @param {Matrix} l - Linear constraint lower bound
   * @param {Matrix} u - Linear constraint upper bound
   * @example
   * // Let's minimize 0.5 x' P x + q' x
   * // Suject to l <= Ax <= u
   * // With P = [[4, 1], [0, 2]]; q = [1, 1]
   * // And A = [[1, 1], [1, 0], [0, 1]] 
   * // l = [1, 0, 0]; u = [1, 0.7, 0.7];
   * const P = eig.SparseMatrix.fromTriplets(2, 2, [
   *  [0, 0, 4], [0, 1, 1], [1, 1, 2]
   * ]);
   * const A = eig.SparseMatrix.fromTriplets(3, 2, [
   *  [0, 0, 1], [0, 1, 1], [1, 0, 1], [2, 1, 1]
   * ]);
   * const q = eig.Matrix.fromArray([1, 1])
   * const l = eig.Matrix.fromArray([1, 0, 0])
   * const u = eig.Matrix.fromArray([1, 0.7, 0.7])
   * return eig.QuadProgSolver.solve(P, q, A, l, u);
   */
  static quadProgSolve(P, q, A, l, u) { }
}