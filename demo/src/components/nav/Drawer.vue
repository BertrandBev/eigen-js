<template lang="pug">
v-navigation-drawer(v-model='drawer'
                    app clipped)
  v-list(dense)
    //* Routes
    div(v-for='routes, name in groups'
        :key='`group_${name}`')
      v-list-item
        v-list-item-content
          v-list-item-subtitle {{ name }}
      v-list-item(v-for='item, idx in routes'
                  :key='`item_${idx}`'
                  @click='nav(item.name)'
                  :class='{ active: isActive(item.name) }')
        v-list-item-action
          v-icon {{ item.icon }}
        v-list-item-content
          v-list-item-title {{ item.title }}
  //* Footer
  v-divider
  v-list(dense style='flex: 0 0 auto')
    v-list-item(@click='github')
      v-list-item-action
        v-icon mdi-github
      v-list-item-content
        v-list-item-title Github
</template>

<script>
import { routes } from "@/router/router";
import _ from "lodash";

export default {
  data: () => ({
    drawer: false
  }),

  props: {
    value: Boolean
  },

  computed: {
    groups() {
      const groups = {};
      routes
        .filter(el => !!el.group)
        .forEach(route => {
          if (!_.has(groups, route.group)) groups[route.group] = [];
          groups[route.group].push(route);
        });
      return groups;
    }
  },

  methods: {
    toggle() {
      this.drawer = !this.drawer;
    },

    github() {
      window.open("https://github.com/BertrandBev/eigen-js", "_blank");
    },

    isActive(name) {
      return this.$route.name === name;
    },

    nav(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style scoped>
.active {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>