<template>
  <div>
    <el-button type="pinfo" @click='logout'>log out</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scope>
</style>
