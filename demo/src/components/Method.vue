<template lang='pug'>
v-col
  v-row
    .font-weight-medium {{ name }}
  v-row.mt-1
    Description(:data='description')
  Parameter.mt-1.ml-2(v-for='param, idx in params'
                      :key='`param_${idx}`'
                      :data='param')
  Parameter.mt-1.ml-2(v-for='ret, idx in returns'
                      :key='`return_${idx}`'
                      :data='ret')
  CodeArea(v-for='example, idx in examples'
           :key='`example_${idx}`'
           :code='example.description')
  //- v-alert(border='left'
  //-         color='blue'
  //-         dark dense
  //-         icon='mdi-information-variant') Some alert
</template>

<script>
import Description from "@/components/Description.vue";
import Parameter from "@/components/Parameter.vue";
import CodeArea from "@/components/CodeArea.vue";
import _ from "lodash";

export default {
  name: "Method",

  props: {
    data: Object,
    constructorClass: String
  },

  components: {
    Description,
    Parameter,
    CodeArea
  },

  data: () => ({}),

  created() {
    console.log("method", this.data);
  },

  computed: {
    scope() {
      return _.get(this.data, "scope");
    },

    name() {
      return this.constructorClass
        ? this.constructorClass
        : _.get(this.data, this.scope === "static" ? "namespace" : "name");
    },

    description() {
      return _.get(this.data, "description.children[0].children[0].value");
    },

    params() {
      return _.get(this.data, "params", []);
    },

    returns() {
      return _.get(this.data, "returns", []);
    },

    examples() {
      return _.get(this.data, "examples", []);
    }
  },

  methods: {}
};
</script>
