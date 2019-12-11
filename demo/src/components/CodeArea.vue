<template lang='pug'>
v-col
  v-row(align='center' style='position: relative')
    codemirror(style='flex: 1 0 auto'
               ref="codeMirror"
               :value="code")
    v-btn(style='position: absolute; right: 5px; bottom: 5px; z-index: 10'
          icon fab dark small color='green'
          @click='eval')
      v-icon mdi-play
    //- v-btn.ml-2(style='flex: 0 0 auto'
    //-             @click='eval') EVAL
  v-row.mt-3
    TexDisplay(v-if='showResult'
               :value='result'
               @clear='clear')
    v-alert(v-model='showError'
            dismissible
            border='left'
            color='red'
            dark dense
            min-width='100%'
            icon='mdi-alert-circle-outline') {{ error }}
</template>

<script>
const safeEval = require("safe-eval");
import TexDisplay from "@/components/TexDisplay.vue";
import eig from "@eigen/eigen.js";

export default {
  name: "CodeArea",

  props: {
    code: String
  },

  components: {
    TexDisplay
  },

  data: () => ({
    showResult: false,
    result: null,
    showError: false,
    error: null
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

  methods: {
    eval() {
      this.showResult = false;
      this.showError = false;
      let code = this.$refs.codeMirror.content;
      // Wrap code
      code = `(function fun() {'use strict'; ${code}})()`;
      try {
        this.result = safeEval(code, {
          eig
        });
        this.showResult = true;
        console.log("result", this.result);
      } catch (e) {
        this.showError = true;
        this.error = e;
      }
    },

    clear() {
      this.showResult = false;
    }
  },

  mounted() {}
};
</script>

<style>
.CodeMirror {
  height: auto !important;
}
.CodeMirror-scroll {
  height: auto;
  /* overflow-y: hidden;
  overflow-x: auto; */
}
</style>
