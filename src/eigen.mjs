/* eslint-disable */
import eigen_gen from '../build/eigen_gen.js'
import GC from './GC.mjs'

const Module = eigen_gen();

/**
 * Add helper functions TODO: extract in file
 */
function addHelpers(eig) {
  /**
   * Add fromArray factory (maybe add that utility in all functions)
   */
  eig.Matrix.fromArray = function (array) {
    // Generate vector if needed
    if (!array.length || !Array.isArray(array[0])) {
      array = array.map(val => [val])
    }
    var v2d = new eig.Vector2d();
    array.forEach(arr => {
      var v = new eig.Vector();
      arr.forEach(val => v.push_back(val));
      v2d.push_back(v)
    })
    return new eig.Matrix.fromVector(v2d);
  }

  /**
   * Add fromTriplets factory to triplets
   */
  eig.SparseMatrix.fromTriplets = function (m, n, array) {
    let triplets = new eig.TripletVector(array.length)
    array.forEach(sub => triplets.add(...sub))
    return new eig.SparseMatrix(m, n, triplets);
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
    ]);
    classes.forEach(className => {
      eig[className] = GC.initClass(classes, module[className])
    })
    addHelpers(eig);
})


// eig.ready = new Promise((resolve, reject) => {
//   console.log('LOADING MODULE', Module)
//   Module.onRuntimeInitialized = () => {
//     console.log('on initialized')
//     const classes = new Set([
//       "Vector",
//       "Vector2d",
//       "Complex",
//       "Matrix",
//       "SparseMatrix",
//       "TripletVector",
//       "ComplexDenseMatrix",
//       "Solvers",
//       "Decompositions",
//       "QuadProgSolver",
//       "Random",
//     ]);
//     classes.forEach(className => {
//       eig[className] = GC.initClass(classes, Module[className])
//     })
//     addHelpers(eig);
//     console.log('eig ready!')
//     resolve(eig)
//   }
//   console.log('done')
// })

export default eig