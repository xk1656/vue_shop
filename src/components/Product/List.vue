<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="queryInfo.query" clearable @clear="getGoodsList">
         <el-button slot="append" icon="el-icon-search" @click="getGoodsList">
           </el-button>
           </el-input>
           </el-col>
    <el-col :span="4"><el-button class="main_btn" @click="goAddGoods">Add Goods</el-button></el-col>
    </el-row>
    <el-table
      :data="goodsList"
      style="width: 100%" stripe border>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="Goods Name" width="600px">
      </el-table-column>
       <el-table-column
        prop="goods_price"
        label="Goods Price">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="Goods Weight">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="Created Time">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat('yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column
        label="Operate">
         <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.goods_id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
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
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      addDialogVisible: false,
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('Get data failed')
      console.log(res.data)
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    editDialog() {},
    async removeById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the goods. Continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('goods/' + id)
        if (res.meta.status !== 200) { return this.$message.error('Delete goods failed') }
        this.$message({
          message: 'Delete goods successfully',
          type: 'success'
        })
        this.getGoodsList()
      }
    },
    goAddGoods() {
      this.$router.push('goods/add')
    }
  }
}

</script>
