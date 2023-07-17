import { testSimplicialCholesky } from './simplicialcholesky/Tutorial_sparse_example'
import { Matrix } from './types' // TODO it does not pick eig namespace from eigen.d.ts for some reason, maybe becuase of require

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eig = require('../../../dist/index.js') // TODO if import is used, it gives error because importing outside module

beforeAll(async () => {
  await eig.ready
})

test('matrix type basic test', () => {
  let M = new eig.Matrix([
    [1, 2],
    [3, 4],
  ]) as Matrix
  M.print('M')
  M = M.inverse()
  M.print('Minv')
  eig.GC.flush()
})

test('SimplicialCholesky test', () => {
  console.info('SimplicialCholesky test')
  testSimplicialCholesky()
  eig.GC.flush()
  console.info('SimplicialCholesky done')
})
