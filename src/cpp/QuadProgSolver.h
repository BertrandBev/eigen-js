#ifndef QUADPROGSOLVER
#define QUADPROGSOLVER

#include <Eigen/Sparse>
#include "SparseMatrix.h"
#include "DenseMatrix.h"
#include "osqp.h"
#include <vector>

#define PRINT_MAT(name, M, size)     \
  printf("%s: [", name);             \
  for (int k = 0; k < (size); k++)   \
    printf("%.2f,", (double)(M)[k]); \
  printf("]\n");

class QuadProgSolver
{
  using T = Eigen::Triplet<double>;
  using DMD = DenseMatrix<double>;
  using SMD = SparseMatrix<double>;

public:
  // Minimize 0.5 xT.P.x + qT.x
  // Suject to l <= Ax <= u
  static DMD solve(SMD &P, DMD &q, SMD &A, DMD &l, DMD &u) {
    assert(P.rows() == P.cols() && "P must be a square matrix");
    assert(q.rows() == P.rows() && "q and P must have the same number of rows");
    assert(A.cols() == P.rows() && "A.cols must equal P.rows");
    assert(l.rows() == A.rows() && "l and A must have the same number of rows");
    assert(u.rows() == A.rows() && "u and A must have the same number of rows");


    int n = P.rows();
    int m = A.rows();
    csc *P_ = sparseToCSC(P);
    csc *A_ = sparseToCSC(A);
    double *q_ = denseToArray(q);
    double *l_ = denseToArray(l);
    double *u_ = denseToArray(u);

    // Workspace settings
    OSQPSettings settings;
    osqp_set_default_settings(&settings);
    // settings.max_iter = 10;
    settings.verbose = 0;

    OSQPData data = {
        .n = n,
        .m = m,
        .P = P_,
        .A = A_,
        .q = q_,
        .l = l_,
        .u = u_};

    OSQPWorkspace *work;
    int exitflag = osqp_setup(&work, &data, &settings);
    DMD x(n, 1);
    if (!exitflag)
    {
      osqp_solve(work);
      double *xArr = work->solution->x;
      for (int k = 0; k < n; k++)
        x.set(k, 0, xArr[k]);
        // x.print("solution");
      // PRINT_MAT("x", work->solution->x, n);
    }
    osqp_cleanup(work);
    // Free matrices
    free(P_); // Don't csc_free as sparse matrix pointers are being used
    free(A_); // Don't csc_free as sparse matrix pointers are being used
    free(q_);
    free(l_);
    free(u_);
    return x;
  }


  static void solveSparse()
  {
    TripletVector<double> tripletsP(3);
    tripletsP.add(0, 0, 4);
    tripletsP.add(0, 1, 1);
    tripletsP.add(1, 1, 2);
    SMD P(2, 2, &tripletsP);
    // P.data.setFromTriplets(triplets.begin(), triplets.end());

    TripletVector<double> tripletsA(4);
    tripletsA.add(0, 0, 1);
    tripletsA.add(0, 1, 1);
    tripletsA.add(1, 0, 1);
    tripletsA.add(2, 1, 1);
    SMD A(3, 2, &tripletsA);
    // A.data.setFromTriplets(triplets.begin(), triplets.end());

    // Get lists
    // const int nnz = mat.nonZeros();
    // PRINT_MAT("Values", mat.valuePtr(), nnz);
    // PRINT_MAT("Inner indices", mat.innerIndexPtr(), nnz);
    // const int nCols = mat.cols();
    // PRINT_MAT("Outer index ptr", mat.outerIndexPtr(), nCols + 1);

    // Build csc from matrix
    csc *P_csc = sparseToCSC(P);
    csc *A_csc = sparseToCSC(A);
    double q[2] = {1.0, 1.0};
    double l[3] = {1.0, 0.0, 0.0};
    double u[3] = {1.0, 0.7, 0.7};
    int n = 2;
    int m = 3;

    // Workspace settings
    OSQPSettings settings;
    osqp_set_default_settings(&settings);
    // settings.max_iter = 10;
    settings.verbose = 0;

    OSQPData data = {
        .n = n,
        .m = m,
        .P = P_csc,
        .A = A_csc,
        .q = q,
        .l = l,
        .u = u};

    OSQPWorkspace *work;
    int exitflag = osqp_setup(&work, &data, &settings);
    if (!exitflag)
    {
      osqp_solve(work);
      // PRINT_MAT("x", work->solution->x, n);
    }
    osqp_cleanup(work);
    // Free matrices
    c_free(P_csc);
    c_free(A_csc);
  }

  static double* denseToArray(DMD mat) {
    double *arr = (double *) malloc(mat.rows() * sizeof(double));
    for (int k = 0; k < mat.rows(); k++) {
      arr[k] = mat.get(k, 0);
    }
    return arr;
  }

  static csc *sparseToCSC(SMD &mat)
  {
    return csc_matrix(mat.rows(), mat.cols(), mat.nonZeros(), mat.valuePtr(), mat.innerIndexPtr(), mat.outerIndexPtr());
  }

  static void solveBasic()
  {
    // Load problem data
    // P = [[4, 1]
    //      [0, 2]]
    double P_x[3] = {4.0, 1.0, 2.0};
    int P_nnz = 3;
    int P_i[3] = {0, 0, 1};
    int P_p[3] = {0, 1, 3};
    double q[2] = {1.0, 1.0};
    // A = [[1 1
    //       1 0
    //       0 1]]
    double A_x[4] = {1.0, 1.0, 1.0, 1.0};
    int A_nnz = 4;
    int A_i[4] = {0, 1, 0, 2};
    int A_p[3] = {0, 2, 4};
    double l[3] = {1.0, 0.0, 0.0};
    double u[3] = {1.0, 0.7, 0.7};
    int n = 2;
    int m = 3;

    // Exitflag
    int exitflag = 0;

    // Workspace structures
    OSQPSettings settings;
    OSQPData data;

    // Populate data
    data.n = n;
    data.m = m;
    data.P = csc_matrix(data.n, data.n, P_nnz, P_x, P_i, P_p);
    data.q = q;
    data.A = csc_matrix(data.m, data.n, A_nnz, A_x, A_i, A_p);
    data.l = l;
    data.u = u;

    // Define solver settings as default
    osqp_set_default_settings(&settings);
    settings.alpha = 1.0; // Change alpha parameter
    // settings.max_iter = 10;
    settings.verbose = 0;

    // Setup workspace
    OSQPWorkspace *work;
    exitflag = osqp_setup(&work, &data, &settings);

    // Solve Problem
    osqp_solve(work);
    // PRINT_MAT("x", work->solution->x, n);

    // Cleanup
    osqp_cleanup(work);
    free(data.P);
    free(data.A);
    // return exitflag;
  }

  // private:
};

#endif // QUADPROGSOLVER