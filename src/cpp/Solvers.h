#ifndef SOLVERS_H
#define SOLVERS_H

#include <Eigen/Dense>
#include "DenseMatrix.h"
#include "CareSolver.h"
#include "SimplicialCholesky.h"
#ifndef NO_OSQP
#include "QuadProgSolver.h"
#endif

class Solvers
{
  using Matrix = Eigen::Matrix<double, Eigen::Dynamic, Eigen::Dynamic>;
  using DMD = DenseMatrix<double>;
  using CMD = DenseMatrix<std::complex<double>>;
  using SMD = SparseMatrix<double>;

public:
  /** 
   * SimplicialCholesky solver
   */
  static SimplicialCholesky<SMD, Eigen::SparseMatrix<double>> createSimplicialCholeskySolver(SMD &matrix) {
    return SimplicialCholesky<SMD, Eigen::SparseMatrix<double>>(matrix);
  }

  /**
   * Eigen solver
   */
  typedef struct {
    Eigen::ComputationInfo info;
    CMD eigenvalues;
    CMD eigenvectors;
  } EigenSolverResult;

  static EigenSolverResult eigenSolve(const DMD &matrix, bool computeEigenvectors = true)
  {
    // const EigenBase<InputType> &matrix
    Eigen::EigenSolver<Matrix> data = Eigen::EigenSolver<Matrix>(matrix.data, computeEigenvectors);
    // return EigenSolverResult(data);
    return (EigenSolverResult){
      .info = data.info(),
      .eigenvalues = CMD(data.eigenvalues()),
      .eigenvectors = CMD(data.eigenvectors())
    };
  };

  /**
   * Care solver 
   */
  static CareSolver::CareSolverResult careSolve(const DMD &A, const DMD &B, const DMD &Q, const DMD &R)
  {
    return CareSolver::solve(A, B, Q, R);
  };

  #ifndef NO_OSQP
  /**
   * Quadratic program solver
   */
  static DMD quadProgSolve(SMD &P, DMD &q, SMD &A, DMD &l, DMD &u) {
    return QuadProgSolver::solve(P, q, A, l, u);
  };
  #endif
};

#endif // SOLVERS_H