<template lang='pug'>
v-container
  v-col
    .display-1.font-weight-light Expressions
    .body-1 Basic Expressions such as add, sub, mul
    v-alert(border='left'
            color='blue'
            dark dense
            icon='mdi-information-variant') Some alert
    CodeArea
</template>

<script>
import CodeArea from "@/components/CodeArea.vue";

export default {
  name: "DenseMatrix",

  components: {
    CodeArea
  },

  data: () => ({
    code: null
  }),

  computed: {
    expression() {
      return "\\frac{a_i}{1+x}";
    },

    matrix() {
      return `
      \\begin{pmatrix}
      a & b \\\\
      c & d
      \\end{pmatrix}`;
    }
  },

  methods: {},

  mounted() {}
};
</script>
