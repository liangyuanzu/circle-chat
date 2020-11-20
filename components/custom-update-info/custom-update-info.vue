<template>
  <view>
    <uni-nav-bar fixed status-bar left-icon="back" @clickLeft="back">
      <template #left>
        <view>{{ title }}</view>
      </template>
      <!-- #ifndef MP-BAIDU -->
      <template #right>
        <button v-if="isEdit" type="primary" size="mini" @tap="save">
          保存
        </button>
      </template>
      <!-- #endif -->
    </uni-nav-bar>

    <view class="bg-white" v-if="isInput">
      <u-field
        v-model="content"
        maxlength="20"
        :focus="isEdit"
        :disabled="!isEdit"
        :clearable="false"
        label-width="0"
      >
        <template #right>
          <view v-if="isEdit" class="text-sm text-grey">{{ inputNum }}</view>
        </template>
      </u-field>
    </view>

    <view class="bg-white" v-if="isTextarea">
      <u-field
        type="textarea"
        v-model="content"
        maxlength="60"
        :focus="isEdit"
        :disabled="!isEdit"
        :clearable="false"
        label-width="0"
      >
        <template #right>
          <view v-if="isEdit" class="text-sm text-grey">{{ textareaNum }}</view>
        </template>
      </u-field>
    </view>

    <view v-if="isNumberBox">
      <uni-list>
        <uni-list-item title="增加有效期">
          <template #footer>
            <u-number-box
              v-model="effective"
              :min="0"
              :max="14 - oldData"
            ></u-number-box>
          </template>
        </uni-list-item>
      </uni-list>
      <view class="text-sm text-grey padding"
        >当前有效时间为 {{ oldData }} 天，增加后有效时间为
        {{ oldData + effective }} 天</view
      >
    </view>

    <!-- #ifdef MP-BAIDU -->
    <view v-if="isEdit" class="padding-lr-lg" style="margin-top: 200rpx">
      <u-button type="primary" @click="save">保存</u-button>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
/**
 * custom-update-info 自定义更新资料组件
 * @description 本组件是适用于本项目的更新资料组件，一般用于展示更新资料的地方，如个人信息编辑，圈聊资料编辑。
 * @property {String} 	title 							标题
 * @property {String} 	oldData 							原始数据
 * @property {Boolean} isInput = [true|false] 是否为输入框
 * @property {Boolean} isTextarea = [true|false] 是否为多行输入框
 * @property {Boolean} isNumberBox = [true|false] 是否为歩进器
 * @property {Boolean} isEdit = [true|false] 是否可编辑
 *
 * @event {Function} click 头像被点击
 */
export default {
  name: 'custom-update-info',

  data() {
    return {
      content: '',
      effective: 0
    }
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    oldData: {
      type: [String, Number],
      default: ''
    },
    isInput: {
      type: Boolean,
      default: false
    },
    isTextarea: {
      type: Boolean,
      default: false
    },
    isNumberBox: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    disabled() {
      if (this.content || this.effective) return false
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

  watch: {
    oldData: function (val) {
      this.content = val
    }
  },

  mounted() {
    if (this.isNumberBox) this.content = ''
  },

  methods: {
    back() {
      this.$u.route({ type: 'back' })
    },

    save() {
      if (!this.isNumberBox) this.$emit('top', this.content)
      else this.$emit('top', this.effective)
    }
  }
}
</script>

<style lang="scss">
</style>
