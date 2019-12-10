#ifndef SOLVERS_H
#define SOLVERS_H

#include <Eigen/Dense>
#include "DenseMatrix.h"

class EigenSolver
{
  using Matrix = Eigen::Matrix<double, Eigen::Dynamic, Eigen::Dynamic>;

protected:
  Eigen::EigenSolver<Matrix> data;

public:
  explicit EigenSolver(const DenseMatrix<double> &matrix, bool computeEigenvectors = true)
  {
    // const EigenBase<InputType> &matrix
    data = Eigen::EigenSolver<Matrix>(matrix.data, computeEigenvectors);
  }

  Eigen::ComputationInfo info() const
  {
    return data.info();
  }

  const DenseMatrix<std::complex<double>> eigenvalues() const
  {
    return DenseMatrix<std::complex<double>>(data.eigenvalues());
  }

  const DenseMatrix<std::complex<double>> eigenvectors() const
  {
    return DenseMatrix<std::complex<double>>(data.eigenvectors());
  }
};

#endif // SOLVERS_H