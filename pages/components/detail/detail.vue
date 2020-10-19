<template>
  <view class="content">
    <!-- 头像 -->
    <view class="title">
      <view
        class="cu-avatar xl round margin-left"
        style="
          background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);
        "
      ></view>
      <view class="message">
        <view>
          <text>圈名称</text>
          <text class="name">{{ this.info.name }}</text>
        </view>
        <view>
          <text>圈人数</text>
          <text>999</text>
        </view>
      </view>
    </view>

    <!-- 中间 -->
    <view class="middle">
      <view class="middle-left">
        <view style="font-weight: bold; color: #333">圈主</view>
        <view>
          <text>小李</text>
          <text>男</text>
          <text>20</text>
        </view>
        <view class="operate">
          <button class="cu-btn line-blue" @click="toChat">私聊</button>
          <button class="cu-btn line-blue">关注</button>
        </view>
      </view>
      <view class="middle-right">
        <view>
          <text>圈类型</text>
          <text>{{ this.info.type }}</text>
        </view>
        <view>
          <text>圈范围</text>
          <text>{{ this.info.radius + '米' }}</text>
        </view>
        <view>
          <text>创建时间</text>
          <text>2020.8.1</text>
        </view>
      </view>
    </view>

    <!-- 公告和说明 -->
    <view class="bottom">
      <view class="notice">
        <view class="title">圈公告</view>
        <view class="content">{{ this.info.notice }}</view>
      </view>
      <view class="explain">
        <view class="title">入圈说明</view>
        <view class="content">{{ this.info.explain }}</view>
      </view>
    </view>

    <!-- 加入圈 -->
    <view class="join">
      <button class="cu-btn round lg bg-blue" @click="toCircleChat">
        加入圈
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      info: {}
    }
  },

  onLoad(options) {
    this.info = JSON.parse(options.info)
  },

  methods: {
    toChat() {
      const userinfo = {
        userId: 10,
        username: this.info.username || '张三丰'
      }
      uni.navigateTo({
        url: '/pages/components/chat/chat?userinfo=' + JSON.stringify(userinfo)
      })
    },

    toCircleChat() {
      const circleinfo = {
        circleId: this.info.circleId,
        circleName: this.info.name
      }
      uni.navigateTo({
        url:
          '/pages/components/chat/chat?circleinfo=' + JSON.stringify(circleinfo)
      })
    }
  }
}
</script>

<style lang="scss">
.content {
  color: #666;
  .title {
    width: 100%;
    height: 150rpx;
    line-height: 150rpx;
    background-color: #fff;
    position: relative;

    .message {
      display: inline-block;
      position: absolute;
      margin-left: 30rpx;
      // left: 50%;
      // top: 50%;
      // transform: translate(-50%, -50%);

      view {
        height: 75rpx;
        line-height: 75rpx;

        text {
          &:nth-of-type(1) {
            margin-right: 30rpx;
            font-weight: bold;
            color: #333;
          }
        }
      }
    }
  }

  .middle {
    width: 100%;
    height: 350rpx;
    margin-top: 10rpx;
    display: flex;
    justify-content: space-between;

    .middle-left,
    .middle-right {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      view {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        display: flex;
        justify-content: space-between;
      }
    }
    .middle-left {
      .operate {
        position: relative;
        top: 20rpx;
        left: 0;
      }
    }
    .middle-right {
      margin-left: 5rpx;
      text {
        width: 100%;
        &:nth-of-type(1) {
          color: #333;
          font-weight: bold;
        }
      }
    }
  }

  .bottom {
    width: 100%;
    height: 500rpx;
    box-sizing: border-box;
    .notice,
    .explain {
      width: 100%;
      height: 250rpx;
      background-color: #fff;
      margin-top: 10rpx;
      padding: 30rpx;

      .title {
        height: 50rpx;
        line-height: 50rpx;
        font-weight: bold;
        color: #333;
      }
      .content {
        height: 200rpx;
        line-height: 50rpx;
      }
    }
  }

  .join {
    width: 100%;
    height: 207rpx;
    line-height: 207rpx;
    margin-top: 20rpx;
    text-align: center;
    background-color: #fff;
  }
}
</style>
