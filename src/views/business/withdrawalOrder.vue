<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务管理</el-breadcrumb-item>
      <el-breadcrumb-item>提币管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="queryForm" :model="queryForm" @keyup.enter.native="getDataList()">
        <el-form-item label="账户类型" prop="accountType">
          <el-select v-model="queryForm.accountType">
            <el-option v-for="option in accountTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="queryForm.status">
            <el-option v-for="option in orderStatusOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员姓名：" prop="userName">
          <el-input v-model="queryForm.userName"></el-input>
        </el-form-item></br>
        <el-form-item label="处理时间" prop="checkTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.checkTime"
            style="width: 100%;" :unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.createTime"
            style="width: 100%;" :unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('queryForm')">重置</el-button>
        </el-form-item>

        <div class="dao">
          <!--<el-button type="primary"> <icon-svg name="exports"></icon-svg> 导出 </el-button>-->
        </div>
      </el-form>

      <el-table :data="dataList" border v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column  type="selection"  header-align="center" align="center"  width="50">
        </el-table-column>
        <el-table-column  prop="id" header-align="center"  align="center" type="index"  :index="1"  label="序号">
        </el-table-column>
        <el-table-column  prop="number"  header-align="center" align="center"  label="订单编号">
        </el-table-column>
        <el-table-column  prop="userName"  header-align="center"  align="center" width="80" label="会员姓名">
        </el-table-column>
        <el-table-column prop="accountType" header-align="center" align="center" width="80" label="账户类型">
          <template slot-scope="scope">
            <div v-if="scope.row.accountType==1" class="default">USDT </div>
            <div v-if="scope.row.accountType==2">yyc</div>
          </template>
        </el-table-column>
        <el-table-column  prop="walletAddress"  header-align="center"  align="center"  label="数字钱包地址">
        </el-table-column>
        <el-table-column  prop="withdrawalAmount"  header-align="center"  align="center"  label="提币数额">
        </el-table-column>
        <el-table-column  prop="handingFee"  header-align="center"  align="center"  label="手续费">
        </el-table-column>
        <el-table-column  prop="realWithdrawalAmount"  header-align="center"  align="center"  label="预计到账数额">
        </el-table-column>
        <el-table-column  prop="status"  header-align="center"  align="center" width="80" label="订单状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">待处理</div>
            <div v-if="scope.row.status==1">处理中</div>
            <div v-if="scope.row.status==2">提币成功</div>
            <div v-if="scope.row.status==3">提币失败</div>
          </template>
        </el-table-column>
        <el-table-column  prop="createTime"  header-align="center"  align="center"  label="创建时间">
        </el-table-column>
        <el-table-column  header-align="center"  align="center"  width="150"  label="操作">
          <template slot-scope="scope">
            <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="seeDetail(scope.row.userId)">查看详情</el-button>
            <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>-->
            <!--<el-button type="primary" :disabled="scope.row.status !== 0" >审核</el-button>-->
            <el-button type="text" size="small" v-if="scope.row.status == 0"  class="blue" @click="examine(scope.row.id)">审核</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.status == 1"  class="blue" @click="examine(scope.row.id)">受理</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.status == 1"  class="blue" @click="examine(scope.row.id)">不受理</el-button>
            <el-button type="text" size="small" v-else class="blue" @click="seeDetail(scope.row.id)">查看详情</el-button>
            <div class="dialog-wrap">
              <el-dialog title="充值订单详情" v-loading="loading" :visible.sync="dialogTableVisible">
                <div class="charge-detail1">
                <form>
                  <div class="div"><label>订单编号：</label><span class="span">{{orderDetail.number}}</span></div>
                  <div class="div"><label>创建时间：</label><span class="span">{{orderDetail.createTime}}</span></div>
                  <div class="div"><label>会员姓名：</label><span class="span">{{orderDetail.userName}}</span></div>
                  <div class="div"><label>账户类型：</label><span class="span">
                    <div v-if="orderDetail.accountType==1" class="default">USDT </div>
                    <div v-if="orderDetail.accountType==2">yyc</div>
                  </span></div>
                  <div class="div"><label>钱包名称：</label><span class="span">{{orderDetail.wallet}}</span></div>
                  <div class="div"><label>钱包地址：</label><span class="span">{{orderDetail.walletAddress}}</span></div>
                  <div class="div"><label>提币金额</label>
                    <!-- <input type="text" v-if="orderDetail.status == 0" v-model="chargeMoney" /> -->
                    <span class="span">{{orderDetail.withdrawalAmount}}</span></div>
                  <div class="div"><label>手续费：</label><span class="span">{{orderDetail.handingFee}}</span></div>
                  <div class="div"><label>预计到账金额：</label><span class="span">{{orderDetail.realWithdrawalAmount}}</span></div>
                  <div class="div"><label>订单状态：</label><span class="span">
                    <div v-if="orderDetail.status==0">待处理</div>
                    <div v-if="orderDetail.status==1">处理中</div>
                    <div v-if="orderDetail.status==2">提币成功</div>
                    <div v-if="orderDetail.status==3">提币失败</div>
                    </span></div>
                  <div class="div"><label>审核时间：</label><span class="span">{{orderDetail.checkTime}}</span></div>
                  <div class="div"><label>备注：
                    </label><textarea v-if="orderDetail.status == 0 || orderDetail.status == 1" name="" rows="" cols="" v-model= "orderDetail.remark"></textarea>
                    <span class="span" v-else>{{orderDetail.remark}}</span></div>
                  <div class="clearfix">
                    <div class="pl80">
                      <el-button type="primary" v-if="orderDetail.status == 0 " @click="updateHandle(orderDetail.id,orderDetail.status,1)">受理</el-button>
                      <el-button  type="info" v-if="orderDetail.status == 0 " @click="updateHandle(orderDetail.id,orderDetail.status,3)">不受理</el-button>
                      <el-button type="primary" v-if=" orderDetail.status == 1" @click="updateHandle(orderDetail.id,orderDetail.status,1)">受理</el-button>
                      <el-button  type="info" v-if=" orderDetail.status == 1" @click="updateHandle(orderDetail.id,orderDetail.status,2)">不受理</el-button>
                      <el-button  type="info"  @click="dialogTableVisible=false">取消</el-button>
                    </div>
                  </div>
                </form>
                </div>
              </el-dialog>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
        :current-page="pageIndex"  :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"  :total="elementTotal"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading:false,
        queryForm: {
          number: '',
          userName: '',
          userType: '',
          accountType: '',
          status: '',
          checkTime: [],
          createTime: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        elementTotal: 0,
        dataListLoading: false,
        dataListSelections: [],
        dialogTableVisible: false,
        orderDetail: {
          id: '',
          number: '',
          createTime: '',
          userName: '',
          accountType: '',
          wallet: '',
          walletAddress: '',
          withdrawalAmount: '',
          handingFee: '',
          realWithdrawalAmount: '',
          checkTime: '',
          status: '',
          remark: ''
        },
        chargeMoney: '',
        formLabelWidth: '120px',
        // 账户类型options
        accountTypeOptions: [
          {value: '', label: '全部'},
          {value: '1', label: 'USDT'},
          {value: '2', label: 'YYC'}
        ],
        // 订单状态
        orderStatusOptions: [
          {value: '', label: '全部'},
          {value: '0', label: '待处理'},
          {value: '1', label: '处理中'},
          {value: '2', label: '提币成功'},
          {value: '3', label: '提币失败'}
        ],
      }
    },
    components: {},
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (!this.queryForm.checkTime) {
          this.queryForm.checkTime = []
        }
        if (!this.queryForm.createTime) {
          this.queryForm.createTime = []
        }
        this.$http({
          url: this.$http.adornUrl('/bs/withdrawal/page'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'checkStartTime': this.queryForm.checkTime.length >= 1 ? this.queryForm.checkTime[0] : '',
            'checkEndTime': this.queryForm.checkTime.length === 2 ? this.queryForm.checkTime[1] : '',
            'createStartTime': this.queryForm.createTime.length >= 1 ? this.queryForm.createTime[0] : '',
            'createEndTime': this.queryForm.createTime.length === 2 ? this.queryForm.createTime[1] : '',
            'status': this.queryForm.status,
            'userName': this.queryForm.userName,
            'accountType': this.queryForm.accountType
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            console.log(data.data)
            this.dataList = data.data.dataList
            this.elementTotal = data.data.elementTotal
            this.dataListLoading = true
          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 受理操作
      updateHandle (id, status, i) {
        this.loading=true;
        this.dialogTableVisible = true
        if (!this.orderDetail.remark) {
          this.$message({type: 'error', message: '请填写备注信息'})
          this.loading=false;
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/withdrawal/check'),
          method: 'post',
          params: this.$http.adornParams({
            'status': i+status,
            'remark': this.orderDetail.remark,
            'id': id
          })
        }).then(({data}) => {
          this.loading=false;
          if (data && data.code === '0000') {
            this.$message({message: data.msg, type: 'success'})
          } else {
            this.$message({type: 'success', message: data.msg})
          }
          this.getDataList()
          this.cleanDialog()
          this.dialogTableVisible = false
        })
      },
      examine (id) {
        this.dialogTableVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/withdrawal/detail'),
          method: 'get',
          params: this.$http.adornParams({'id': id})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            console.log(data)
            this.dialogTableVisible = true
            this.orderDetail.id = data.data.id
            this.orderDetail.number = data.data.number
            this.orderDetail.userName = data.data.userName
            this.orderDetail.accountType = data.data.accountType
            this.orderDetail.wallet = data.data.wallet
            this.orderDetail.walletAddress = data.data.walletAddress
            this.orderDetail.withdrawalAmount = data.data.withdrawalAmount
            this.orderDetail.handingFee = data.data.handingFee
            this.orderDetail.realWithdrawalAmount = data.data.realWithdrawalAmount
            this.orderDetail.createTime = data.data.createTime
            this.orderDetail.status = data.data.status
            this.orderDetail.checkTime = data.data.checkTime
            this.orderDetail.remark = data.data.remark
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        })
      },
      seeDetail (id) {
        this.dialogTableVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/withdrawal/detail'),
          method: 'get',
          params: this.$http.adornParams({'id': id})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dialogTableVisible = true
            this.orderDetail.id = data.data.id
            this.orderDetail.number = data.data.number
            this.orderDetail.userName = data.data.userName
            this.orderDetail.accountType = data.data.accountType
            this.orderDetail.wallet = data.data.wallet
            this.orderDetail.walletAddress = data.data.walletAddress
            this.orderDetail.withdrawalAmount = data.data.withdrawalAmount
            this.orderDetail.handingFee = data.data.handingFee
            this.orderDetail.realWithdrawalAmount = data.data.realWithdrawalAmount
            this.orderDetail.createTime = data.data.createTime
            this.orderDetail.status = data.data.status
            this.orderDetail.checkTime = data.data.checkTime
            this.orderDetail.remark = data.data.remark
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 清空dialog数据
      cleanDialog () {
        this.orderDetail.remark = ''
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
    }
  }
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .dao { margin-bottom: 20px;}
  .icon-svg__exports { margin-right: 5px; }
  .blue{color: #00a0e9}
</style>
