<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>后台用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="dataform"  :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="用户编号：" prop="number">
          <el-input v-model="dataForm.number"> </el-input>
        </el-form-item>
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <el-select v-model="dataForm.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="冻结" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('dataform')">重置</el-button>
          <el-button type="primary" @click="toAddPage()">新增</el-button>
        </el-form-item>
        <!-- <div class="dao">
        <el-button type="primary"><icon-svg name="exports"></icon-svg>导出</el-button>
        </div>-->
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="number" header-align="center" align="center" label="编号">
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" header-align="center" align="center" label="手机号">
        </el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">启用</div>
            <div v-else>冻结</div>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" header-align="center" align="center" label="角色">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" width="180" label="注册时间">
        </el-table-column>
        <el-table-column header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.number)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.number,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageNum"
                     :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="elementTotal"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!--修改 -->
      <div class="dao">
        <el-dialog title="修改用户信息" widt :visible.sync="dialogFormVisible2">
          <el-form ref="formx" :model="formx" :rules="formxRules" class="identity">
            <div>
              <el-form-item label="用户编号：">
                <el-input v-model="formx.number" disabled></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="用户名：" prop="name">
                <el-input v-model="formx.name" ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="formx.phone"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="赋予角色：">
                <el-select v-model="formx.roleId" multiple placeholder="请选择">
                  <el-option  v-for="item in optionss"  :key="item.roleId"  :label="item.name"  :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="是否冻结：">
                <el-radio-group v-model="formx.status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="clearfix">
              <div class="pull-right">
                <el-button  @click="claerFormx">取消</el-button>
                <el-button type="primary" style="" @click="updateHandle()">确认</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
<!--添加用户信息-->
      <div class="dao">
        <el-dialog title="添加用户信息" widt :visible.sync="dialogFormVisibleAdd">
          <el-form ref="formx" :model="formx" :rules="formxRules" class="identity add_user">
            <div>
              <el-form-item label="用户编号：" prop="number">
                <el-input v-model="formx.number">
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="用户名：" prop="name">
                <el-input v-model="formx.name" ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="初始密码：" prop="password" >
                <el-input v-model="formx.password"  type="password" ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="formx.phone"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="赋予角色：">
                <el-select v-model="rolev" multiple placeholder="请选择">
                  <el-option  v-for="item in optionss"  :key="item.roleId"  :label="item.name"  :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="是否冻结：">
                <el-radio-group v-model="formx.status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="clearfix">
              <div class="pull-right">
                <el-button  @click="claerFormx">取消</el-button>
                <el-button type="primary" style="" @click="addHandle()">确认</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          const reg = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
          console.log(reg.test(value))
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
      var checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户编号不能为空'))
        } else {
          this.$http({
            url: this.$http.adornUrl('/bs/manager/exist'),
            method: 'get',
            params: this.$http.adornParams({'number': value})
          }).then(({data}) => {
            if (data && data.code === '0006') {
              callback(new Error('该用户编号已经存在！'))
            } else {
              callback()
            }
          })
        }
      }
      var checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'))
        } else {
          if (value.length < 6) {
            return callback(new Error('密码长度不能小于6位'))
          } else {
            callback()
          }
        }
      }
      return {
        dataForm: {
          number: '',
          name: '',
          status: '',
          date1: ''
        },
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        elementTotal: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible2: false,
        dialogFormVisibleAdd: false,
        formxRules: {
          number: [{ required: true, validator: checkNumber, trigger: 'blur' }],
          phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
          name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          password: [{ required: true, validator: checkPassword, trigger: 'blur' }]
        },
        formx: {
          id: '',
          number: '',
          name: '',
          region: '',
          phone: '',
          date1: '',
          status: 0,
          date2: '',
          roleId: [],
          delivery: false,
          password: '',
          errorMessage1: '',
          errorMessage2: '',
          errorMessage3: '',
          errorMessage4: ''
        },
        rolev: [],
        optionss: [],
        roleIdStr: ''
      }
    },
    components: {},
    activated () {
      this.getDataList()
      this.getRole()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/bs/manager/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageNum,
            'size': this.pageSize,
            'number': this.dataForm.number,
            'name': this.dataForm.name,
            'status': this.dataForm.status
          })
        }).then(({
          data
        }) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.dataList = data.data.dataList
            this.elementTotal = data.data.elementTotal
          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          this.dataListLoading = false
        })
        // console.log(data.list)
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
      // 新增页面
      toAddPage () {
        this.formx = {}
        this.dialogFormVisibleAdd = true
        this.formx.status = 0
      },
      // 新增
      addHandle () {
        if (this.rolev) {
          for (let i = 0; i < this.rolev.length; i++) {
           // const element = array[index];
            this.roleIdStr += this.rolev[i] + ','
          }
        }
        if (!(/^1[345678]\d{9}$/.test(this.formx.phone))) {
          this.$message.error('请输入正确电话号码')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/manager/insert'),
          method: 'post',
          data: this.$http.adornData({
            number: this.formx.number,
            name: this.formx.name,
            password: this.formx.password,
            phone: this.formx.phone,
            roleIds: this.roleIdStr,
            status: this.formx.status
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogFormVisibleAdd = false
                this.getDataList()
                this.formx = {}
              }
            })
          }
        })
      },
      // 修改
      updateHandle () {
        if (this.formx.roleId) {
          for (let i = 0; i < this.formx.roleId.length; i++) {
            this.roleIdStr += this.formx.roleId[i] + ','
          }
        }
        if (!(/^1[345678]\d{9}$/.test(this.formx.phone))) {
          this.$message.error('请输入正确电话号码')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/manager/modify'),
          method: 'post',
          data: this.$http.adornData({
            number: this.formx.number,
            name: this.formx.name,
            password: this.formx.password,
            phone: this.formx.phone,
            roleIds: this.roleIdStr,
            status: this.formx.status
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogFormVisible2 = false
                this.getDataList()
                this.formx = {}
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 详情 / 修改页面
      addOrUpdateHandle (number) {
        this.addOrUpdateVisible = true
        this.$http({
          url: this.$http.adornUrl('/bs/manager/details'),
          method: 'get',
          params: this.$http.adornParams({'number': number})
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.dialogFormVisible2 = true
            this.formx.roleId = []
            this.formx.id = data.data.id
            this.formx.number = data.data.number
            this.formx.name = data.data.name
            this.formx.password = data.data.password
            this.formx.phone = data.data.phone
            this.formx.status = data.data.status
            for (let i = 0; i < data.data.role.length; i++) {
              this.formx.roleId[i] = data.data.role[i].roleId
            }
            console.log(this.formx.roleId)
          } else {
            this.formx = {}
            this.$message.error(data.msg)
          }
        })
      },
      // 删除
      deleteHandle (number, name) {
        this.$confirm(`确定${number ? '删除' : '批量删除'}【${name}】会员吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/bs/manager/delete'),
            method: 'get',
            params: this.$http.adornParams({'number': number})
          }).then(({data}) => {
            if (data && data.code === '0000') {
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
        }).catch(() => {})
      },
      // 获取角色
      getRole () {
        this.$http({
          url: this.$http.adornUrl('/bs/role/list'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.optionss = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      claerFormx () {
        this.dialogFormVisibleAdd = false
        this.dialogFormVisible2 = false
        this.rolev = []
        this.formx.roleId = []
        this.formx.id = ''
        this.formx.number = ''
        this.formx.name = ''
        this.formx.password = ''
        this.formx.phone = ''
        this.formx.status = ''
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
