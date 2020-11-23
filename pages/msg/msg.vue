<template>
  <view>
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
        <u-dropdown-item title="筛选">
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
          <view class="text-cut">{{
            item.userId ? item.username : item.circleName
          }}</view>
          <view class="text-gray text-sm flex">
            <view class="text-cut">
              <rich-text :nodes="item.data"></rich-text> </view
          ></view>
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
import { read } from '@/helpers/chat.js'

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
        },
        {
          label: '我的圈',
          value: '我创建的',
          color: '#19be6b',
          border: '1px solid #19be6b',
          active: false,
          activeClass: 'successAct'
        }
      ],
      activeOption: [],
      list: []
    }
  },

  computed: {
    ...mapGetters('user', ['userId']),
    ...mapState('chat', ['CurrentToUser'])
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
        if (!userinfo) {
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

  methods: {
    formatKey(item) {
      return item.userId ?? item.circleId
    },

    formatTime(time) {
      if (time) return Time.getTime(Number(time))
    },

    formatBadge(noReadNum) {
      if (noReadNum > 0 && noReadNum <= 99) {
        return noReadNum
      } else if (noReadNum > 99) {
        return '99+'
      }
      return ''
    },

    toChatDetail(id) {
      const index = this.list.findIndex(
        (i) => i.userId === id || i.circleId === id
      )
      const item = this.list[index]

      if (item.userId) {
        uni.navigateTo({
          url: '/pages/components/chat/chat?personId=' + item.userId
        })
        // 服务端未读数更新
        this.$store.dispatch('chat/readMsg', {
          toUserId: item.userId
        })
      } else if (item.circleId) {
        uni.navigateTo({
          url: '/pages/components/chat/chat?circleId=' + item.circleId
        })
        // 服务端未读数更新
        this.$store.dispatch('chat/readMsg', {
          circleId: item.circleId
        })
      }

      // 缓存未读数更新
      read(item)
    },

    getList() {
      this.list = localStore.get(chatListName) || []
    },

    tagClick(index) {
      this.options[index].active = !this.options[index].active
    },

    confirm() {
      uni.showLoading({
        title: '加载中...'
      })
      this.$refs.uDropdown.close()
      this.activeOption = this.options
        .filter((item) => item.active)
        .map((i) => i.value)
      if (this.activeOption) {
        this.list = this.list.filter((i) =>
          this.activeOption.includes(i.circleType)
        )
      } else {
        this.getList()
      }
      uni.hideLoading()
    },

    toSearch() {
      this.$u.route('/pages/components/search/search')
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
