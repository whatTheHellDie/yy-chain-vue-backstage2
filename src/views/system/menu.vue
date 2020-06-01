<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content main-content1">
      <div class="menu-menu in-b">
        <div class="name">菜单</div>
        <el-button type="primary" @click="toAddTopMenu()">+ 添加最高级菜单</el-button>
        <div class="block">
          <el-tree :data="menuTree" node-key="id" default-expand-all :expand-on-click-node="false"  @node-click="updateHandle">
            <span class="custom-tree-node"  slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span style="font-size: 16px;">
                <el-button type="text" @click.stop="() => append(data)"> +
                </el-button>
                <el-button type="text" @click.stop="() => remove(node, data)"> -
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="menu-info in-b">
        <div class="title">菜单信息</div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-input v-model="form.parentId" type="hidden"></el-input>
          <el-form-item label="父级菜单">
            <el-input v-model="parentName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="跳转URL">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dao">
        <el-dialog title="顶级菜单基本信息"  :visible.sync="menuVisibleAdd">
          <el-form ref="form" :model="form" :rules="formRules" class="identity add_user">
            <div>
              <el-form-item label="分类名称：" prop="name">
                <el-input v-model="form.name">
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="排序：">
                <el-input v-model="form.sort" ></el-input>
              </el-form-item>
            </div>
            <div class="clearfix">
              <div class="pull-right">
                <el-button  @click="menuVisibleAdd=false">取消</el-button>
                <el-button type="primary" style="" @click="addTopMenu()">确认</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  let id = 1000;
  export default {
    data () {
      const data = []
      return {
        menuTree: JSON.parse(JSON.stringify(data)),
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        formRules: {
          name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
          sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
        },
        form: {
          id: '',
          parentId: '',
          name: '新增菜单',
          sort: '',
          url: ''
        },
        parentName: '',
        menuVisibleAdd: false
      }
    },
    components: {},
    activated () {
      this.getDataList()
    },
    methods: {
      // 添加菜单节点
      append (data) {
        this.resetForm()
        this.form.name='新增菜单'
        const newChild = { parentId: id++, label: this.form.name, children: [] }
        this.parentName = data.label
        this.form.parentId = data.id
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      // 删除菜单节点
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        this.$confirm(`确定删除所选的菜单吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          children.splice(index, 1)
          this.parentName = ''
          this.$http({
            url: this.$http.adornUrl('/bs/menu/delete'),
            method: 'delete',
            params: this.$http.adornParams({'menuId': data.id})
          }).then(({data}) => {
            if (data && data.code === '0000') {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
            }
          })
        }).catch(() => {})
      },
      // 树结构菜单
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/bs/menu/tree'),
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.menuTree = data.data
          } else {
            this.menuTree = []
          }
        })
      },
      toAddTopMenu () {
        this.menuVisibleAdd = true
         this.resetForm()
      },
      // 添加顶级菜单
      addTopMenu () {
        this.$http({
          url: this.$http.adornUrl('/bs/menu/insert'),
          method: 'post',
          data: this.$http.adornData({
            name: this.form.name,
            sort: this.form.sort,
            url: 0
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.menuVisibleAdd = false
                this.getDataList()
                 this.resetForm()
              }
            })
          }
        })
      },
      updateHandle(data){
        console.log(data)
        //alert(data.id+'----'+data.label)
        //this.parentName = data.label
        this.form.parentId = data.parentId
        this.form.id = data.id
        this.form.name = data.label
        this.form.sort = data.sort
        this.form.url = data.url
        // this.$http({
        //   url: this.$http.adornUrl('/bs/menu/detail'),
        //   method: 'get',
        //   params:this.$http.adornParams({id: data.id})
        // }).then(({data}) => {
        //   console.log(data)
        //   if (data && data.code === '0000') {
        //     this.parentName = data.parentName
        //     this.form.parentId = data.parentId
        //     this.form.id = data.id
        //     this.form.name = data.label
        //     this.form.sort = data.sort
        //     this.form.url = data.url
        //   } else {
        //     this.resetForm()
        //   }
        // })
      },
      onSubmit () {
        if (!this.form.name) {
          this.$message.error('菜单名称不能为空')
          return
        }
        if (!this.form.sort) {
          this.$message.error('排序号不能为空')
          return
        }
        if (!this.form.url) {
          this.$message.error('URL不能为空')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/bs/menu/insert'),
          method: 'post',
          data: this.$http.adornData({
            parent: this.form.parentId,
            name: this.form.name,
            sort: this.form.sort,
            url: this.form.url
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.menuVisibleAdd = false
                this.getDataList()
                this.resetForm()
              }
            })
          }
        })
      },
      resetForm () {
        this.parentName = ''
        this.form.parentId = ''
        this.form.id = ''
        this.form.name = ''
        this.form.sort = ''
        this.form.url = ''
      }
    }
  }
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.el-button--medium{
  font-size: 16px !important;
    font-weight: 800 ;
}
  .absoluteList {
    position: absolute;
    top: 36px;
    left: 139px;
    min-width: 292px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
