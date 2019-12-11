<template lang='pug'>
v-container
  v-col
    //- v-alert(border='left'
    //-         color='blue'
    //-         dark dense
    //-         icon='mdi-information-variant') Some alert
    Class(:data='data')
</template>

<script>
import Class from "@/components/Class.vue";
import doc from "@docs/doc.json";
import _ from "lodash";

export default {
  name: "Documentation",

  components: {
    Class
  },

  data: () => ({}),

  computed: {
    data() {
      return doc[1]; // TODO: pass as argument
    }
  },

  methods: {},

  mounted() {
    console.log(doc);
  }
};
</script>
