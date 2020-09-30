<template>
  <view class="content">
    <!-- 头像 -->
    <view class="avatar">
      <!--  
      <view
        class="cu-avatar xl round margin-left"
        style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);"
      ></view>
      -->
      <u-avatar :src="circleAvatar" size="large" style="margin-left: 30rpx"></u-avatar>
      <view class="change-avatar" @click="changeCircleAvatar()">
        <text>更换头像</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
    </view>

    <!-- 圈信息 -->
    <view class="info">
      <view>
        <text>圈名称：</text>
        <text>贵族圈</text>
      </view>
      <view>
        <text>圈类型：</text>
        <text>交友圈</text>
      </view>
      <view class="owner">
        <text>圈主：</text>
        <text>小李</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
      <view>
        <text>创建时间：</text>
        <text>2020/8/1 12:00</text>
      </view>
      <view class="no-disturb">
        <text>消息免打扰</text>
        <view class="switch">
          <u-switch v-model="checked" @change="change"></u-switch>
        </view>
      </view>
    </view>

    <!-- 公告和说明 -->
    <view class="bottom">
      <view class="notice">
        <view class="title">圈公告</view>
        <view class="content">请友善发言</view>
      </view>
      <view class="explain">
        <view class="title">圈说明</view>
        <view class="content">闲聊，交友</view>
      </view>
    </view>

    <!-- 退出圈 -->
    <view class="exit">
      <text class="text-red">退出该圈</text>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      checked: false,
    };
  },

  computed: {
    ...mapGetters("circle", ["circleAvatar"]),
  },

  methods: {
    changeCircleAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: (res) => {
          uni.showLoading();
          this.$store
            .dispatch("circle/updateCirclePhoto", {
              circleId: "1",
              img: JSON.stringify(res.tempFilePaths[0]),
            })
            .then(() => {
              uni.hideLoading();
              uni.showToast({
                icon: "none",
                position: "bottom",
                title: "修改成功",
              });
            })
            .catch(() => {
              uni.hideLoading();
            });
        },
      });
    },

    change(status) {
      console.log(status);
    },
  },
};
</script>

<style lang="scss">
.content {
  .avatar {
    width: 100%;
    height: 150rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    color: #888;

    .change-avatar {
      margin-right: 30rpx;

      text {
        &:nth-of-type(1) {
          margin-right: 5rpx;
        }
      }
    }
  }

  .info {
    width: 100%;
    margin-top: 20rpx;
    background-color: #fff;

    & > view {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 30rpx;
      border-bottom: 1px solid #f1f1f1;

      text {
        &:nth-of-type(1) {
          font-weight: bold;
          margin-right: 10rpx;
        }
      }
    }

    .owner {
      text {
        &:nth-last-child(1) {
          float: right;
        }
      }
    }

    .no-disturb {
      position: relative;
      .switch {
        display: inline-block;
        position: absolute;
        top: 16rpx;
        right: 30rpx;
      }
    }
  }

  .bottom {
    width: 100%;
    box-sizing: border-box;

    .notice,
    .explain {
      width: 100%;
      height: 250rpx;
      background-color: #fff;
      margin-top: 20rpx;
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

  .exit {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    margin-top: 20rpx;
    text-align: center;
    background-color: #fff;
    // border-top: 20rpx solid #f1f1f1;
  }
}
</style>
