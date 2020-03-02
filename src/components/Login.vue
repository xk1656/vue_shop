<template>
  <div class="login_container">
    <div class="login_box">
<div class="avatar_box">
  <img src="../assets/JosephBuy_logo.png" alt="">
</div>
<el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
  <el-form-item prop="username">
    <el-input prefix-icon="el-icon-s-custom" placeholder="Username" v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input type="password" prefix-icon="el-icon-lock" placeholder="Password" v-model="loginForm.password"></el-input>
  </el-form-item>
  <el-form-item class="btns">
    <el-button class="main_btn" @click="login">Log In</el-button>
    <el-button type="info" @click="reset">Reset</el-button>
  </el-form-item>
</el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: 'Please input user name', trigger: 'blur' },
          { min: 5, max: 8, message: 'Length should be 6 to 8', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input user name', trigger: 'blur' },
          { min: 6, max: 15, message: 'Length should be 6 to 15', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('log in failed!')
        } else {
          this.$message({
            message: 'log in successfully',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      }
      )
    }
  }

}
</script>

<style  lang="less" scoped>
  .login_container {
    width: 100%;
    height: 100%;
    background-color: #c81623;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 3px;
    transform: translate(-50%, -50%);
  }
  .avatar_box{

    border-radius: 50%;
    border:2px solid #eee;
    height: 130px;
    width: 130px;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img{
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
