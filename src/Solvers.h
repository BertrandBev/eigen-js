#ifndef SOLVERS_H
#define SOLVERS_H

#include <Eigen/Dense>
#include "DenseMatrix.h"
#include "CareSolver.h"

class Solvers
{
  using Matrix = Eigen::Matrix<double, Eigen::Dynamic, Eigen::Dynamic>;
  using DMD = DenseMatrix<double>;
  using CMD = DenseMatrix<std::complex<double>>;

public:
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

  /**
   * Decompositions
   */
  typedef struct {
    DMD SingularValues;
    DMD U;
    DMD V;
  } SVDResult;

  static SVDResult svd(const DMD &M, bool thin) {
    Eigen::BDCSVD<Matrix> svd(M.data, thin ? (Eigen::ComputeThinU | Eigen::ComputeThinV) : (Eigen::ComputeFullU | Eigen::ComputeFullV));
    return (SVDResult) {
      .SingularValues = DMD(svd.singularValues()),
      .U = DMD(svd.matrixU()),
      .V = DMD(svd.matrixV())
    };
  };
};

#endif // SOLVERS_H