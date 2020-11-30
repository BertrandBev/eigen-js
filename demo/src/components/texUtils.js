import _ from 'lodash'
import eig from "@eigen";

function format(val) {
  return `${val}`.length < 5 ? `${val}` : val.toFixed(3);
}

function getTex(val) {
  if (_.isPlainObject(val)) {
    const list = [];
    _.forEach(val, (sub, key) => {
      list.push(`\\text{${key}: } ${getTex(sub)}`);
    });
    return list.join(", ");
  }
  if (Array.isArray(val)) {
    return val.map(getTex).join(", ");
  } else if (
    val instanceof eig.Matrix ||
    val instanceof eig.ComplexDenseMatrix
  ) {
    let body = [];
    for (let i = 0; i < val.rows(); i++) {
      const row = [];
      for (let j = 0; j < val.cols(); j++) {
        const v = val.get(i, j);
        const str = row.push(getTex(v));
      }
      body.push(row.join(" & "));
    }
    return `
      \\begin{pmatrix}
      ${body.join("\\\\")}
      \\end{pmatrix}
    `;
  } else if (val instanceof eig.Complex) {
    let ri = [val.real(), val.imag()];
    ri = ri
      .map((v, idx) =>
        Math.abs(v) > 1e-8 ? format(v) + (idx === 1 ? "i" : "") : null
      )
      .filter(val => !!val);
    return ri.join(" + ");
  } else if (typeof val === "number") {
    return `${format(val)}`;
  } else if (typeof val === "string") {
    return `${val}`;
  } else if (val) {
    const constructor = val.constructor;
    return `${constructor ? constructor.name : typeof val}`;
  } else {
    return `${val}`;
  }
}

export { getTex }