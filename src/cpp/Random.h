#ifndef RANDOM_H
#define RANDOM_H

#include <stdlib.h>  /* srand, rand */
#include <Eigen/Dense>
#include "DenseMatrix.h"
#include "CareSolver.h"
#include "contrib/multivariateNormal.h"


class Seed {
public:
  Seed() {
    std::srand(time(NULL)); // Seed the random number generator
  }

  uint64_t get() {
    return std::rand();
  }
};

class Random
{
  using Matrix = Eigen::Matrix<double, Eigen::Dynamic, Eigen::Dynamic>;
  using DMD = DenseMatrix<double>;
  static Seed seed;

public:
  /**
   * Eigen solver
   */
  typedef struct {
    Eigen::ComputationInfo info;
  } EigenSolverResult;

  static DMD normal(const DMD &mean, const DMD &cov, int samples)
  {
    Eigen::EigenMultivariateNormal<double> emn(mean.data, cov.data, false, seed.get());
    Matrix res = emn.samples(samples);
    return DMD(res);
  };
};

#endif // RANDOM_H