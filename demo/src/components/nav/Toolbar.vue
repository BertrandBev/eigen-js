<template lang="pug">
v-app-bar(app clipped-left
          :color='color'
          :dark='dark'
          dense)
  v-app-bar-nav-icon(v-if='!showBack'
                     @click.stop="toggleDrawer")
  v-toolbar-items(v-else
                  style='margin-left: 0px')
    v-btn.mr-2(icon @click='navBack')
      v-icon(small) fas fa-chevron-left
  v-toolbar-title.headline
    span.font-weight-light {{ title }}
  v-spacer
  v-toolbar-items
    v-btn(href='', target='_blank', text)
      span.mr-2 Github
      v-icon mdi-open-in-new
</template>

<script>
import _ from "lodash";
import { routes } from "@/router/router";

export default {
  props: {
    drawer: Boolean
  },

  computed: {
    title() {
      const route = _.find(routes, r => r.name === this.routeName);
      return _.get(route, "title");
    },

    showBack() {
      return false;
    },

    dark() {
      return true;
    },

    color() {
      return _.get(
        {
          home: "#004D40"
        },
        this.routeName,
        "primary"
      );
    },

    routeName() {
      return _.get(this.$route, "name", null);
    },

    routeQuery() {
      return _.get(this.$route, "query", {});
    }
  },

  created() {},

  methods: {
    toggleDrawer() {
      this.$emit("update:drawer", !this.drawer);
    },

    navBack() {
      this.$bus.$emit("navBack");
    }
  }
};
</script>