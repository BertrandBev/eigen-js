<template lang='pug'>
v-container
  v-col
    v-row
      .display-1.font-weight-light Benchmark for linear algebra javascript libraries
    v-row.mt-1
      span.pl-2.grey--text.text--darken-2
      | This table compares the features offered by different javascript libraries for linear algebra
      | The next table compares the performance of the libraries and displays the computing time in milliseconds of standard linear algebra operations.
    v-row
      v-btn(@click='run') Run Benchmark
    

</template>

<script>
import _ from "lodash";
import eig from "@eigen/eigen.js";
export default {
  name: "Benchmark",

  props: {},

  components: {},

  data: () => ({}),

  computed: {},

  methods: {
    run() {
      // benchmarks.forEach(bench => {
      //   const types = _.keys(bench.benchmark).filter(v => v !== "body");
      //   types.forEach(type => {
      //     const benchFun = createBenchmark(bench.benchmark, type);
      //     const time = runBenchmark(benchFun, bench.params);
      //     console.log(`${bench.name} - ${type} - Time: ${time}ms`);
      //   });
      // });
    }
  },

  mounted() {}
};
</script>
