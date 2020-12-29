<template>
  <view>
    <view class="empty" v-if="Object.keys(urgent).length === 0">
      <u-empty text="还没有发布寻人寻物启事">
        <view slot="bottom">
          <u-button
            slot="bottom"
            size="mini"
            @click="toFindEdit"
            v-if="isOwner"
          >
            去发布
          </u-button>
        </view>
      </u-empty>
    </view>

    <view v-else>
      <view class="cu-bar solid-bottom" v-if="isOperate">
        <view class="flex justify-end padding-right" style="width: 100%">
          <button class="cu-btn round bg-blue" @click="toFindEdit">更改</button>
        </view>
      </view>

      <view
        class="padding-lr-xl padding-bottom-xl text-left"
        :class="[isOperate ? 'padding-top-sm' : 'padding-top-xl']"
      >
        <view v-if="urgent.name" class="margin-bottom-xs">
          <text class="text-lg">{{
            urgent.type === 'person' ? '姓名：' : '名称：'
          }}</text>
          <text>{{ urgent.name }}</text>
        </view>
        <view v-if="urgent.size" class="margin-tb-xs">
          <text class="text-lg">{{
            urgent.type === 'person' ? '年龄：' : '尺寸：'
          }}</text>
          <text>{{ urgent.size }}</text>
        </view>
        <view v-if="urgent.form" class="margin-tb-xs">
          <text class="text-lg">{{
            urgent.type === 'person' ? '穿着打扮：' : '物品形状：'
          }}</text>
          <text>{{ urgent.form }}</text>
        </view>
        <view v-if="urgent.properties" class="margin-tb-xs">
          <text class="text-lg">{{
            urgent.type === 'person' ? '性格特征：' : '物品特征：'
          }}</text>
          <text>{{ urgent.properties }}</text>
        </view>
        <view v-if="urgent.supply" class="margin-tb-xs">
          <text class="text-lg">补充说明：</text>
          <text>{{ urgent.supply }}</text>
        </view>
        <view v-if="urgent.createTime" class="margin-tb-xs">
          <text class="text-lg">{{
            urgent.type === 'person' ? '走失时间：' : '丢失时间：'
          }}</text>
          <text>{{ urgent.createTime }}</text>
        </view>

        <view v-if="urgent.picture" class="margin-top-lg">
          <u-image
            mode="aspectFill"
            height="600"
            :src="urgent.picture"
            @click="previewImage"
          ></u-image>
        </view>

        <view class="text-center margin-top-xl" v-if="urgent.handle">
          <view class="text-xsl">
            <text class="cuIcon-roundcheckfill text-green"></text>
          </view>
          <text>已找到</text>
        </view>

        <view class="margin-top-xl" v-else>
          <u-form
            :model="form"
            ref="uForm"
            label-width="150"
            :border-bottom="false"
          >
            <u-form-item label="是否找到" :border-bottom="false">
              <u-radio-group v-model="form.isFind">
                <u-radio
                  v-for="(item, index) in findOptions"
                  :key="index"
                  :name="item.name"
                  >{{ item.name }}
                </u-radio>
              </u-radio-group>
            </u-form-item>

            <text class="text-gray"
              >设置为已找到后，将不能更改。并且寻人寻物启事不会在聊天界面中显示。</text
            >

            <view style="margin-top: 100rpx" class="flex justify-center">
              <u-button
                type="primary"
                style="width: 300rpx"
                :disabled="form.isFind === '未找到'"
                @click="save"
                >保存</u-button
              >
            </view>
          </u-form>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        isFind: '未找到'
      },
      findOptions: [
        {
          name: '未找到'
        },
        {
          name: '已找到'
        }
      ],
      circleId: 0,
      ownerId: 0
    }
  },

  computed: {
    ...mapGetters('circle', ['urgent']),
    ...mapGetters('user', ['userId']),
    isOwner() {
      if (this.ownerId == this.userId) return true
      return false
    },
    isOperate() {
      if (this.ownerId == this.userId && !this.urgent.handle) return true
      return false
    }
  },

  onLoad({ circleId, ownerId }) {
    this.circleId = circleId
    this.ownerId = ownerId
  },

  methods: {
    previewImage() {
      uni.previewImage({
        current: this.urgent.picture,
        urls: [this.urgent.picture]
      })
    },

    save() {
      uni.showLoading({
        title: '正在修改...'
      })
      this.$store
        .dispatch('circle/setFound', {
          circleId: this.urgent.circleId
        })
        .then(async () => {
          await this.$store.dispatch('circle/getUrgent', this.urgent.circleId)
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '修改成功'
            })
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
        })
    },

    toFindEdit() {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/find-notice/find-notice-edit',
        params: {
          circleId: this.circleId
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
</style>
