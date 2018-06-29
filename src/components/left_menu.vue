<template>
  <Menu :active-name="activeName" theme="dark" width="auto" :class="menuitemClasses" ref="menuBtn"
        @on-select="checkMenu" accordion :open-names="openNameList">
    <MenuItem v-for="(menuItem, index) in menuList" :key="index" :name="index + ''" v-if="!menuItem.children">
      <Icon :type="menuItem.iconType"></Icon>
      <span>{{menuItem.title}}</span>
    </MenuItem>
    <Submenu v-for="(menuItem, index) in menuList" :key="index" :name="index" v-if="menuItem.children">
      <template slot="title">
        <Icon :type="menuItem.iconType"></Icon>
        <span>{{menuItem.title}}</span>
      </template>
      <MenuItem v-for="(child, child_index) in menuItem.children" :key="child_index" :name="index + '-' + child_index"
                v-if="menuItem.children">
        <Icon :type="child.iconType"></Icon>
        <span>{{child.title}}</span>
      </MenuItem>
    </Submenu>
  </Menu>
</template>
<script>
import {sStorageSet, sStorageGet} from '../common/storage_sj'
export default {
  beforeCreate () {
    this.openNameList = []
    if (sStorageGet('menuName')) {
      this.openNameList[0] = sStorageGet('menuName')[0] * 1
    }
  },
  mounted () {
    this.activeName = sStorageGet('menuName') || 0
  },
  props: {
    isCollapsed: Boolean,
    menuitemClasses: Array
  },
  data () {
    return {
      activeName: '0',
      menuList: [{
        title: '收入',
        iconType: 'happy-outline',
        children: [{
          title: '工资收入',
          iconType: 'card'
        }, {
          title: '理财收入',
          iconType: 'social-yen-outline'
        }, {
          title: '其他收入',
          iconType: 'android-sunny'
        }]
      }, {
        title: '支出',
        iconType: 'sad-outline',
        children: [{
          title: '信用支出',
          iconType: 'card'
        }, {
          title: '账户支出',
          iconType: 'person'
        }, {
          title: '理财支出',
          iconType: 'social-yen-outline'
        }]
      }, {
        title: '我的账户',
        iconType: 'locked'
      }]
    }
  },
  methods: {
    checkMenu (name) {
      sStorageSet({menuName: name})
      this.$store.dispatch('changeMain', false)
      if (name) {
        this.$router.push({name: name})
      }
    }
  }
}
</script>
<style>
@import "../App.less";
</style>
