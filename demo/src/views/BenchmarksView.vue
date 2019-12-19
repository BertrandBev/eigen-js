<template lang='pug'>
v-container
  v-col
    v-row
      .headline.font-weight-light Benchmarks of linear algebra javascript libraries
    v-row.mt-1
      span.pl-2.grey--text.text--darken-2
      | This table compares the features offered by different javascript libraries for linear algebra
      | The next table compares the performance of the libraries and displays the computing time in milliseconds of standard linear algebra operations.
  //*
  Benchmark.mt-2(v-for='benchmark, idx in benchmarks'
                 :key='`benchmark_${idx}`'
                 :benchmark='benchmark')
</template>

<script>
import _ from "lodash";
import eig from "@eigen";
import Benchmark from "@/components/benchmark/Benchmark.vue";
import benchmarks from "@/components/benchmark/benchmark.js";

export default {
  name: "BenchmarksView",

  props: {},

  components: { Benchmark },

  data: () => ({
    benchmarks
  }),

  computed: {},

  methods: {},

  mounted() {}
};
</script>
