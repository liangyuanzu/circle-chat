<template>
  <view class="wrap">
    <u-form :model="form" ref="uForm" label-width="120">
      <u-form-item
        :leftIconStyle="{ color: '#888', fontSize: '32rpx' }"
        left-icon="account"
        label-width="150"
        label="圈名称"
        prop="name"
      >
        <u-input
          v-model="form.name"
          maxlength="20"
          placeholder="请输入圈名称"
        />
      </u-form-item>

      <u-form-item label="圈类型">
        <u-radio-group v-model="form.circleType">
          <u-radio
            v-for="(item, index) in circleType"
            :key="index"
            :name="item.name"
            >{{ item.name }}
          </u-radio>
        </u-radio-group>
      </u-form-item>

      <!--
      <u-form-item label="圈范围">
        <u-radio-group v-model="form.circleRange">
          <u-radio
            v-for="(item, index) in circleRange"
            :key="index"
            :name="item.value"
            >{{ item.name }}
          </u-radio>
        </u-radio-group>
      </u-form-item>
			 -->

      <u-form-item label="圈范围" prop="circleRange" v-if="!form.radius">
        <u-input
          type="number"
          :maxlength="5"
          :clearable="false"
          v-model="form.circleRange"
          placeholder="请输入圈范围"
        />
      </u-form-item>

      <u-form-item
        v-show="form.circleType !== '固定圈'"
        label="有效期"
        :leftIconStyle="{ color: '#888', fontSize: '32rpx' }"
        left-icon="clock"
        label-width="150"
      >
        <u-number-box
          v-model="form.effective"
          :min="1"
          :max="7"
          @change="valChange"
        ></u-number-box>
        <text>（天）</text>
      </u-form-item>

      <view style="margin-top: 100rpx">
        <u-button @click="creatCircle">立即创建</u-button>
      </view>
    </u-form>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        position: '',
        radius: '',
        circleType: '交友圈',
        circleRange: '',
        effective: 7
      },

      rules: {
        name: [
          {
            required: true,
            message: '请输入圈名称',
            trigger: ['change', 'blur']
          }
        ],
        circleRange: [
          {
            required: true,
            type: 'number',
            message: '圈范围半径最大为 10000m',
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              if (value >= 0 && value <= 10000) return true
              return false
            },
            message: '圈范围半径最大为 10000m',
            trigger: ['change', 'blur']
          }
        ]
      },

      circleType: [
        {
          name: '交友圈'
        },
        {
          name: '固定圈'
        },
        {
          name: '紧急圈'
        }
      ],

      circleRange: [
        {
          name: '100m',
          value: '100'
        },
        {
          name: '500m',
          value: '500'
        },
        {
          name: '1000m',
          value: '1000'
        },
        {
          name: '1500m',
          value: '1500'
        },
        {
          name: '2000m',
          value: '2000'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('user', ['position'])
  },

  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },

  onLoad(options) {
    this.form = { ...this.form, ...options }
    this.$store.dispatch('user/getPosition')
  },

  methods: {
    creatCircle() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading({
            title: '创建中...'
          })
          this.$store
            .dispatch('circle/creatCircle', {
              name: this.form.name,
              position: this.position,
              radius: this.form.radius
                ? this.form.radius
                : this.form.circleRange,
              type: this.form.circleType,
              effective: this.form.effective
            })
            .then(() => {
              uni.hideLoading()
              setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: '创建圈成功'
                })
                setTimeout(() => {
                  uni.navigateTo({
                    url: '/pages/msg/msg'
                  })
                }, 500)
              }, 500)
              this.$store.dispatch('chat/getOldChatList', 0)
            })
            .catch(() => {
              uni.hideLoading()
            })
        }
      })
    },

    valChange(e) {
      this.form.effective = e.value
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.wrap {
  padding: 30rpx;
}
</style>
