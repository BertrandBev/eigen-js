<template lang="pug">
div(style='display: flex; flex-direction: column; align-items: center')
  div(:style='divStyle')
    div(style='display: flex; flex-direction: column; align-items: center')
      v-img(src='@assets/logo_white.svg'
            width='150px')
      span.display-1.font-weight-light.white--text(
        style='margin-top: 16px') Eigen JS
      Demo(style='margin-top: 48px')
  div(style='width: 100%; max-width: 960px; padding: 40px'
      v-html='markdownHtml')
</template>

<script>
import Demo from "@/components/home/Demo.vue";
import markdown from "!raw-loader!../../../README.md";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript"
import bash from "highlight.js/lib/languages/bash"
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);

export default {
  components: {
    Demo
  },

  data: () => ({
    markdown
  }),

  computed: {
    markdownHtml() {
      const highlight = function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs"><span>' +
              hljs.highlight(lang, str, true).value +
              "</span></pre>"
            );
          } catch (__) {
            console.error("Highlight parsing error");
          }
        }
        return (
          '<pre class="hljs"><span>' +
          md.utils.escapeHtml(str) +
          "</span></pre>"
        );
      };
      const md = new MarkdownIt({
        highlight,
        html: true
      });
      return md.render(markdown);
    },

    divStyle() {
      return {
        width: `${this.$store.windowSize.x}px`,
        height: `${this.$store.windowSize.y}px`,
        display: "flex",
        "flex-direction": "row",
        "justify-content": "center",
        "align-items": "center",
        background: "#00796B"
      };
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style>
</style>