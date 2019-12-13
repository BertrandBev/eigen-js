<template lang='pug'>
v-alert(v-model='visible'
        border='left'
        outlined
        dismissible
        min-width='100%'
        icon='mdi-chevron-right'
        color='green')
  div.grey--text.text--darken-2(v-katex='expression')
</template>

<script>
import eig from "@eigen/eigen.js";
import _ from "lodash";

export default {
  name: "TexDisplay",

  props: {
    value: [Object, String, Number, Array]
  },

  data: () => ({
    visible: true
  }),

  computed: {
    expression() {
      return this.getTex(this.value);
    }
  },

  watch: {
    value() {
      this.visible = true;
    },

    visible() {
      if (!this.visible) {
        this.$emit("clear");
      }
    }
  },

  methods: {
    getTex(val) {
      if (_.isPlainObject(val)) {
        const list = [];
        _.forEach(val, (sub, key) => {
          list.push(`\\text{${key}:} ${this.getTex(sub)}`);
        });
        return list.join(", ");
      }
      if (Array.isArray(val)) {
        return val.map(this.getTex).join(", ");

        // const body = val.map(this.format).join(" & ");
        // return `
        //   \\begin{bmatrix}
        //   ${body}
        //   \\end{bmatrix}
        // `;
      } else if (
        val instanceof eig.Matrix ||
        val instanceof eig.ComplexDenseMatrix
      ) {
        let body = [];
        for (let i = 0; i < val.rows(); i++) {
          const row = [];
          for (let j = 0; j < val.cols(); j++) {
            const v = val.get(i, j);
            const str = row.push(this.getTex(v));
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
            Math.abs(v) > 1e-8 ? this.format(v) + (idx === 1 ? "i" : "") : null
          )
          .filter(val => !!val);
        return ri.join(" + ");
      } else if (typeof val === "number") {
        return `${this.format(val)}`;
      } else if (typeof val === "string") {
        return `${val}`;
      } else if (val) {
        const constructor = val.constructor;
        return `${constructor ? constructor.name : typeof val}`;
      } else {
        return `${val}`;
      }
    },

    format(val) {
      return  `${val}`.length < 5 ? `${val}` : val.toFixed(3);
    },

    parse(object) {}
  },

  mounted() {}
};
</script>

