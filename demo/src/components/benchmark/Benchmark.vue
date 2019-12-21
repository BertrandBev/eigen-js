<template lang="pug">
div
  //- centered
  span.headline.font-weight-light {{ name }}
  v-tabs.elevation-2.mt-2(v-model='tab'
                          background-color='primary'
                          dark
                          grow)
    v-tabs-slider
    v-tab(v-for='fun, lib in tabs'
          :key='`tab_${lib}`')
      //- :href='`#tab-${lib}`')
      | {{ libName(lib) }}
    v-tab-item(v-for='fun, lib in tabs'
              :key='`tab_item_${lib}`')
      CodeArea(:ref='`codeArea_${lib}`'
               :code='fun'
               @run='() => runBenchmark(lib)')
  //* Params
  div(style='display: flex; margin-top: 28px')
    v-text-field(v-model.number='params.size'
                 label='Matrix size'
                 hide-details
                 outlined
                 dense)
    v-text-field.ml-2(v-model.number='params.iterations'
                 label='Iteration count'
                 hide-details
                 outlined
                 dense)
    v-spacer
    v-btn(@click='runAll'
          outlined
          :loading='running'
          :disabled='running'
          color='primary') Run all

  //* Results
  v-simple-table.mt-5(style='background: transparent')
    thead
      tr
        th(v-for='fun, lib in tabs') {{ libName(lib) }}
    tbody
      tr
        td(v-for='fun, lib in tabs') {{ libResult(lib) }}
</template>

<script>
import CodeArea from "@/components/CodeArea.vue";
import _ from "lodash";

export default {
  components: {
    CodeArea
  },

  data: () => ({
    tab: 0,
    results: {},
    running: false
  }),

  props: {
    benchmark: Object
  },

  computed: {
    name() {
      return this.benchmark.data.name;
    },

    params() {
      return this.benchmark.data.params;
    },

    tabs() {
      return this.benchmark.functions;
    }
  },

  created() {
    // _.keys(this.tabs).forEach(lib => this.results[lib] = '-')
  },

  methods: {
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async runAll() {
      this.running = true;
      const libs = _.keys(this.tabs);
      libs.forEach(lib => this.$set(this.results, lib, `-`));
      for (let k = 0; k < libs.length; k++) {
        await this.runBenchmark(libs[k]);
      }
      this.running = false;
    },

    async runBenchmark(lib) {
      this.$set(this.results, lib, `-`);
      await this.timeout(25);
      const ref = this.$refs[`codeArea_${lib}`];
      const code = ref ? ref[0].getCode() : this.benchmark.functions[lib];
      const time = this.benchmark.run(code);
      this.$set(this.results, lib, `${time}ms`);
    },

    libName(lib) {
      return this.benchmark.libraries[lib].name;
    },

    libResult(lib) {
      return _.get(this.results, lib, "-");
    }
  }
};
</script>