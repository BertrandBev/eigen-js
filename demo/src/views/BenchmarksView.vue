<template lang='pug'>
v-container
  v-col
    v-row
      .headline.font-weight-light Benchmarks of linear algebra javascript libraries
    v-row.mt-1
      span.pl-2.grey--text.text--darken-2
      | These tables compare the performances of different javascript linear algebra libraries
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
