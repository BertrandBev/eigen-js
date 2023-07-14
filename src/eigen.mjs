/* eslint-disable */
import eigen_gen from '../build/eigen_gen.js'
import wasm from '../build/eigen_gen.wasm' // Comment out for local testing
import GC, { getStaticMethods } from './GC.mjs'


const Module = eigen_gen({
  wasmBinary: wasm // Comment out for local testing
});

/**
 * Add helper functions TODO: extract in file
 */
function addHelpers(eig) {
  /**
   * Add fromTriplets factory to triplets
   */
  eig.SparseMatrix.fromTriplets = function (m, n, array) {
    let triplets = new eig.TripletVector(array.length)
    array.forEach(sub => triplets.add(...sub))
    return new eig.SparseMatrix(m, n, triplets);
  }

  /**
   * Re-define matrix constructor
   */
  const clazz = eig.Matrix;
  eig.Matrix = function (arg0, arg1 = 1) {
    // Copy constructor
    if (arg0 instanceof eig.Matrix)
      return new clazz(arg0);
    // Create matrices or arrays
    if (typeof arg0 === "number")
      return new clazz(arg0, arg1);
    if (!Array.isArray(arg0))
      throw new Error(`Invalid constructor argument ${arg0}`);
    // Generate vector if needed
    if (!arg0.length || !Array.isArray(arg0[0])) {
      arg0 = arg0.map(val => [val])
    }
    // Create initializer
    var v2d = new eig.Vector2d();
    arg0.forEach(arr => {
      var v = new eig.Vector();
      arr.forEach(val => v.push_back(val));
      v2d.push_back(v)
    })
    // Pass matrix
    return clazz.fromVector(v2d);
  }
  eig.Matrix.prototype = clazz.prototype;
  const staticMethods = getStaticMethods(clazz);
  staticMethods.forEach(method => {
    eig.Matrix[method] = clazz[method];
  });

  /**
   * Update get & set methods
   */
  const getFun = eig.Matrix.prototype.get;
  eig.Matrix.prototype.get = function (arg0, arg1) {
    if (arg1 == undefined)
      return this.vGet(arg0);
    else
      return getFun.call(this, arg0, arg1);
  }

  const setFun = eig.Matrix.prototype.set;
  eig.Matrix.prototype.set = function (arg0, arg1, arg2) {
    if (arg2 == undefined)
      return this.vSet(arg0, arg1);
    else
      return setFun.call(this, arg0, arg1, arg2);
  }

  /**
   * Return pointer on self methods
   */
  const methods = [
    "mulSelf",
    "divSelf",
    "matAddSelf",
    "matSubSelf",
    "matMulSelf",
    "negatedSelf",
    "clampSelf"
  ]
  methods.forEach(method => {
    const fun = eig.Matrix.prototype[method]
    eig.Matrix.prototype[method] = function (...args) {
      fun.call(this, ...args)
      return this
    }
  })
}

const eig = {
  GC: GC
}

eig.ready = Module.then(module => {
  const classes = new Set([
    "Vector",
    "Vector2d",
    "Complex",
    "Matrix",
    "SparseMatrix",
    "TripletVector",
    "ComplexDenseMatrix",
    "Solvers",
    "Decompositions",
    "QuadProgSolver",
    "Random",
    "SimplicialCholesky",
  ]);
  classes.forEach(className => {
    eig[className] = GC.initClass(classes, module[className])
  })
  addHelpers(eig);
})

export default eig
