/* eslint-disable */
const BROWSER = typeof window === 'object'

let Module = {}
if (BROWSER) {
  const wasm = require('./eigen_gen.wasm')
  Module = { wasmBinary: wasm }
  window.Module = Module
  require('./eigen_gen.js')
} else {
  Module = require('./eigen_gen.js')
}
const HashMap = require('./hashmap.js')


function getStaticMethods(Class) {
  return Object.getOwnPropertyNames(Class).filter(prop => prop !== "constructor" && typeof Class[prop] === "function");
}

class GarbageCollector {
  static objects = new Set()
  static whitelist = new HashMap() // Reference count

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

/**
 * Equip class to add constructor feedback
 * @param  {object} Class class to wrap
 * @returns {object} wrapped class
 */
function initClass(Class) {
  const NewClass = function (...args) {
    const instance = new Class(...args)
    GarbageCollector.add(instance)
    return instance
  }
  const arr = [Class, Class.prototype] // forEach doesn't seem to work
  for (let idx in arr) {
    let obj = arr[idx]
    getStaticMethods(obj).forEach(method => {
      const fun = obj[method]
      obj[method] = function (...args) {
        const rtn = fun.call(this, ...args)
        if (rtn instanceof Class) {
          GarbageCollector.add(rtn)
        }
        return rtn
      }
    })
  }

  // Class.prototype.constructor = NewClass TODO: control
  getStaticMethods(Class).forEach(method => { NewClass[method] = Class[method]; })
  NewClass.prototype = Class.prototype
  return NewClass
}

/**
 * Add helper functions TODO: extract in file
 */
function addHelpers(Module) {
  const DenseMatrix = Module.DenseMatrix;
  const get = DenseMatrix.prototype.get;
  /**
   * Add default for vector polling
   */
  DenseMatrix.get = function (i, j = 0) {
    return get(i, j)
  }

  /**
   * Add fromArray factory (maybe add that utility in all functions)
   */
  DenseMatrix.fromArray = function (array) {
    // Generate vector if needed
    if (!array.length || !Array.isArray(array[0])) {
      array = array.map(val => [val])
    }
    var v2d = new Module.Vector2d();
    array.forEach(arr => {
      var v = new Module.Vector();
      arr.forEach(val => v.push_back(val));
      v2d.push_back(v)
    })
    return new DenseMatrix.fromVector(v2d);
  }
}


const defExport = {
  GC: GarbageCollector,
  ready: () => { } // Override if needed
}

Module.onRuntimeInitialized = _ => {
  const classes = ["Vector",
    "Vector2d",
    "Complex",
    "DenseMatrix",
    "ComplexDenseMatrix",
    "EigenSolver",
    "CareSolver"]
  classes.forEach(className => {
    defExport[className] = initClass(Module[className])
  })
  addHelpers(defExport);
  defExport.ready()
}

module.exports = defExport;