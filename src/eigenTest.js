const Module = require('../eigen-js/eigen.js');
const util = require('util');

const obj = {}

Module.ready = _ => {
    const v1 = Module.DenseMatrix.identity(2, 2)
    Module.GC.set(obj, 'v', v1)
    Module.GC.flush()
    v1.print("v1")
    const v2 = Module.DenseMatrix.identity(2, 2)
    Module.GC.set(obj, 'v2', v2)
    Module.GC.flush()

};