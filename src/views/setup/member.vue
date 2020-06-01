<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>体系管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="queryForm" :model="queryForm" @keyup.enter.native="getDataList()">
        <el-form-item label="会员编号：" prop="userNumber">
          <el-input v-model="queryForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="会员名称：" prop="userName">
          <el-input v-model="queryForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="推荐人编号：" prop="userName">
          <el-input v-model="queryForm.referrerNumber"></el-input>
        </el-form-item>
        <el-form-item label="会员类型" prop="userType">
          <el-select v-model="queryForm.userType">
            <el-option v-for="option in userTypeOptions" :key="option.value" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <el-select v-model="queryForm.userStatus">
            <el-option v-for="option in userStatusOptions" :key="option.value" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" prop="registerTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.registerTime"
                          style="width: 100%;" unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryClick()">查询</el-button>
          <el-button @click="resetForm('queryForm')">重置</el-button>
          <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>

        <div class="dao">
         <el-button type="primary" @click="exportData()">
            <icon-svg name="exports"></icon-svg>
            导出
          </el-button>
        </div>
      </el-form>

      <el-table :data="dataList" border v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection"  header-align="center"  align="center"  width="50">
        </el-table-column>
        <el-table-column prop="userId" header-align="center" align="center" width="80" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="userNumber" header-align="center" align="center" label="会员编号">
        </el-table-column>
        <el-table-column prop="userName" header-align="center" align="center" label="会员姓名">
        </el-table-column>
        <el-table-column prop="phone" header-align="center" align="center" label="会员手机号">
        </el-table-column>
        <el-table-column prop="userType" header-align="center" align="center" :formatter="userTypeFormatter" label="会员类型">
        </el-table-column>
        <el-table-column
          prop="referrerNumber" header-align="center" align="center" width="180" label="推荐人">
        </el-table-column>
        <el-table-column prop="yyi" header-align="center" align="center" width="150" label="配送易用积分余额">
        </el-table-column>
        <el-table-column prop="usdt" header-align="center" align="center" width="150" label="USDT余额">
        </el-table-column>
        <el-table-column
          prop="status" header-align="center" align="center" width="150" :formatter="userStatusFormatter" label="状态">
        </el-table-column>
        <el-table-column prop="lastLoginTime" header-align="center" align="center" width="165" label="最近登入时间">
        </el-table-column>
        <el-table-column  header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="seeDetail(scope.row.userId)">查看详情</el-button>

            <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">查看详情</el-button>
            <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>-->
            <el-button type="text" @click="seeDetail(scope.row)">查看详情</el-button>

            <el-dialog title="会员信息详情" style="text-align: left;" width="80%" :visible.sync="dialogTableVisible">
              <div class="user-list">
                <div class="title">
                  <span>会员基本信息</span>
                </div>
                <div class="content clearfix">
                  <div class="lot-item">会员编号：{{userDetailInfo.userNumber}}</div>
                  <div class="lot-item">推荐人编号：{{userDetailInfo.referrerNumber}}</div>
                  <div class="lot-item">会员类型：{{userDetailInfo.userType}}</div>
                  <div class="lot-item">会员姓名：{{userDetailInfo.userName}}</div>
                  <div class="lot-item">会员手机号：{{userDetailInfo.phone}}</div>
                  <!-- <div class="lot-item">性别：{{userDetailInfo.sex}}</div>-->
                  <div class="lot-item">身份证：{{userDetailInfo.idCardNumber}}</div>
                  <div class="lot-item">直属会员：{{userDetailInfo.directlyUserCount}}</div>
                  <div class="lot-item">间属会员：{{userDetailInfo.indirectUserCount}}</div>
                  <div class="lot-item">状态：
                    <span v-if="userDetailInfo.status==1">正常</span>
                    <span v-if="userDetailInfo.status==0">冻结</span>
                  </div>
                  <div class="lot-item">注册时间：{{userDetailInfo.registerTime}}</div>
                  <div class="lot-item">备注：{{userDetailInfo.remark}}</div>
                </div>
              </div>
              <div class="user-list">
                <div class="title">
                  <span>会员账户信息</span>
                </div>
                <div class="content clearfix">
                  <div class="lot-item">USDT余额：{{userDetailInfo.usdt}}</div>
                  <div class="lot-item">YYC余额：{{userDetailInfo.yyc}}</div>
                  <div class="lot-item">配送易用积分余额：{{userDetailInfo.sendYyi}}</div>
                  <div class="lot-item">激励易用积分余额：{{userDetailInfo.incentiveYyi}}</div>
                  <!--<div class="lot-item">冻结激励易用积分余额：{{userDetailInfo.frozenYyi}}</div>-->
                </div>
              </div>
              <div class="user-list">
                <div class="title">
                  <span>会员团队信息</span>
                </div>
                <div class="content clearfix">
                  <div class="lot-item">团队人数：{{userDetailInfo.teamCount}}</div>
                  <div class="lot-item">团队业绩：{{userDetailInfo.teamTotalYyi}}</div>
                  <div class="lot-item">团队奖励USDT：{{userDetailInfo.teamRewardsUSDT}}</div>
                  <div class="lot-item">团队奖励激励风水积分：{{userDetailInfo.teamIncentiveYyi}}</div>
                </div>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
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
        queryForm: {
          userNumber: '',
          userName: '',
          referrerNumber: '',
          userType: '',
          userStatus: '',
          registerTime: []
        },
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        elementTotal: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        needGrid: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
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
          {value: '15', label: '二阶段销毁一阶段激励币账户'}
        ],
        // 用户类型options
        userStatusOptions: [
          {value: '', label: '全部'},
          {value: '1', label: '正常'},
          {value: '0', label: '冻结'}
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
      queryClick () {
        this.pageNum = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (!this.queryForm.registerTime) {
          this.queryForm.registerTime = []
        }
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/list/page'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'registerEndTime': this.queryForm.registerTime.length === 2 ? this.queryForm.registerTime[1] : '',
            'registerStartTime': this.queryForm.registerTime.length >= 1 ? this.queryForm.registerTime[0] : '',
            'status': this.queryForm.userStatus,
            'type': this.queryForm.userType,
            'userName': this.queryForm.userName,
            'userNumber': this.queryForm.userNumber,
            'referrerNumber': this.queryForm.referrerNumber
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.dataList = data.data.dataList
            this.elementTotal = data.data.elementTotal
          } else {
            this.$message.error(data.msg)
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageNum = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
//    addOrUpdateHandle (id) {
//      this.addOrUpdateVisible = true
//      this.$nextTick(() => {
//        this.$refs.addOrUpdate.init(id)
//      })
//    },
      seeDetail (row) {
        this.dialogTableVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/one'),
          method: 'get',
          params: this.$http.adornParams({
            'userNumber': row.userNumber
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.userDetailInfo.directlyUserCount = data.data.directlyUserCount
            this.userDetailInfo.frozenYyi = data.data.frozenYyi
            this.userDetailInfo.idCardNumber = data.data.idCardNumber
            this.userDetailInfo.incentiveYyi = data.data.incentiveYyi
            this.userDetailInfo.indirectUserCount = data.data.indirectUserCount
            this.userDetailInfo.lastLoginTime = data.data.lastLoginTime
            this.userDetailInfo.phone = data.data.phone
            this.userDetailInfo.referrerNumber = data.data.referrerNumber
            this.userDetailInfo.registerTime = data.data.registerTime
            this.userDetailInfo.remark = data.data.remark
            this.userDetailInfo.sendYyi = data.data.sendYyi
            this.userDetailInfo.sex = data.data.sex
            this.userDetailInfo.status = data.data.status
            this.userDetailInfo.teamCount = data.data.teamCount
            this.userDetailInfo.teamIncentiveYyi = data.data.teamIncentiveYyi
            this.userDetailInfo.teamRewardsUSDT = data.data.teamRewardsUSDT
            this.userDetailInfo.teamTotalYyi = data.data.teamTotalYyi
            this.userDetailInfo.usdt = data.data.usdt
            this.userDetailInfo.userName = data.data.userName
            this.userDetailInfo.userNumber = data.data.userNumber
            this.userDetailInfo.userType = data.data.userType
            this.userDetailInfo.yyc = data.data.yyc
            this.userDetailInfo.yyi = data.data.yyi
          } else {
            this.$message.error(data.msg)
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
      // 删除
      deleteHandle(id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
        })
      },
      resetForm(formName) {
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
      // 导出
      exportData () {
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/export'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'registerEndTime': this.queryForm.registerTime.length === 2 ? this.queryForm.registerTime[1] : '',
            'registerStartTime': this.queryForm.registerTime.length >= 1 ? this.queryForm.registerTime[0] : '',
            'status': this.queryForm.userStatus,
            'type': this.queryForm.userType,
            'userName': this.queryForm.userName,
            'userNumber': this.queryForm.userNumber,
            'referrerNumber': this.queryForm.referrerNumber
          }),
          responseType: 'arraybuffer'
        }).then(({data}) => {
          if (data) {
            let blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'})
            let objectUrl = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.href = objectUrl
            link.download = '用户信息.xls'

            // 此写法兼容火狐浏览器
            document.body.appendChild(link)

            let evt = document.createEvent('MouseEvents')
            evt.initEvent('click', false, false)
            link.dispatchEvent(evt)

            window.URL.revokeObjectURL(objectUrl)
            this.dataListLoading = false
          }
        })
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

</style>
