<template>
<div>
  <div class="img-box">
    <img src="static/img/piture.png" alt="" />
    <div class="title">欢迎进入易用链后台管理系统</div>
  </div>
  <div class="main-content">
    <div class="fengshui">易用币（YYC）众筹进度</div>
    <el-table :data="tableDataCrowdfunding"  border style="width: 100%">
    <el-table-column prop="stage" label="阶段" width="80">
    </el-table-column>
    <el-table-column prop="sendYyiIssueAmount" label="总配送量（万个）" width="180">
    </el-table-column>
    <el-table-column prop="sendProgress" label="配送进度">
    </el-table-column>
    <el-table-column prop="surplusSendYyiAmount" label="剩余配送量（万个）">
      </el-table-column>
    <el-table-column prop="roundCurrent" label="本期数">
    </el-table-column>
    <el-table-column prop="roundSendYyiAmount" label="本期配送量（万个）">
    </el-table-column>
    <el-table-column prop="price" label="当前YYI价格（元/万个）">
    </el-table-column>
    <el-table-column prop="usdtPrice" label="当前USDT价格（枚/万个）">
    </el-table-column>
    <el-table-column prop="startTime" label="开始时间">
    </el-table-column>
    <el-table-column prop="endTime" label="完成时间">
    </el-table-column>

  </el-table>
  <div class="fengshui">人员数量</div>
  <el-table :data="tableDataUser" border style="width: 100%" >
    <el-table-column prop="title" width="80">
    </el-table-column>
    <el-table-column prop="initiator" label="发起人">
    </el-table-column>
    <el-table-column prop="partners" label="合伙人" width="180">
    </el-table-column>
    <el-table-column prop="leader" label="领导人" width="180">
    </el-table-column>
    <el-table-column prop="VIPUser" label="vip会员">
    </el-table-column>
    <el-table-column  prop="qualifiedLeader" label="普通会员">
    </el-table-column>
  </el-table>
  <div class="fengshui">订单信息</div>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="12" :md="12" :lg="6">
      <div class="order-info">
        <div class="title">总订单数（条）:</div>
        <div class="content">{{totalNumberOrder}}</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6">
      <div class="order-info">
        <div class="title">昨日新增订单数（条）：</div>
        <div class="content">{{yesterdayOrderCount}}</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" >
      <div class="order-info">
        <div class="title">总金额（USDT）： </div>
        <div class="content">{{totalNumberUsdtAmount}}</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6">
      <div class="order-info">
        <div class="title">昨日新增订单金额（USDT）:</div>
        <div class="content">{{yesterdayUsdtAmountCount}}</div>
      </div>
    </el-col>
  </el-row>
  <div class="border-grey"></div>
  <div class="order-info1">
    <div class="fengshui">待处理</div>
    <el-row :gutter="10" class="process">
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <div class="order-info">
          <div class="title">实名认证待审核数：</div>
          <div class="content" @click="$router.push({name:'business-authentication'})">{{totalNumberRealNamePending}}</div><!--换行会多空格-->
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <div class="order-info">
          <div class="title">充币订单待处理数： </div>
          <div class="content" @click="$router.push({name:'business-chargeCoinManagement'})">{{totalNumberChargeOrderPending}}</div><!--换行会多空格-->
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" >
        <div class="order-info">
          <div class="title">提币订单待审核数： </div>
          <div class="content" @click="$router.push({name:'business-withdrawalOrder'})">{{withdrawalOrderPending}}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <div class="order-info">
          <div class="title">提币订单待处理数：</div>
          <div class="content" @click="$router.push({name:'business-withdrawalOrder'})">{{withdrawalOrderBeingProcessed}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
  </div>
</div>
</template>

<script>
  export default {
    data () {
      return {
        tableDataCrowdfunding: [{ // 易用币（YYC）众筹进度
          stage: '',
          sendYyiIssueAmount: '',
          sendProgress: '',
          surplusSendYyiAmount: '',
          roundSendYyiAmount: '',
          price: '',
          usdtPrice: '',
          startTime: '',
          endTime: ''
        }],
        tableDataUser: [{ // 人员数量
          title: '总数',
          initiator: '',
          partners: '',
          leader: '',
          VIPUser: '',
          qualifiedLeader: ''
        }],
        // 订单信息
        totalNumberOrder: '',
        yesterdayOrderCount: '',
        totalNumberUsdtAmount: '',
        yesterdayUsdtAmountCount: '',
        // 待处理
        totalNumberRealNamePending: '',
        totalNumberChargeOrderPending: '',
        withdrawalOrderPending: '',
        withdrawalOrderBeingProcessed: ''
      }
    },
    activated () {
      this.getCountUser()
      this.getCountPending()
      this.getOrderInformation()
      this.getCrowdfunding()
      this.getCenterUsdtPrice()
      
    },
    methods: {
      getCrowdfunding () {
        this.$http({
          url: this.$http.adornUrl('/bs/home/crowdfunding/progress'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.tableDataCrowdfunding = data.data
          } else {
            this.tableDataUser = []
          }
          this.dataListLoading = false
        })
      },
      getCenterUsdtPrice () {
        this.$http({
          url: this.$http.adornUrl('/bs/home/current/usdtprice'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.tableDataCrowdfunding[0].usdtPrice = data.data
          } else {
            this.tableDataCrowdfunding[0].usdtPrice = ''
          }
          this.dataListLoading = false
        })
      },
      getCountUser () {
        this.$http({
          url: this.$http.adornUrl('/bs/home/count/users'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            console.log(data.data)
            var tableDataUser = data.data
            tableDataUser[0].title = '总数'
            this.tableDataUser = tableDataUser
          } else {
            this.tableDataUser = []
          }
          this.dataListLoading = false
        })
      },
      getCountPending () {
        this.$http({
          url: this.$http.adornUrl('/bs/home/pending'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.totalNumberRealNamePending = data.data.totalNumberRealNamePending
            this.totalNumberChargeOrderPending = data.data.totalNumberChargeOrderPending
            this.withdrawalOrderPending = data.data.withdrawalOrderPending
            this.withdrawalOrderBeingProcessed = data.data.withdrawalOrderBeingProcessed
          } else {
            this.totalNumberRealNamePending = ''
            this.totalNumberChargeOrderPending = ''
            this.withdrawalOrderPending = ''
            this.withdrawalOrderBeingProcessed = ''
          }
          this.dataListLoading = false
        })
      },
      getOrderInformation () {
        this.$http({
          url: this.$http.adornUrl('/bs/home/order/information'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.totalNumberOrder = data.data.totalNumberOrder
            this.yesterdayOrderCount = data.data.yesterdayOrderCount
            this.totalNumberUsdtAmount = data.data.totalNumberUsdtAmount
            this.yesterdayUsdtAmountCount = data.data.yesterdayUsdtAmountCount
          } else {
            this.totalNumberOrder = ''
            this.yesterdayOrderCount = ''
            this.totalNumberUsdtAmount = ''
            this.yesterdayUsdtAmountCount = ''
          }
          this.dataListLoading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .img-box{position: relative;margin-bottom: 34px;background: #fff;margin-top: -40px;height: 135px;
    img{
      width: 100%;
      height: 135px;
    }
    .title{position: absolute;top: 0;left: 0;line-height: 135px;font-size:30px;
font-weight:bold;
color:rgba(51,51,51,1);width: 100%;text-align: center;}
  }

  .fengshui{font-size: 20px;line-height: 76px;}
  .el-table{margin-bottom: 14px;text-align: center;}
  .order-info{
    .title{
      font-size: 14px;
      line-height: 22px;
      color: #333333;
      margin-bottom: 12px;
    }
    .content{
      font-size: 30px;

    }
  }
  .order-info1 .content{color: #1473E6;
      text-decoration: underline;cursor: pointer;}
  .border-grey{height: 1px;background: #e9e9e9;margin: 20px 0 0;}
  .process{
    padding-bottom: 60px;
    .order-info{
      width: 264px;
  height: 119px;
  background-color: #ffffff;
  box-shadow: 0px 3px 6px 0px
    rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding:18px 0 0 24px;
    margin-bottom: 20px;
    }
  }
</style>

