<template>
  <div>
    <Button type="primary" style="margin: 30px 7px" @click="addClick=true"><Icon type="plus-round"></Icon> 又花钱了！</Button>
    <Table :columns="expendColumns" border :data="expendData"></Table>
    <Modal v-model="addClick"  @on-ok="addIncome" title="新支出记录" @on-cancel="initTableForm">
      <Row class="ModelInput">
        <Col :span="8">支出存入账户： </Col>
        <Select v-model="account" style="width:200px" placeholder="请选择账户" @on-change="selectionChange">
          <Option :value="index" v-for="(account, index) in myAccountList" :key="account.index">{{account.account_name}}-{{account.account_user}}</Option>
        </Select>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 支出日期：</Col>
        <Col :span="16">
        <DatePicker type="date" placeholder="请选择收入时间"  format="yyyy-MM-dd" style="width: 200px"  v-model="time"></DatePicker>
        </Col>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 支出金额（元）：</Col>
        <Col :span="16">
          <InputNumber v-model="amount" style="width: 200px"></InputNumber>
        <div v-show="errorShow" style="color:red">账户余额不足，请核对后重新输入</div>
        <div v-show="amount<0" style="color:red">支出不能为负，请核对后重新输入</div>
        </Col>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 备注：</Col>
        <Col :span="16"><Input v-model="description" style="width: 200px"></Input></Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
let accountNameList = {
  normal: '普通账户',
  credit: '信用账户',
  money_management: '理财账户'
}
export default {
  props: {
    type: {
      type: String,
      default: () => ''
    }
  },
  mounted () {
  },
  data () {
    return {
      expendColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '合作企业',
          key: 'account_name'
        },
        {
          title: '合作人',
          key: 'account_user'
        },
        {
          title: '支出金额（元）',
          key: 'amount'
        },
        {
          title: '支出日期',
          key: 'date',
          render: (h, params) => {
            return h('div', params.row.date.split('T')[0])
          }
        },
        {
          title: '账户类型',
          key: 'type',
          render: (h, params) => {
            return h('span',
              accountNameList[params.row.type])
          }
        },
        {
          title: '备注',
          key: 'description'
        }
      ],
      addClick: false,
      account: 0,
      time: new Date(),
      amount: 0,
      description: ''
    }
  },
  computed: {
    myAccountList () {
      return this.$store.state.myAccountList
    },
    expendData () {
      return this.$store.state.expendData
    },
    errorShow () {
      if (this.myAccountList[this.account] && (this.myAccountList[this.account].amount || this.myAccountList[this.account].amount === 0)) {
        return !(this.myAccountList[this.account].amount - this.amount >= 0)
      } else {
        return false
      }
    }
  },
  methods: {
    selectionChange (selection) {
    },
    remove () {

    },
    addIncome () {
      if (this.errorShow || this.amount < 0) {
        this.$Message.error('新支出记录失败，请核对后重新输入！')
        return
      }
      if (!this.amount) {
        this.$Message.error('支出不能为0！')
        return this.myAccountList[this.account]
      }
      let params = this.myAccountList[this.account]
      params.amount = this.amount
      params.description = this.description
      params.date = new Date(this.time)
      axios.post('/api/add/expend', params).then((res) => {
        if (res.data.status === 1) {
          this.$Message.success('新支出记录成功！')
          let start = new Date(this.$store.state.timeValue[0]).toLocaleDateString()
          let end = new Date(this.$store.state.timeValue[1]).toLocaleDateString()
          console.log(this.$router.currentRoute.path.replace('/', ''))
          this.$store.dispatch(this.$router.currentRoute.path.replace('/', ''), {start: start, end: end})
        } else {
          this.$Message.error('添加失败，请稍候再试！')
        }
      })
      this.initTableForm()
    },
    initTableForm () {
      this.account = 0
      this.time = new Date()
      this.amount = 0
      this.description = ''
    }
  }
}
</script>
<style lang="less">
  @import "common-less.less";
</style>
