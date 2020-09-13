<template>
  <view>
    <view>
      <u-subsection
        :list="optionList"
        current="0"
        mode="subsection"
        active-color="#ff9900"
        @change="changeItem"
      ></u-subsection>
    </view>

    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.userId"
        thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png"
        thumb-size="lg"
      >
        <template>
          <text>
            {{item.username}}
            <text :class="sexClass(item)" style="margin-left: 20rpx"></text>
          </text>
        </template>

        <template #right>
          <text>取消关注</text>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  mounted() {
    uni.showLoading();
    this.$store
      .dispatch("focus/queryMyFocus", this.type)
      .then(() => {
        uni.hideLoading();
      })
      .catch(() => {
        uni.hideLoading();
      });
  },

  data() {
    return {
      optionList: [
        {
          name: "我的关注",
        },
        {
          name: "关注我的",
        },
      ],
      type: 1,
    };
  },

  computed: {
    ...mapGetters("focus", ["list"]),
  },

  methods: {
    changeItem(index) {
      this.type = index + 1;
      uni.showLoading();
      this.$store
        .dispatch("focus/queryMyFocus", this.type)
        .then(() => {
          uni.hideLoading();
        })
        .catch(() => {
          uni.hideLoading();
        });
    },

    sexClass(user) {
      return {
        "cuIcon-male": user.sex === "男",
        "text-blue": user.sex === "男",
        "cuIcon-female": user.sex === "女",
        "text-pink": user.sex === "女",
        "cuIcon-questionfill": user.sex !== "男" && user.sex !== "女",
        "text-gray": user.sex !== "男" && user.sex !== "女",
      };
    },
  },
};
</script>

<style lang="scss">
</style>
