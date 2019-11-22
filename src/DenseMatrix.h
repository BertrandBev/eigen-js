#ifndef DENSE_MATRIX_H
#define DENSE_MATRIX_H

#include <iostream>
#include <vector>
#include <Eigen/Dense>

using namespace Eigen;
using namespace std;
// using emscripten::val = void (*)(void);

template <typename T>
class DenseMatrix
{
protected:
  // member
  // static emscripten::val callback; // TODO: clear
  void assertVector() const
  {
    assert((rows() == 1 || cols() == 1) && "The matrix must be a vector");
  }

public:
  Matrix<T, Dynamic, Dynamic> data;
  typedef vector<vector<double>> Vector2d;

  DenseMatrix(int m, int n)
  {
    data = Matrix<T, Dynamic, Dynamic>::Zero(m, n);
  }

  DenseMatrix(const Matrix<T, Dynamic, Dynamic> &data_) : data(data_)
  {
  }

  DenseMatrix(const DenseMatrix<T> &B) : data(B.copy())
  {
  }

  DenseMatrix<T> &operator=(const Matrix<T, Dynamic, Dynamic> &data_)
  {
    if (&data != &data_)
      data = data_;

    return *this;
  }

  DenseMatrix<T> &operator=(const DenseMatrix<T> &B)
  {
    if (this != &B)
      data = B.copy();

    return *this;
  }

  DenseMatrix<T> transpose() const
  {
    return DenseMatrix<T>(data.transpose());
  }

  DenseMatrix<T> conjugate() const
  {
    return DenseMatrix<T>(data.conjugate());
  }

  int rows() const
  {
    return (int)data.rows();
  }

  int cols() const
  {
    return (int)data.cols();
  }

  double norm(int n) const
  {
    if (n == 0)
      return data.template lpNorm<Infinity>();
    else if (n == 1)
      return data.template lpNorm<1>();
    return data.norm();
  }

  double rank() const
  {
    ColPivHouseholderQR<Matrix<T, Dynamic, Dynamic>> qr(data);
    return qr.rank();
  }

  T sum() const
  {
    return data.sum();
  }

  DenseMatrix<T> block(int i, int j, int di, int dj) const
  {
    return DenseMatrix<T>(data.block(i, j, di, dj));
  }

  Matrix<T, Dynamic, Dynamic> copy() const
  {
    return data;
  }

  Matrix<T, Dynamic, Dynamic> &toEigen()
  {
    return data;
  }

  DenseMatrix<T> operator*(const T &s)
  {
    return DenseMatrix<T>(data * s);
  }

  DenseMatrix<T> operator/(const T &s)
  {
    return DenseMatrix<T>(data / s);
  }

  DenseMatrix<T> operator+(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data + B->data);
  }

  DenseMatrix<T> operator-(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data - B->data);
  }

  DenseMatrix<T> operator*(const DenseMatrix<T> *B)
  {
    return DenseMatrix<T>(data * B->data);
  }

  DenseMatrix<T> operator-()
  {
    return DenseMatrix<T>(data * T(-1.0));
  }

  // void operator*=(const T &s)
  // {
  //   data *= s;
  // }

  // void operator+=(DenseMatrix<T> *B)
  // {
  //   data += B->data;
  // }

  // void operator-=(DenseMatrix<T> *B)
  // {
  //   data -= B->data;
  // }

  T get(int r, int c) const
  {
    return data(r, c);
  }

  void set(int r, int c, const T &s)
  {
    data(r, c) = s;
  }

  /**
   * Vector ops
   */

  T vGet(int r) const
  {
    assertVector();
    return cols() == 1 ? data(r, 0) : data(0, r);
  }

  void vSet(int r, const T &s)
  {
    assertVector();
    *(cols() == 1 ? &data(r, 0) : &data(0, r)) = s;
  }

  T dot(const DenseMatrix<T> &B) const
  {
    assertVector();
    return (cols() == 1 ? B.data * data : data * B.data)(0, 0);
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

  void print(const string title = "") const
  {
    if (title.length())
    {
      cout << title << endl;
    }
    const int rows = data.rows();
    const int cols = data.cols();
    for (int i = 0; i < rows; i++)
    {
      printf(i == 0 ? "[[" : " [");
      for (int j = 0; j < cols; j++)
      {
        if (std::is_same<T, complex<double>>::value)
        {
          printf("%.2f + %.2fi", real(get(i, j)), imag(get(i, j)));
        }
        else
        {
          printf("%.2f", real(get(i, j)));
        }
        printf(j < cols - 1 ? ", " : "");
      }
      printf((i < rows - 1 ? "]" : "]]"));
      printf("\n");
    }
  }

  // static void setCallback(emscripten::val cb)
  // {
  //   DenseMatrix::callback = cb;
  // }

  static DenseMatrix<T> identity(int m, int n)
  {
    return DenseMatrix<T>(Matrix<T, Dynamic, Dynamic>::Identity(m, n));
  }

  static DenseMatrix<T> ones(int m, int n)
  {
    return DenseMatrix<T>(Matrix<T, Dynamic, Dynamic>::Ones(m, n));
  }

  static DenseMatrix<T> constant(int m, int n, const T &x)
  {
    return DenseMatrix<T>(Matrix<T, Dynamic, Dynamic>::Constant(m, n, x));
  }

  static DenseMatrix<T> random(int m, int n)
  {
    return DenseMatrix<T>(Matrix<T, Dynamic, Dynamic>::Random(m, n));
  }

  static DenseMatrix<T> fromVector(const Vector2d &v)
  {
    const size_t m = v.size();
    const size_t n = m > 0 ? v[0].size() : 0;
    Matrix<T, Dynamic, Dynamic> mat(m, n);
    for (size_t i = 0; i < m; i++)
    {
      assert(v[i].size() == n && "All the rows must have the same size");
      for (size_t j = 0; j < n; j++)
      {
        mat(i, j) = v[i][j];
      }
    }
    return mat;
  }
};

// template <typename T>
// emscripten::val DenseMatrix<T>::callback = emscripten::val::null();

#endif // DENSE_MATRIX