#pragma once

#include <Eigen/Sparse>
#include <Eigen/SparseCholesky>	
#include "DenseMatrix.h"

template <typename MatrixWrapType, typename MatrixType>
class SimplicialCholesky
{
public:
  SimplicialCholesky(const MatrixWrapType &m): m_(&m.data) {
    data = new Eigen::SimplicialCholesky<MatrixType>( *m_ );
  }

  SimplicialCholesky(const SimplicialCholesky<MatrixWrapType, MatrixType> &s) {
    m_ = s.m_;
    data = new Eigen::SimplicialCholesky<MatrixType>(*m_);
  }

  ~SimplicialCholesky() {
    delete data;
  }

  SimplicialCholesky& operator=(const SimplicialCholesky& s) {
    if (data) {
      delete data;
    }
    m_ = s.m_;
    data = new Eigen::SimplicialCholesky<MatrixType>(*m_);
  }

  DenseMatrix<double> solve(DenseMatrix<double> &y) {
    return DenseMatrix<double>(data->solve(y.data));
  }

protected:
  
  Eigen::SimplicialCholesky<MatrixType> *data;
  const MatrixType *m_;

};