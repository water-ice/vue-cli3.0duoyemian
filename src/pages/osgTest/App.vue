<template>
  <div class="osg">
      <button @click="open">判断端内端外</button>
  </div>
</template>
<script>
export default {
  name: 'osg',
  methods: {
    open() {
      this.$osg().then(() => {
        // eslint-disable-next-line
          alert('success')
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  body {
    a, a:hover {
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      outline: 0;
    }
  }
</style>
