#ifndef QUADPROGSOLVER_H
#define QUADPROGSOLVER_H

#include <Eigen/Dense>
#include <QuadProg++.hh>
#include "DenseMatrix.h"
#include "Array.hh"
#undef inverse // fix array.hh inverse directive

// using namespace std;
// using namespace Eigen;

using DMD = DenseMatrix<double>;
using QMD = quadprogpp::Matrix<double>;
using QVD = quadprogpp::Vector<double>;

class QuadProgSolver
{
public:
  // The problem is in the form:
  // min 0.5 * x G x + g0 x
  // s.t.
  //  CE^T x + ce0 = 0
  //  CI^T x + ci0 >= 0
  // 
  // With
  //  x: n
  //  G: n * n; g0: n
  //  CE: n * p; ce0: p
  //  CI: n * m; ci0: m
  static double solve(DMD &G, DMD& g0, const DMD& CE, const DMD &ce0, const DMD &CI, const DMD &ci0, DMD &x) {
    int n = G.rows();
    int m = CE.cols();
    int p = CI.cols();
    assert(G.cols() == n && "G must be a square matrix");
    assert(g0.rows() == n && "g0 and G must have the same number of rows");
    assert(CE.rows() == n && "CE and G must have the same number of rows");
    assert(CE.cols() == std::max(ce0.rows(), ce0.cols()) && "CE and ce0 must have the same number of columns");
    assert(CI.rows() == n && "CI and G must have the same number of rows");
    assert(CI.cols() == std::max(ci0.rows(), ci0.cols()) && "CI and ci0 must have the same number of columns");
    QMD _G = getMatrix(G);
    QVD _g0 = getVector(g0);
    QMD _CE = getMatrix(CE);
    QVD _ce0 = getVector(ce0);
    QMD _CI = getMatrix(CI);
    QVD _ci0 = getVector(ci0);
    QVD _x = getVector(x);
    double res = quadprogpp::solve_quadprog(_G, _g0, _CE, _ce0, _CI, _ci0, _x);
    copy(_G, G);
    copy(_g0, g0);
    copy(_x, x);
    return res;
  }

private:
  static QMD getMatrix(const DMD &M) {
    QMD mat(M.rows(), M.cols());
    for (size_t i = 0; i < M.rows(); i++)
      for (size_t j =0; j < M.cols(); j++)
        mat[i][j] = M.get(i, j);
    return mat;
  }
  
  static QVD getVector(const DMD &V) {
    assert((V.rows() == 1 || V.cols() == 1) && "The matrix must be a vector");
    QVD vec(std::max(V.rows(), V.cols()));
    for (size_t k = 0; k < std::max(V.rows(), V.cols()); k++) {
      vec[k] = V.vGet(k);
    }
    return vec;
  }

  static void copy(const QMD &M, DMD &target) {
    assert(M.nrows() == target.rows() && M.ncols() == target.cols() && "Matrices must be the same size");
    for (size_t i = 0; i < M.nrows(); i++)
      for (size_t j =0; j < M.ncols(); j++)
        target.set(i, j, M[i][j]);
  }

  static void copy(const QVD &V, DMD &target) {
    assert(V.size() == std::max(target.rows(), target.cols())  && "Vectors must be the same size");
    for (size_t k = 0; k < V.size(); k++) {
      target.vSet(k, V[k]);
    }
  }
};

#endif // QUADPROGSOLVER_H