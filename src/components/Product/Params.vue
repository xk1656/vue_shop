<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-alert
    title="Notice: only allow to set params for Level 3 categories"
    type="warning" show-icon :closable="false">
  </el-alert>
    <el-row class="cat_opt">
      <el-col>
        <span>
          Choose Product Category:
        </span>
        <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="cateChanged">
          </el-cascader>
      </el-col>
    </el-row>
     <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="Dynamic Parameters" name="many">
     <el-button :disabled="isDisabled" type="primary" @click="addInfo">Add Parameters</el-button>
     <el-table :data="manyTabData" border stripe>
       <el-table-column type="expand" >
         <template slot-scope="scope">
           <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
           <el-input
           class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
         </template>
       </el-table-column>
       <el-table-column
         type="index" >
       </el-table-column>
       <el-table-column prop="attr_name" label="Params Name" >
       </el-table-column>
       <el-table-column label="Operate" >
         <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">Delete</el-button>
       </template>
       </el-table-column>
     </el-table>
    </el-tab-pane>
    <el-tab-pane :disabled="isDisabled" label="Product Information" name="only">
     <el-button type="primary" @click="addInfo">Add Specification</el-button>
     <el-table :data="onlyTabData" border stripe>
        <el-table-column type="expand" >
         <template slot-scope="scope">
           <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
           <el-input
           class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
         </template>
       </el-table-column>
       <el-table-column
         type="index" >
       </el-table-column>
       <el-table-column prop="attr_name" label="Product Specification" >
       </el-table-column>
       <el-table-column label="Operate" >
         <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">Delete</el-button>
       </template>
       </el-table-column>
     </el-table>
    </el-tab-pane>
  </el-tabs>
  </el-card>

  <el-dialog
  :title="'Add '+titleText"
  :visible.sync="addDialogVisible"
  width="30%" @close="addDialogClosed">
  <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="auto">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addInfoConfirm">Confirm</el-button>
  </span>
</el-dialog>

<el-dialog
  :title="'Edit '+titleText"
  :visible.sync="editDialogVisible"
  width="30%" >
  <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="auto">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="editInfoConfirm">Confirm</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedKeys: [],
      parentCateList: [],
      cascaderProps: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: 'Please input product information', trigger: 'blur' }]
      },
      editRules: {
        attr_name: [{ required: true, message: 'Please input product information', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getParentCateList()
  },
  methods: {
    async cateChanged() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('Get data failed')
      }
      this.parentCateList = res.data
    },
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.parentCateList = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('Get data failed')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') this.manyTabData = res.data
      else this.onlyTabData = res.data
    },
    addInfo() {
      this.addDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addInfoConfirm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('Update product information failed')
        this.$message.success('Update product information successfully')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params:
          { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('Get product information failed')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editInfoConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('Update product information failed')
        this.$message.success('Update product information successfully')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams(id) {
      const confirmResult = await this.$confirm('This will permanently delete the product info. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) return this.$message.error('Delete product information failed')
        this.$message.success('Delete product information successfully')
        this.getParamsData()
      }
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('Update product information failed')
      this.$message.success('Update product information successfully')
      this.getParamsData()
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') return 'Parameters'
      return 'Specification'
    }
  }
}
</script>

<style lang="less">
  .cat_opt {
    margin: 20px 0;
    font-size: 14px;
  }

  .el-cascader {
    width: 25%;
    margin-left: 20px;
  }
  .el-tabs__header {
    margin-bottom: 25px!important;
  }
  .input-new-tag {
    width: 150px!important;
    margin-left: 10px;
  }
</style>
