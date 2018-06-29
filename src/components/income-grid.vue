<template>
  <div>
    <Button type="primary" style="margin: 30px 7px" @click="addClick=true"><Icon type="plus-round"></Icon> 有新收入啦！</Button>
    <Table :columns="incomeColumns" border :data="incomeData" @on-selection-change="selectionChange"></Table>
    <Modal v-model="addClick"  @on-ok="addIncome" title="新收入记录" @on-cancel="initTableForm">
      <Row class="ModelInput">
        <Col :span="8">收入存入账户： </Col>
        <Select v-model="account" style="width:200px" placeholder="请选择账户">
          <Option :value="index" v-for="(account, index) in myAccountList" :key="account.index">{{account.account_name}}-{{account.account_user}}</Option>
        </Select>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 收入日期：</Col>
        <Col :span="16">
          <DatePicker type="date" placeholder="请选择收入时间"  format="yyyy-MM-dd" style="width: 200px"  v-model="time"></DatePicker>
        </Col>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 收入金额（元）：</Col>
        <Col :span="16"><InputNumber v-model="amount" style="width: 200px"></InputNumber></Col>
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
export default {
  props: {
    type: {
      type: String,
      default: () => ''
    }
  },
  mounted () {
    this.$store.dispatch('getMyAccountList')
  },
  data () {
    return {
      incomeColumns: [
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
          title: '收入金额（元）',
          key: 'amount'
        },
        {
          title: '收入日期',
          key: 'date',
          render: (h, params) => {
            return h('div', params.row.date.split('T')[0])
          }
        },
        {
          title: '账户类型',
          key: 'type'
        }
      ],
      addClick: false,
      account: '',
      time: '',
      amount: 0,
      description: ''
    }
  },
  computed: {
    myAccountList () {
      return this.$store.state.myAccountList
    },
    incomeData () {
      return this.$store.state.incomeData
    }
  },
  methods: {
    selectionChange (selection) {

    },
    remove () {

    },
    addIncome () {
      let params = this.myAccountList[this.account]
      params.amount = this.amount
      params.description = this.description
      params.date = new Date(this.time)
      axios.post('/api/add/income', params).then((res) => {
        if (res.data.status === 1) {
          this.$Message.success('新收入记录成功！')
        } else {
          this.$Message.error('添加失败，请稍候再试！')
        }
      })
      this.initTableForm()
    },
    initTableForm () {
      this.account = ''
      this.time = ''
      this.amount = 0
      this.description = ''
    }
  }
}
</script>
<style lang="less">
  @import "common-less.less";
</style>
