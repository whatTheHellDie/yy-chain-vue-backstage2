<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务管理</el-breadcrumb-item>
      <el-breadcrumb-item>充币管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="queryForm" :model="queryForm" @keyup.enter.native="getDataList()">
        <el-form-item label="账户类型" prop="accountType">
          <el-select v-model="queryForm.accountType">
            <el-option v-for="option in userStatusOptions" :key="option.value" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员编号：" prop="userNumber">
          <el-input v-model="queryForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名：" prop="userName">
          <el-input v-model="queryForm.userName"></el-input>
        </el-form-item>

        <el-form-item label="处理时间" prop="checkTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.checkTime"
                          style="width: 100%;" :unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.createTime"
                          style="width: 100%;" :unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="queryForm.status">
            <el-option v-for="option in orderStatusOptions" :key="option.value" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('queryForm')">重置</el-button>
          <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>

        <div class="dao">
          <!--<el-button type="primary">
            <icon-svg name="exports"></icon-svg>
            导出
          </el-button>-->
        </div>
      </el-form>

      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userId"
          header-align="center"
          align="center"
          width="80"
          type="index"
          :index="1"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="userNumber"
          header-align="center"
          align="center"
          label="会员编号">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="会员名">
        </el-table-column>
        <el-table-column
          prop="accountType"
          header-align="center"
          align="center"
          label="账户类型">
          <template slot-scope="scope">
            <div v-if="scope.row.accountType==1" class="default">USDT </div>
            <div v-if="scope.row.accountType==2">yyc</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyChargeAmount"
          header-align="center"
          align="center"
          label="请求充值金额">
        </el-table-column>
        <el-table-column
          prop="realChargeAmount"
          header-align="center"
          align="center"
          label="实际充值金额">
        </el-table-column>
        <el-table-column
          prop="accountType3"
          header-align="center"
          align="center"
          label="订单状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">待处理</div>
            <div v-if="scope.row.status==1" class="default">已受理</div>
            <div v-if="scope.row.status==2">不受理</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="chargeNumber"
          header-align="center"
          align="center"
          label="im交易号">
        </el-table-column>
        <el-table-column
          prop="chargeVoucher"
          header-align="center"
          align="center"
          label="凭证" width="120px">
          <template slot-scope="scope">
            <img :src="scope.row.chargeVoucher" alt=""  class="pinzheng " />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="seeDetail(scope.row.userId)">查看详情</el-button>

            <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">查看详情</el-button>
            <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>-->
            <!--<el-button type="primary" :disabled="scope.row.status !== 0" >审核</el-button>-->
            <el-button type="text" size="small" v-if="scope.row.status == 0"  class="blue" @click="examine(scope.row.number)">审核</el-button>
            <el-button type="text" size="small" v-else class="blue" @click="seeDetail(scope.row.number)">查看详情</el-button>
          </el-button>
            <div class="dialog-wrap">
            <el-dialog title="充值订单详情" v-loading="loading" :visible.sync="dialogTableVisible">
              <div class="charge-detail1">
               <form>
                <div class="div"><label>订单编号：</label><span class="span">{{orderDetail.number}}</span></div>
                <div class="div"><label>创建时间：</label><span class="span">{{orderDetail.createTime}}</span></div>
                <div class="div"><label>会员编号：</label><span class="span">{{orderDetail.userNumber}}</span></div>
                <div class="div"><label>会员姓名：</label><span class="span">{{orderDetail.userName}}</span></div>
                <div class="div"><label>兑换类型：</label><span class="span">{{orderDetail.exchangeType}}</span></div>
                <div class="div"><label>账户类型：</label><span class="span"><div v-if="orderDetail.accountType==1" class="default">USDT </div>
                  <div v-if="orderDetail.accountType==2">yyc</div></span></div>
                <div class="div"><label>请求充值金额：</label><span class="span">{{orderDetail.applyChargeAmount}}</span></div>
                 <div></div>
                <div class="div"><label>充值金额</label><input type="text" v-if="orderDetail.status == 0" v-model="chargeMoney" /><span class="span" v-else>{{orderDetail.realChargeAmount}}</span></div>
                <div class="div"><label>im交易号：</label><span class="span">{{orderDetail.chargeNumber}}</span></div>
                <div class="div"><label>凭证：</label>
                  <el-popover placement="right" width="400" trigger="hover">
                    <img :src="orderDetail.chargeVoucher" />
                    <img slot="reference" :src="orderDetail.chargeVoucher" class="img" />
                  </el-popover>

                </div>
                <div class="div"><label>备注：</label><textarea v-if="orderDetail.status == 0" name="" rows="" cols="" v-model= "remark"></textarea><span class="span" v-else>{{orderDetail.remark}}</span></div>
            <!--<div>
              <el-form-item label="赋予角色：">
                <el-cascader :options="optionsWithDisabled"></el-cascader>
              </el-form-item>
            </div>-->

            <div class="clearfix">
              <div class="pl80">
                <el-button type="primary" v-if="orderDetail.status == 0" style="" @click="updateHandle(orderDetail.number,1,orderDetail.chargeNumber)">受理</el-button>
                <el-button  type="info" v-if="orderDetail.status == 0"  @click="updateHandle(orderDetail.number,2,orderDetail.chargeNumber)">不受理</el-button>
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
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="elementTotal"
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
          userNumber: '',
          userName: '',
          userType: '',
          accountType: '',
          status: '',
          checkTime: [],
          createTime: [],
          remark: '',
          chargeMoney: '',
          chargeVoucher: '/static/img/zhan.png'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        elementTotal: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        needGrid: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        orderDetail: {
          number: '',
          createTime: '',
          userNumber: '',
          userName: '',
          exchangeType: '',
          accountType: '',
          applyChargeAmount: '',
          realChargeAmount: '',
          remark: '',
          chargeNumber: '',
          chargeVoucher: '/static/img/zhan.png'
        },
        chargeMoney: '',
        formLabelWidth: '120px',
        // 用户类型options
        userTypeOptions: [
          {value: '', label: '全部'},
          {value: '1', label: '平台'},
          {value: '2', label: '发起人'},
          {value: '3', label: '合伙人'},
          {value: '4', label: '领导人'},
          {value: '5', label: 'vip用户'},
          {value: '6', label: '普通用户'},
          {value: '7', label: '服务团队'},
          {value: '8', label: '红包网'},
          {value: '9', label: '李总团队'},
          {value: '10', label: '张总团队'},
          {value: '11', label: '刘总团队'},
          {value: '12', label: '分红账户'},
          {value: '13', label: '一阶段销毁配送币账户'},
          {value: '14', label: '二阶段销毁配送币账户'},
          {value: '15', label: '二阶段销魂一阶段激励币账户'}
        ],
        // 用户类型options
        userStatusOptions: [
        {value: '1', label: 'USDT'},
          {value: '0', label: '全部'}
        ],
        // 订单状态
        orderStatusOptions: [
          {value: '3', label: '全部'},
          {value: '0', label: '待处理'},
          {value: '1', label: '已受理'},
          {value: '2', label: '不受理'}
        ],
        // 用户详细信息数据
        userDetailInfo: {
          directlyUserCount: '',
          frozenYyi: '',
          idCardNumber: '',
          incentiveYyi: '',
          indirectUserCount: '',
          lastLoginTime: '',
          phone: '',
          referrerNumber: '',
          registerTime: '',
          remark: '',
          sendYyi: '',
          sex: '',
          status: '',
          teamCount: '',
          teamIncentiveYyi: '',
          teamRewardsUSDT: '',
          teamTotalYyi: '',
          usdt: '',
          userName: '',
          userNumber: '',
          userType: '',
          yyc: '',
          yyi: ''
        }
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
          url: this.$http.adornUrl('/bs/fund/query/list/page'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'finishTime': this.queryForm.checkTime.length === 2 ? this.queryForm.checkTime[1] : '',
            'beginTime': this.queryForm.checkTime.length >= 1 ? this.queryForm.checkTime[0] : '',
            'createTime': this.queryForm.createTime.length === 2 ? this.queryForm.createTime[0] : '',
            'endTime': this.queryForm.createTime.length >= 1 ? this.queryForm.createTime[1] : '',
            'status': this.queryForm.status,
            'number': this.queryForm.number,
            'userName': this.queryForm.userName,
            'userNumber': this.queryForm.userNumber,
            'accountType': this.queryForm.accountType,
            'chargeNumber': this.queryForm.chargeNumber
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
      updateHandle (number, i, chargeNumber) {
        this.loading=true;
        this.dialogTableVisible = true
        if (i === 2 && !this.remark) {
          this.$message({type: 'error', message: '请填写备注信息'})
          this.loading=false;
          return
        }
        if (i === 1 && !this.chargeMoney) {
          this.$message({type: 'error', message: '请输入充值金额'})
          this.loading=false;
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/fund/check'),
          method: 'post',
          data: this.$http.adornData({
            'type': i,
            'remark': this.remark,
            'number': number,
            'realChargeAmount': this.chargeMoney
          })
        }).then(({data}) => {
          this.loading=false;
          if (data && data.code === '1') {
            this.$message({message: data.msg, type: 'success'})
          } else {
            this.$message({type: 'success', message: data.msg})
          }
          this.getDataList()
          this.cleanDialog()
          this.dialogTableVisible = false
        })
      },
      examine (row) {
        this.dialogTableVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/fund/query/list/number'),
          method: 'get',
          params: this.$http.adornParams({'number': row})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dialogTableVisible = true
            this.orderDetail.number = data.data.number
            this.orderDetail.userName = data.data.userName
            this.orderDetail.userNumber = data.data.userNumber
            this.orderDetail.exchangeType = data.data.exchangeType
            this.orderDetail.accountType = data.data.accountType
            this.orderDetail.applyChargeAmount = data.data.applyChargeAmount
            this.orderDetail.chargeNumber = data.data.chargeNumber
            this.orderDetail.chargeVoucher = data.data.chargeVoucher
            this.orderDetail.createTime = data.data.createTime
            this.orderDetail.status = data.data.status
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        })
      },
      seeDetail (row) {
        this.dialogTableVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/fund/query/list/number'),
          method: 'get',
          params: this.$http.adornParams({'number': row})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dialogTableVisible = true
            this.orderDetail.number = data.data.number
            this.orderDetail.userName = data.data.userName
            this.orderDetail.userNumber = data.data.userNumber
            this.orderDetail.exchangeType = data.data.exchangeType
            this.orderDetail.accountType = data.data.accountType
            this.orderDetail.applyChargeAmount = data.data.applyChargeAmount
            this.orderDetail.realChargeAmount = data.data.realChargeAmount
            this.orderDetail.chargeNumber = data.data.chargeNumber
            this.orderDetail.chargeVoucher = data.data.chargeVoucher
            this.orderDetail.createTime = data.data.createTime
            this.orderDetail.remark = data.data.remark
            this.orderDetail.status = data.data.status
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 用户类型格式，table使用
      userTypeFormatter(row, column, cellValue) {
        if (this.userTypeOptions.length > 0) {
          for (let i = 0; i < this.userTypeOptions.length; i++) {
            if (cellValue === this.userTypeOptions[i].value) {
              return this.userTypeOptions[i].label
            }
          }
        }
      },
      // 用户状态格式，table使用
      userStatusFormatter (row, column, cellValue) {
        if (this.userStatusOptions.length > 0) {
          for (let i = 0; i < this.userStatusOptions.length; i++) {
            if (cellValue === this.userStatusOptions[i].value) {
              return this.userStatusOptions[i].label
            }
          }
        }
      },
      // 清空dialog数据
      cleanDialog () {
        this.chargeMoney = ''
        this.remark = ''
      },
      // 取消审核
      cancel () {
        this.cleanDialog()
        this.dialogTableVisible = false
      }
    }
  }
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .dao {
    margin-bottom: 20px;

  }

  .icon-svg__exports {
    margin-right: 5px;
  }
  .blue{color: #00a0e9}

</style>
