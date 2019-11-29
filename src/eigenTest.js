const Module = require('../eigen-js/eigen.js');
const util = require('util');


Module.ready = _ => {
  inPlaceBenchmark()
};

function inPlaceBenchmark() {
  const M1 = Module.DenseMatrix.random(8, 8);
  const M2 = Module.DenseMatrix.random(8, 8);
  const M3 = Module.DenseMatrix.random(8, 8);
  const M4 = Module.DenseMatrix.random(8, 8);
  Module.GC.pushException(M1, M2, M3, M4)
  console.log('M1', M1)
  const nIter = 1;
  let tStart = Date.now();
  for (let k = 0; k < nIter; k++) {
    const [m1, m2, m3, m4] = [M1, M2, M3, M4].map(m => new Module.DenseMatrix(m));
    let res = m1;
    for (let j = 0; j < 7; j++) {
      res = res.matAdd(m2).matMul(m3).matSub(m4).mul(123).div(321)
    }
    if (k % 50 === 0) {
      Module.GC.flush()
    }
  }
  console.log('Copy time', Date.now() - tStart)
  tStart = Date.now();
  for (let k = 0; k < nIter; k++) {
    const [m1, m2, m3, m4] = [M1, M2, M3, M4].map(m => new Module.DenseMatrix(m));
    let res = m1;
    for (let j = 0; j < 7; j++) {
      res = res.matAddSelf(m2).matMulSelf(m3).matSubSelf(m4).mulSelf(123).divSelf(321)
    }
    if (k % 50 === 0) {
      Module.GC.flush()
    }
  }
  console.log('In place time', Date.now() - tStart)
}

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