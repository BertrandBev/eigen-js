/* eslint-disable */
import HashMap from 'hashmap'
import eigen_gen from '../build/eigen_gen.js'
import wasm from '../build/eigen_gen.wasm'
const Module = eigen_gen({
  wasmBinary: wasm
});

function getStaticMethods(Class) {
  return Object.getOwnPropertyNames(Class).filter(prop => prop !== "constructor" && typeof Class[prop] === "function");
}

class GarbageCollector {
  static add(...addList) {
    addList.flat(Infinity).forEach(obj => {
      GarbageCollector.objects.add(obj)
    })
  }

  static pushException(...exceptionList) {
    exceptionList.flat(Infinity).forEach(obj => {
      const val = GarbageCollector.whitelist.get(obj) || 0
      GarbageCollector.whitelist.set(obj, val + 1)
    })
  }

  static popException(...exceptionList) {
    exceptionList.flat(Infinity).forEach(obj => {
      const val = GarbageCollector.whitelist.get(obj) || 0
      GarbageCollector.whitelist.set(obj, val - 1)
      if (GarbageCollector.whitelist.get(obj) <= 0) {
        GarbageCollector.whitelist.remove(obj)
      }
    })
  }

  static flush() {
    const flushed = [...GarbageCollector.objects].filter(
      obj => !GarbageCollector.whitelist.has(obj)
    )
    flushed.forEach(obj => {
      obj.delete()
      GarbageCollector.objects.delete(obj)
    })
    return flushed.length
  }

  /**
   * Smart reference bookkeeping
   */
  static set(ref, name, newObj) {
    if (ref[name]) {
      GarbageCollector.popException(ref[name])
    }
    GarbageCollector.pushException(newObj)
    ref[name] = newObj
  }
}
// Add static members
GarbageCollector.objects = new Set();
GarbageCollector.whitelist = new HashMap(); // Reference count

/**
 * Equip class to add constructor feedback
 * @param  {Set} classes Set of all the classes names
 * @param  {object} Class class to wrap
 * @returns {object} wrapped class
 */
function initClass(classes, Class) {
  const NewClass = function (...args) {
    const instance = new Class(...args)
    GarbageCollector.add(instance)
    return instance
  }
  const arr = [Class, Class.prototype] // forEach doesn't seem to work
  for (let idx in arr) {
    let obj = arr[idx]
    getStaticMethods(obj).forEach(method => {
      // console.log(`Wrapping reg method ${method} of ${Class}`)
      const fun = obj[method]
      obj[method] = function (...args) {
        const rtn = fun.call(this, ...args)
        if (rtn && classes.has(rtn.constructor.name)) {
          GarbageCollector.add(rtn)
        }
        return rtn
      }
    })
  }

  // Class.prototype.constructor = NewClass TODO: control
  getStaticMethods(Class).forEach(method => {
    NewClass[method] = Class[method];
  })
  NewClass.prototype = Class.prototype
  return NewClass
}

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
    "negatedSelf"
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
  GC: GarbageCollector
}

eig.ready = new Promise(resolve => {
  Module.onRuntimeInitialized = () => {
    const classes = new Set(["Vector",
      "Vector2d",
      "Complex",
      "Matrix",
      "SparseMatrix",
      "TripletVector",
      "ComplexDenseMatrix",
      "Solvers",
      "Decompositions",
      "QuadProgSolver"])
    classes.forEach(className => {
      eig[className] = initClass(classes, Module[className])
    })
    addHelpers(eig);
    resolve(eig)
  }
})

export default eig