import eig from "@eigen/eigen.js";
import { Matrix, inverse } from "ml-matrix";
const mathjs = require('mathjs')
const linalg = require('linear-algebra')();
const lalolib = window.lalolib;
import _ from 'lodash'

const mlmatrix = {
  Matrix,
  inverse
}

const libraries = {
  eig: { name: 'Eigen JS', lib: eig },
  mlmatrix: { name: 'Ml Matrix', lib: mlmatrix },
  mathjs: { name: 'Math JS', lib: mathjs },
  linalg: { name: 'Linalg', lib: linalg },
  // lalolib : { name: 'LaloLib, lib: lalolib },
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

class Benchmark {
  constructor(data) {
    this.data = data
    this.functions = {}
    this.libraries = libraries
    _.keys(libraries).filter(lib => _.has(data, lib)).forEach(lib => {
      const body = data.body(lib, data[lib])
      this.functions[lib] = body.replace(/^\s*[\r\n]/gm, "")
    })
  }

  static getRandomArray2D(size) {
    const r = new Random(1928473);
    const value = [...Array(size)].map((v, idx) => idx);
    return [...Array(size)].map((v, idx) => value.map(() => r.get()));
  }

  static createMatrix(type, size) {
    const array = Benchmark.getRandomArray2D(size)
    switch (type) {
      case 'eig':
        return eig.Matrix.fromArray(array)
      case 'mlmatrix':
        return new Matrix(array);
      case 'lalolib':
        return lalolib.array2mat(array);
      case 'mathjs':
        return mathjs.matrix(array);
      case 'linalg':
        return new linalg.Matrix(array);
    }
  }

  run(benchmarkFun) {
    const startTime = Date.now();
    const libs = _.zipObject(
      _.keys(libraries),
      _.values(libraries).map(l => l.lib)
    )
    const params = {
      createMatrix: Benchmark.createMatrix,
      ...libs,
      ...this.data.params,
    }
    let fun = new Function(..._.keys(params), benchmarkFun);
    const result = fun(..._.values(params));
    return Date.now() - startTime
  }
}

/**
 * Benchmark functions
 */
const benchmarks = []

benchmarks.push(new Benchmark({
  name: 'Matrix multiplication',
  description: 'Matrix multiplication test',
  params: { size: 100, iterations: 100 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
const B = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eig: `
  A.matMul(B);`,
  lalolib: `
  lalolib.mul(A, B);`,
  mlmatrix: `
  A.mmul(B)`,
  mathjs: `
  mathjs.multiply(A, B)`,
  linalg: `
  A.dot(B)`
}))

benchmarks.push(new Benchmark({
  name: 'Matrix inversion',
  description: 'Matrix inversion test',
  params: { size: 100, iterations: 20 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eig: `
  A.inverse();`,
  lalolib: `
  lalolib.inv(A);`,
  mlmatrix: `
  mlmatrix.inverse(A)`,
  mathjs: `
  mathjs.inv(A)`
}))

benchmarks.push(new Benchmark({
  name: 'Singular value decomposition',
  description: 'Singular value decomposition test',
  params: { size: 100, iterations: 100 },
  body: (type, fun) => `
const A = createMatrix('${type}', size);
for (let k = 0; k < iterations; k++) {
${fun}
}`,
  eig: `
  eig.Decompositions.svd(A, true)`,
  lalolib: `
  lalolib.svd(A, "thin");`,
}))

export default benchmarks