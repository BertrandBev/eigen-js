<template lang='pug'>
v-col.py-0.px-0
  div(style='position: relative')
    pre.hljs(v-if='!editable')
      span(v-html='highlightedCode')
    codemirror(v-else
               ref="codeMirror"
               :value="code")
    div.actionBar
      v-btn(v-if='!editable'
            icon fab dark small color='green'
            @click='edit')
        v-icon mdi-pencil
      v-btn(icon fab dark small color='green'
            @click='run')
        v-icon mdi-play
  //- v-row.pa-0(align='center' style='position: relative; width: 300px')
    //- v-btn.ml-2(style='flex: 0 0 auto'
    //-             @click='eval') EVAL
  v-row.mt-3(v-if='texEval')
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
import eig from "@eigen";
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

export default {
  name: "CodeArea",

  props: {
    code: String,
    texEval: Boolean
  },

  components: {
    TexDisplay
  },

  data: () => ({
    editable: false,
    showResult: false,
    result: null,
    showError: false,
    error: null
  }),

  computed: {
    highlightedCode() {
      return hljs.highlight("javascript", this.code, true).value;
    },

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

  watch: {
    code() {
      this.showResult = false;
      this.showError = false;
    }
  },

  methods: {
    edit() {
      this.editable = true;
    },

    getCode() {
      return this.editable
        ? this.$refs.codeMirror.codemirror.getValue()
        : this.code;
    },

    runAsync() {
      this.showResult = false;
      this.showError = false;
      const code = this.getCode();
      this.$worker
        .run(new Function("eig", code), [eig])
        .then(res => {
          this.result = res;
          this.showResult = true;
        })
        .catch(e => {
          this.showError = true;
          this.error = e;
        });
    },

    run() {
      if (this.texEval) {
        this.showResult = false;
        this.showError = false;
        let code = this.getCode();
        try {
          let f = new Function("eig", code);
          this.result = f(eig);
          // eig.GC.flush()
          this.showResult = true;
        } catch (e) {
          this.showError = true;
          this.error = e;
        }
      } else {
        this.$emit("run", this.getCode());
      }
    },

    clear() {
      this.showResult = false;
    }
  }
};
</script>

<style>
.CodeMirror {
  height: auto !important;
  padding-top: 4px;
  padding-bottom: 4px;
  /* min-height: 48px */
}
.CodeMirror-scroll {
  height: auto;
  /* overflow-y: hidden;
  overflow-x: auto; */
}
.actionBar {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 2;
}
</style>
