#ifndef DECOMPOSITIONS_H
#define DECOMPOSITIONS_H

#include <Eigen/Dense>
#include "DenseMatrix.h"
#include "CareSolver.h"

class Decompositions
{
  using Matrix = Eigen::Matrix<double, Eigen::Dynamic, Eigen::Dynamic>;
  using DMD = DenseMatrix<double>;
  using CMD = DenseMatrix<std::complex<double>>;

public:
  /**
   * Decompositions
   */
  typedef struct
  {
    DMD L;
  } CholeskyResult;

  static CholeskyResult cholesky(const DMD &M)
  {
    Eigen::LLT<Matrix> llt(M.data);
    return (CholeskyResult){
      .L = DMD(llt.matrixL())
    };
  };

  typedef struct
  {
    DMD L;
    DMD U;
    DMD P;
    DMD Q;
  } LUResult;

  static LUResult lu(const DMD &M)
  {
    Eigen::FullPivLU<Matrix> lu(M.data);
    return (LUResult){
        .L = DMD(lu.matrixLU().triangularView<Eigen::StrictlyLower>()),
        .U = DMD(lu.matrixLU().triangularView<Eigen::Upper>()),
        .P = DMD(lu.permutationP()),
        .Q = DMD(lu.permutationQ()),
    };
  };

  typedef struct
  {
    DMD Q;
    DMD R;
  } QRResult;

  static QRResult qr(const DMD &M)
  { 
    Eigen::HouseholderQR<Matrix> qr(M.data);
    return (QRResult){
        .Q = DMD(qr.householderQ()),
        .R = DMD(qr.matrixQR().triangularView<Eigen::Upper>()),
    };
  };

  typedef struct
  {
    DMD sv;
    DMD U;
    DMD V;
  } SVDResult;

  static SVDResult svd(const DMD &M, bool thin)
  {
    Eigen::BDCSVD<Matrix> svd(M.data, thin ? (Eigen::ComputeThinU | Eigen::ComputeThinV) : (Eigen::ComputeFullU | Eigen::ComputeFullV));
    return (SVDResult){
        .sv = DMD(svd.singularValues()),
        .U = DMD(svd.matrixU()),
        .V = DMD(svd.matrixV())};
  };
};

#endif // DECOMPOSITIONS_H