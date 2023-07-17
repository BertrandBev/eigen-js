#include <Eigen/Sparse>
#include <vector>
#include <iostream>
#include <chrono>
#include <DenseMatrix.h>
#include "Tutorial_sparse_example_details.hpp"

typedef Eigen::SparseMatrix<double> SpMat; // declares a column-major sparse matrix type of double
typedef Eigen::Triplet<double> T;

void buildProblem(std::vector<T>& coefficients, Eigen::VectorXd& b, int n);
void prinMatrixVector(const char *title, Eigen::VectorXd &arr);

void testSimplicialCholesky() {
  auto start = std::chrono::steady_clock::now();
  
  int n = 10;  // size of the image
  int m = n*n;  // number of unknows (=number of pixels)

  // Assembly:
  std::vector<T> coefficients;            // list of non-zeros coefficients
  Eigen::VectorXd b(m);                   // the right hand side-vector resulting from the constraints
  buildProblem(coefficients, b, n);

  SpMat A(m,m);
  A.setFromTriplets(coefficients.begin(), coefficients.end());

  // Solving:
  Eigen::SimplicialCholesky<SpMat> chol(A);  // performs a Cholesky factorization of A
  
  auto solverStart = std::chrono::steady_clock::now();
  
  Eigen::VectorXd x = chol.solve(b);         // use the factorization to solve for the given right hand side

  auto end = std::chrono::steady_clock::now();

  prinMatrixVector("X = ", x);

  std::cout << "SimplicalCholesky test elapsed time "
      << std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count()
      << " ns" << std::endl;
  std::cout << "Solver time "
      << std::chrono::duration_cast<std::chrono::nanoseconds>(end - solverStart).count()
      << " ns" << std::endl;
}
