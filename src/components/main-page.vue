<template>
  <div>
    <Collapse v-model="collapseValue" style="margin-top: 80px" v-if="isMain" accordion @on-change="getList">
      <Panel name="1">
        账户余额：{{amount.grossAmount.total}}元
        <p slot="content">
        <Table border :columns="columns1" :data="grossAmountData"></Table>
        </p>
      </Panel>
      <Panel name="2">
        总支出：{{amount.expend.total}}元
        <p slot="content">
        <p slot="content">
        <Table border :columns="columns2" :data="expendData"></Table>
        </p></p>
      </Panel>
      <Panel name="3">
        总收入：{{amount.income.total}}元
        <p slot="content">
        <Table border :columns="columns3" :data="incomeData"></Table>
        </p>
      </Panel>
    </Collapse>
    <router-view name="content"></router-view>
  </div>
</template>
<script>
export default {
  props: {
    checkDaysMenuClick: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      collapseValue: '0',
      columns1: [
        {
          title: '账户',
          key: 'account_name'
        },
        {
          title: '用户',
          key: 'account_user'
        },
        {
          title: '余额（元）',
          key: 'total'
        }
      ],
      columns2: [
        {
          title: '账户',
          key: 'account_name'
        },
        {
          title: '用户',
          key: 'account_user'
        },
        {
          title: '支出金额（元）',
          key: 'total'
        }
      ],
      columns3: [
        {
          title: '账户',
          key: 'account_name'
        },
        {
          title: '用户',
          key: 'account_user'
        },
        {
          title: '收入金额（元）',
          key: 'total'
        }
      ],
      grossAmountData: [],
      expendData: [],
      incomeData: []
    }
  },
  computed: {
    amount () {
      return this.$store.state.amount
    },
    isMain () {
      return this.$store.state.isMain
    }
  },
  methods: {
    getList (key) {
      let list = this.$store.state.amount.grossAmount.list
      switch (key[0]) {
        case '2':
          this.expendData = list.map((account) => {
            console.log(this.$store.state.amount.expend.list[account.account_name + account.account_user])
            return {
              account_name: account.account_name,
              account_user: account.account_user,
              total: this.$store.state.amount.expend.list[account.account_name + account.account_user] || 0
            }
          })
          break
        case '3':
          this.incomeData = list.map((account) => {
            return {
              account_name: account.account_name,
              account_user: account.account_user,
              total: this.$store.state.amount.income.list[account.account_name + account.account_user] || 0
            }
          })
          break
        default:
          this.grossAmountData = list
      }
    }
  },
  watch: {
    checkDaysMenuClick: function () {
      this.collapseValue = '0'
    }
  }
}
</script>
<style>
</style>
