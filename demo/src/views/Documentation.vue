<template lang='pug'>
.docs-container
  DocsClass.docs-class(:data='data'
                       :env='env')
    template(v-slot:default='props')
      TexDisplay(:value='props.result')
</template>

<script>
import TexDisplay from "@/components/TexDisplay.vue";
import DocsClass from "@vue-live-docs/components/DocsClass.vue";
import doc from "@docs/doc.json";
import _ from "lodash";
import eig from "@eigen";

export default {
  name: "Documentation",

  props: {
    className: String
  },

  components: {
    DocsClass,
    TexDisplay
  },

  data: () => ({}),

  computed: {
    data() {
      return doc.filter(obj => obj.namespace === this.className)[0];
    },

    env() {
      return { eig };
    }
  },

  methods: {},

  watch: {},

  mounted() {}
};
</script>

<style scoped>
.docs-container {
  display: flex;
  height: 100%;
  justify-content: center;
  background: #f0f2f5;
}

.docs-class {
  max-width: 920px;
  height: 100%;
  background: white;
  padding: 64px;
  padding-top: 48px;
  border-left-style: solid;
  border-right-style: solid;
  border-color: #00000022;
  border-width: 1px;
}
</style>