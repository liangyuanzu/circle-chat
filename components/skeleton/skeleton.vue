<template>
  <view>
    <view class="skeleton" :class="{ animate: animate }">
      <view
        v-if="showAvatar"
        class="skeleton-avatar"
        :class="[avatarShape]"
        :style="{ width: avatarSize, height: avatarSize }"
      ></view>
      <view class="skeleton-content">
        <view
          v-if="showTitle"
          class="skeleton-title"
          :style="{ width: titleWidth }"
        ></view>
        <view class="skeleton-rows">
          <view
            class="skeleton-row-item"
            v-for="(item, index) in rowList"
            :key="index"
            :style="{ width: item.width }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const DEFAULT_ROW_WIDTH = '100%'
const DEFAULT_LAST_ROW_WIDTH = '60%'

export default {
  props: {
    showAvatar: {
      type: Boolean,
      default: true
    },
    avatarSize: {
      type: String,
      default: '100rpx'
    },
    avatarShape: {
      type: String,
      default: 'round' // square | round
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    titleWidth: {
      type: String,
      default: '40%'
    },
    row: {
      type: Number,
      default: 3
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    rowList() {
      let list = []
      for (let i = 0; i < this.row; i++) {
        list.push({
          width:
            i === this.row - 1 && i !== 0
              ? DEFAULT_LAST_ROW_WIDTH
              : DEFAULT_ROW_WIDTH
        })
      }
      return list
    }
  }
}
</script>

<style scoped>
.skeleton {
  display: flex;
  align-items: center;
  padding: 32rpx;
  --bg-color: #f2f3f5;
  --row-height: 32rpx;
  --row-margin-top: 32rpx;
}
.skeleton-avatar {
  flex-shrink: 0;
  background: var(--bg-color);
  margin-right: 16rpx;
}
.skeleton-avatar.round {
  border-radius: 50%;
}

.skeleton-content {
  width: 100%;
}

.skeleton-title {
  background-color: var(--bg-color);
  height: var(--row-height);
}

.skeleton-title + .skeleton-rows {
  margin-top: var(--row-margin-top);
}

.skeleton-rows {
}

.skeleton-row-item {
  background-color: var(--bg-color);
  height: var(--row-height);
}
.skeleton-row-item:not(:first-child) {
  margin-top: var(--row-margin-top);
}

.skeleton.animate {
  animation: skeleton-blink 1.2s ease-in-out infinite;
}

@keyframes skeleton-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
