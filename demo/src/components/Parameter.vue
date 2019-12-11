<template lang="pug">
  v-row
    v-icon(:color='color') {{ icon }}
    span.ml-2(v-if='name') {{ name }}
    span.font-weight-bold.ml-2 ({{ type }}):
    span.grey--text.text--darken-2.ml-2 {{ description }}
</template>

<script>
import _ from "lodash";

export default {
  props: {
    data: Object
  },

  computed: {
    name() {
      return this.title !== "returns" ? _.get(this.data, "name") : null;
    },

    title() {
      return _.get(this.data, "title");
    },

    description() {
      return _.get(this.data, "description.children[0].children[0].value");
    },

    type() {
      return _.get(this.data, "type.name");
    },

    icon() {
      return {
        param: "mdi-alpha-p-circle-outline",
        returns: "mdi-alpha-r-circle-outline"
      }[this.title];
    },

    color() {
      return {
        param: "blue",
        returns: "red"
      }[this.title];
    }
  }
};
</script>