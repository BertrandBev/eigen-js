#ifndef SPARSE_MATRIX_H
#define SPARSE_MATRIX_H

#include <Eigen/Sparse>
// #include <Eigen/SparseCholesky>	
// #include<Eigen/SparseLU>	
// #include<Eigen/SparseQR>	
// #include <Eigen/Dense>
#include "DenseMatrix.h"
#include "SimplicialCholesky.h"

template <typename T>
class TripletVector;

template <typename T>
class SparseMatrix
{
public:
  SparseMatrix(int m, int n) {
    data = Eigen::SparseMatrix<T>(m, n);
  }

  SparseMatrix(int m, int n, TripletVector<T> *tripletVector) : data(m, n)
  {
    std::vector<Eigen::Triplet<T>> &eigenTriplet = tripletVector->data;
    data.setFromTriplets(eigenTriplet.begin(), eigenTriplet.end());
  }

  SparseMatrix(const Eigen::SparseMatrix<T> &data_) : data(data_)
  {
  }

  SparseMatrix(const SparseMatrix<T> &B) : data(B.copy())
  {
  }

  SparseMatrix<T> &operator=(const Eigen::SparseMatrix<T> &data_)
  {
    if (&data != &data_)
    {
      // factorization.clear();
      data = data_;
    }

    return *this;
  }

  SparseMatrix<T> &operator=(const SparseMatrix<T> &B)
  {
    if (this != &B)
    {
      // factorization.clear();
      data = B.copy();
    }

    return *this;
  }

  static SparseMatrix<T> identity(int m, int n)
  {
    Eigen::SparseMatrix<T> id(m, n);
    id.setIdentity();

    return SparseMatrix<T>(id);
  }

  static SparseMatrix<T> diag(const DenseMatrix<T> &d)
  {
    TripletVector<T> triplet(d.rows());
    for (int i = 0; i < d.rows(); i++)
      triplet.add(i, i, d.get(i, 0));

    return SparseMatrix<T>(d.rows(), d.rows(), &triplet);
  }

  SparseMatrix<T> transpose() const
  {
    return SparseMatrix<T>(data.transpose());
  }

  SparseMatrix<T> conjugate() const
  {
    return SparseMatrix<T>(data.conjugate());
  }

  int rows() const
  {
    return (int)data.rows();
  }

  int cols() const
  {
    return (int)data.cols();
  }

  int nonZeros() const
  {
    return (int)data.nonZeros();
  }

  T *valuePtr()
  {
    return data.valuePtr();
  }

  int *innerIndexPtr()
  {
    return data.innerIndexPtr();
  }

  int *outerIndexPtr()
  {
    return data.outerIndexPtr();
  }

  double frobeniusNorm() const
  {
    return data.norm();
  }

  SparseMatrix<T> block(int r0, int r1, int c0, int c1) const
  {
    return SparseMatrix<T>(data.block(r0, c0, r1 - r0, c1 - c0));
  }

  DenseMatrix<T> toDense() const
  {
    return DenseMatrix<T>(Eigen::Matrix<T, Eigen::Dynamic, Eigen::Dynamic>(data));
  }

  Eigen::SparseMatrix<T> copy() const
  {
    return data;
  }

  Eigen::SparseMatrix<T> &toEigen()
  {
    return data;
  }

  SparseMatrix<T> mul(const T &s)
  {
    return SparseMatrix<T>(data * s);
  }

  void mulSelf(const T &s)
  {
    data *= s;
    // factorization.clearNumeric();
  }

  SparseMatrix<T> div(const T &s)
  {
    return SparseMatrix<T>(data / s);
  }

  void divSelf(const T &s)
  {
    data /= s;
    // factorization.clearNumeric();
  }

  SparseMatrix<T> matAdd(SparseMatrix<T> *B)
  {
    return SparseMatrix<T>(data + B->data);
  }

  void matAddSelf(SparseMatrix<T> *B)
  {
    data += B->data;
    // factorization.clear();
  }

  SparseMatrix<T> matSub(SparseMatrix<T> *B)
  {
    return SparseMatrix<T>(data - B->data);
  }

  void matSubSelf(SparseMatrix<T> *B)
  {
    data -= B->data;
    // factorization.clear();
  }

  SparseMatrix<T> matMul(SparseMatrix<T> *B)
  {
    return SparseMatrix<T>(data * B->data);
  }

  DenseMatrix<T> vecMul(DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data * B->data);
  }

  T get(int i, int j)
  {
    return data.coeffRef(i, j);
  }

  void set(int i, int j, const T &s)
  {
    data.coeffRef(i, j) = s;
  }

  // void matMulSelf(SparseMatrix<T> &B)
  // {
  //   data *= B.data;
  //   // factorization.clear();
  // }

  // Eigen::SparseCholesky<T> *chol()
  // {
  //   return &factorization.llt;
  // }

  // Eigen::SparseLU<T> *lu()
  // {
  //   return &factorization.lu;
  // }

  // Eigen::SparseQR<T> *qr()
  // {
  //   return &factorization.qr;
  // }

  void print(const std::string title = "")
  {
    if (title.length())
    {
      std::cout << title << std::endl;
    }
    const int rows = data.rows();
    const int cols = data.cols();
    for (int i = 0; i < rows; i++)
    {
      printf(i == 0 ? "[[" : " [");
      for (int j = 0; j < cols; j++)
      {
        printf("%.2f", get(i, j));
        printf(j < cols - 1 ? ", " : "");
      }
      printf((i < rows - 1 ? "]" : "]]"));
      printf("\n");
    }
  }

protected:
  // members
  // Eigen::SparseFactorization<T> factorization;
  
  friend class SimplicialCholesky<SparseMatrix<T>, Eigen::SparseMatrix<T>>;

  Eigen::SparseMatrix<T> data;
};

template <typename T>
class TripletVector
{
public:
  TripletVector(int capacity)
  {
    data.reserve(capacity);
  }

  void add(int i, int j, const T &x)
  {
    if (x > 1e-8 || x < -1e-8)
      data.push_back(Eigen::Triplet<T>(i, j, x));
  }

  void addBlock(int i, int j, const DenseMatrix<T> &mat)
  {
    for (int ii = 0; ii < mat.rows(); ii++)
      for (int jj = 0; jj < mat.cols(); jj++)
        add(i + ii, j + jj, mat.get(ii, jj));
  }

  void addDiag(int i, int j, const DenseMatrix<T> &diag)
  {
    assert(diag.cols() == 1 && "The input matrix must be a vector");
    for (int k = 0; k < diag.rows(); k++)
      add(i + k, j + k, diag.get(k, 0));
  }

protected:
  std::vector<Eigen::Triplet<T>> data;
  friend SparseMatrix<T>;
};

#endif // SPARSE_MATRIX_H
