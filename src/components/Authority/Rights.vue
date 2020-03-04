<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
     <el-table
       border stripe
      :data="rightsList"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="Authority Name">
      </el-table-column>
      <el-table-column
        prop="path"
        label="Path">
      </el-table-column>
      <el-table-column
        prop="level"
        label="Authority Level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">Level 2</el-tag>
          <el-tag type="warning" v-else>Level 3</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('get data failed')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less">
</style>
