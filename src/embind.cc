#include <emscripten/bind.h>
#include <Eigen/Dense>
#include <vector>

#include "DenseMatrix.h"
#include "CareSolver.h"
#include "Solvers.h"

using namespace std;
using namespace emscripten;

EMSCRIPTEN_BINDINGS(Module)
{
  // Double vector
  emscripten::register_vector<double>("Vector");
  emscripten::register_vector<std::vector<double>>("Vector2d");

  // Complex numbers
  class_<complex<double>>("Complex")
      .constructor<double, double>();
  emscripten::function("real", select_overload<double(const complex<double> &)>(&real)); // TODO: extract in complex class
  emscripten::function("imag", select_overload<double(const complex<double> &)>(&imag)); // TODO: extract in complex class

  // Dense Matrix
  class_<DenseMatrix<double>>("DenseMatrix")
      .constructor<int, int>()
      .constructor<const DenseMatrix<double> &>()
      .class_function("identity", &DenseMatrix<double>::identity)
      .class_function("ones", &DenseMatrix<double>::ones)
      .class_function("constant", &DenseMatrix<double>::constant)
      .class_function("random", &DenseMatrix<double>::random)
      .class_function("setCallback", &DenseMatrix<double>::setCallback, allow_raw_pointers())
      .class_function("fromVector", &DenseMatrix<double>::fromVector)
      .function("transpose", &DenseMatrix<double>::transpose)
      .function("rows", &DenseMatrix<double>::rows)
      .function("cols", &DenseMatrix<double>::cols)
      .function("norm", &DenseMatrix<double>::norm)
      .function("rank", &DenseMatrix<double>::rank)
      .function("sum", &DenseMatrix<double>::sum)
      .function("subMatrix", select_overload<DenseMatrix<double>(int, int, int, int) const>(&DenseMatrix<double>::subMatrix))
      .function("scaleBy", &DenseMatrix<double>::operator*=, allow_raw_pointers())
      .function("incrementBy", &DenseMatrix<double>::operator+=, allow_raw_pointers())
      .function("decrementBy", &DenseMatrix<double>::operator-=, allow_raw_pointers())
      .function("timesReal", select_overload<DenseMatrix<double>(const double &)>(&DenseMatrix<double>::operator*))
      .function("timesDense", select_overload<DenseMatrix<double>(DenseMatrix<double> *)>(&DenseMatrix<double>::operator*), allow_raw_pointers())
      .function("plus", select_overload<DenseMatrix<double>(DenseMatrix<double> *)>(&DenseMatrix<double>::operator+), allow_raw_pointers())
      .function("minus", select_overload<DenseMatrix<double>(DenseMatrix<double> *)>(&DenseMatrix<double>::operator-), allow_raw_pointers())
      .function("negated", select_overload<DenseMatrix<double>()>(&DenseMatrix<double>::operator-))
      .function("get", &DenseMatrix<double>::get)
      .function("set", &DenseMatrix<double>::set)
      .function("hcat", &DenseMatrix<double>::hcat, allow_raw_pointers())
      .function("vcat", &DenseMatrix<double>::vcat, allow_raw_pointers())
      .function("print", &DenseMatrix<double>::print);

  // Complex Dense Matrix
  class_<DenseMatrix<complex<double>>>("ComplexDenseMatrix")
      .constructor<int, int>()
      .constructor<const DenseMatrix<complex<double>> &>()
      .class_function("identity", &DenseMatrix<complex<double>>::identity)
      .class_function("ones", &DenseMatrix<complex<double>>::ones)
      .class_function("constant", &DenseMatrix<complex<double>>::constant)
      .class_function("random", &DenseMatrix<complex<double>>::random)
      .function("transpose", &DenseMatrix<complex<double>>::transpose)
      .function("conjugate", &DenseMatrix<complex<double>>::conjugate)
      .function("rows", &DenseMatrix<complex<double>>::rows)
      .function("cols", &DenseMatrix<complex<double>>::cols)
      .function("norm", &DenseMatrix<complex<double>>::norm)
      .function("rank", &DenseMatrix<complex<double>>::rank)
      .function("sum", &DenseMatrix<complex<double>>::sum)
      .function("subMatrix", select_overload<DenseMatrix<complex<double>>(int, int, int, int) const>(&DenseMatrix<complex<double>>::subMatrix))
      .function("scaleBy", &DenseMatrix<complex<double>>::operator*=, allow_raw_pointers())
      .function("incrementBy", &DenseMatrix<complex<double>>::operator+=, allow_raw_pointers())
      .function("decrementBy", &DenseMatrix<complex<double>>::operator-=, allow_raw_pointers())
      .function("timesComplex", select_overload<DenseMatrix<complex<double>>(const complex<double> &)>(&DenseMatrix<complex<double>>::operator*))
      .function("timesDense", select_overload<DenseMatrix<complex<double>>(DenseMatrix<complex<double>> *)>(&DenseMatrix<complex<double>>::operator*), allow_raw_pointers())
      .function("plus", select_overload<DenseMatrix<complex<double>>(DenseMatrix<complex<double>> *)>(&DenseMatrix<complex<double>>::operator+), allow_raw_pointers())
      .function("minus", select_overload<DenseMatrix<complex<double>>(DenseMatrix<complex<double>> *)>(&DenseMatrix<complex<double>>::operator-), allow_raw_pointers())
      .function("negated", select_overload<DenseMatrix<complex<double>>()>(&DenseMatrix<complex<double>>::operator-))
      .function("get", &DenseMatrix<complex<double>>::get)
      .function("set", &DenseMatrix<complex<double>>::set)
      .function("hcat", &DenseMatrix<complex<double>>::hcat, allow_raw_pointers())
      .function("vcat", &DenseMatrix<complex<double>>::vcat, allow_raw_pointers())
      .function("print", &DenseMatrix<complex<double>>::print);

  // Computation Info
  enum_<ComputationInfo>("ComputationInfo")
      .value("Success", ComputationInfo::Success)
      .value("NumericalIssue", ComputationInfo::NumericalIssue)
      .value("NoConvergence", ComputationInfo::NoConvergence)
      .value("InvalidInput", ComputationInfo::InvalidInput);

  // Eigen Solver
  class_<EigenSolver2>("EigenSolver")
      .constructor<const DenseMatrix<double> &, bool>()
      .function("info", &EigenSolver2::info)
      .function("eigenvectors", &EigenSolver2::eigenvectors)
      .function("eigenvalues", &EigenSolver2::eigenvalues);

  // Care Solver
  class_<CareSolver>("CareSolver")
      .constructor<const DenseMatrix<double> &, const DenseMatrix<double> &, const DenseMatrix<double> &, const DenseMatrix<double> &>()
      .function("info", &CareSolver::info)
      .function("S", &CareSolver::S)
      .function("K", &CareSolver::K);
}