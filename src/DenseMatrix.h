#ifndef DENSE_MATRIX_H
#define DENSE_MATRIX_H

#include <iostream>
#include <vector>
#include <Eigen/Dense>

template <typename T>
class DenseMatrix
{
  using Mat = Eigen::Matrix<T, Eigen::Dynamic, Eigen::Dynamic>;
  using Vector2d = std::vector<std::vector<T>>;

protected:
  void assertVector(DenseMatrix &M) const
  {
    assert((M.rows() == 1 || M.cols() == 1) && "The matrix must be a vector");
  }

  void assertVector() const
  {
    assert((rows() == 1 || cols() == 1) && "The matrix must be a vector");
    // return assertVector(*this);
  }

public:
  Mat data;

  DenseMatrix() {
    data = Mat();
  }

  DenseMatrix(int m, int n)
  {
    data = Mat::Zero(m, n);
  }

  DenseMatrix(const Mat &data_) : data(data_)
  {
  }

  DenseMatrix(const DenseMatrix<T> &B) : data(B.copy())
  {
  }

  // DenseMatrix<T> &operator=(const Mat &data_)
  // {
  //   if (&data != &data_)
  //     data = data_;

  //   return *this;
  // }

  // DenseMatrix<T> &operator=(const DenseMatrix<T> &B)
  // {
  //   if (this != &B)
  //     data = B.copy();

  //   return *this;
  // }

  int rows() const
  {
    return (int)data.rows();
  }

  int cols() const
  {
    return (int)data.cols();
  }

  T get(int i, int j) const
  {
    return data(i, j);
  }

  void set(int i, int j, const T &s)
  {
    data(i, j) = s;
  }

  int length() const
  {
    assertVector();
    return std::max(rows(), cols());
  }

  T vGet(int i) const
  {
    assertVector();
    return cols() == 1 ? data(i, 0) : data(0, i);
  }

  void vSet(int i, const T &s)
  {
    assertVector();
    *(cols() == 1 ? &data(i, 0) : &data(0, i)) = s;
  }

  T dot(const DenseMatrix<T> &B) const
  {
    assert(length() == B.length() && "The two matrices must be same length vectors");
    double dot = 0;
    for (int k = 0; k < length(); k++)
      dot += vGet(k) * B.vGet(k);
    return dot;
  }

  double norm() const
  {
    return data.norm();
  }

  double normSqr() const
  {
    return data.squaredNorm();
  }

  double l1Norm() const
  {
    return data.template lpNorm<1>();
  }

  double lInfNorm() const
  {
    return data.template lpNorm<Eigen::Infinity>();
  }

  double rank() const
  {
    Eigen::ColPivHouseholderQR<Mat> qr(data);
    return qr.rank();
  }

  double det() const
  {
    return data.determinant();
  }

  T sum() const
  {
    return data.sum();
  }

  DenseMatrix<T> block(int i, int j, int di, int dj) const
  {
    return DenseMatrix<T>(data.block(i, j, di, dj));
  }

  void setBlock(int i, int j, DenseMatrix<T> &block)
  {
    assert(rows() >= i + block.rows() && cols() >= j + block.cols() && "The matrix doens't fit");
    for (int ii = 0; ii < block.rows(); ii++)
    {
      for (int jj = 0; jj < block.cols(); jj++)
      {
        data(i + ii, j + jj) = block.data(ii, jj);
      }
    }
  }

  Mat copy() const
  {
    return data;
  }

  Mat &toEigen()
  {
    return data;
  }

  DenseMatrix<T> mul(const T &s)
  {
    return DenseMatrix<T>(data * s);
  }

  void mulSelf(const T &s)
  {
    data *= s;
  }

  DenseMatrix<T> div(const T &s)
  {
    return DenseMatrix<T>(data / s);
  }

  void divSelf(const T &s)
  {
    data /= s;
  }

