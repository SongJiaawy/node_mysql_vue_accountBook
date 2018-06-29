<template>
  <div class="login">
    <div class="loginForm">
      <div class="backLog" @click="isRegister=false;initForm()"><a v-show="isRegister"><Icon type="chevron-left"></Icon> 去登陆</a></div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" v-show="!isRegister">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        </FormItem>
        <a @click="isRegister=true;initForm()">注册</a>
      </Form>
      <Form ref="regFormInline" :model="regFormInline" :rules="regRuleInline" v-show="isRegister">
        <FormItem prop="regUser">
          <Input type="text" v-model="regFormInline.user" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="regPassword">
          <Input type="password" v-model="regFormInline.password" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="rePassword">
          <Input type="password" v-model="regFormInline.rePassword" placeholder="确认密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('regFormInline')">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {sStorageSet} from '../common/storage_sj'
let vm = null
export default {
  beforeMount () {
    vm = this
  },
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      regFormInline: {
        user: '',
        password: '',
        rePassword: ''
      },
      isRegister: false,
      ruleInline: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码.', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少不能少于6位', trigger: 'blur' }
        ]
      },
      regRuleInline: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码.', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少不能少于6位', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请输入密码.', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少不能少于6位', trigger: 'blur' },
          {validator (rule, value, callback, source, options) {
            var errors = []
            if (value !== vm.regFormInline.password) {
              errors.push({message: '两次输入密码不同'})
            }
            callback(errors)
          },
          trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    initForm () {
      this.formInline = {
        user: '',
        password: ''
      }
      this.regFormInline = {
        user: '',
        password: '',
        rePassword: ''
      }
    },
    loginSuccess (username) {
      this.$Message.success('正在跳转！')
      sStorageSet({'login': true})
      this.$store.dispatch('changeMain', true)
      setTimeout(() => {
        this.$router.push({name: 'main'})
        this.initForm()
        this.$store.dispatch('setUsername', username)
      }, 500)
    },
    handleSubmit () {
      if (this.isRegister) {
        this.$refs.regFormInline.validate((valid) => {
          if (valid) {
            axios.post('/api/register', this.regFormInline).then((res) => {
              if (res.data.status === 2) {
                this.$Message.error('用户名已存在！')
                this.initForm()
              } else if (res.data.status === 1) {
                sStorageSet({'Token': res.data.token})
                this.loginSuccess(this.regFormInline.user)
              } else {
                this.$Message.error('注册失败，请稍候重试！')
                this.initForm()
              }
            })
          }
        })
      } else {
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            axios.post('/api/login', this.formInline).then((res) => {
              if (res.data.status === 2) {
                this.$Message.error('密码错误！')
                this.initForm()
              } else if (res.data.status === 1) {
                sStorageSet({'Token': res.data.token})
                this.loginSuccess(this.formInline.user)
              } else {
                this.$Message.error('用户名不存在！')
                this.initForm()
              }
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
  .login{
    width: 100%;
    height: 100%;
    background: url('../assets/login.jpg') no-repeat ;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .loginForm{
      padding: 20px 15px;
      .backLog{
        position: relative;
        left: 0;
        bottom: 20px;
        font-size: 15px;
        a {
          color: #f0f0f0;
        }
        a:hover{
          color: aquamarine;
        }
      }
    }
  }
</style>
