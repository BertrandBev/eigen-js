<template lang="pug">
div
  div(v-resize="onResize"
      :style='divStyle')
    div(style='display: flex; flex-direction: column; align-items: center')
      v-img(src='@assets/logo_white.svg'
            width='150px')
      span.display-1.font-weight-light.white--text(
        style='margin-top: 16px') Eigen JS
      Demo(style='margin-top: 48px')
    //- v-img(src='@assets/icon.png')
    //- span.headline.font-weight-light	Eigen JS
</template>

<script>
import Demo from "@/components/home/Demo.vue";

export default {
  components: {
    Demo
  },

  data: () => ({
    windowSize: [0, 0]
  }),

  computed: {
    divStyle() {
      return {
        width: `${this.windowSize[0]}px`,
        height: `${this.windowSize[1]}px`,
        display: "flex",
        "flex-direction": "row",
        "justify-content": "center",
        "align-items": "center",
        background: "#00796B"
      };
    }
  },

  mounted() {
    this.onResize();
  },

  methods: {
    onResize() {
      this.windowSize = [
        window.innerWidth,
        window.innerHeight - this.$vuetify.application.top
      ];
    }
  }
};
</script>