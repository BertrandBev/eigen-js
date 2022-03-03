interface GarbageCollector {
  add(...addList: unknown[]): void;
  pushException(...exceptionList: unknown[]): void;
  popException(...exceptionList: unknown[]): void;
  flush(): number;
  set(ref: unknown, name: unknown, newObj: unknown): void;
  initClass(classes: unknown, Class: unknown): unknown;
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
    constructor(re: number, im: number);
    real(): number;
    imag(): number;
  }

  class Matrix {
    constructor(arg0: number, arg1?: number);
    constructor(arg0: number[] | number[][] | Matrix);
    static identity(m: number, n: number): Matrix;
    static ones(m: number, n: number): Matrix;
    static constant(m: number, n: number, x: number): Matrix;
    static random(m: number, n: number): Matrix;
    static diagonal(vector: Matrix): Matrix;
    static fromVector(v: Vector2d): Matrix;
    transpose(): Matrix;
    transposeSelf(): Matrix;
    inverse(): Matrix;
    rows(): number;
    cols(): number;
    norm(): number;
    normSqr(): number;
    l1Norm(): number;
    lInfNorm(): number;
    rank(): number;
    det(): number;
    sum(): number;
    block(i: number, j: number, di: number, dj: number): Matrix;
    setBlock(i: number, j: number, block: Matrix): void;
    mul(s: number): Matrix;
    mulSelf(s: number): Matrix;
    div(s: number): Matrix;
    divSelf(s: number): Matrix;
    matAdd(B: Matrix): Matrix;
    matAddSelf(B: Matrix): Matrix;
    matSub(B: Matrix): Matrix;
    matSubSelf(B: Matrix): Matrix;
    matMul(B: Matrix): Matrix;
    matMulSelf(B: Matrix): Matrix;
    get(i: number, j?: number): number;
    set(i: number, j: number, s: number): void;
    set(i: number, s: number): void;
    hcat(B: Matrix): Matrix;
    vcat(B: Matrix): Matrix;
    print(title: string): void;
    clamp(lo: number, hi: number): Matrix;
    clampSelf(lo: number, hi: number): Matrix;
    length(): number;
    vGet(i: number): number;
    vSet(i: number, s: number): void;
    dot(B: Matrix): number;
  }

  class ComplexDenseMatrix {
    // TODO
  }

  class TripletVector {
    // TODO
  }

  class SparseMatrix {
    // TODO
  }

  type ComputationInfo = unknown; // TODO

  interface EigenSolverResult {
    info: ComputationInfo;
    eigenvalues: ComplexDenseMatrix;
    eigenvectors: ComplexDenseMatrix;
  }

  interface CareSolverResult {
    info: ComputationInfo;
    K: Matrix;
    S: Matrix;
  }

  class Solvers {
    static eigenSolve(M: Matrix, computeEigenvectors: boolean): EigenSolverResult;
    static careSolve(M: Matrix, computeEigenvectors: boolean): CareSolverResult;
  }

  interface CholeskyResult {
    L: Matrix;
  }

  interface LUResult {
    L: Matrix;
    U: Matrix;
    P: Matrix;
    Q: Matrix;
  }

  interface QRResult {
    Q: Matrix;
    R: Matrix;
  }

  interface SVDResult {
    sv: Matrix;
    U: Matrix;
    V: Matrix;
  }

  class Decompositions {
    static cholesky(M: Matrix): CholeskyResult;
    static lu(M: Matrix): LUResult;
    static qr(M: Matrix): QRResult;
    static svd(M: Matrix, thin: boolean): SVDResult;
  }

  class QuadProgSolver {
    static solve(P: SparseMatrix, q: Matrix, A: SparseMatrix, l: Matrix, u: Matrix): Matrix;
    static solveSparse(): void;
    static solveBasic(): void;
  }

  class Random {
    static normal(mean: Matrix, cov: Matrix, samples: number): Matrix;
  }
}

export default eig;
