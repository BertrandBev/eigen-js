interface GarbageCollector {
  add(...addList: any[]): void; // TODO
  pushException(...exceptionList: any[]): void; // TODO
  flush(): void;
  set(ref: any, name: any, newObj: any): void; // TODO
  initClass(classes: any, Class: any): object; // TODO
}

declare namespace eig {
  const GC: GarbageCollector;
  const ready: Promise<void>;

  class Vector {
    // TODO
  }

  class Vector2d {
    // TODO
  }

  class Complex {
    // TODO
  }

  class Matrix {
    constructor(rows: number, columns?: number);
    constructor(arg0: number[] | number[][] | Matrix);
    // TODO
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
