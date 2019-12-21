<template lang='pug'>
div(style='display: flex; justify-content: center; padding: 20px')
  Class(style='max-width: 920px'
        :data='data')
</template>

<script>
import Class from "@/components/Class.vue";
import doc from "@docs/doc.json";
import _ from "lodash";

export default {
  name: "Documentation",

  props: {
    className: String
  },

  components: {
    Class
  },

  data: () => ({}),

  computed: {
    data() {
      return doc.filter(obj => obj.namespace === this.className)[0];
    }
  },

  methods: {},

  watch: {
    
  },

  mounted() {
  }
};
</script>
