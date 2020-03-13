<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
     <el-alert title="info alert" type="info" show-icon :closable="false"></el-alert>
     <el-steps :space="200" :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="Product info"></el-step>
        <el-step title="Product params"></el-step>
        <el-step title="Product attribute"></el-step>
        <el-step title="Product image"></el-step>
        <el-step title="Product content"></el-step>
        <el-step title="Finished"></el-step>
    </el-steps>

    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px" label-position="top">
    <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeaveTab" @tab-click="handleTabClick">
    <el-tab-pane label="Product info" name="0">
      <el-form-item label="Goods Name" prop="goods_name">
      <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="Goods Price" prop="goods_price">
      <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="Goods Weight" prop="goods_weight">
      <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="Goods Quantity" prop="goods_number">
      <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="Goods Category" prop="goods_cat">
            <el-cascader placeholder="Select"
            expand-trigger="hover"
    v-model="addForm.goods_cat"
    :options="cateList"
    :props="cascaderProps" @change="handleChanged" ></el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="Product params" name="1">
      <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
        <el-checkbox-group v-model="item.attr_vals">
        <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
      </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="Product attribute" name="2">
      <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
      <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="Product image" name="3">
      <el-upload
  :action="uploadURL"
  list-type="picture-card" :headers="headerObj" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :on-remove="handleRemove">
    <i slot="default" class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Product content" name="4">
      <quill-editor v-model="addForm.goods_introduce">

      </quill-editor>
      <el-row :gutter="20">
    <el-col :span="4"><el-button class="main_btn" @click="add">Add Goods</el-button></el-col>
    </el-row>
    </el-tab-pane>
  </el-tabs>
    </el-form>
  </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: 'Please input goods name', trigger: 'blur' }],
        goods_price: [{ required: true, message: 'Please input goods price', trigger: 'blur' }],
        goods_weight: [{ required: true, message: 'Please input goods weight', trigger: 'blur' }],
        goods_number: [{ required: true, message: 'Please input goods quantity', trigger: 'blur' }],
        goods_cat: [{ required: true, message: 'Please select goods category', trigger: 'blur' }]
      },
      cascaderProps: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      cateList: [],
      manyTabData: [],
      onlyTabData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('Get data failed')
      }
      this.cateList = res.data
    },
    handleChanged() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeaveTab(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('Please select a level 3 goods category at first')
        return false
      }
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })

        if (res.meta.status !== 200) {
          return this.$message.error('Get data failed')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })

        if (res.meta.status !== 200) {
          return this.$message.error('Get data failed')
        }
        this.onlyTabData = res.data
      }
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('Please complete the form')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) this.$message.error('Add goods failed')
        this.$message.success('Add goods successfully!')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } return null
    }
  }
}
</script>

<style lang="less">
 .el-step {
   margin: 30px 0;
 }
 .el-step__title {
   font-size: 13px;
 }
 .el-cascader {
   margin-left: 0;
 }
 .el-tabs--left .el-tabs__header.is-left {
    margin-right: 40px!important;
}
.el-tabs__content {
  padding-right: 40px;
}
.el-checkbox {
  margin-right: 5px!important;
}
.el-upload-list__item-status-label {
  display: none!important
}

</style>
