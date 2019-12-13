<template lang="pug">
v-navigation-drawer(app clipped
                    :value='value'
                    @input='val => $emit("input", val)')
  v-list(dense)
    //* Classes
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
</template>

<script>
import { routes } from "@/router/router";
import _ from "lodash";

export default {
  data: () => ({}),

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
      console.log("groups", groups);
      return groups;
    }
  },

  methods: {
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