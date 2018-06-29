<template>
  <div>
    <Button type="primary" style="margin: 30px 7px" @click="addClick=true"><Icon type="plus-round"></Icon> 添加新的账户</Button>
    <Button type="error" style="margin: 30px 7px" @click="remove(selectAmount, selectAmountZero)"><Icon type="android-remove"></Icon> 批量删除账户</Button>
    <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns" style="margin-left: 7px;">
      <Checkbox label="account_user">合作人</Checkbox>
      <Checkbox label="amount">合作金额</Checkbox>
      <Checkbox label="type">账户类型</Checkbox>
    </Checkbox-group>
    <Table :columns="columnsMyAccount" border :data="getMyAccountList" ref="myAccountTable" @on-selection-change="selectionChange"></Table>
    <Modal v-model="addClick"  @on-ok="addAccount" title="添加新的账户" @on-cancel="initTableForm">
      <Row class="ModelInput">
        <Col :span="8">合作企业： </Col>
        <Col :span="16"><Input v-model="accountName"></Input></Col>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8"> 合作人：</Col>
        <Col :span="16"><Input v-model="accountUser"></Input></Col>
      </Row>
      <Row  class="ModelInput">
        <Col :span="8">账户类型：</Col>
        <Col :span="16">
        <Select v-model="type" style="width:200px">
          <Option value="normal">普通账户</Option>
          <Option value="credit">信用账户</Option>
          <Option value="money_management">理财账户</Option>
        </Select>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'

let typeList = {
  'normal': '普通账户',
  'credit': '信用账户',
  'money_management': '理财账户'
}
export default {
  mounted () {
    this.$store.dispatch('getMyAccountList')
    this.changeTableColumns()
  },
  data () {
    return {
      tableColumnsChecked: ['account_user', 'amount', 'type'],
      columnsMyAccount: [],
      addClick: false,
      accountName: '',
      accountUser: '',
      deleteAmount: '',
      selectAmount: {},
      selectAmountZero: false,
      type: 'normal'
    }
  },
  methods: {
    changeTableColumns () {
      this.columnsMyAccount = this.getColumns()
    },
    addAccount () {
      axios.post('/api/add/account', {
        accountName: this.accountName,
        accountUser: this.accountUser,
        type: this.type
      }).then((res) => {
        this.initTableForm()
        if (res.data.status === 1) {
          this.$store.dispatch('getMyAccountList')
          this.$Notice.success({
            title: '添加新账户成功！'
          })
        } else {
          this.$Notice.error({
            title: '添加新账户失败！'
          })
        }
      })
    },
    initTableForm () {
      this.accountName = ''
      this.accountUser = ''
      this.deleteAmount = ''
    },
    getColumns () {
      const ColumnsMyAccount = {
        selection: {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        account_name: {
          title: '合作企业',
          key: 'account_name'
        },
        account_user: {
          title: '合作人',
          key: 'account_user'
        },
        amount: {
          title: '合作金额',
          key: 'amount'
        },
        type: {
          title: '账户类型',
          key: 'type',
          render: (h, params) => {
            return h('span', typeList[params.row.type])
          }
        },
        deleteAmount: {
          title: '删除账户',
          key: 'deleteAmount',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                on: {
                  click: () => {
                    this.remove(params.row, !params.row.amount)
                  }
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'android-cancel',
                    color: params.row.isDefult ? '#919191' : 'red'
                  }
                })
              ])
            ])
          }
        }
      }
      let data = [ColumnsMyAccount.selection, ColumnsMyAccount.account_name, ColumnsMyAccount.deleteAmount]
      this.tableColumnsChecked.forEach((col) => {
        data.splice(-1, 0, ColumnsMyAccount[col])
      })
      return data
    },
    remove (options, isZero) {
      if (options.length === 0) {
        this.$Message.error('请选择至少一个账户！')
        return
      }
      if (!isZero) {
        this.selectAmountZero = false
        this.$Message.error('删除账户失败：账户余额不为零！')
        return
      }
      if (options.isDefult) {
        return
      }
      axios.post('/api/delete/account', {
        account_id: options.account_id
      }).then((res) => {
        if (res.data.status === 1) {
          this.$Message.success('删除成功！')
          this.$store.dispatch('getMyAccountList')
        } else {
          this.$Message.error('删除失败，请稍后重试！')
        }
      })
    },
    selectionChange (selection) {
      this.selectAmount.account_id = selection.map((select) => {
        if (select.amount === 0) {
          this.selectAmountZero = true
        }
        if (!select.isDefult) {
          return select.account_id
        } else {
          return -1
        }
      })
      this.selectAmount.account_id = this.selectAmount.account_id.filter((selectId) => {
        return selectId > -1
      })
    }
  },
  computed: {
    getMyAccountList () {
      return this.$store.state.myAccountList
    }
  }
}
</script>
<style lang="less">
@import "common-less.less";
</style>
