const eig = require('../eigen-js/eigen.js');
const util = require('util');


eig.ready = _ => {
  // inPlaceBenchmark()
  // quadProgTest()
  for (let k = 0; k < 1000000; k++) {
    const m = solveTest()
    eig.GC.flush()
    // m.delete()
    if (k % 1000 === 0) {
      // m.print('m')
      console.log(`Iteration ${k}`)
    }
  }
};

function refTest() {
  const A = eig.DenseMatrix.fromArray([
    [1, 2, 3, 5, 6, 7, 8, 9, 10],
    [4, 5, 6, 5, 6, 7, 8, 9, 10],
    [7, 8, 9, 5, 6, 7, 8, 9, 10]
  ])
  const B = eig.DenseMatrix.fromArray([
    [1, 2, 3, 2, 3, 4, 5, 6, 7],
    [4, 5, 6, 2, 3, 4, 5, 6, 7],
    [7, 8, 9, 2, 3, 4, 5, 6, 7]
  ])
  let tStart = Date.now();
  for (let k = 0; k < 10000; k++) {
    A.matAdd(B)
  }
  console.log('Ref time', Date.now() - tStart)
  tStart = Date.now();
  for (let k = 0; k < 10000; k++) {
    A.matAddSelfRef(B)
  }
  console.log('Pointer time', Date.now() - tStart)
}

function quadProgBenchmark() {
  let tStart = Date.now();
  const n = 1000000;
  for (let k = 0; k < n; k++)
    eig.QuadProgSolver.solveBasic()
  console.log('Compiled time', Date.now() - tStart)
  tStart = Date.now();
  for (let k = 0; k < n; k++)
    eig.QuadProgSolver.solveSparse()
  console.log('Sparse time', Date.now() - tStart)
  tStart = Date.now();
  for (let k = 0; k < n; k++)
    solveTest()
  console.log('JS time', Date.now() - tStart)
}

function solveTest() {
  let triplets = new eig.TripletVector(3)
  triplets.add(0, 0, 4);
  triplets.add(0, 1, 1);
  triplets.add(1, 1, 2);
  const P = new eig.SparseMatrix(2, 2, triplets);

  triplets = new eig.TripletVector(4)
  triplets.add(0, 0, 1);
  triplets.add(0, 1, 1);
  triplets.add(1, 0, 1);
  triplets.add(2, 1, 1);
  const A = new eig.SparseMatrix(3, 2, triplets);

  const q = eig.DenseMatrix.fromArray([1, 1])
  const l = eig.DenseMatrix.fromArray([1, 0, 0])
  const u = eig.DenseMatrix.fromArray([1, 0.7, 0.7])

  return eig.QuadProgSolver.solve(P, q, A, l, u);
  // console.log('solved')
  // eig.GC.flush()
}

function quadProgTest() {
  const G = eig.DenseMatrix.fromArray([[4, -2], [-2, 4]])
  const g0 = eig.DenseMatrix.fromArray([6, 0])
  const CE = eig.DenseMatrix.fromArray([1, 1])
  const ce0 = eig.DenseMatrix.fromArray([-3])
  const CI = eig.DenseMatrix.fromArray([[1, 0, 1], [0, 1, 1]])
  const ci0 = eig.DenseMatrix.fromArray([0, 0, 2])
  const x = eig.DenseMatrix.fromArray([0, 0])
  const res = eig.QuadProgSolver.solve(G, g0, CE, ce0, CI, ci0, x)
  console.log('result', res)
  x.print('x')
}

function inPlaceBenchmark() {
  const M1 = eig.DenseMatrix.random(8, 8);
  const M2 = eig.DenseMatrix.random(8, 8);
  const M3 = eig.DenseMatrix.random(8, 8);
  const M4 = eig.DenseMatrix.random(8, 8);
  eig.GC.pushException(M1, M2, M3, M4)
  console.log('M1', M1)
  const nIter = 1;
  let tStart = Date.now();
  for (let k = 0; k < nIter; k++) {
    const [m1, m2, m3, m4] = [M1, M2, M3, M4].map(m => new eig.DenseMatrix(m));
    let res = m1;
    for (let j = 0; j < 7; j++) {
      res = res.matAdd(m2).matMul(m3).matSub(m4).mul(123).div(321)
    }
    if (k % 50 === 0) {
      eig.GC.flush()
    }
  }
  console.log('Copy time', Date.now() - tStart)
  tStart = Date.now();
  for (let k = 0; k < nIter; k++) {
    const [m1, m2, m3, m4] = [M1, M2, M3, M4].map(m => new eig.DenseMatrix(m));
    let res = m1;
    for (let j = 0; j < 7; j++) {
      res = res.matAddSelf(m2).matMulSelf(m3).matSubSelf(m4).mulSelf(123).divSelf(321)
    }
    if (k % 50 === 0) {
      eig.GC.flush()
    }
  }
  console.log('In place time', Date.now() - tStart)
}

function gcTest() {
  const obj1 = {}
  const obj2 = {}
  const v1 = new eig.DenseMatrix(1, 1)
  eig.GC.set(obj1, 'v', v1)
  eig.GC.set(obj2, 'v', v1)
  let n = eig.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v1.print("v1")
  const v2 = eig.DenseMatrix.identity(1, 1)
  eig.GC.set(obj1, 'v', v2)
  n = eig.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v1.print("v1")
  v2.print("v2")
  eig.GC.set(obj2, 'v', v2)
  n = eig.GC.flush()
  console.assert(n == 1, 'One object should be flushed')
  v2.print("v2")
  eig.GC.popException(v2)
  n = eig.GC.flush()
  console.assert(n == 0, 'No object should be flushed')
  v2.print("v2")
  eig.GC.popException(v2)
  n = eig.GC.flush()
  console.assert(n == 1, 'One object should be flushed')
}