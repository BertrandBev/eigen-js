import HashMap from 'hashmap'

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
   * Reference bookkeeping
   */
  static set(ref, name, newObj) {
    if (ref[name]) {
      GarbageCollector.popException(ref[name])
    }
    GarbageCollector.pushException(newObj)
    ref[name] = newObj
  }

  /**
   * Equip class to add constructor feedback
   * @param  {Set} classes Set of all the classes names
   * @param  {object} Class class to wrap
   * @returns {object} wrapped class
   */
  static initClass(classes, Class) {
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
}

// Add static members
GarbageCollector.objects = new Set();
GarbageCollector.whitelist = new HashMap(); // Reference count

export default GarbageCollector