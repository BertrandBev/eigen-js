#include <emscripten/bind.h>
#include <Eigen/Dense>
#include <vector>

#include "DenseMatrix.h"
#include "SparseMatrix.h"
#include "CareSolver.h"
#include "Solvers.h"
// #include "QuadProgSolver.h"
#include "QuadProg.h"

using namespace std;
using namespace emscripten;

using DDM = DenseMatrix<double>;
using CDM = DenseMatrix<complex<double>>;
using SDM = SparseMatrix<double>;

EMSCRIPTEN_BINDINGS(Module)
{
    // Double vector
    emscripten::register_vector<double>("Vector");
    emscripten::register_vector<vector<double>>("Vector2d");

    // Complex numbers
    class_<complex<double>>("Complex")
        .constructor<double, double>();
    emscripten::function("real", select_overload<double(const complex<double> &)>(&real)); // TODO: extract in complex class
    emscripten::function("imag", select_overload<double(const complex<double> &)>(&imag)); // TODO: extract in complex class

    // Dense Matrix
    class_<DDM>("Matrix") // TODO: rename
        .constructor<int, int>()
        .constructor<const DDM &>()
        .class_function("identity", &DDM::identity)
        .class_function("ones", &DDM::ones)
        .class_function("constant", &DDM::constant)
        .class_function("random", &DDM::random)
        .class_function("fromVector", &DDM::fromVector)
        .function("transpose", &DDM::transpose)
        .function("transposeSelf", &DDM::transposeSelf)
        .function("inverse", &DDM::inverse)
        .function("rows", &DDM::rows)
        .function("cols", &DDM::cols)
        .function("norm", &DDM::norm)
        .function("rank", &DDM::rank)
        .function("sum", &DDM::sum)
        .function("block", &DDM::block)
        .function("setBlock", &DDM::setBlock)
        .function("mul", &DDM::mul)
        .function("mulSelf", &DDM::mulSelf)
        .function("div", &DDM::div)
        .function("divSelf", &DDM::divSelf)
        .function("matAdd", &DDM::matAdd, allow_raw_pointers())
        .function("matAddSelf", &DDM::matAddSelf, allow_raw_pointers())
        .function("matSub", &DDM::matSub, allow_raw_pointers())
        .function("matSubSelf", &DDM::matSubSelf, allow_raw_pointers())
        .function("matMul", &DDM::matMul, allow_raw_pointers())
        .function("matMulSelf", &DDM::matMulSelf, allow_raw_pointers())
        .function("get", &DDM::get)
        .function("set", &DDM::set)
        .function("hcat", &DDM::hcat, allow_raw_pointers())
        .function("vcat", &DDM::vcat, allow_raw_pointers())
        .function("print", &DDM::print)
        .function("clamp", &DDM::clamp)
        // Vector ops
        .function("length", &DDM::length)
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
        .function("mul", &CDM::mul)
        .function("div", &CDM::div)
        .function("matAdd", &CDM::matAdd, allow_raw_pointers())
        .function("matSub", &CDM::matSub, allow_raw_pointers())
        .function("matMul", &CDM::matMul, allow_raw_pointers())
        .function("get", &CDM::get)
        .function("set", &CDM::set)
        .function("hcat", &CDM::hcat, allow_raw_pointers())
        .function("vcat", &CDM::vcat, allow_raw_pointers())
        .function("print", &CDM::print);

    // Triplet
    class_<TripletVector<double>>("TripletVector")
        .constructor<int>()
        .function("add", &TripletVector<double>::add)
        .function("addDiag", &TripletVector<double>::addDiag)
        .function("addBlock", &TripletVector<double>::addBlock);

    // Sparse Matrix
    class_<SDM>("SparseMatrix")
        .constructor<int, int>()
        .constructor<int, int, TripletVector<double> *>()
        .constructor<SDM>()
        .class_function("identity", &SDM::identity)
        .class_function("diag", &SDM::diag)
        .function("transpose", &SDM::transpose)
        .function("rows", &SDM::rows)
        .function("cols", &SDM::cols)
        .function("nonZeros", &SDM::nonZeros)
        .function("frobeniusNorm", &SDM::frobeniusNorm)
        .function("block", &SDM::block)
        .function("toDense", &SDM::toDense)
        .function("mul", &SDM::mul)
        .function("mulSelf", &SDM::mulSelf)
        .function("div", &SDM::div)
        .function("divSelf", &SDM::divSelf)
        .function("matAdd", &SDM::matAdd, allow_raw_pointers())
        .function("matAddSelf", &SDM::matAddSelf, allow_raw_pointers())
        .function("matSub", &SDM::matSub, allow_raw_pointers())
        .function("matSubSelf", &SDM::matSubSelf, allow_raw_pointers())
        .function("matMul", &SDM::matMul, allow_raw_pointers())
        .function("get", &SDM::get)
        .function("set", &SDM::set)
        .function("print", &SDM::print);

        // .function("matMulSelf", &SDM::matMulSelf, allow_raw_pointers());
        // .function("chol", &SDM::chol, allow_raw_pointers())
        // .function("lu", &SDM::lu, allow_raw_pointers())
        // .function("qr", &SDM::qr, allow_raw_pointers());

    // Computation Info
    enum_<Eigen::ComputationInfo>("ComputationInfo")
        .value("Success", Eigen::ComputationInfo::Success)
        .value("NumericalIssue", Eigen::ComputationInfo::NumericalIssue)
        .value("NoConvergence", Eigen::ComputationInfo::NoConvergence)
        .value("InvalidInput", Eigen::ComputationInfo::InvalidInput);

    // Eigen Solver
    class_<EigenSolver>("EigenSolver")
        .constructor<const DDM &, bool>()
        .function("info", &EigenSolver::info)
        .function("eigenvectors", &EigenSolver::eigenvectors)
        .function("eigenvalues", &EigenSolver::eigenvalues);

    // Care Solver
    class_<CareSolver>("CareSolver")
        .constructor<const DDM &, const DDM &, const DDM &, const DDM &>()
        .function("info", &CareSolver::info)
        .function("S", &CareSolver::S)
        .function("K", &CareSolver::K);

    // Quad prog solver
    // class_<QuadProgSolver>("QuadProgSolver")
    //     .class_function("solve", &QuadProgSolver::solve);

    // Quad prog solver
    class_<QuadProgSolver>("QuadProgSolver")
        .class_function("solve", &QuadProgSolver::solve)
        .class_function("solveSparse", &QuadProgSolver::solveSparse)
        .class_function("solveBasic", &QuadProgSolver::solveBasic);
}