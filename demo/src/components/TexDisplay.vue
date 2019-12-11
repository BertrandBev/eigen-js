<template lang='pug'>
v-alert(v-model='visible'
        border='left'
        outlined
        dismissible
        min-width='100%'
        icon='mdi-chevron-right'
        color='green')
  div.black--text(v-katex='expression')
</template>

<script>
import eig from "@eigen/eigen.js";

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
      if (typeof this.value === "number") {
        console.log("number");
        return `${this.value}`;
      } else if (Array.isArray(this.value)) {
        console.log("is array");
        const body = this.value.map(val => val).join(" & ");
        return `
          \\begin{bmatrix}
          ${body}
          \\end{bmatrix}
        `;
      } else if (this.value instanceof eig.DenseMatrix) {
        let body = [];
        for (let i = 0; i < this.value.rows(); i++) {
          const row = [];
          for (let j = 0; j < this.value.cols(); j++) {
            row.push(this.value.get(i, j));
          }
          body.push(row.join(" & "));
        }
        return `
          \\begin{pmatrix}
          ${body.join("\\\\")}
          \\end{pmatrix}
        `;
      } else {
        const constructor = this.value.constructor;
        return `${constructor ? constructor.name : typeof this.value}`;
      }
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
    parse(object) {}
  },

  mounted() {}
};
</script>

