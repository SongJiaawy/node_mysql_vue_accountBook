<template>
  <div class="layout">
    <Layout>
      <Sider ref="siderBtn" breakpoint="sm" hide-trigger collapsible v-model="isCollapsed" :collapsed-width="80">
        <div class="logoContent" :class="menuitemClasses" @click="checkMainLogo">
          <a href="/#/main">
            <Icon type="ios-book-outline"></Icon>
            <span id="logoText" :class="showLogoText">记账本</span>
          </a>
        </div>
        <leftMenu :isCollapsed="!!isCollapsed" :menuitemClasses="menuitemClasses"></leftMenu>
      </Sider>
      <Layout>
        <Header  :style="{padding: 0}" class="layout-header-bar">
          <Row>
            <Col :span = '4'><Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '12px 12px 0'}" type="navicon-round" size="24"></Icon></Col>
            <Col :span = '16'>
              <Menu mode="horizontal" theme="light" active-name="day" @on-select="checkDaysMenu">
                <div class="layout-nav">
                  <MenuItem v-for="(headItem, index) in headerList" :key="index" :name="headItem.date">
                    <Icon :type="headItem.iconType"></Icon>
                    <span>{{headItem.title}}</span>
                  </MenuItem>
                </div>
              </Menu>
            </Col>
            <Col :span="2"><h6 style="text-align: center">{{$store.state.username}}</h6></Col>
            <Col :span="2"><Button type="text" @click="logOut">退出</Button></Col>
          </Row>
        </Header>
        <Content :style="{margin: '20px',background: '#fff', minHeight: '260px'}">
          <Row style="margin-top: 30px">
            <Col :span="2">&nbsp;</Col>
            <Col :span="12">
              <DatePicker style="width: 75%" type="daterange" :readonly="checkEdit" confirm  placeholder="请选择起止日期" :editable="false" format="yyyy-MM-dd" v-model="timeValueSet" @on-ok="checkTimeOk"></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col :span="2">&nbsp;</Col>
            <Col span="20">
            &nbsp;<router-view :checkDaysMenuClick="checkDaysMenuClick"></router-view>
            </Col>
          </Row>

        </Content>
        <Footer v-if="!isMain">
          <table width="180px">
            <tr>
              <td width="50%" >账户余额：</td>
              <td>{{amount.grossAmount.total}}</td>
            </tr>
            <tr>
              <td>总支出：</td>
              <td>{{amount.expend.total}}</td>
            </tr>
            <tr>
              <td>总收入：</td>
              <td>{{amount.income.total}}</td>
            </tr>
          </table>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {sStorageGet, sStorageSet} from './common/storage_sj'
import leftMenu from './components/left_menu.vue'
export default {
  mounted () {
    this.getInitData()
    let myTime = setTimeout(() => {
      this.logOut()
    }, 10 * 60 * 1000)
    let resetTime = () => {
      clearTimeout(myTime)
      myTime = setTimeout(() => {
        this.logOut()
      }, 10 * 60 * 1000)
    }
    document.documentElement.onkeydown = resetTime
    document.documentElement.onclick = resetTime
    document.documentElement.onmousemove = resetTime
  },
  components: {
    leftMenu
  },
  data () {
    return {
      isCollapsed: false,
      checkEdit: true,
      timeValueSet: [],
      checkDaysMenuClick: '',
      headerList: [{
        title: '日账单',
        iconType: 'ios-calendar-outline',
        date: 'day'
      }, {
        title: '月账单',
        iconType: 'ios-moon-outline',
        date: 'month'
      }, {
        title: '年账单',
        iconType: 'ios-ionic-outline',
        date: 'year'
      }, {
        title: '自定义时间',
        iconType: 'edit',
        date: 'edit-time'
      }],
      dateOptions: {

      },
      columns1: [
        {
          title: '账户',
          key: 'account_name'
        },
        {
          title: '余额',
          key: 'amount'
        }
      ],
      data1: [
        {
          account_name: '北京银行',
          amount: 18
        },
        {
          account_name: '民生银行',
          amount: 24
        }
      ]
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    showLogoText () {
      return this.isCollapsed ? 'logoText' : ''
    },
    amount () {
      return this.$store.state.amount
    },
    isMain () {
      return this.$store.state.isMain
    }
  },

  methods: {
    collapsedSider () {
      this.$refs.siderBtn.toggleCollapse()
    },
    checkMainLogo () {
      this.$store.dispatch('changeMain', true)
      sStorageSet({menuName: ''})
    },
    checkDaysMenu (name) {
      this.checkHeaderMenu(name)
      this.checkDaysMenuClick = name
      let start = new Date(this.$store.state.timeValue[0]).toLocaleDateString()
      let end = new Date(this.$store.state.timeValue[1]).toLocaleDateString()
      this.timeValueSet = this.$store.state.timeValue
      this.$store.dispatch('getInitDate', {start: start, end: end})
      if (this.$router.currentRoute.name[0] === '0') {
        this.$store.dispatch(this.$router.currentRoute.path.replace('/', ''), {start: start, end: end})
      }
    },
    getInitData () {
      let isMain = sStorageGet('isMain')
      this.$store.dispatch('changeMain', isMain)
      this.timeValueSet = this.$store.state.timeValue
      let start = new Date(this.$store.state.timeValue[0]).toLocaleDateString()
      let end = new Date(this.$store.state.timeValue[1]).toLocaleDateString()
      this.$store.dispatch('getInitDate', {start: start, end: end})
    },
    checkTimeOk (time) {
      this.$store.dispatch('changeTimeValue', this.timeValueSet)
      let start = new Date(this.timeValueSet[0])
      let end = new Date(this.timeValueSet[1])
      this.$store.dispatch('getInitDate', {start: start, end: end})
    },
    checkHeaderMenu (name) {
      switch (name) {
        case 'edit-time':
          this.checkEdit = false
          break
        case 'month':
          this.checkEdit = true
          let startMonth = new Date(new Date().setDate(1))
          let endMonth = new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
          this.$store.dispatch('changeTimeValue', [startMonth, endMonth])
          break
        case 'year':
          this.checkEdit = true
          let startYear = new Date(new Date(new Date().setDate(1)).setMonth(0))
          let endYear = new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
          this.$store.dispatch('changeTimeValue', [startYear, endYear])
          break
        default:
          this.checkEdit = true
          let startDay = new Date()
          let endDay = new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
          this.$store.dispatch('changeTimeValue', [startDay, endDay])
      }
    },
    logOut () {
      this.$store.dispatch('logOut', this.$router)
    }
  }
}
</script>
<style lang="less">
@import "App.less";
</style>
