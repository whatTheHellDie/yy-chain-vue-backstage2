<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="dataform" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="会员编号：" prop="userNumber">
          <el-input v-model="dataForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="会员名称：" prop="userName">
          <el-input v-model="dataForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="订单编号：" prop="number">
          <el-input v-model="dataForm.number"></el-input>
        </el-form-item>
        <el-form-item label="交易状态" prop="userStatus">
          <el-select v-model="dataForm.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="待支付" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
            <el-option label="交易关闭" value="2"></el-option>
            <el-option label="交易取消" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="dataForm.createTime"
                          style="width: 100%;" unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="dataForm.finishTime"
                          style="width: 100%;" unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('dataform')">重置</el-button>
          <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>
        <div class="dao">
          <el-button type="primary" @click="exportData()" >
            <icon-svg name="exports"></icon-svg>导出
          </el-button>
        </div>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="userId" header-align="center" align="center" width="50" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="number"  header-align="center" align="center" width="160" label="订单编号">
        </el-table-column>
        <el-table-column prop="userNumber"  header-align="center" align="center" label="会员编号">
        </el-table-column>
        <el-table-column prop="userName" header-align="center"  align="center" label="姓名">
        </el-table-column>
        <el-table-column prop="sendYyiQuantity" header-align="center"  align="center" label="配送积分数量（个）">
        </el-table-column>
        <el-table-column prop="sendYyiPrice" header-align="center"  align="center" width="150" label="配送积分单价(元/万个)">
        </el-table-column>
        <el-table-column prop="usdtPrice" header-align="center" align="center" label="USDT单价">
        </el-table-column>
        <el-table-column prop="usdtAmount" header-align="center" align="center" label="USDT金额">
        </el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="交易状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">待支付</div>
            <div v-else-if="scope.row.status === 1">已完成</div>
            <div v-else-if="scope.row.status === 2">交易关闭</div>
            <div v-else>交易取消</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" width="160" label="创建时间">
        </el-table-column>
        <el-table-column prop="finishTime" header-align="center" align="center" width="160" label="完成时间">
        </el-table-column>
        <el-table-column header-align="center" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="detailsHandle(scope.row.id)">订单详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 详情 -->
      <div class="dao">

          <el-dialog title="信息详情" style="text-align: left;" width="60%" :visible.sync="dialogTableVisible">
            <div class="user-list">
              <div class="title">
                <span>订单信息详情</span>
              </div>
              <div class="content clearfix">
                <div class="lot-item">订单id：{{orderDetail.id}}</div>
                <div class="lot-item">订单编号：{{orderDetail.number}}</div>
                <div class="lot-item">创建时间：{{orderDetail.createTime}}</div>
                <div class="lot-item">会员编号：{{orderDetail.userNumber}}</div>
                <div class="lot-item">会员姓名：{{orderDetail.userName}}</div>
                <div class="lot-item">订单状态：
                  <span v-if="orderDetail.status==0">待支付</span>
                  <span v-if="orderDetail.status==1">已完成</span>
                  <span v-if="orderDetail.status==2">交易关闭</span>
                  <span v-if="orderDetail.status==3">交易取消</span>
                </div>
                <div class="lot-item">配送积分数量（个）：{{orderDetail.sendYyiQuantity}}</div>
                <div class="lot-item">配送积分单价（人民币）：{{orderDetail.sendYyiPrice}}</div>
                <div class="lot-item">配送积分金额（人民币）：{{orderDetail.sendYyiAmount}}</div>
                <div class="lot-item">USDT单价：{{orderDetail.usdtPrice}}</div>
                <div class="lot-item">USDT金额：{{orderDetail.usdtAmount}}</div>
                <div class="lot-item">是否已分配usdt：{{orderDetail.isSplit}}</div>
                <div class="lot-item">所属阶段：
                  <span v-if="orderDetail.stage==1">第一阶段</span>
                  <span v-if="orderDetail.stage==2">第二阶段</span>
                </div>
                <div class="lot-item">所属期数：第 {{orderDetail.round}} 期</div>
                <div class="lot-item">订单结束时间：{{orderDetail.finishTime}}</div>
                <div class="lot-item">支付时间：{{orderDetail.payTime}}</div>
                <div class="lot-item">支付截止时间：{{orderDetail.payDeadline}}</div>
                <div class="lot-item">修改人：{{orderDetail.modifier}}</div>
                <div class="lot-item">修改时间：{{orderDetail.modifyTime}}</div>
                <div class="lot-item">备注：{{orderDetail.remark}}</div>
              </div>
            </div>
            <div class="pull-right">
              <el-button  @click="dialogTableVisible=false">取消</el-button>
            </div>
          </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          number: '',
          userNumber: '',
          userName: '',
          status: '',
          date1: '',
          createTime: [],
          finishTime: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogTableVisible: false,
        orderDetail: {
          number: '',
          sendYyiQuantity: '',
          sendYyiPrice: '',
          sendYyiAmount: '',
          usdtPrice: '',
          usdtAmount: '',
          stage: '',
          round: '',
          payTime: '',
          payDeadline: '',
          finishTime: '',
          status: '',
          isSplit: '',
          modifier: '',
          userName: '',
          userNumber: '',
          createTime: '',
          modifyTime: '',
          remark: ''
        }
      }
    },
    components: {
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (!this.dataForm.checkTime) {
          this.dataForm.checkTime = []
        }
        if (!this.dataForm.finishTime) {
          this.dataForm.finishTime = []
        }
        this.$http({
          url: this.$http.adornUrl('/bs/shares/query/list'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'createEndTime': this.dataForm.createTime.length === 2 ? this.dataForm.createTime[1] : '',
            'createStartTime': this.dataForm.createTime.length >= 1 ? this.dataForm.createTime[0] : '',
            'finishStartTime': this.dataForm.finishTime.length === 2 ? this.dataForm.finishTime[0] : '',
            'finishEndTime': this.dataForm.finishTime.length >= 1 ? this.dataForm.finishTime[1] : '',
            'status': this.dataForm.status,
            'number': this.dataForm.number,
            'userName': this.dataForm.userName,
            'userNumber': this.dataForm.userNumber
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dataList = data.data.dataList
            this.totalPage = data.data.elementTotal
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 导出
      exportData () {
        this.$http({
          url: this.$http.adornUrl('/bs/shares/export'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'createEndTime': this.dataForm.createTime.length === 2 ? this.dataForm.createTime[1] : '',
            'createStartTime': this.dataForm.createTime.length >= 1 ? this.dataForm.createTime[0] : '',
            'finishStartTime': this.dataForm.finishTime.length === 2 ? this.dataForm.finishTime[0] : '',
            'finishEndTime': this.dataForm.finishTime.length >= 1 ? this.dataForm.finishTime[1] : '',
            'status': this.dataForm.status,
            'number': this.dataForm.number,
            'userName': this.dataForm.userName,
            'userNumber': this.dataForm.userNumber
          }),
          responseType: 'arraybuffer'
        }).then(({data}) => {
          let blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'})
          let objectUrl = URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.href = objectUrl
          link.download = '会员入股订单信息.xls'

          // 此写法兼容火狐浏览器
          document.body.appendChild(link)

          let evt = document.createEvent('MouseEvents')
          evt.initEvent('click', false, false)
          link.dispatchEvent(evt)

          window.URL.revokeObjectURL(objectUrl)
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 详情
      detailsHandle (id) {
        this.$http({
          url: this.$http.adornUrl('/bs/shares/order/details'),
          method: 'get',
          params: this.$http.adornParams({'oId': id})
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.dialogTableVisible = true
            this.orderDetail.id = data.data.id
            this.orderDetail.number = data.data.number
            this.orderDetail.userName = data.data.userName
            this.orderDetail.userNumber = data.data.userNumber
            this.orderDetail.sendYyiQuantity = data.data.sendYyiQuantity
            this.orderDetail.sendYyiPrice = data.data.sendYyiPrice
            this.orderDetail.sendYyiAmount = data.data.sendYyiAmount
            this.orderDetail.usdtPrice = data.data.usdtPrice
            this.orderDetail.usdtAmount = data.data.usdtAmount
            this.orderDetail.stage = data.data.stage
            this.orderDetail.round = data.data.round
            this.orderDetail.payTime = data.data.payTime
            this.orderDetail.payDeadline = data.data.payDeadline
            this.orderDetail.finishTime = data.data.finishTime
            this.orderDetail.status = data.data.status
            this.orderDetail.isSplit = data.data.isSplit
            this.orderDetail.modifier = data.data.modifier
            this.orderDetail.createTime = data.data.createTime
            this.orderDetail.modifyTime = data.data.modifyTime
            this.orderDetail.remark = data.data.remark
          } else {
            this.$message.error(data.msg)
          }
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