  DenseMatrix<T> matAdd(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data + B->data);
  }

  void matAddSelf(const DenseMatrix<T> *B)
  {
    data += B->data;
  }

  DenseMatrix<T> matSub(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data - B->data);
  }

  void matSubSelf(const DenseMatrix<T> *B)
  {
    data -= B->data;
  }

  DenseMatrix<T> matMul(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data * B->data);
  }

  void matMulSelf(const DenseMatrix<T> *B)
  {
    data *= B->data;
  }

  DenseMatrix<T> hcat(DenseMatrix<T> *B)
  {
    int m = data.rows();
    int n1 = data.cols();
    int n2 = B->data.cols();
    DenseMatrix<T> C(m, n1 + n2);

    for (int i = 0; i < m; i++)
    {
      for (int j = 0; j < n1; j++)
      {
        C.set(i, j, data(i, j));
      }

      for (int j = 0; j < n2; j++)
      {
        C.set(i, n1 + j, B->data(i, j));
      }
    }

    return C;
  }

  DenseMatrix<T> vcat(DenseMatrix<T> *B)
  {
    int m1 = data.rows();
    int m2 = B->data.rows();
    int n = data.cols();
    DenseMatrix<T> C(m1 + m2, n);

    for (int j = 0; j < n; j++)
    {
      for (int i = 0; i < m1; i++)
      {
        C.set(i, j, data(i, j));
      }

      for (int i = 0; i < m2; i++)
      {
        C.set(m1 + i, j, B->data(i, j));
      }
    }

    return C;
  }

  DenseMatrix<T> transpose() const
  {
    return DenseMatrix<T>(data.transpose());
  }

  DenseMatrix<T> &transposeSelf()
  {
    std::cout << "working on: " << this << " data: " << &data << std::endl;
    data.transposeInPlace();
    return *this;
  }

  DenseMatrix<T> inverse() const
  {
    return DenseMatrix<T>(data.inverse());
  }

  DenseMatrix<T> conjugate() const
  {
    return DenseMatrix<T>(data.conjugate());
  }

  DenseMatrix<T> clamp(T lo, T hi)
  {
    DenseMatrix<T> clamped = DenseMatrix<T>(data);
    for (int i = 0; i < rows(); i++)
      for (int j = 0; j < cols(); j++)
        clamped.data(i, j) = std::max(lo, std::min(hi, clamped.data(i, j)));
    return clamped;
  }

  void print(const std::string title = "") const
  {
    if (title.length())
      std::cout << title << std::endl;
    const int rows = data.rows();
    const int cols = data.cols();
    for (int i = 0; i < rows; i++)
    {
      printf(i == 0 ? "[[" : " [");
      for (int j = 0; j < cols; j++)
      {
        if (std::is_same<T, std::complex<double>>::value)
        {
          printf("%.2f + %.2fi", std::real(get(i, j)), std::imag(get(i, j)));
        }
        else
        {
          printf("%.2f", std::real(get(i, j)));
        }
        printf(j < cols - 1 ? ", " : "");
      }
      printf((i < rows - 1 ? "]" : "]]"));
      printf("\n");
    }
  }

  static DenseMatrix<T> identity(int m, int n)
  {
    return DenseMatrix<T>(Mat::Identity(m, n));
  }

  static DenseMatrix<T> ones(int m, int n)
  {
    return DenseMatrix<T>(Mat::Ones(m, n));
  }

  static DenseMatrix<T> constant(int m, int n, const T &x)
  {
    return DenseMatrix<T>(Mat::Constant(m, n, x));
  }

  static DenseMatrix<T> random(int m, int n)
  {
    return DenseMatrix<T>(Mat::Random(m, n));
  }

  static DenseMatrix<T> diagonal(const DenseMatrix<T> vector)
  {
    int n = vector.length();
    DenseMatrix<T> mat(n, n);
    for (int k = 0; k < n; k++) {
      mat.set(k, k, vector.vGet(k));
    }
    return mat;
  }

  static DenseMatrix<T> fromVector(const Vector2d &v)
  {
    const size_t m = v.size();
    const size_t n = m > 0 ? v[0].size() : 0;
    Mat mat(m, n);
    for (size_t i = 0; i < m; i++)
    {
      assert(v[i].size() == n && "All the rows must have the same size");
      for (size_t j = 0; j < n; j++)
        mat(i, j) = v[i][j];
    }
    return mat;
  }
};

#endif // DENSE_MATRIX