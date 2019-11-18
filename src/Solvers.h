#ifndef SOLVERS_H
#define SOLVERS_H

#include <Eigen/Dense>
#include "DenseMatrix.h"

using namespace std;
using namespace Eigen;

class EigenSolver2
{
protected:
  EigenSolver<Matrix<double, Dynamic, Dynamic>> data;

public:
  explicit EigenSolver2(const DenseMatrix<double> &matrix, bool computeEigenvectors = true)
  {
    // const EigenBase<InputType> &matrix
    data = EigenSolver<Matrix<double, Dynamic, Dynamic>>(matrix.data, computeEigenvectors);
  }

  ComputationInfo info() const
  {
    return data.info();
  }


  // typename EigenSolver<Matrix<double, Dynamic, Dynamic>>::EigenvectorsType eigenvectorsOld()
  // {
  //   return data.eigenvectors();
  // }

  // const typename EigenSolver<Matrix<double, Dynamic, Dynamic>>::EigenvalueType &eigenvaluesOld() const
  // {
  //   return data.eigenvalues();
  // }

  const DenseMatrix<complex<double>> eigenvalues() const
  {
    return DenseMatrix<complex<double>>(data.eigenvalues());
  }

  const DenseMatrix<complex<double>> eigenvectors() const
  {
    return DenseMatrix<complex<double>>(data.eigenvectors());
  }
};

#endif // SOLVERS_H