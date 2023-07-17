# Benchmark and comparison tests

The purpose of this directory is to have some benchmark tests with comparison against natively executed cpp binary code. At the moment only SmiplicialCholesky solver is being tested here, it solves large linear systems with constraints.

benchmark.test.ts loads built eigen-js package from dist/index.js and performs tests over it using jest.

My initial intent was to write test in Typescript with ts-jest in Visual Studio Code, where we have type information at hand, thanks to its intellisense.

I have issues with these tests:
- import { eig } from '../../../dist/index'  generates an error, because the import is outside the module
  Workaround: const eig = require('../../../dist/index')

- But then, the type declaration from eigen.d.ts is not applied to eig.
  Workaround: manually extract needed class declarations from eigen.d.ts and put to src/tests/types.ts, this will allow for cast via 'as' in typescript, at least something.


# about Tutorial_sparse_example.ts test

This test was taken from libeigen and executed vie eigen-js. Solution of large linear system using SimplicialCholesky solver:

Javascript version (nodejs):

 X = 0.1359, 0.2717, 0.4530, 0.6366, 0.7529, 0.7529, 0.6366, 0.4530, 0.2717, 0.1359, 0.2717, 0.3810, 0.4904, 0.5906, 0.6521, 0.6521, 0.5906, 0.4904, 0.3810, 0.2717, 0.4530, 0.4904, 0.5369, 0.5834, 0.6128, 0.6128, 0.5834, 0.5369, 0.4904, 0.4530, 0.6366, 0.5906, 0.5834, 0.5932, 0.6030, 0.6030, 0.5932, 0.5834, 0.5906, 0.6366, 0.7529, 0.6521, 0.6128, 0.6030, 0.6030, 0.6030, 0.6030, 0.6128, 0.6521, 0.7529, 0.7529, 0.6521, 0.6128, 0.6030, 0.6030, 0.6030, 0.6030, 0.6128, 0.6521, 0.7529, 0.6366, 0.5906, 0.5834, 0.5932, 0.6030, 0.6030, 0.5932, 0.5834, 0.5906, 0.6366, 0.4530, 0.4904, 0.5369, 0.5834, 0.6128, 0.6128, 0.5834, 0.5369, 0.4904, 0.4530, 0.2717, 0.3810, 0.4904, 0.5906, 0.6521, 0.6521, 0.5906, 0.4904, 0.3810, 0.2717, 0.1359, 0.2717, 0.4530, 0.6366, 0.7529, 0.7529, 0.6366, 0.4530, 0.2717, 0.1359

 SimplicalCholesky test elapsed time 1 917 766 n
  Solver time 85 345 ns

Cpp native version:

X = 0.1359, 0.2717, 0.4530, 0.6366, 0.7529, 0.7529, 0.6366, 0.4530, 0.2717, 0.1359, 0.2717, 0.3810, 0.4904, 0.5906, 0.6521, 0.6521, 0.5906, 0.4904, 0.3810, 0.2717, 0.4530, 0.4904, 0.5369, 0.5834, 0.6128, 0.6128, 0.5834, 0.5369, 0.4904, 0.4530, 0.6366, 0.5906, 0.5834, 0.5932, 0.6030, 0.6030, 0.5932, 0.5834, 0.5906, 0.6366, 0.7529, 0.6521, 0.6128, 0.6030, 0.6030, 0.6030, 0.6030, 0.6128, 0.6521, 0.7529, 0.7529, 0.6521, 0.6128, 0.6030, 0.6030, 0.6030, 0.6030, 0.6128, 0.6521, 0.7529, 0.6366, 0.5906, 0.5834, 0.5932, 0.6030, 0.6030, 0.5932, 0.5834, 0.5906, 0.6366, 0.4530, 0.4904, 0.5369, 0.5834, 0.6128, 0.6128, 0.5834, 0.5369, 0.4904, 0.4530, 0.2717, 0.3810, 0.4904, 0.5906, 0.6521, 0.6521, 0.5906, 0.4904, 0.3810, 0.2717, 0.1359, 0.2717, 0.4530, 0.6366, 0.7529, 0.7529, 0.6366, 0.4530, 0.2717, 0.1359

SimplicalCholesky test elapsed time 1 436 149 ns
Solver time 156 210 ns


Conclusion: javascript version of the test is not stable in terms of elapsed time, sometimes it becomes even faster than the native version, but that's possible due to caches at all levels of the V8.