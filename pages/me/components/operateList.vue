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
        :border="false"
        clickable
        @click="listItemClick(item.title)"
      >
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
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
          title: '受邀列表',
          extraIcon: {
            color: '#1cbbb4',
            size: '22',
            type: 'personadd-filled'
          }
        },
        {
          title: '我创建的圈',
          extraIcon: {
            color: '#9c26b0',
            size: '22',
            type: 'plus-filled'
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
        {
          title: '地图模式',
          extraIcon: {
            color: '#2979ff',
            size: '22',
            type: 'location-filled'
          }
        }
      ]
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
        case '受邀列表':
          this.$u.route(
            '/pages/components/receive-invite-list/receive-invite-list'
          )
          break
        case '我创建的圈':
          this.$u.route('/pages/components/my-create-circle/my-create-circle')
          break
        case '我加入的圈':
          this.$u.route('/pages/components/my-join-circle/my-join-circle')
          break
        case '地图模式':
          this.$u.route('/pages/components/map-mode/map-mode')
        default:
          break
      }
    }
  }
}
</script>

<style>
</style>
