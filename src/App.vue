<template>
  <div id="app">
    <MarkdownDemo />
  </div>
</template>

<script>
import MarkdownDemo from './views/markdown.vue';

export default {
  name: 'App',
  components: {
    MarkdownDemo,
  }
};
</script>

<style scoped>
#app {
  margin: 20px;
}
</style>
