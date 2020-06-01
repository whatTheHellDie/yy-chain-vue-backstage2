<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>后台用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <el-form :inline="true" ref="dataform" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色值：" prop="code">
           <el-input v-model="dataForm.code" placeholder="请输入"></el-input>
         </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('dataform')">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 30px;">
        <el-button type="primary" @click="toAddPage()">+ 添加</el-button>
      </div>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="roleId" header-align="center" align="center" width="80" type="index" :index="1" label="序号">
        </el-table-column>
        <el-table-column prop="code" header-align="center" align="center" label="角色值">
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="角色名">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注">
        </el-table-column>
        <el-table-column header-align="center" align="center" width="200" label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="setAccess(scope.row.roleId,scope.row.name)">设置权限</el-button>-->
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle"
                     @current-change="currentChangeHandle"
                     :current-page="pageNum"
                     :page-sizes="[10]"
                     :page-size="pageSize"
                     :total="elementTotal" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!--修改 -->
      <div class="dao">
        <el-dialog title="修改用户信息" widt :visible.sync="dialogFormVisible2">
          <el-form ref="form" :model="form" :rules="formRules" class="identity">
            <div>
              <el-form-item label="角色值：">
                <el-input v-model="form.code" disabled></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="用户名：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" v-model="form.remark" autosize style="width:100px;"></el-input>
              </el-form-item>
            </div>
            <div>
              <span>选择菜单权限</span>
              <el-tree
                :data="data2"  show-checkbox  default-expand-all node-key="id"
                ref="tree"  highlight-current :props="defaultProps">
              </el-tree>
            </div>
            <div class="clearfix">
              <div class="pull-right">
                <el-button @click="resetChecked">取消</el-button>
                <el-button type="primary" style="" @click="updateHandle()">确认</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
<!--添加角色-->
      <div class="dao">
        <el-dialog title="添加角色" widt :visible.sync="dialogFormVisibleAdd">
          <el-form ref="form" :model="form" :rules="formRules" class="identity add_user">
            <div>
              <el-form-item label="角色值：" prop="code">
                <el-input v-model="form.code">
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="角色名称：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="备注：">
                <el-input type="textarea" v-model="form.remark" autosize style="width:100px;"></el-input>
              </el-form-item>
            </div>
            <div>
              <span>选择菜单权限</span>
              <el-tree
                :data="data2"  show-checkbox  default-expand-all node-key="id"
                ref="tree"  highlight-current :props="defaultProps">
              </el-tree>

            </div>
            <div class="clearfix">
              <div class="pull-right">
                <el-button @click="resetChecked">取消</el-button>
                <el-button type="primary" style="" @click="addHandle()">确认</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
