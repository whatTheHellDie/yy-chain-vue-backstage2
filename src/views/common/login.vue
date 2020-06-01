<template>
  <div class="site-wrapper site-page--login" v-loading="loginLoading" element-loading-text="登录中">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
        </div>
        <div class="login-main">
          <h3 class="login-title">易用链后台管理系统</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="账户"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <!--<el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>-->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getUUID } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: ''
//        captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
//        captcha: [
//          { required: true, message: '验证码不能为空', trigger: 'blur' }
//        ]
        },
        loginLoading: false
//      captchaPath: ''
      }
    },
    created () {
//    this.getCaptcha()
      if(this.$route.query.loginStatus=="failed"){
        this.$message.error("登录超时，请重新登录！")
      }
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loginLoading = true
            this.$http({
              url: this.$http.adornUrl('/bs/manager/login'),
              method: 'post',
              data: this.$http.adornData({
                'number': this.dataForm.userName,
                'password': this.dataForm.password
              })
            }).then(({data}) => {
              this.loginLoading = false
              if (data && data.code === '0000') {
                this.$cookie.set('yy-chain-bs-token', data.data.token)
                this.$router.push({ name: 'home' })
              } else {
//              this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
      // 获取验证码
//    getCaptcha () {
//      this.dataForm.uuid = getUUID()
//      this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
//    }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    overflow: hidden;
    &:before {
     position: fixed;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    min-width: 1180px;
    height: 100%;
    content: "";
    background-image: url(/static/img/login_bg.jpg);
    background-size: cover;
    background-position: bottom;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
     position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -245px;
    padding: 0 40px;
    width: 450px;
    height: 446px;
    margin-top: -223px;
    background-color: #fff;
    -webkit-box-shadow: 0px 6px 17px 0px rgba(51, 51, 51, 0.19);
    box-shadow: 0px 6px 17px 0px rgba(51, 51, 51, 0.19);
    }
    .login-title {
  font-size: 36px;
  color: #ed9d0e;
  margin: 47px auto 70px;
  text-align: center;
  font-weight: normal;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
