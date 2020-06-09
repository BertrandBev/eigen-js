<template lang='pug'>
//- v-alert(v-model='visible'
//-         border='left'
//-         outlined
//-         dismissible
//-         min-width='100%'
//-         icon='mdi-chevron-right'
//-         color='green')
div.grey--text.text--darken-2(v-katex='expression')
</template>

<script>
import { getTex } from "./texUtils.js";
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
      return getTex(this.value);
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

