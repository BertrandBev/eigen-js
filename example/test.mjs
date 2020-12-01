import eig from 'eigen'

(async () => {
  await eig.ready
  const M = new eig.Matrix([[1, 2], [3, 4]])
  M.print("M");
  M.inverse();
  M.print("Minv");
  eig.GC.flush();
})();