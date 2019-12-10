#ifndef CARE_H
#define CARE_H

#include <Eigen/Dense>
#include "DenseMatrix.h"

template <typename T1, typename T2>
bool isEqual(const Eigen::MatrixBase<T1> &m1,
             const Eigen::MatrixBase<T2> &m2,
             double tolerance)
{
  return (
      (m1.rows() == m2.rows()) &&
      (m1.cols() == m2.cols()) &&
      ((m1 - m2).template lpNorm<Eigen::Infinity>() <= tolerance));
}

class CareSolver
{
  using MatrixXd = Eigen::MatrixXd;
  using ComputationInfo = Eigen::ComputationInfo;

protected:
  DenseMatrix<double> _S = DenseMatrix<double>(0, 0);
  DenseMatrix<double> _K = DenseMatrix<double>(0, 0);
  ComputationInfo computationInfo;

public:
  CareSolver(const DenseMatrix<double> &A,
             const DenseMatrix<double> &B,
             const DenseMatrix<double> &Q,
             const DenseMatrix<double> &R)
  {
    solve(A.data, B.data, Q.data, R.data);
  }

  ComputationInfo info() const
  {
    return computationInfo;
  }

  DenseMatrix<double> S() const
  {
    return _S;
  }

  DenseMatrix<double> K() const
  {
    return _K;
  }

private:
  void solve(
      const MatrixXd &A,
      const MatrixXd &B,
      const MatrixXd &Q,
      const Eigen::LLT<MatrixXd> &R_cholesky)
  {
    const Eigen::Index n = B.rows(), m = B.cols();
    assert(A.rows() == n && A.cols() == n);
    assert(Q.rows() == n && Q.cols() == n);
    assert(R_cholesky.matrixL().rows() == m &&
           R_cholesky.matrixL().cols() == m);

    assert(isEqual(Q, Q.transpose(), 1e-10));

    MatrixXd H(2 * n, 2 * n);

    H << A, B * R_cholesky.solve(B.transpose()), Q, -A.transpose();

    MatrixXd Z = H;
    MatrixXd Z_old;

    // these could be options
    const double tolerance = 1e-9;
    const double max_iterations = 100;

    double relative_norm;
    size_t iteration = 0;

    const double p = static_cast<double>(Z.rows());

    do
    {
      Z_old = Z;
      // R. Byers. Solving the algebraic Riccati equation with the matrix sign
      // function. Linear Algebra Appl., 85:267–279, 1987
      // Added determinant scaling to improve convergence (converges in rough half
      // the iterations with this)
      double ck = std::pow(std::abs(Z.determinant()), -1.0 / p);
      Z *= ck;
      Z = Z - 0.5 * (Z - Z.inverse());
      relative_norm = (Z - Z_old).norm();
      iteration++;
    } while (iteration < max_iterations && relative_norm > tolerance);
    computationInfo = iteration == max_iterations ? ComputationInfo::NoConvergence : ComputationInfo::Success;

    MatrixXd W11 = Z.block(0, 0, n, n);
    MatrixXd W12 = Z.block(0, n, n, n);
    MatrixXd W21 = Z.block(n, 0, n, n);
    MatrixXd W22 = Z.block(n, n, n, n);

    MatrixXd lhs(2 * n, n);
    MatrixXd rhs(2 * n, n);
    MatrixXd eye = MatrixXd::Identity(n, n);
    lhs << W12, W22 + eye;
    rhs << W11 + eye, W21;

    Eigen::JacobiSVD<MatrixXd> svd(
        lhs, Eigen::ComputeThinU | Eigen::ComputeThinV);

    MatrixXd sol = svd.solve(rhs);
    _S = DenseMatrix<double>(sol);
    _K = DenseMatrix<double>(R_cholesky.solve(B.transpose() * sol));
  }

  void solve(
      const MatrixXd &A,
      const MatrixXd &B,
      const MatrixXd &Q,
      const MatrixXd &R)
  {
    assert(isEqual(R, R.transpose(), 1e-10));

    Eigen::LLT<MatrixXd> R_cholesky(R);
    if (R_cholesky.info() != Eigen::Success)
      throw std::runtime_error("R must be positive definite");
    solve(A, B, Q, R_cholesky);
  }
};

#endif // CARE_H