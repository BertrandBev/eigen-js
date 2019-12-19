<p align="center">
  <img width="192" src="https://user-images.githubusercontent.com/12652154/71167221-945de480-2254-11ea-97ba-faadc933ed4f.png">
</p>

[![npm version](https://badge.fury.io/js/eigen.svg)](https://badge.fury.io/js/eigen)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://shields.io/)
[![Generic badge](https://img.shields.io/badge/Made width-emscripten-blue.svg)](https://github.com/emscripten-core/emscripten)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)

# Eigen.js

Eigen.js is a port of the [Eigen](https://eigen.tuxfamily.org/) C++ linear algebra library

It uses a WebAssembly compiled subset of the [Eigen](https://eigen.tuxfamily.org/) library, and implements a garbage collection mechanism to manage memory

[Home]() • [Documentation]() • [Benchmarks]()

## Usage

Eigen.js can be installed via [npm](https://www.npmjs.com/package/eigen) or [yarn](https://yarnpkg.com/en/package/eigen)

```bash
npm install eigen
```

```bash
yarn add eigen
```

In a node application or in the browser (using [webpack](https://webpack.js.org/))

```bash
const eig = require('eigen')
// ES6: import eig from 'eigen'
const M = eig.Matrix.fromArray([[1, 2], [3, 4]])
M.inverse();
eig.GC.flush();
```

## Documentation

The documentation is available at [eigen.js]()

## Build

Make sure [Emscripten](https://emscripten.org/docs/getting_started/Tutorial.html) is intalled & activated in your terminal session

```bash
source path/to/emsdk/emsdk_env.sh
./emcc -v
```

Dowload the latest versions of [Eigen](https://gitlab.com/libeigen/eigen/-/releases/) and [OSPQ](https://github.com/oxfordcontrol/osqp/), and put then in the `lib` directory

```bash
lib/eigen
lib/ospq
```

Now compile osqp for a Webassembly target

```
cd lib/ospq
mkdir build; cd build
emconfigure cmake .. -DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1
emmake make
```

Once done, eigen.js can be compile to a wasm binary

```bash
emcc -I lib/eigen -I lib/osqp/include --bind -o build/eigen_gen.js src/cpp/embind.cc -Isrc ./lib/osqp/build/out/libosqp.bc -s DISABLE_EXCEPTION_CATCHING=0 -s ASSERTIONS=0 -O3 -s ALLOW_MEMORY_GROWTH=1
```