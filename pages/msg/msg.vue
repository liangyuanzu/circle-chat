<template>
  <view>
    <u-no-network></u-no-network>

    <view class="bar">
      <u-search
        placeholder="搜索用户和圈"
        class="search"
        :clearabled="false"
        :show-action="false"
        disabled
        @click="toSearch"
      ></u-search>
      <u-dropdown ref="uDropdown">
        <u-dropdown-item></u-dropdown-item>
        <u-dropdown-item></u-dropdown-item>
        <!--
        <u-dropdown-item title="筛选" >
          <view class="slot-content">
            <view class="item-box">
              <view
                class="item"
                :class="[item.active ? item.activeClass : '']"
                :style="[{ color: item.color, border: item.border }]"
                @tap="tagClick(index)"
                v-for="(item, index) in options"
                :key="index"
              >
                {{ item.label }}
              </view>
            </view>
            <u-button type="primary" @click="confirm">确定</u-button>
          </view>
        </u-dropdown-item>
				-->
        <u-dropdown-item
          title="筛选"
          v-model="circleType"
          :options="circleOptions"
          @change="typeSelect"
        >
        </u-dropdown-item>
      </u-dropdown>
    </view>

    <view class="cu-list menu-avatar">
      <view
        class="cu-item"
        v-for="item in list"
        :key="formatKey(item)"
        @click="toChatDetail(formatKey(item))"
      >
        <view
          class="cu-avatar radius lg"
          :style="'background-image: url(' + item.avatar + ')'"
        ></view>
        <view class="content">
          <view
            class="text-cut"
            :class="{
              'text-blue': item.circleType === '交友圈',
              'text-yellow': item.circleType === '固定圈',
              'text-red': item.circleType === '紧急圈'
            }"
            >{{ item.userId ? item.username : item.circleName }}</view
          >
          <view class="text-gray text-sm flex">
            <view class="text-cut">
              <text>{{ item.data }}</text>
            </view></view
          >
        </view>
        <view class="action">
          <view class="text-grey text-xs"> {{ formatTime(item.time) }}</view>
          <view class="cu-tag round bg-red sm" v-show="item.noReadNum > 0">{{
            formatBadge(item.noReadNum)
          }}</view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="list.length === 0">
      <u-empty mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
import Time from '@/helpers/time.js'
import { readMsg } from '@/helpers/chat.js'

