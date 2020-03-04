<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col ><el-button class="main_btn" >Add Roles</el-button></el-col>
    </el-row>
    <el-dialog
  title="Edit Role"
  :visible.sync="editRoleDialogVisible"
  width="50%">
  <el-form :model="editRoleList" label-width="120px">
  <el-form-item label="Role Name" prop="roleName">
    <el-input v-model="editRoleList.roleName"></el-input>
  </el-form-item>
  <el-form-item label="Role Description" prop="roleDesc">
    <el-input v-model="editRoleList.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">Cancel</el-button>
    <el-button class="main_btn" @click="editRole()">Confirm</el-button>
  </span>
</el-dialog>
     <el-table
     :data="roleList"
       border stripe
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['vcenter','bdbottom', i1 === 0 ? 'bdtop' : '' ]" v-for="(item1, i1) in scope.row.children" :key="item1.id">
          <el-col :span="5">
            <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <el-col :span="19">
            <el-row :class="['vcenter', i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
              <el-col :span="6">
                <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
            </el-col>
            </el-row>
          </el-col>
        </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="Role Name">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="Role Description">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleDialog(scope.row.id)">Edit</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">Delete</el-button>
       <el-button type="warning" icon="el-icon-share" size="mini" @click="showRightDialog(scope.row)">User Role</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

      <el-dialog
  title="Assign Right"
  :visible.sync="showSetDialogVisible"
  width="50%" @close="setDialogClosed">
  <el-tree :data="rightsList" :props="treeProps" :default-checked-keys="defKeys" show-checkbox node-key="id" :default-expand-all="true" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showSetDialogVisible = false">Cancel</el-button>
    <el-button class="main_btn" @click="allotRights">Confirm</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightsList: [],
      editRoleList: {},
      roleId: '',
      editRoleDialogVisible: false,
      showSetDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('get data failed')
      this.roleList = res.data
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('Delete right failed')
        this.$message({
          type: 'success',
          message: 'Delete right successfully'
        })
        role.children = res.data
      }
    },
    async editRoleDialog(id) {
      this.editRoleDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('get user info failed') }
      this.editRoleList = res.data
    },
    async editRole() {
      const { data: res } = await this.$http.put('roles/' + this.editRoleList.roleId, { roleName: this.editRoleList.roleName, roleDesc: this.editRoleList.roleDesc })
      if (res.meta.status !== 200) { return this.$message.error('edit user failed') }
      this.$message({
        message: 'Edit user successfully',
        type: 'success'
      })
      this.editRoleDialogVisible = false
      this.getRolesList()
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the role. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) { return this.$message.error('Delete role failed') }
        this.$message({
          message: 'Delte user successfully',
          type: 'success'
        })
        this.getRolesList()
      }
    },
    async showRightDialog(role) {
      this.roleId = role.id
      this.showSetDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('get right info failed') }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.showSetDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('update right info failed') }
      this.$message.success('update right info successfully')
      this.getRolesList()
      this.showSetDialogVisible = false
    }
  }
}
</script>

<style lang="less">
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
