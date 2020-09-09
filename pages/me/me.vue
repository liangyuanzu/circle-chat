<template>
  <view class="content">
    <!-- 头像 -->
    <view class="avatar">
      <view
        class="cu-avatar xl round margin-left"
        style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);"
      ></view>
      <view class="change-avatar">
        <text>更换头像</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
    </view>

    <!-- 相关操作 -->
    <view class="operate">
      <view @click="toInfo">
        <text>昵称：</text>
        <text>Jason_liang</text>
        <text class="info">
          <text>个人信息</text>
          <text class="lg text-gray cuIcon-right"></text>
        </text>
      </view>
      <view>
        <text>关注列表</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
      <view>
        <text>默认加圈</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
      <view>
        <text>消息通知</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout">
      <view @click="open">
        <text>退出登录</text>
        <text class="lg text-gray cuIcon-right"></text>
      </view>
    </view>
    <u-modal
      v-model="show"
      :title="title"
      :content="content"
      show-cancel-button
      confirm-color="#fa3534"
      @confirm="confirm"
      ref="uModal"
      :async-close="true"
    ></u-modal>
  </view>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      show: false,
      title: "确认退出?",
      content: "",
    };
  },

  computed: {
    ...mapGetters("user", ["email"]),
  },

  methods: {
    toInfo() {
      uni.navigateTo({
        url: "/pages/components/info/info",
      });
    },

    open() {
      this.show = true;
    },

    confirm() {
      this.$store
        .dispatch("user/logout", this.email)
        .then(() => {
          this.show = false;
          uni.reLaunch({
            url: "/pages/login/login",
          });
        })
        .catch(() => {
          this.$refs.uModal.clearLoading();
        });
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

  .operate,
  .logout {
    width: 100%;
    margin-top: 20rpx;
    background-color: #fff;

    & > view {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 30rpx;
      border-bottom: 1px solid #f1f1f1;

      & > text {
        &:first-child {
          font-weight: bold;
          margin-right: 10rpx;
        }

        &:last-child {
          float: right;
        }
      }

      .info {
        text {
          &:first-child {
            margin-right: 5rpx;
            color: #888;
          }
        }
      }
    }
  }

  .logout {
    margin-top: 20rpx;
  }
}
</style>
