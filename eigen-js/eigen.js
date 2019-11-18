let Module = require('./eigen_gen.js');

function getStaticMethods(Class) {
  return Object.getOwnPropertyNames(Class).filter(prop => prop !== "constructor" && typeof Class[prop] === "function");
}

class GarbageCollector {
  static objects = new Set()

  static add(...objects) {
    console.log('object added to GC')
    objects.forEach(obj => GarbageCollector.objects.add(obj))
  }

  static flushExcept(...exceptionList) {
    GarbageCollector.ignore(...exceptionList)
    GarbageCollector.objects.forEach(obj => obj.delete())
    console.log(`${GarbageCollector.objects.size} object flushed!`)
    GarbageCollector.objects.clear()
  }

  static ignore(...exceptionList) {
    exceptionList.forEach(obj => GarbageCollector.objects.delete(obj))
  }
}

/**
 * Equip class to add constructor feedback
 * @param  {object} Class class to wrap
 * @returns {object} wrapped class
 */
function initClass(Class) {
  NewClass = function (...args) {
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

  Class.prototype.constructor = NewClass
  getStaticMethods(Class).forEach(method => { NewClass[method] = Class[method]; })
  NewClass.prototype = Class.prototype
  return NewClass
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
  defExport.ready()
}

module.exports = defExport;