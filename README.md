# Eigen-js

Eigen-js is a port of the great [Eigen](https://eigen.tuxfamily.org/) C++ linear algebra library

It uses a WebAssembly compiled subset of the [Eigen](https://eigen.tuxfamily.org/) library, and implements a simple garbage collection mechanism to manage memory

## Installation

Copy the files eigen_gen.js, eigen_gen.wasm & eigen.js to your project

## Compilation

Make sure [Emscripten](https://emscripten.org/docs/getting_started/Tutorial.html) is intalled & activated in your terminal session

```bash
source path/to/emsdk/emsdk_env.sh
./emcc -v
```

Dowload the latest version of the [Eigen](https://eigen.tuxfamily.org/) library and extract it under

```bash
lib/Eigen
```

Now to compile the wasm binary, run the following command

```bash
emcc -I lib --pre-js src/pre.js --bind -o eigen-js/eigen_gen.js src/embind.cc
```