<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-col ><el-button class="main_btn" @click="addCateDialog">Add Categories</el-button></el-col>
    </el-row>
     <tree-table :data="cateList" :columns="columns" :expand-type="false" :selection-type="false" show-index index-text="#" border :show-row-hover="false" >
       <template slot-scope="scope" slot="isAvailable">
         <i class="el-icon-success" v-if="scope.row.cat_delete='false'"></i>
         <i class="el-icon-error" v-else></i>
       </template>
       <template slot-scope="scope" slot="level">
         <el-tag v-if="scope.row.cat_level === 0">Level 1</el-tag>
         <el-tag type="success" v-else-if="scope.row.cat_level === 1">Level 2</el-tag>
         <el-tag type="warning" v-else>Level 3</el-tag>
       </template>
       <template slot="operate" slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" >Edit</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row)">Delete</el-button>
       </template>
     </tree-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <el-dialog
  title="Add New Category"
  :visible.sync="addCateDialogVisible"
  width="50%"
  @close="addCateDialogClosed">
  <el-form ref="addCateFormRef" :rules="addCateFormRules" :model="addCateForm" label-width="140px" label-position="left">
  <el-form-item label="Category Name" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="Choose Category">
    <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable>
          </el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addCate">Confirm</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: 'Please input Category Name', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectedKeys: [],
      cascaderProps: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      cateList: [],
      columns: [{
        label: 'Category Name',
        prop: 'cat_name'
      },
      {
        label: 'Available',
        type: 'template',
        template: 'isAvailable'
      },
      {
        label: 'Level',
        type: 'template',
        template: 'level'
      },
      {
        label: 'Operate',
        type: 'template',
        template: 'operate'
      }]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('Get categories data failed')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('Get data failed')
      }
      this.parentCateList = res.data
    },
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res.data)
        if (res.meta.status !== 201) {
          return this.$message.error('Add Category failed')
        }
        this.$message.success('Add category successfully')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    addCateDialogClosed() {
      this.addCateDialogVisible = false
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async removeCateById(cate) {
      const confirmResult = await this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('categories/' + cate.cat_id)
        if (res.meta.status !== 200) {
          return this.$message.error('Delete Category failed')
        }
        this.$message.success('Delete category successfully')
        this.getCateList()
      }
    }
  }
}
</script>

<style lang="less">
  .zk-table {
    margin-top: 30px;
  }
  .el-icon-success {
    color: lightgreen;
  }
  .el-icon-error {
    color: red;
  }
  .el-scrollbar__wrap {
    height: 320px!important;
}
.el-cascader {
  width: 100%;
}
</style>
