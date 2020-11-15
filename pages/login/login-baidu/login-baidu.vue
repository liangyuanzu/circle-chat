<template>
  <view class="content padding-lg">
    <view class="brand">
      <view class="logo">
        <image :src="logoUrl" />
      </view>
      <view class="margin-top-sm text-xl text-black">{{ title }}</view>
    </view>

    <u-divider half-width="50" border-color="#666" class="margin-top-xl"
      >登录帐号，可享受以下功能和权益</u-divider
    >

    <u-grid :col="3" :border="false" class="margin-top-xl" hover-class="none">
      <u-grid-item v-for="(item, index) in gridList" :key="index">
        <u-icon :name="item.name" :size="46"></u-icon>
        <view class="grid-text">{{ item.tetx }}</view>
      </u-grid-item>
    </u-grid>

    <u-button type="primary" shape="circle" style="margin-top: 200rpx"
      >百度用户授权登录</u-button
    >
  </view>
</template>

<script>
import logoUrl from './../logo.js'

export default {
  data() {
    return {
      logoUrl,
      title: '咸鱼有梦的智能聊天定位软件',
      gridList: [
        {
          name: 'chat',
          tetx: '实时聊天'
        },
        {
          name: 'map',
          tetx: '查看地图'
        },
        {
          name: 'star',
          tetx: '关注他人'
        },
        {
          name: 'plus-circle',
          tetx: '创建圈聊'
        },
        {
          name: 'account',
          tetx: '个人中心'
        },
        {
          name: 'clock',
          tetx: '历史记录'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF !important;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 80rpx;

  .brand {
    margin: 0 auto;

    .logo {
      width: 161rpx;
      height: 161rpx;
      margin: 0 auto;
      box-shadow: 0rpx 0rpx 60rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      background-color: #000000;

      image {
        width: 161rpx;
        height: 161rpx;
        border-radius: 50%;
      }
    }
  }

  .grid-text {
    font-size: 28rpx;
    margin-top: 4rpx;
    color: $u-type-info;
  }
}
</style>
