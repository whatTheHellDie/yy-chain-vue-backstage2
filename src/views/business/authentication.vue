<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务管理</el-breadcrumb-item>
      <el-breadcrumb-item>实名认证管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="queryForm" :model="queryForm" @keyup.enter.native="getDataList()">
        <el-form-item label="会员号：" prop="userNumber">
          <el-input v-model="queryForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="会员名称：" prop="userName">
          <el-input v-model="queryForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="userStatus">
          <el-select v-model="queryForm.userStatus">
            <el-option v-for="option in userStatusOptions" :key="option.value" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间:" prop="createTime" editable="true" clearable="false">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.createTime"
                          style="width: 100%;" unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核时间:" prop="checkTime">
          <el-date-picker type="daterange" placeholder="选择日期" v-model="queryForm.checkTime"
                          style="width: 100%;" :unlink-panels="true" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center"  width="50">
        </el-table-column>
        <el-table-column prop="userId" header-align="center" align="center" width="80" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="userNumber" header-align="center" align="center" label="会员编号">
        </el-table-column>
        <el-table-column prop="userName" header-align="center" align="center" label="会员姓名">
        </el-table-column>
        <el-table-column prop="status" header-align="center" align="center" :formatter="userStatusFormatter" label="状态">
        </el-table-column>
        <el-table-column prop="userType" header-align="center" align="center" :formatter="userTypeFormatter" label="会员类型">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" width="180" label="提交时间">
        </el-table-column>
        <el-table-column prop="checkTime" header-align="center" align="center" width="160" label="审核时间">
        </el-table-column>
        <el-table-column header-align="center" align="center" width="180" label="操作">
          <template slot-scope="scope">
              <el-button  v-if="scope.row.status == 0" type="text" @click="showDetail(scope.row)" class="blue">审核</el-button>
            <el-button type="text" @click="showDetail(scope.row,'view')" class="grey">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <el-dialog title="实名认证" :visible.sync="dialogTableVisible">
        <div class="shiming">
          <dl>
           <!--/ <dd><span class="name">id：</span>{{detail.id}}</dd>-->
            <dd><span class="name">会员编号：</span> {{detail.userNumber}}</dd>
            <dd><span class="name">会员名称：</span> {{detail.userName}}</dd>
            <dd><span class="name">身份证号：</span> {{detail.idCardNumber}}</dd>
            <dd><span class="name">提交时间：</span> {{detail.createTime}}</dd>
            <dd><span class="name">状态：</span>
              <span style="text-align: left;" v-if="detail.status==0">待审核</span>
              <span style="text-align: left;" v-if="detail.status==1">审核通过</span>
              <span style="text-align: left;" v-if="detail.status==2">审核不通过</span>
            </dd>
            <dd><span class="name">身份证正面：</span>
              <el-popover placement="right" width="400" trigger="hover">
                <img :src="detail.idCardFrontPicUrl" style="display: block;" alt="" width="auto"/>
                <img :src="detail.idCardFrontPicUrl" slot="reference" class="upload-img" alt=""/>
              </el-popover>
            </dd>

            <dd><span class="name">身份证反面：</span>
              <el-popover placement="right" width="400" trigger="hover">
                <img :src="detail.idCardOppositePicUrl" style="display: block;" alt="" width="auto"/>
                <img :src="detail.idCardOppositePicUrl" slot="reference" class="upload-img" alt=""/>
              </el-popover>
            </dd>
            <dd><span class="name">审核记录：</span>
              <div>
                <el-table :data="recordData" class="shiming-record">
                  <el-table-column prop="date" label="序号" type="index" :index="1">
                  </el-table-column>
                  <el-table-column prop="checkTime" label="审核时间">
                  </el-table-column>
                  <el-table-column prop="checker" label="审核人">
                  </el-table-column>
                  <el-table-column prop="status" label="审核结果">
                    <template slot-scope="scope">
                      <div v-if="scope.row.status === 0">待审核</div>
                      <div v-else-if="scope.row.status === 1">审核通过</div>
                      <div v-else>审核不通过</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注/原因">
                  </el-table-column>
                </el-table>
              </div>
            </dd>
            <dd  v-if="detail.view">
              <span class="name">备注/原因：</span>
              <textarea style="width: 513px;height: 50px;" v-model="detail.remark"></textarea>
            </dd>
            <div class="text-center" v-if="detail.view">
              <el-button type="primary" style="margin-right: 154px;" @click="check(1)">审核通过</el-button>
              <el-button @click="check(2)">审核不通过</el-button>
            </div>
          </dl>
        </div>
       <!-- <el-table :data="needGrid">
        </el-table>-->
      </el-dialog>
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
          userType: '',
          userStatus: '',
          createTime: [],
          checkTime: []
        },
        // zhengmian: "/static/img/zhan.png",
        recordData: [],
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        needGrid: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        detail: {
          id: '',
          userNumber: '',
          userName: '',
          idCardNumber: '',
          idCardFrontPicUrl: '',
          idCardOppositePicUrl: '',
          createTime: '',
          checkTime: '',
          idCard: false,
          resource: '',
          remark: '',
          view: ''
        },
        formLabelWidth: '120px',
        // 用户类型options
        userTypeOptions: [
          {value: '', label: '全部'},
          {value: '2', label: '发起人'},
          {value: '3', label: '合伙人'},
          {value: '4', label: '领导人'},
          {value: '5', label: 'vip用户'},
          {value: '6', label: '普通用户'}
        ],
        // 认证状态options
        userStatusOptions: [
          {value: '', label: '全部'},
          {value: '0', label: '待审核'},
          {value: '1', label: '审核通过'},
          {value: '2', label: '审核不通过'}
        ]
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
          url: this.$http.adornUrl('/bs/user/manage/query/auth/list/page'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'userNumber': this.queryForm.userNumber,
            'userName': this.queryForm.userName,
            'status': this.queryForm.userStatus,
            'createStartTime': this.queryForm.createTime.length >= 1 ? this.queryForm.createTime[0] : '',
            'createEndTime': this.queryForm.createTime.length === 2 ? this.queryForm.createTime[1] : '',
            'checkStartTime': this.queryForm.checkTime.length >= 1 ? this.queryForm.checkTime[0] : '',
            'checkEndTime': this.queryForm.checkTime.length === 2 ? this.queryForm.checkTime[1] : ''
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.dataList = data.data.dataList
            this.totalPage = data.data.elementTotal
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message({type: 'error',message: error})
        })
      },
      showDetail (row, ve) {
        this.dialogTableVisible = true
        if (!ve) {
          this.detail.view = 'view'
        } else {
          this.detail.view = ''
        }
        this.getOne(row, ve)
      },
      // 获取数据列表
      getOne (row, ve) {
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/query/auth/one'),
          method: 'get',
          params: this.$http.adornParams({
            'userNumber': row.userNumber
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.detail.id = data.data.authId
            this.detail.userNumber = data.data.userNumber
            this.detail.userName = data.data.userName
            this.detail.idCardNumber = data.data.idCardNumber
            this.detail.idCardFrontPicUrl = data.data.idCardFrontPicUrl
            this.detail.idCardOppositePicUrl = data.data.idCardOppositePicUrl
            this.detail.createTime = data.data.createTime
            this.detail.status = data.data.status

            this.recordData = data.data.checkList
          } else {
            this.dataList = []
            this.totalPage = 0
          }

        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
					this.$message({type: 'error',message: error})
        })
      },
      check (passFlag) {
        if (this.detail.remark == null || this.detail.remark == '') {
					this.$message({type: 'error',message: '审核意见不能为空'})
          return
        } else if (this.detail.remark.length > 20) {
					this.$message({type: 'error',message: '审核意见长度不能大于20字'})
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/user/manage/check'),
          method: 'post',
          params: this.$http.adornParams({
            'id': this.detail.id,
            'remark': this.detail.remark,
            'passFlag': passFlag
          })
        }).then(({data}) => {
          this.dataListLoading = false
          this.dialogTableVisible = false
          if (data && data.code === '01502') {
						this.$message({type: 'success',message: data.msg})
          } else {
						this.$message({type: 'error',message: data.msg})
          }
          this.detail.remark = ''
          this.getDataList()
        }).catch(({error}) => {
          this.dataListLoading = false
					this.$message({type: 'error',message: error})
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 用户类型格式，table使用
      userTypeFormatter (row, column, cellValue) {
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

  .blue {
    color: #1890ff;
  }

  .grey {
    color: #b4b4b4;
  }

  .shiming {
    color: #000;
    text-align: left;
    font-size: 14px;
    dd {
      margin: 16px 0;
    }
    span {
      color: rgba(0, 0, 0, .65);
      margin-right: 15px;
      display: inline-block;
      vertical-align: top;
      width: 270px;
      text-align: right;
    }
    .upload-img{width: 224px;display: block;height: auto}
  }

  .record {
    width: 600px;
    display: block;
    margin: 0 auto;
  }

</style>
