<template lang='pug'>
v-col
  v-row(align='center')
    .font-weight-medium {{ name }}
    v-chip.ml-2(v-if='chipName'
                :color='chipColor'
                label
                outlined
                x-small) {{ chipName }}
  v-row.mt-1
    Description(:data='description')
  v-row
    Warning.mt-1(v-for='warning, idx in warnings'
                 :key='`warning_${idx}`'
                 :data='warning.description')
  Parameter.mt-1.ml-2(v-for='param, idx in params'
                      :key='`param_${idx}`'
                      :data='param')
  Parameter.mt-1.ml-2(v-for='ret, idx in returns'
                      :key='`return_${idx}`'
                      :data='ret')
  v-row.mt-2
    CodeArea(v-for='example, idx in examples'
            :key='`example_${idx}`'
            :code='example.description'
            texEval)
</template>

<script>
import Description from "@/components/Description.vue";
import Warning from "@/components/Warning.vue";
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
    Warning,
    Parameter,
    CodeArea
  },

  data: () => ({}),

  created() {
    if (this.name === "length") console.log("method", this.data);
  },

  computed: {
    scope() {
      return this.constructorClass ? "constructor" : _.get(this.data, "scope");
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
    },

    warnings() {
      return _.get(this.data, "tags", []).filter(
        tag => tag.title === "warning"
      );
    },

    chipName() {
      return this.scope !== "instance" ? this.scope : null;
    },

    chipColor() {
      return {
        constructor: "green",
        static: "red"
      }[this.scope];
    }
  },

  methods: {}
};
</script>
