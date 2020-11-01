<template>
  <view
    class="avatar"
    :style="[wrapStyle]"
    :hover-class="clickable ? 'uni-list-item--hover' : ''"
    @click="click"
  >
    <view class="avatar-left">
      <u-avatar
        :bg-color="avatarBgColor"
        :src="src"
        :size="size"
        :mode="mode"
        :text="text"
        :img-mode="imgMode"
        :sex-icon="sexIcon"
        :show-sex="showSex"
        :showLevel="showLevel"
        style="margin-left: 30rpx"
      >
      </u-avatar>
      <view class="info">
        <slot name="content">
          <view
            v-if="title"
            class="text-lg text-black text-cut"
            style="width: 470rpx"
          >
            {{ title }}
          </view>
          <slot name="bottom">
            <view
              v-if="note"
              class="text-sm text-grey text-cut"
              style="width: 470rpx"
            >
              {{ note }}
            </view>
          </slot>
        </slot>
      </view>
    </view>

    <uni-icons
      v-if="showArrow"
      :size="16"
      class="uni-icon-wrapper"
      color="#bbb"
      type="arrowright"
    />
  </view>
</template>

<script>
/**
 * custom-avatar 自定义头像组件
 * @description 本组件是适用于本项目的头像组件，一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。
 * @property {String} bg-color 背景颜色（默认#ffffff）
 * @property {String} avatar-bg-color 头像背景颜色，一般显示文字时用（默认#ffffff）
 * @property {String} src 头像路径，如加载失败，将会显示默认头像
 * @property {String Number} size 头像尺寸，可以为指定字符串(large, default, mini)，或者数值，单位rpx（默认default）
 * @property {String} mode 显示类型，见上方说明（默认circle）
 * @property {String} text 用文字替代图片，级别优先于src
 * @property {String} img-mode 头像图片的裁剪类型，与uni的image组件的mode参数一致，如效果达不到需求，可尝试传widthFix值（默认aspectFill）
 * @property {String} sex-icon 性别图标，man-男，woman-女（默认man）
 * @property {String} level-icon 等级图标（默认level）
 * @property {String} sex-bg-color 性别图标背景颜色
 * @property {String} level-bg-color 等级图标背景颜色
 * @property {String} show-sex 是否显示性别图标（默认false）
 * @property {String} show-level 是否显示等级图标（默认false）
 * @property {Boolean} 	clickable = [true|false] 		是否开启点击反馈
 * @property {Boolean} 	showArrow = [true|false] 		是否显示箭头图标
 * @property {String} 	title 							标题
 * @property {String} 	note 							描述
 *
 * @event {Function} click 头像被点击
 */
export default {
  name: 'custom-avatar',

  props: {
    // 背景颜色
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    // 背景颜色
    avatarBgColor: {
      type: String,
      default: 'transparent'
    },
    // 头像路径
    src: {
      type: String,
      default: ''
    },
    // 尺寸，large-大，default-中等，mini-小，如果为数值，则单位为rpx
    // 宽度等于高度
    size: {
      type: [String, Number],
      default: 'default'
    },
    // 头像模型，square-带圆角方形，circle-圆形
    mode: {
      type: String,
      default: 'circle'
    },
    // 文字内容
    text: {
      type: String,
      default: ''
    },
    // 图片的裁剪模型
    imgMode: {
      type: String,
      default: 'aspectFill'
    },
    // 右上角性别角标，man-男，woman-女
    sexIcon: {
      type: String,
      default: 'man'
    },
    // 右下角的等级图标
    levelIcon: {
      type: String,
      default: 'level'
    },
    // 右下角等级图标背景颜色
    levelBgColor: {
      type: String,
      default: ''
    },
    // 右上角性别图标的背景颜色
    sexBgColor: {
      type: String,
      default: ''
    },
    // 是否显示性别图标
    showSex: {
      type: Boolean,
      default: false
    },
    // 是否显示等级图标
    showLevel: {
      type: Boolean,
      default: false
    },
    // 是否开启点击反馈
    clickable: {
      type: Boolean,
      default: false
    },
    // 是否显示箭头图标
    showArrow: {
      type: [Boolean, String],
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 描述
    note: {
      type: [String, Number],
      default: ''
    }
  },

  computed: {
    wrapStyle() {
      let style = {}
      style.backgroundColor = this.bgColor
      return style
    }
  },

  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.avatar {
  width: 100%;
  height: 150rpx;
  padding-right: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .avatar-left {
    display: flex;
    align-items: center;

    .info {
      margin: 0 20rpx 0 40rpx;
    }
  }
}

.uni-list-item--hover {
  background-color: $uni-bg-color-hover !important;
}
</style>
