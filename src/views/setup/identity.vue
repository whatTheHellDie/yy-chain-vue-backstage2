<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>体系管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员角色统计管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="dataform" :model="dataForm" @keyup.enter.native="getDataList()">

        <div class="dao">
          <el-button type="primary" @click="dialogFormVisible = true">
            <icon-svg name="identity" style="margin-right: 5px;vertical-align: middle;"></icon-svg>变更身份</el-button>
          <el-dialog title="变更身份" widt :visible.sync="dialogFormVisible" :before-close="cancelInput">
            <el-form ref="formx" :model="formx" class="identity">
              <div>
                <el-form-item label="会员编号：" prop="name"><el-input v-model="formx.userNumber"></el-input></el-form-item>
                <el-button type="primary"  @click="seeDetail(formx.userNumber)">查询</el-button>
              </div>
              <div>
                <el-form-item label="会员名称："><span>{{dataForm.userName}}</span></el-form-item>
              </div>
              <div>
                <el-form-item label="会员类型："><span>{{dataForm.userType}}</span></el-form-item>
              </div>
              <div>
                <el-form-item label="注册时间："><span>{{dataForm.registerTime}}</span></el-form-item>
              </div>
              <div>
                <el-form-item label="手机号："><span>{{dataForm.phone}}</span></el-form-item>
              </div>
              <div>
                <el-form-item label="身份证号："><span>{{dataForm.idCardNumber}}</span></el-form-item>
              </div>

              <div>
                <el-form-item label="身份变更为：" prop="userStatus">
                  <el-select v-model="dataForm.userStatus" placeholder="请选择身份" :disabled="!this.userStatusOptions || this.userStatusOptions.length == 0">
                    <el-option v-for="option in userStatusOptions" :key="option.value" :label="option.label"
                               :value="option.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="dataForm.userStatus == 3 || dataForm.userStatus == 4" :visible.sync="dialogFormVisibleAdd">
                 <!-- {{getInitiator()}}-->
                <div v-if="dataForm.userStatus == 3" style="margin: 0px 0 13px 48px;line-height: 21px;font-size: 14px;">
                  {{partnersBusinessData()}}
                  <div>CNY  单价：<span>{{this.businessData.cnyPrice}}</span> 元/个 </div>
                  <div>CNY  总价：<span>{{this.businessData.cnyAmount}}</span></div>
                  <div>USDT单价：<span>{{this.businessData.usdtPrice}}</span> 枚/个</div>
                  <div>USDT总价：<span>{{this.businessData.usdtAmount}}</span></div>
                </div>
                <el-form-item label="新推荐人编号：" ><el-input v-model="dataForm.referrerNumber"></el-input></el-form-item>
              </div>
              <div>
                <el-form-item label="备注"><textarea v-model="dataForm.remark" name="remark" rows="" cols="" :disabled="!this.userStatusOptions || this.userStatusOptions.length == 0"></textarea></el-form-item>
              </div>
              <div class="clearfix">
                <div class="pull-right">
                  <el-button @click="cancelInput">取消</el-button>
                  <el-button type="primary" style="" @click="addOrUpdateHandle()">确认</el-button>
                </div>
              </div>
            </el-form>
          </el-dialog>
        </div>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="userId" header-align="center" align="center" width="80" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="userType" header-align="center" align="center" label="会员类型">
          <template slot-scope="scope">
            <div v-if="scope.row.userType === 2">发起人</div>
            <div v-if="scope.row.userType === 3">合伙人</div>
            <div v-if="scope.row.userType === 4">领导人</div>
            <div v-if="scope.row.userType === 5">VIP会员</div>
            <div v-if="scope.row.userType === 6">普通会员</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalNumberOfUser" header-align="center" align="center" label="会员总人数">
        </el-table-column>
        <el-table-column prop="allocatedPartnersCounting" header-align="center" align="center" label="已分配合伙人数">
        </el-table-column>
        <el-table-column prop="undistributedPartnersCounting" header-align="center" align="center" width="180" label="未分配合伙人数">
        </el-table-column>
        <el-table-column prop="qualifiedLeaderCounting" header-align="center" align="center" width="150" label="已达标领导人数">
        </el-table-column>
        <el-table-column prop="substandardLeaderCounting" header-align="center" align="center" width="150" label="未达标领导人数">
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          userNumber: '',
          userName: '',
          userType: '',
          userStatus: '',
          idCardNumber: '',
          registerTime: '',
          referrerNumber: '',
          phone: '',
          remark: ''
        },
        dataList: [],
        allocatedPartnersCounting: '',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        dialogFormVisibleAdd: false,
        partnerDataFormVisible: false,
        businessData: {
          usdtPrice: '',
          usdtAmount: '',
          cnyPrice: '',
          cnyAmount: ''
        },
        formx: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        // 用户类型options
        userStatusOptions: [
          // {value: '2', label: '发起人'},
          // {value: '3', label: '合伙人'},
          // {value: '4', label: '领导人'},
          // {value: '5', label: 'vip用户'},
          // {value: '6', label: '普通用户'}
        ]
      }
    },
    components: {},
    activated () {
      this.getDataList()
    },
    methods: {
      cancelInput(){
        this.formx.userNumber=''
        this.dialogFormVisible = false;
        this.dataForm.userNumber='';
        this.dataForm.userName=''
          this.dataForm.userType=''
        this.dataForm.referrerNumber='';
          this.dataForm.registerTime=''
        this.dataForm.userStatus=[]
          this.dataForm.phone=''
          this.dataForm.idCardNumber=''
        this.dataForm.remark=''
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/statistics'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dataList = data.data
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 选择不同角色提示
      // valueChange (ve) {
      // },
      //  修改
      addOrUpdateHandle () {
        if (this.dataForm.userType === this.dataForm.userStatus) {
          this.$message.error('会员变更前后身份一致，请重新确认')
          return
        }
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].userType == 3) {
            if (this.dataForm.userStatus == 3 && this.dataList[i].allocatedPartnersCounting == 49) {
              this.$message.error('合伙人已全部分配，请重新确认')
              return
            }
          }
        }
        if (this.dataForm.userStatus == 3 || this.dataForm.userStatus == 4) {
          if (this.dataForm.referrerNumber == null || this.dataForm.referrerNumber == "" ) {
            this.$message.error('推荐人编号不能为空，请重新确认')
            return
          } else if (this.dataForm.referrerNumber.length !== 10) {
            this.$message.error('推荐人编号不正确，请重新确认')
            return
          }
        }
        if (this.dataForm.userType == 3 && this.dataForm.userStatus == 4) {
          this.$message.error('合伙人不能变更为领导人，请重新确认')
          return
        }
        if (this.dataForm.userType == 4 && this.dataForm.userStatus == 3) {
          this.$message.error('领导人不能变更为合伙人，请重新确认')
          return
        }
        if (this.dataForm.userType == 2) {
          this.$message.error('发起人身份不能变更，请重新确认')
          return
        }
        if (this.formx.userNumber == null) {
          this.$message.error('会员编号为空，请重新确认')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/change/type'),
          method: 'post',
          data: this.$http.adornData({
            userNumber: this.formx.userNumber,
            type: this.dataForm.userStatus,
            referrerNumber: this.dataForm.referrerNumber,
            remark: this.dataForm.remark,
            cnyPrice: this.businessData.cnyPrice,
            cnyAmount: this.businessData.cnyAmount,
            usdtPrice: this.businessData.usdtPrice,
            usdtAmount: this.businessData.usdtAmount
          })
        }).then(({data}) => {
          if (data && data.code === '01502') {
            this.$message({
              message: '变更身份成功',
              type: 'success'
              // duration: 1500
              // onClose: () => {
              //   this.dialogFormVisible2 = false
              //   this.getDataList()
              // }
            })
            this.dialogFormVisible = false
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 根据用户编号查询数据
      seeDetail (userNumber) {
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/one'),
          method: 'get',
          params: this.$http.adornParams({'userNumber': userNumber})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dataForm.userName = data.data.userName
            this.dataForm.userType = data.data.userType
            this.dataForm.registerTime = data.data.registerTime
            this.dataForm.phone = data.data.phone
            this.dataForm.idCardNumber = data.data.idCardNumber
            this.userStatusOptions = data.data.changeOptionList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 获取变更为合伙人时获取业务数据
      partnersBusinessData: function () {
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/change/getPriceInfo'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.businessData.usdtPrice = data.data.usdtPrice
            this.businessData.usdtAmount = data.data.usdtAmount
            this.businessData.cnyPrice = data.data.cnyPrice
            this.businessData.cnyAmount = data.data.cnyAmount
          } else {
            this.businessData = {}
          }
          this.dataListLoading = false
        })
      },
      // 获取发起人账号//
      getInitiator: function () {
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/getInitiator'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.businessData.usdtPrice = data.data.userName
            this.businessData.usdtAmount = data.data.userNumber
          } else {
            this.businessData = {}
          }
          this.dataListLoading = false
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
	.dao{
	  margin-bottom: 20px;

	}
	.icon-svg__exports{
    margin-right: 5px;
    }
</style>
