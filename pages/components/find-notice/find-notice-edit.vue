<template>
  <view class="wrap">
    <u-form :model="form" ref="uForm">
      <u-form-item label="类型" required>
        <u-radio-group v-model="form.type" :disabled="disabled">
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
          :disabled="disabled"
          @click="disabled ? (pickerShow = false) : (pickerShow = true)"
        ></u-input>
      </u-form-item>

      <u-form-item label="上传图片" label-width="150">
        <u-upload
          width="160"
          height="160"
          max-count="1"
          :size-type="['compressed']"
          :action="uploadUrgentImgUrl"
          :form-data="formData"
          :header="header"
          :file-list="fileList"
          :show-progress="false"
          ref="uUpload"
        ></u-upload>
      </u-form-item>

      <view style="margin-top: 100rpx">
        <u-button @click="btnClick">{{
          hasUrgent ? '立即更改' : '立即发布'
        }}</u-button>
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
      header: {
        sessionid: localStore.get('sessionId')
      },
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
      },
      disabled: false,
      fileList: []
    }
  },

  computed: {
    ...mapGetters('circle', ['urgent', 'circleInfo']),
    formData() {
      return {
        name: 'file',
        circleId: this.circleInfo.circleId
      }
    },
    hasUrgent() {
      return Object.keys(this.urgent).length > 0 && !this.urgent.handle
    }
  },

  onReady() {
    this.$refs.uForm.setRules(this.rules)
    this.$nextTick(() => {
      if (this.hasUrgent) {
        for (let key in this.urgent) {
          if (this.urgent[key] && key !== 'circleId' && key !== 'picture') {
            this.form[key] = this.urgent[key]
          }
        }
        if (this.urgent.picture) {
          this.form.picture = this.urgent.picture
          let obj = {
            url: this.urgent.picture
          }
          this.fileList.push(obj)
        }
        this.disabled = true
        this.btnText = '立即更改'
      }
    })
  },

  methods: {
    timeConfirm(e) {
      this.form.createTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
    },

    btnClick() {
      const files = this.$refs.uUpload.lists.filter(
        (val) => val.progress == 100
      )
      if (files.length > 0) {
        let src = files[0].response?.data || files[0]?.url
        if (typeof src === 'object' && Object.keys(src).length === 0) {
          uni.showToast({
            title: '图片上传失败，请重新上传',
            icon: 'none'
          })
          return
        }
        this.form.picture = src
      } else {
        this.form.picture = ''
      }

      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading({
            title: this.hasUrgent ? '正在更改...' : '正在发布...'
          })
          if (this.hasUrgent) {
            this.$store
              .dispatch('circle/updateUrgent', {
                circleId: this.circleInfo.circleId,
                name: this.form.name,
                size: this.form.size,
                form: this.form.form,
                properties: this.form.properties,
                supply: this.form.supply,
                picture: this.form.picture
              })
              .then(async () => {
                await this.$store.dispatch(
                  'circle/getUrgent',
                  this.circleInfo.circleId
                )
                uni.hideLoading()
                setTimeout(() => {
                  uni.showToast({
                    icon: 'none',
                    title: '更改成功'
                  })
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 500)
                }, 500)
              })
              .catch(() => {
                uni.hideLoading()
                setTimeout(() => {
                  uni.showToast({
                    icon: 'none',
                    title: '更改失败'
                  })
                }, 500)
              })
          } else {
            this.$store
              .dispatch('circle/urgentMsg', {
                circleId: this.circleInfo.circleId,
                type: this.form.type,
                name: this.form.name,
                size: this.form.size,
                form: this.form.form,
                properties: this.form.properties,
                supply: this.form.supply,
                picture: this.form.picture,
                createTime: this.form.createTime
              })
              .then(async () => {
                await this.$store.dispatch(
                  'circle/getUrgent',
                  this.circleInfo.circleId
                )
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
                setTimeout(() => {
                  uni.showToast({
                    icon: 'none',
                    title: '发布失败'
                  })
                }, 500)
              })
          }
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
