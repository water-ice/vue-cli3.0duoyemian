<template>
  <div>
      <el-button type="primary" disabled>主要按钮</el-button>
      <span>test</span>
  </div>
</template>
<script>
export default {
  name: 'ty',
  created() {
    this.$fetch.get(
      '/api/athena/teacher/myformalclassstudents?rn=5&pn=0',
      ).then((res) => {
      
    })
  }
};
</script>
<style lang="less" scoped>

</style>

