#include <emscripten/bind.h>
#include <Eigen/Dense>
#include <vector>

#include "DenseMatrix.h"
#include "CareSolver.h"
#include "Solvers.h"

using namespace std;
using namespace emscripten;

using DDM = DenseMatrix<double>;
using CDM = DenseMatrix<complex<double>>;

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
    class_<DDM>("DenseMatrix")
        .constructor<int, int>()
        .constructor<const DDM &>()
        .class_function("identity", &DDM::identity)
        .class_function("ones", &DDM::ones)
        .class_function("constant", &DDM::constant)
        .class_function("random", &DDM::random)
        .class_function("fromVector", &DDM::fromVector)
        .function("transpose", &DDM::transpose)
        .function("inverse", &DDM::inverse)
        .function("rows", &DDM::rows)
        .function("cols", &DDM::cols)
        .function("norm", &DDM::norm)
        .function("rank", &DDM::rank)
        .function("sum", &DDM::sum)
        .function("block", select_overload<DDM(int, int, int, int) const>(&DDM::block))
        .function("mul", select_overload<DDM(const double &)>(&DDM::operator*))
        .function("div", select_overload<DDM(const double &)>(&DDM::operator/))
        .function("matAdd", select_overload<DDM(const DDM *)>(&DDM::operator+), allow_raw_pointers())
        .function("matSub", select_overload<DDM(const DDM *)>(&DDM::operator-), allow_raw_pointers())
        .function("matMul", select_overload<DDM(const DDM *)>(&DDM::operator*), allow_raw_pointers())
        .function("negated", select_overload<DDM()>(&DDM::operator-))
        // Added functions
        .function("get", &DDM::get)
        .function("set", &DDM::set)
        .function("hcat", &DDM::hcat, allow_raw_pointers())
        .function("vcat", &DDM::vcat, allow_raw_pointers())
        .function("print", &DDM::print)
        .function("clip", &DDM::clip)
        // Vector ops
        .function("vGet", &DDM::vGet)
        .function("vSet", &DDM::vSet)
        .function("dot", &DDM::dot);

    // Complex Dense Matrix
    class_<CDM>("ComplexDenseMatrix")
        .constructor<int, int>()
        .constructor<const CDM &>()
        .class_function("identity", &CDM::identity)
        .class_function("ones", &CDM::ones)
        .class_function("constant", &CDM::constant)
        .class_function("random", &CDM::random)
        .function("transpose", &CDM::transpose)
        .function("inverse", &CDM::inverse)
        .function("conjugate", &CDM::conjugate)
        .function("rows", &CDM::rows)
        .function("cols", &CDM::cols)
        .function("norm", &CDM::norm)
        .function("rank", &CDM::rank)
        .function("sum", &CDM::sum)
        .function("block", select_overload<CDM(int, int, int, int) const>(&CDM::block))
        .function("mul", select_overload<CDM(const complex<double> &)>(&CDM::operator*))
        .function("div", select_overload<CDM(const complex<double> &)>(&CDM::operator/))
        .function("matAdd", select_overload<CDM(const CDM *)>(&CDM::operator+), allow_raw_pointers())
        .function("matSub", select_overload<CDM(const CDM *)>(&CDM::operator-), allow_raw_pointers())
        .function("matMul", select_overload<CDM(const CDM *)>(&CDM::operator*), allow_raw_pointers())
        .function("negated", select_overload<CDM()>(&CDM::operator-))
        // Custom function
        .function("get", &CDM::get)
        .function("set", &CDM::set)
        .function("hcat", &CDM::hcat, allow_raw_pointers())
        .function("vcat", &CDM::vcat, allow_raw_pointers())
        .function("print", &CDM::print);

    // Computation Info
    enum_<ComputationInfo>("ComputationInfo")
        .value("Success", ComputationInfo::Success)
        .value("NumericalIssue", ComputationInfo::NumericalIssue)
        .value("NoConvergence", ComputationInfo::NoConvergence)
        .value("InvalidInput", ComputationInfo::InvalidInput);

    // Eigen Solver
    class_<EigenSolver2>("EigenSolver")
        .constructor<const DDM &, bool>()
        .function("info", &EigenSolver2::info)
        .function("eigenvectors", &EigenSolver2::eigenvectors)
        .function("eigenvalues", &EigenSolver2::eigenvalues);

    // Care Solver
    class_<CareSolver>("CareSolver")
        .constructor<const DDM &, const DDM &, const DDM &, const DDM &>()
        .function("info", &CareSolver::info)
        .function("S", &CareSolver::S)
        .function("K", &CareSolver::K);
}