<!--设置权限-->
      <!--<div class="dao">
        <el-dialog title="权限设置" widt :visible.sync="setAccessVisible">
          <span>《{{roleName}}》的菜单权限设置</span>
          <el-tree
            :data="data2"  show-checkbox  default-expand-all node-key="id"
            ref="tree"  highlight-current :props="defaultProps">
          </el-tree>
          <div class="buttons">
            <input type="hidden" v-model="roleIds"/>
            <el-button style="float: right;" @click="getCheckedKeys(roleIds)">确定</el-button>
            <el-button class="cleanButten" @click="resetChecked">清空</el-button>
          </div>
        </el-dialog>
      </div>-->

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        absoluteMenu: false,
        data2: [],
        defaultProps: {},
        dataForm: {
          code: '',
          name: '',
          status: '',
          date1: ''
        },
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        elementTotal: 0,
        roleName: '',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible2: false,
        dialogFormVisibleAdd: false,
        setAccessVisible: false,
        formRules: {
          name: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          code: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
        },
        form: {
          id: '',
          name: '',
          region: '',
          date1: '',
          status: 0,
          remark: '',
          menuIds: '',
          code: ''
        },
        optionChosen: [],
        selectedOptions2: '',
        menuIdStr: '',
        roleIds: ''
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
        this.$http({
          url: this.$http.adornUrl('/bs/role/page'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'code': this.dataForm.code,
            'name': this.dataForm.name
          })
        }).then(({ data }) => {
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
        this.$http({
          url: this.$http.adornUrl('/bs/menu/tree'),
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.data2 = data.data
          } else {
            this.data2 = []
          }
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
      // 新增页面
      toAddPage () {
        this.form = {}
        this.dialogFormVisibleAdd = true
        this.form.status = 0
      },
      // 取消键
      resetChecked () {
        this.dialogFormVisibleAdd = false
        this.dialogFormVisible2 = false
        this.$refs.tree.setCheckedKeys([])
        this.clearForm()
      },
      // getCheckedKeys () {
      //   console.log(this.$refs.tree.getCheckedKeys())
      //   this.$confirm(`确定提交所选的菜单吗?`, '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //   }).then(() => {
      //     var menuIds = this.$refs.tree.getCheckedKeys()
      //     if (menuIds) {
      //       for (let i = 0; i < menuIds.length; i++) {
      //         this.menuIdStr += menuIds[i] + ','
      //       }
      //     }
      //     this.$http({
      //       url: this.$http.adornUrl('/bs/role/update/menu'),
      //       method: 'post',
      //       data: this.$http.adornData({
      //         'roleIds': this.roleIds,
      //         'menuIds': this.menuIdStr
      //       })
      //     }).then(({ data }) => {
      //       if (data && data.code === '0000') {
      //         this.$message({
      //           message: '设置成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.setAccessVisible = false
      //             this.getDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   }).catch(() => {})
      // },
      // 新增
      addHandle () {
        var menuIds = this.$refs.tree.getCheckedKeys()
        if (menuIds) {
          this.form.menuIds = ''
          for (let i = 0; i < menuIds.length; i++) {
            this.form.menuIds += menuIds[i] + ','
          }
        }
        this.$http({
          url: this.$http.adornUrl('/bs/role/insert'),
          method: 'post',
          data: this.$http.adornData({
            code: this.form.code,
            name: this.form.name,
            remark: this.form.remark,
            menuIds: this.form.menuIds
          })
        }).then(({ data }) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogFormVisibleAdd = false
                this.getDataList()
                this.clearForm()
              }
            })
          }
        })
      },
      // 修改
      updateHandle () {
        this.$confirm(`确定提交修改吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var menuIds = this.$refs.tree.getCheckedKeys()
          if (menuIds) {
            this.form.menuIds = ''
            for (let i = 0; i < menuIds.length; i++) {
              this.form.menuIds += menuIds[i] + ','
            }
          }
          this.$http({
            url: this.$http.adornUrl('/bs/role/update'),
            method: 'post',
            data: this.$http.adornData({
              roleId: this.form.id,
              code: this.form.code,
              name: this.form.name,
              remark: this.form.remark,
              menuIds: this.form.menuIds
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
                  this.form = {}
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 详细 / 修改页面
      addOrUpdateHandle (id) {
        this.dialogFormVisible2 = true
        this.$http({
          url: this.$http.adornUrl('/bs/role/detail'),
          method: 'get',
          params: this.$http.adornParams({ 'roleId': id })
        }).then(({ data }) => {
          if (data && data.code === '0000') {
            this.form.id = data.data.roleId
            this.form.code = data.data.code
            this.form.name = data.data.name
            this.form.remark = data.data.remark
            var menuIds = []
            this.$refs.tree.setCheckedKeys([])
            for (var i = 0; i < data.data.menus.length; i++) {
              menuIds[i] = data.data.menus[i].id
            }
            this.$refs.tree.setCheckedKeys(menuIds)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 删除
      deleteHandle (id, name) {
        this.$confirm(`确定${id ? '删除' : '批量删除'}【${name}】会员吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/bs/role/delete'),
            method: 'get',
            params: this.$http.adornParams({'id': id})
          }).then(({
            data
          }) => {
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      clearForm () {
        this.form.id = ''
        this.form.code = ''
        this.form.name = ''
        this.form.remark = ''
      }
    }
  }
</script>
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .absoluteList{
    position: absolute;
    top: 36px;
    left: 139px;
    min-width: 292px;}
  .cleanButten{
    float: right;
    margin-left: 0px;
    margin-right: 15px;
    margin-bottom: 0px;
  }
</style>
