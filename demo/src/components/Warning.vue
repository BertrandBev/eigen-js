<template lang="pug">
v-alert(border='left'
        color='orange darken-3'
        outlined
        dark dense
        icon='mdi-information-variant') {{ data }}
</template>

<script>
export default {
  props: {
    data: String
  }
};
</script>