import {
  chatListName,
  receiveOneType,
  receiveCircleType
} from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { toFirst } from '@/helpers/utils.js'
import { chatFormat, formatMsg } from '@/helpers/chat.js'
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      options: [
        {
          label: '交友圈',
          value: '交友圈',
          color: '#2979ff',
          border: '1px solid #2979ff',
          active: false,
          activeClass: 'primaryAct'
        },
        {
          label: '固定圈',
          value: '固定圈',
          color: '#ff9900',
          border: '1px solid #ff9900',
          active: false,
          activeClass: 'warningAct'
        },
        {
          label: '紧急圈',
          value: '紧急圈',
          color: '#fa3534',
          border: '1px solid #fa3534',
          active: false,
          activeClass: 'errorAct'
        }
        /*
        {
          label: '我的圈',
          value: '我创建的',
          color: '#19be6b',
          border: '1px solid #19be6b',
          active: false,
          activeClass: 'successAct'
				}
				 */
      ],
      activeOption: [],
      list: [],
      circleType: '',
      circleOptions: [
        {
          label: '综合',
          value: '综合'
        },
        {
          label: '交友圈',
          value: '交友圈'
        },
        {
          label: '固定圈',
          value: '固定圈'
        },
        {
          label: '紧急圈',
          value: '紧急圈'
        }
      ],
      refreshing: false,
      clicked: false
    }
  },

  computed: {
    ...mapGetters('user', ['userId', 'personinfo', 'isInit']),
    ...mapGetters('circle', ['circleInfo']),
    ...mapState('chat', ['CurrentToUser'])
  },

  onReady() {
    // #ifdef MP-BAIDU
    uni.checkSession({
      fail: () => {
        const chatList = localStore.get(chatListName) || []
        if (chatList.length === 0) {
          const data = {
            type: 'person',
            userId: 63,
            username: '小提示',
            avatar: 'https://circlechat.top/files/img/male.jpeg',
            data: '欢迎来到圈聊小程序，登录即可体验所有功能...',
            time: new Date().getTime(),
            noReadNum: 1
          }
          this.list.push(data)
          uni.setTabBarBadge({
            index: 0,
            text: '1'
          })
        }
      }
    })
    // #endif
  },

  onLoad() {
    // 开启监听
    uni.$on('UserChat', (res) => {
      if (res.type === receiveOneType) {
        const index = this.list?.findIndex(
          (val) => val.userId === res.body.userId
        )
        // 会话存在
        if (index !== -1) {
          let item = this.list[index]
          item.data = formatMsg(res.body.type, {
            content: res.body.content
          })
          item.time = res.body.createTime
          item.noReadNum++
          // 删除数组中这个元素
          this.list.splice(index, 1)
          // 置顶
          this.list.unshift(item)
          return
        }
        // 不存在
        const user = {
          userId: this.userId,
          toUser: this.CurrentToUser.userId,
          toUserName: this.CurrentToUser.username,
          toUserAvatar: this.CurrentToUser.avatar
        }
        let obj = chatFormat(res, { type: 'chatList' }, user)
        obj.noReadNum = 1
        this.list.unshift(obj)
      } else if (res.type === receiveCircleType) {
        const index = this.list?.findIndex(
          (val) => val.circleId === res.body.circleId
        )
        // 会话存在
        if (index !== -1) {
          let item = this.list[index]
          // 判断是否是本人
          if (res.body.userId == this.userId) {
            item.data = formatMsg(res.body.type, {
              content: res.body.content,
              isCircle: true,
              isMe: true
            })
          } else {
            item.data = formatMsg(res.body.type, {
              username: res.body.username,
              content: res.body.content,
              isCircle: true
            })
          }
          item.time = res.body.createTime
          item.noReadNum++
          // 删除数组中这个元素
          this.list.splice(index, 1)
          // 置顶
          this.list.unshift(item)
          return
        }
        // 不存在
        const user = {
          userId: this.userId
        }
        let obj = chatFormat(res, { type: 'chatList', isCircle: true }, user)
        obj.noReadNum = 1
        this.list.unshift(obj)
      }
    })
  },

  onShow() {
    // 获取列表
    this.getList()
  },

  onHide() {
    // #ifdef MP-BAIDU
    uni.checkSession({
      success: () => {
        const userinfo = localStore.get('userinfo')
        if (userinfo) {
          if (!this.isInit) {
            this.$store.dispatch('user/init_baidu').then(() => {
              this.$store.commit('user/setIsInit', true)
            })
          }
        } else {
          uni.reLaunch({
            url: '/pages/login/login-baidu/login-baidu'
          })
        }
      },

      fail: () => {
        this.$store.dispatch('user/logout_baidu')
        uni.reLaunch({
          url: '/pages/login/login-baidu/login-baidu'
        })
      }
    })
    // #endif
  },

  onPullDownRefresh() {
    if (this.refreshing) return
    this.refreshing = true
    Promise.all([
      this.$store.dispatch('chat/getOldChatList', 0),
      this.$store.dispatch('chat/getNoReadNum')
    ]).then(() => {
      this.getList()
      uni.stopPullDownRefresh()
      this.refreshing = false
    })
  },

  methods: {
    formatKey(item) {
      return item.userId ?? item.circleId
    },

    formatTime(time) {
      if (time) return Time.getListTime(Number(time))
    },

    formatBadge(noReadNum) {
      if (noReadNum > 0 && noReadNum <= 99) {
        return noReadNum
      } else if (noReadNum > 99) {
        return '99+'
      }
      return ''
    },

    async toChatDetail(id) {
      if (this.clicked) return
      this.clicked = true

      const index = this.list.findIndex(
        (i) => i.userId === id || i.circleId === id
      )
      const item = this.list[index]

      // 未读数更新
      readMsg(id)
      item.noReadNum = 0

      if (item.userId) {
        await this.$store.dispatch('user/getPersonInfo', item.userId)
        const { isFocus } = this.personinfo
        if (isFocus === 3) {
          uni.navigateTo({
            url:
              '/pages/components/chat/chat?personInfo=' +
              encodeURIComponent(JSON.stringify(this.personinfo))
          })
        } else {
          uni.showToast({
            title: '双方关注才可聊天',
            icon: 'none'
          })
        }
        setTimeout(() => (this.clicked = false), 500)
      } else if (item.circleId) {
        await this.$store.dispatch('circle/getCircleInfo', item.circleId)
        const { inCircle } = this.circleInfo
        if (inCircle) {
          uni.navigateTo({
            url:
              '/pages/components/chat/chat?circleInfo=' +
              encodeURIComponent(JSON.stringify(this.circleInfo))
          })
        } else {
          uni.showToast({
            title: '加入圈后才可聊天',
            icon: 'none'
          })
        }
        setTimeout(() => (this.clicked = false), 500)
      }
    },

    getList() {
      // #ifdef MP-BAIDU
      const chatList = localStore.get(chatListName) || []
      uni.checkSession({
        success: () => {
          this.list = chatList
        },
        fail: () => {
          if (chatList.length !== 0) this.list = chatList
        }
      })
      // #endif
    },

    tagClick(index) {
      this.options[index].active = !this.options[index].active
    },

    confirm() {
      uni.showLoading({
        title: '加载中...'
      })
      const chatList = localStore.get(chatListName) || []
      if (chatList.length === 0) return
      this.$refs.uDropdown.close()
      this.activeOption = this.options
        .filter((item) => item.active)
        .map((i) => i.value)
      if (this.activeOption.length > 0) {
        uni.hideLoading()
        this.list = chatList.filter((i) =>
          this.activeOption.includes(i.circleType)
        )
        if (this.list.length === 0) {
          uni.showToast({
            title: '消息列表中没有您选的圈',
            icon: 'none'
          })
        }
      } else {
        uni.hideLoading()
        this.getList()
      }
    },

    toSearch() {
      this.$u.route('/pages/components/search/search')
    },

    typeSelect(type) {
      if (type === '综合') {
        this.getList()
      } else {
        const chatList = localStore.get(chatListName) || []
        this.list = chatList.filter((i) => i.circleType === type)
        if (this.list.length === 0) this.$u.toast('消息列表中没有您选的圈')
      }
    }
  }
}
</script>

<style lang="scss">
.bar {
  position: relative;
  background-color: #fff;

  .search {
    width: 60%;
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
  }
}

.u-dropdown__menu__item {
  &:nth-child(1),
  &:nth-child(2) {
    visibility: hidden;
  }
}

.slot-content {
  background-color: #ffffff;
  padding: 24rpx;

  .item-box {
    margin-bottom: 50rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      // border: 1px solid $u-type-primary;
      // color: $u-type-primary;
      padding: 8rpx 40rpx;
      border-radius: 100rpx;
      margin-top: 30rpx;
    }

    .primaryAct,
    .warningAct,
    .errorAct,
    .successAct {
      color: #ffffff !important;
    }

    .primaryAct {
      background-color: $u-type-primary;
    }

    .warningAct {
      background-color: $u-type-warning;
    }

    .errorAct {
      background-color: $u-type-error;
    }

    .successAct {
      background-color: $u-type-success;
    }
  }
}
</style>
