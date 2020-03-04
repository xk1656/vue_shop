<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="queryInfo.query" clearable @clear="getUserList">
         <el-button slot="append" icon="el-icon-search" @click="getUserList">
           </el-button>
           </el-input>
           </el-col>
      <el-col :span="4"><el-button class="main_btn" @click="addDialogVisible = true">Add Users</el-button></el-col>
      <el-dialog
  title="Add New User"
  :visible.sync="addDialogVisible"
  width="50%" @close="dialogClosed">
  <el-form :model="addForm" :rules="addFormRules" ref="AddFormRef" label-width="120px">
  <el-form-item label="User Name" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="Password" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="Email" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="Phone" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">Cancel</el-button>
    <el-button class="main_btn" @click="addUser">Confirm</el-button>
  </span>
</el-dialog>
<el-dialog
  title="Edit User Info"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
  <el-form-item label="User Name" prop="username">
    <el-input v-model="editForm.username" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="Email" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="Phone" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">Cancel</el-button>
    <el-button class="main_btn" @click="editUser()">Confirm</el-button>
  </span>
</el-dialog>
<el-dialog
  title="Set Role"
  :visible.sync="setRoleDialogVisible"
  width="30%" @close="setRoleDialogClosed">
  <div>
    <p>User Name: {{userInfo.username}}</p>
    <p>User Role: {{userInfo.role_name}}</p>
    <p>Set New Role:
       <el-select v-model="selectRoleId" placeholder="Select">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogClosed">Cancel</el-button>
    <el-button type="primary" @click="saveRoleInfo">Confirm</el-button>
  </span>
</el-dialog>
    </el-row>
    <el-table
       border stripe
      :data="userList"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="username"
        label="Name">
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="Phone">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="Role">
      </el-table-column>
      <el-table-column
        label="State">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#c81623" @change="userStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="Operate">
        <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
         <el-tooltip class="item" effect="dark" content="Change User Role" placement="top" :enterable="false">
       <el-button type="warning" icon="el-icon-share" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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

</div>
</template>

<script>
export default {

  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) { return cb() }
      cb(new Error('Please input correct email'))
    }

    var checkPhone = (rule, value, cb) => {
      const regPhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      if (regPhone.test(value)) { return cb() }
      cb(new Error('Please input correct phone number'))
    }
    return {
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRules: {
        username: [{ required: true, message: 'Please input user name', trigger: 'blur' }, { require: true, min: 3, max: 10, message: 'The length of user name must between 3 and 10', trigger: 'blur' }],
        password: [{ required: true, message: 'Please input password', trigger: 'blur' }, { require: true, min: 6, max: 15, message: 'The length of password must between 3 and 10', trigger: 'blur' }],
        email: [{ required: true, message: 'Please input email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        phone: [{ required: true, message: 'Please input phone number', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }]
      },
      editFormRules: {
        email: [{ required: true, message: 'Please input email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: 'Please input phone number', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      total: 0,
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userInfo: {},
      roleList: [],
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('查找失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('User role updates failed')
      }
      this.$message({
        message: 'User role updates successfully',
        type: 'success'
      })
    },
    dialogClosed() {
      this.$refs.AddFormRef.resetFields()
    },
    addUser() {
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) { return this.$message.error('add user failed') }
        this.$message({
          message: 'Add user successfully',
          type: 'success'
        })
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async editDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('get user info failed') }
      this.editForm = res.data
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) { return this.$message.error('edit user failed') }
        this.$message({
          message: 'Edit user successfully',
          type: 'success'
        })
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async removeUserById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) { return this.$message.error('Delete user failed') }
        this.$message({
          message: 'Delete user successfully',
          type: 'success'
        })
        this.getUserList()
      }
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('Get Role List failed') }
      this.roleList = res.data
    },
    setRoleDialogClosed() {
      this.setRoleDialogVisible = false
      this.selectRoleId = ''
      this.userInfo = {}
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('Please select a new role')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) { return this.$message.error('Get User Info failed') }
      this.$message({
        message: 'Update user role successfully',
        type: 'success'
      })
      this.setRoleDialogVisible = false
      this.getUserList()
    }
  }
}
</script>
