<template lang='pug'>
v-app
  Drawer(v-model='drawer')
  Toolbar(:drawer.sync='drawer')
  v-content
    //* Loading row
    v-row(v-if='loading'
          align='center'
          justify='center'
          style='height: 100%')
      v-progress-circular(:size='40'
                          color='blue'
                          indeterminate)
    //* Content
    router-view(v-else)
</template>

<script>
import eig from "@eigen/eigen.js";
import Toolbar from "@/components/nav/Toolbar.vue";
import Drawer from "@/components/nav/Drawer.vue";

export default {
  name: "App",

  components: {
    Toolbar,
    Drawer
  },

  data: () => ({
    drawer: false,
    loading: true
  }),

  created() {
    eig.ready = () => {
      this.loading = false;
    };
  }
};
</script>
