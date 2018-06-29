<template>
  <div>
    <Collapse v-model="collapseValue" style="margin-top: 80px" v-if="isMain" accordion @on-change="getList">
      <Panel name="1">
        账户余额：{{amount.grossAmount.total}}
        <p slot="content">
        <Table border :columns="columns1" :data="grossAmountData"></Table>
        </p>
      </Panel>
      <Panel name="2">
        总支出：{{amount.expend.total}}
        <p slot="content">
        <p slot="content">
        <Table border :columns="columns1" :data="expendData"></Table>
        </p></p>
      </Panel>
      <Panel name="3">
        总收入：{{amount.income.total}}
        <p slot="content">
        <Table border :columns="columns1" :data="incomeData"></Table>
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
          title: '余额',
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
            return {
              account_name: account.account_name,
              total: this.$store.state.amount.expend.list[account.account_name] || 0
            }
          })
          break
        case '3':
          this.incomeData = list.map((account) => {
            return {
              account_name: account.account_name,
              total: this.$store.state.amount.income.list[account.account_name] || 0
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
