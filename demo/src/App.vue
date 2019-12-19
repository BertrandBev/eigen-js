<template lang='pug'>
v-app(v-resize="onResize")
  Drawer(ref='drawer')
  Toolbar(@toggleDrawer='toggleDrawer')
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
import eig from "@eigen";
import Toolbar from "@/components/nav/Toolbar.vue";
import Drawer from "@/components/nav/Drawer.vue";

export default {
  name: "App",

  components: {
    Toolbar,
    Drawer
  },

  data: () => ({
    loading: true
  }),

  created() {
    eig.ready.then(() => {
      this.loading = false;
    });
  },

  mounted() {},

  methods: {
    onResize() {
      console.log("onResize");
      this.$store.windowSize.x =
        window.innerWidth - this.$vuetify.application.left;
      this.$store.windowSize.y =
        window.innerHeight - this.$vuetify.application.top;
    },

    toggleDrawer() {
      this.$refs.drawer.toggle();
    }
  }
};
</script>

<style>
</style>