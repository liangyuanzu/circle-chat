<template>
  <view style="margin-top: 20rpx">
    <uni-list>
      <!-- 个人信息 关注列表 -->
      <uni-list-item
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        show-extra-icon
        :extraIcon="item.extraIcon"
        showArrow
        clickable
        @click="listItemClick(item.title)"
      >
      </uni-list-item>

      <!-- 默认加圈 -->
      <uni-list-item
        :title="defalutAdd.title"
        show-extra-icon
        :extraIcon="defalutAdd.extraIcon"
      >
        <template #footer>
          <u-switch
            size="40"
            v-model="addChecked"
            :loading="addLoading"
          ></u-switch>
        </template>
      </uni-list-item>

      <!-- 消息通知 -->
      <uni-list-item
        :title="notice.title"
        show-extra-icon
        :extraIcon="notice.extraIcon"
      >
        <template #footer>
          <u-switch
            size="40"
            v-model="noticeChecked"
            :loading="noticeLoading"
          ></u-switch>
        </template>
      </uni-list-item>
    </uni-list>

    <u-modal
      v-model="addModal"
      title="默认加圈"
      content="开启后系统会自动为您加入一些圈，是否确认开启?"
      show-cancel-button
      @confirm="addConfirm"
      ref="uModal"
    ></u-modal>

    <u-modal
      v-model="noticeModal"
      title="消息通知"
      content="开启后您将会收到系统推送消息，是否确认开启?"
      show-cancel-button
      @confirm="noticeConfirm"
      ref="uModal"
    ></u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addChecked: false,
      noticeChecked: false,
      addLoading: false,
      noticeLoading: false,
      // 中间变量，避免在watch中多次回调，造成无限循环
      addOpenStatus: false,
      addCloseStatus: false,
      noticeOpenStatus: false,
      noticeCloseStatus: false,
      addModal: false,
      noticeModal: false,

      list: [
        {
          title: '个人信息',
          extraIcon: {
            color: '#2979ff',
            size: '22',
            type: 'contact-filled'
          }
        },
        {
          title: '关注列表',
          extraIcon: {
            color: '#ff9900',
            size: '22',
            type: 'star-filled'
          }
        },
        {
          title: '我加入的圈',
          extraIcon: {
            color: '#19be6b',
            size: '22',
            type: 'smallcircle'
          }
        },
        // #ifndef MP-BAIDU
        {
          title: '地图模式',
          extraIcon: {
            color: '#2979ff',
            size: '22',
            type: 'location-filled'
          }
        }
        // #endif
      ],

      defalutAdd: {
        title: '默认加圈',
        extraIcon: {
          color: '#909399',
          size: '22',
          type: 'circle-filled'
        }
      },

      notice: {
        title: '消息通知',
        extraIcon: {
          color: '#ff9900',
          size: '22',
          type: 'sound-filled'
        }
      }
    }
  },

  watch: {
    addChecked(val) {
      if (val) {
        if (this.addOpenStatus) {
          this.addOpenStatus = false
          return
        }
        // 避免造成无限循环
        this.addCloseStatus = true
        this.addChecked = false
        this.addModal = true
      } else {
        if (this.addCloseStatus) {
          this.addCloseStatus = false
          return
        }
        this.addOpenStatus = true
        this.addChecked = true
        this.addLoading = true
        this.$store
          .dispatch('user/userSet', {
            defaultAdd: '000'
          })
          .then(() => {
            this.addCloseStatus = true
            this.addChecked = false
            this.addLoading = false
          })
          .catch(() => {
            this.addLoading = false
          })
      }
    },

    noticeChecked(val) {
      if (val) {
        if (this.noticeOpenStatus) {
          this.noticeOpenStatus = false
          return
        }
        // 避免造成无限循环
        this.noticeCloseStatus = true
        this.noticeChecked = false
        this.noticeModal = true
      } else {
        if (this.noticeCloseStatus) {
          this.noticeCloseStatus = false
          return
        }
        this.noticeOpenStatus = true
        this.noticeChecked = true
        this.noticeLoading = true
        this.$store
          .dispatch('user/userSet', {
            defaultAdd: '000',
            isNotice: 1
          })
          .then(() => {
            this.noticeCloseStatus = true
            this.noticeChecked = false
            this.noticeLoading = false
          })
          .catch(() => {
            this.noticeLoading = false
          })
      }
    }
  },

  methods: {
    listItemClick(title) {
      switch (title) {
        case '个人信息':
          this.$emit('toInfo')
          break
        case '关注列表':
          this.$u.route('/pages/components/focus-list/focus-list')
          break
        case '我加入的圈':
          this.$u.route('/pages/components/my-join-circle/my-join-circle')
          break
        case '地图模式':
          this.$u.route('/pages/components/map-mode/map-mode')
        default:
          break
      }
    },

    addConfirm() {
      this.addModal = false
      this.addLoading = true
      this.$store
        .dispatch('user/userSet', {
          defaultAdd: '111'
        })
        .then(() => {
          this.addOpenStatus = true
          this.addChecked = true
          this.addLoading = false
        })
        .catch(() => {
          this.addLoading = false
        })
    },

    noticeConfirm() {
      this.noticeModal = false
      this.noticeLoading = true
      this.$store
        .dispatch('user/userSet', {
          isNotice: 0
        })
        .then(() => {
          this.noticeOpenStatus = true
          this.noticeChecked = true
          this.noticeLoading = false
        })
        .catch(() => {
          this.noticeLoading = false
        })
    }
  }
}
</script>

<style>
</style>
