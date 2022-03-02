interface GarbageCollector {
  add(...addList: any[]): void; // TODO
  pushException(...exceptionList: any[]): void; // TODO
  flush(): number;
  set(ref: any, name: any, newObj: any): void; // TODO
  initClass(classes: any, Class: any): object; // TODO
}

declare namespace eig {
  const GC: GarbageCollector;
  const ready: Promise<void>;

  class Vector {
    constructor();
    push_back(value: number): void;
    resize(count: number, value: number): void;
    size(): number;
    get(index: number): number | undefined;
    set(index: number, value: number): true;
  }

  class Vector2d {
    constructor();
    push_back(value: Vector): void;
    resize(count: number, value: Vector): void;
    size(): number;
    get(index: number): Vector | undefined;
    set(index: number, value: Vector): true;
  }

  class Complex {
    // TODO
  }

  class Matrix {
    // TODO: correct these
    constructor(arg0: number, arg1?: number);
    constructor(arg0: number[] | number[][] | Matrix);
    static identity(m: number, n: number): Matrix;
    static ones(m: number, n: number): Matrix;
    static constant(m: number, n: number, value: number): Matrix;
    static random(m: number, n: number): Matrix;
    static diagonal(vec: Matrix): Matrix;
    static fromVector(arr: number[] | number[][]): Matrix;
    rows(): number;
    cols(): number;
    get(i: number, j?: number): number;
    set(i: number, j: number, val: number): void;
    set(i: number, val: number): void;
    length(): number;
    dot(B: Matrix): number;
    norm(): number;
    normSqr(): number;
    l1Norm(): number;
    lInfNorm(): number;
    rank(): number;
    det(): number;
    sum(): number;
    block(i: number, j: number, di: number, dj: number): Matrix;
    setBlock(i: number, j: number, block: Matrix): void;
    mul(val: number): Matrix;
    mulSelf(val: number): Matrix;
    div(val: number): Matrix;
    divSelf(val: number): Matrix;
    matAdd(B: Matrix): Matrix;
    matAddSelf(B: Matrix): Matrix;
    matSub(B: Matrix): Matrix;
    matSubSelf(B: Matrix): Matrix;
    matMul(B: Matrix): Matrix;
    matMulSelf(B: Matrix): Matrix;
    hcat(B: Matrix): Matrix;
    vcat(B: Matrix): Matrix;
    transpose(): Matrix;
    transposeSelf(): Matrix;
    inverse(): Matrix;
  }

  class SparseMatrix {
    // TODO
  }

  class TripletVector {
    // TODO
  }

  class ComplexDenseMatrix {
    // TODO
  }

  class Solvers {
    static eigenSolve(M: Matrix, computeEigenvectors: boolean): EigenSolverResult;
    // TODO
  }

  class Decompositions {
    // TODO
  }

  class QuadProgSolver {
    // TODO
  }

  class Random {
    // TODO
  }
}

export default eig;
