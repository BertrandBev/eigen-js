import eig from '../dist/index.js'
// In a browser environment, install eigen from npm, and import it with
// import eig from 'eigen'

(async () => {
  await eig.ready
  let M = new eig.Matrix([[1, 2], [3, 4]])
  M.print("M");
  M = M.inverse();
  M.print("Minv");
  eig.GC.flush();
})();