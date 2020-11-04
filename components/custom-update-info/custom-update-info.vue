<template>
  <view>
    <uni-nav-bar fixed status-bar left-icon="back" @clickLeft="back">
      <template #left>
        <view>{{ title }}</view>
      </template>
      <template #right>
        <button type="primary" size="mini" :disabled="disabled" @tap="save">
          保存
        </button>
      </template>
    </uni-nav-bar>

    <u-field
      v-if="isInput"
      v-model="content"
      maxlength="20"
      focus
      :clearable="false"
      label-width="0"
      class="bg-white"
    >
      <template #right>
        <view class="text-sm text-grey">{{ inputNum }}</view>
      </template>
    </u-field>

    <u-field
      v-if="isTextarea"
      type="textarea"
      v-model="content"
      maxlength="60"
      focus
      :clearable="false"
      label-width="0"
      class="bg-white"
    >
      <template #right>
        <view class="text-sm text-grey">{{ textareaNum }}</view>
      </template>
    </u-field>
  </view>
</template>

<script>
/**
 * custom-update-info 自定义更新资料组件
 * @description 本组件是适用于本项目的更新资料组件，一般用于展示更新资料的地方，如个人信息编辑，圈聊资料编辑。
 * @property {String} 	title 							标题
 * @property {String} 	data 							原始数据
 * @property {Boolean} isInput = [true|false] 是否为输入框
 * @property {Boolean} isTextarea = [true|false] 是否为多行输入框
 *
 * @event {Function} click 头像被点击
 */
export default {
  data() {
    return {
      content: this.data
    }
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    },
    isInput: {
      type: Boolean,
      default: false
    },
    isTextarea: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    disabled() {
      if (this.content) return false
      return true
    },
    inputNum() {
      if (!this.content) {
        return 20
      } else {
        return 20 - this.content.length
      }
    },
    textareaNum() {
      if (!this.content) {
        return 60
      } else {
        return 60 - this.content.length
      }
    }
  },

  methods: {
    back() {
      this.$u.route({ type: 'back' })
    },

    save() {
      this.$emit('top', this.content)
    }
  }
}
</script>

<style lang="scss">
</style>
