import eig from "@eigen/eigen.js";
import { Matrix, inverse } from "ml-matrix";
const lalolib = window.lalolib;
import _ from 'lodash'

const mlMatrix = {
  Matrix,
  inverse
}

const libraries = {
  eig,
  lalolib,
  mlMatrix
}

class Random {
  constructor(seed) {
    this.seed = seed;
  }

  get() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

function getRandomArray2D(size) {
  const r = new Random(1928473);
  const value = [...Array(size)].map((v, idx) => idx);
  return [...Array(size)].map((v, idx) => value.map(() => r.get()));
}

function createMatrix(type, size) {
  const array = getRandomArray2D(size)
  switch (type) {
    case 'eigen':
      return eig.Matrix.fromArray(array)
    case 'mlmatrix':
      return new Matrix(array);
    case 'lalolib':
      return lalolib.array2mat(array);
  }
}

function createBenchmark(benchmark, type) {
  const body = benchmark.body(type, benchmark[type])
  return body.replace(/^\s*[\r\n]/gm, "")
}

function runBenchmark(benchmarkFun, params) {
  const startTime = Date.now();
  params = {
    createMatrix,
    ...libraries,
    ...params,
  }
  let fun = new Function(..._.keys(params), benchmarkFun);
  const result = fun(..._.values(params));
  return Date.now() - startTime
}

/**
 * Benchmark functions
 */
const matMulBenchmark = {
  name: 'Matrix multiplication',
  description: 'Matrix multiplication test',
  params: { size: 100, iterations: 1000 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
const B = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eigen: `
  A.matMul(B);`,
  lalolib: `
  lalolib.mul(A, B);`,
  mlmatrix: `
  A.mmul(B)`
}

const inverseBenchmark = {
  name: 'Matrix inversion',
  description: 'Matrix inversion test',
  params: { size: 100, iterations: 100 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eigen: `
  A.inverse();`,
  lalolib: `
  lalolib.inv(A);`,
  mlmatrix: `
  mlMatrix.inverse(A)`
}

const svdBenchmark = {
  name: 'Singular value decomposition',
  description: 'Singular value decomposition test',
  params: { size: 100, iterations: 100 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eigen: `
  eig.Solvers.svd(A, true)`,
  lalolib: `
  lalolib.svd(A, "thin");`,
}

const benchmarks = {
  matMulBenchmark,
  inverseBenchmark,
  svdBenchmark
}

export { libraries, benchmarks, createBenchmark, runBenchmark }