<template lang='pug'>
v-app
  v-app-bar(app, color='primary', dark)
    v-spacer
    v-btn(href='https://github.com/vuetifyjs/vuetify/releases/latest', target='_blank', text)
      span.mr-2 Latest Release
      v-icon mdi-open-in-new
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

export default {
  name: "App",

  data: () => ({
    loading: true
  }),

  created() {
    eig.ready = () => {
      this.loading = false;
    };
  }
};
</script>
