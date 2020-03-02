<template>
  <el-container class="home_container">
  <el-header>
    <div>
      <img src="../assets/JosephBuy_logo.png" alt="">
      <span>JosephBuy® Management System</span>
    </div>
    <el-button type="info" @click='logout' class="logout">log out</el-button></el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle_button" @click="toggleCollapase"> &lt;&lt;&lt; </div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#c81623" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
          </el-menu-item>
        </el-submenu>
    </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [],
      activePath: '',
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList: async function() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) { return this.$message.error(res.meta.error) }
      this.menuList = res.data
    },
    toggleCollapase: function() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState: function(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scope>
body {
  font-family: sans-serif;
}

 .el-header{
   padding-left: 0px!important;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      height: 100%;
      align-items: center;
      font-family: sans-serif;
    }
    img{
       height: 100%;
       margin-right: 15px;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
.home_container {
  height: 100%;
}

.iconfont {
  margin-right: 15px
}
.toggle_button {
  background-color: #4a5064;
  font-size: 14px;
  line-height:  24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}

</style>
