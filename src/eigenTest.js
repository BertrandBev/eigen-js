const Module = require('../eigen-js/eigen.js');
const util = require('util');


Module.ready = _ => {
  const m1 = new Module.DenseMatrix(2, 2);
  m1.sTranspose();
  m1.sTranspose();
  const m2 = m1.sTranspose();
  console.log('equality', m1 === m2)
  m2.sTranspose();
};

function gcTest() {
  const obj1 = {}
  const obj2 = {}
  const v1 = new Module.DenseMatrix(1, 1)
  Module.GC.set(obj1, 'v', v1)
  Module.GC.set(obj2, 'v', v1)
  let n = Module.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v1.print("v1")
  const v2 = Module.DenseMatrix.identity(1, 1)
  Module.GC.set(obj1, 'v', v2)
  n = Module.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v1.print("v1")
  v2.print("v2")
  Module.GC.set(obj2, 'v', v2)
  n = Module.GC.flush()
  console.assert(n == 1, 'One object should be flushed')
  v2.print("v2")
  Module.GC.popException(v2)
  n = Module.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v2.print("v2")
  Module.GC.popException(v2)
  n = Module.GC.flush()
  console.assert(n == 1, 'One object should be flushed')
}