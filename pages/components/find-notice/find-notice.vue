<template>
  <view class="wrap">
    <u-form :model="form" ref="uForm">
      <u-form-item label="类型" required>
        <u-radio-group v-model="form.type">
          <u-radio
            v-for="(item, index) in typeOptions"
            :key="index"
            :name="item.name"
            >{{ item.value }}
          </u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item
        :label="form.type === 'person' ? '姓名' : '名称'"
        prop="name"
        required
      >
        <u-input
          v-model="form.name"
          maxlength="20"
          :placeholder="
            form.type === 'person' ? '请输入走失人的姓名' : '请输入丢失物的名称'
          "
        />
      </u-form-item>

      <u-form-item :label="form.type === 'person' ? '年龄' : '尺寸'">
        <u-input
          v-model="form.size"
          maxlength="20"
          :placeholder="
            form.type === 'person' ? '请输入走失人的年龄' : '请输入丢失物的尺寸'
          "
        />
      </u-form-item>

      <u-form-item
        :label="form.type === 'person' ? '穿着打扮' : '物品形状'"
        label-width="150"
      >
        <u-input
          v-model="form.form"
          maxlength="20"
          :placeholder="
            form.type === 'person'
              ? '请输入走失人的穿着打扮'
              : '请输入丢失物的形状'
          "
        />
      </u-form-item>

      <u-form-item
        :label="form.type === 'person' ? '性格特征' : '物品特征'"
        label-width="150"
      >
        <u-input
          v-model="form.properties"
          maxlength="20"
          :placeholder="
            form.type === 'person'
              ? '请输入走失人的性格特征'
              : '请输入丢失物的特征'
          "
        />
      </u-form-item>

      <u-form-item label="补充说明" label-width="150">
        <u-input
          v-model="form.supply"
          type="textarea"
          :auto-height="false"
          maxlength="60"
          :customStyle="{
            height: '180rpx'
          }"
          placeholder="请输入补充说明"
        />
      </u-form-item>

      <u-form-item
        :label="form.type === 'person' ? '走失时间' : '丢失时间'"
        label-width="150"
      >
        <u-input
          type="select"
          placeholder="请选择时间"
          :select-open="pickerShow"
          v-model="form.createTime"
          @click="pickerShow = true"
        ></u-input>
      </u-form-item>

      <u-form-item label="上传图片" label-width="150">
        <u-upload
          width="160"
          height="160"
          max-count="1"
          :size-type="['compressed']"
          :action="uploadUrgentImgUrl"
          :form-data="{ name: 'file', circleId }"
          :header="{ sessionid }"
          ref="uUpload"
        ></u-upload>
      </u-form-item>

      <view style="margin-top: 100rpx">
        <u-button @click="find">立即发布</u-button>
      </view>
    </u-form>

    <u-picker
      mode="time"
      v-model="pickerShow"
      :params="params"
      :endYear="new Date().getFullYear()"
      @confirm="timeConfirm"
    ></u-picker>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadUrgentImgUrl } from '@/config/config.js'
import localStore from '@/helpers/localStore.js'
import { filter } from '../../../uview-ui/components/u-parse/libs/config'
import time from '@/helpers/time.js'

export default {
  data() {
    return {
      circleId: 0,
      form: {
        type: 'person',
        name: '',
        size: '',
        form: '',
        properties: '',
        supply: '',
        picture: '',
        createTime: time.format('yyyy-MM-dd HH:mm:ss')
      },
      uploadUrgentImgUrl,
      sessionid: localStore.get('sessionId'),
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名或名称',
            trigger: ['change', 'blur']
          }
        ]
      },
      typeOptions: [
        {
          value: '人',
          name: 'person'
        },
        {
          value: '物',
          name: 'item'
        }
      ],
      pickerShow: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true
      }
    }
  },

  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },

  onLoad({ circleId }) {
    this.circleId = circleId
  },

  methods: {
    timeConfirm(e) {
      this.form.createTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
    },

    find() {
      const files = this.$refs.uUpload.lists.filter(
        (val) => val.progress == 100
      )
      if (files.length > 0) {
        let src = files[0].response.data
        if (typeof src === 'object' && Object.keys(src).length === 0) {
          uni.showToast({
            title: '图片上传失败，请重新上传',
            icon: 'none'
          })
          return
        } else {
          this.form.picture = src
        }
      } else {
        this.form.picture = ''
      }

      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading({
            title: '正在发布...'
          })
          this.$store
            .dispatch('circle/urgentMsg', {
              circleId: this.circleId,
              type: this.form.type,
              name: this.form.name,
              size: this.form.size,
              form: this.form.form,
              properties: this.form.properties,
              supply: this.form.supply,
              picture: this.form.picture,
              createTime: this.form.createTime
            })
            .then(() => {
              uni.hideLoading()
              setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: '发布成功'
                })
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              }, 500)
            })
            .catch(() => {
              uni.hideLoading()
            })
        }
      })
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
