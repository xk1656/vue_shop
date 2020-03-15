<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>

   <el-card>
      <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="queryInfo.query" clearable @clear="getOrderList" placeholder="Please enter search content">
         <el-button slot="append" icon="el-icon-search" @click="getOrderList">
           </el-button>
           </el-input>
           </el-col>
    </el-row>
    <el-table border stripe
      :data="orderList"
      style="width: 100%">
      <el-table-column
        type="index" >
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="Order No." width="400px">
      </el-table-column>
       <el-table-column
        prop="order_price"
        label="Order Price">
      </el-table-column>
       <el-table-column
        prop="order_pay"
        label="Paid / Unpaid">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'" type="danger">Unpaid</el-tag>
          <el-tag type="success" v-else>Paid</el-tag>
           </template>
      </el-table-column>
       <el-table-column
        prop="is_send"
        label="Delivered / Undelivered">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.is_send === '否'" type="danger">Undelivered</el-tag>
          <el-tag type="success" v-else>Delivered</el-tag>
           </template>
      </el-table-column>
       <el-table-column
        prop="create_time"
        label="Order Time">
        <template slot-scope="scope">
        {{scope.row.create_time | dateFormat('yyyy-MM-dd')}}
         </template>
      </el-table-column>
       <el-table-column
        label="Operate">
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
          <el-tooltip class="item" effect="dark" content="Logistic Info" placement="top">
          <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
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

   <el-dialog
  title="Edit Address"
  :visible.sync="dialogVisible"
  width="30%" @close="dialogClosed">
  <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="auto" >
  <el-form-item label="Province / City" prop="address1">
     <el-cascader placeholder="Select"
            expand-trigger="hover"
    v-model="addressForm.address1"
    :options="cityData" width="auto"
    ></el-cascader>
  </el-form-item>
  <el-form-item label="Street" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button class="main_btn" @click="dialogVisible = false">Confirm</el-button>
  </span>
</el-dialog>

<el-dialog
  title=""
  :visible.sync="progressDialogVisible"
  width="50%"
  >
  <el-timeline>
    <el-timeline-item
      color="lightgreen"
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      progressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [{ required: true, message: 'Please select Province / City', trigger: 'blur' }],
        address2: [{ required: true, message: 'Please enter Street', trigger: 'blur' }]
      },
      cateList: [],
      cityData,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
    this.getCateList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('get data failed')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('Get data failed')
      }
      this.cateList = res.data
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox() {
      this.dialogVisible = true
    },
    dialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgress() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error('get data failed')
      this.progressInfo = res.data
      this.progressDialogVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less">

.el-cascader {
  width:100%!important
}
</style>
