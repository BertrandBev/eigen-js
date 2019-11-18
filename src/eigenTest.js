let Module = require('../eigen-js/eigen.js');
const util = require('util');

Module.ready = _ => {
    const DenseMatrix = Module.DenseMatrix
    const mat = DenseMatrix.ones(2, 2)
    mat.set(0, 0, 2);
    mat.print()

    const mat2 = mat.transpose()
    mat2.print()
    const mat3 = mat2.negated()
    mat3.print()
    const mat4 = mat3.plus(mat2).plus(mat2)
    mat4.print()

    const EigenSolver = Module.EigenSolver
    const solver = new EigenSolver(mat, true)
    console.log(solver.info())
    solver.eigenvalues().print()
    solver.eigenvectors().print()

    // Care solver test
    function vector2d(array2d) {
        var v2d = new Module.Vector2d();
        array2d.forEach(arr => {
            var v = new Module.Vector();
            arr.forEach(val => v.push_back(val));
            v2d.push_back(v)
        })
        return v2d
    }

    const A = DenseMatrix.fromVector(vector2d([[1, 2], [4, 5]]));
    const B = DenseMatrix.fromVector(vector2d([[3, 4], [5, 6]]));
    const Q = DenseMatrix.fromVector(vector2d([[1, 2], [2, 1]]));
    const R = DenseMatrix.fromVector(vector2d([[1, 0], [0, 1]]));
    const CareSolver = Module.CareSolver
    const careSolver = new CareSolver(A, B, Q, R);
    console.log(careSolver.info())
    careSolver.S().print()
    careSolver.K().print()

    Module.GC.flushExcept()
};