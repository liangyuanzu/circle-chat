<template>
  <view>
    <custom-avatar
      :src="circleInfo.img"
      :title="circleInfo.circleName"
      :note="circleInfo.circleId"
    >
    </custom-avatar>

    <view class="text-df text-grey padding bg-white margin-top-sm">
      <view>本圈创建于 {{ createTime }}</view>
      <view v-if="circleInfo.synopsis">{{ circleInfo.synopsis }}</view>
    </view>

    <view
      class="text-df text-grey padding bg-white margin-top-sm"
      v-if="circleInfo.explain"
    >
      <view>入圈说明</view>
      <view>{{ circleInfo.explain }}</view>
    </view>

    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item title="圈类型">
          <template #footer>
            <u-tag
              :text="circleInfo.type"
              size="mini"
              :type="$formatType(circleInfo.type)"
            />
          </template>
        </uni-list-item>
        <uni-list-item title="圈人数">
          <template #footer>
            <view class="cu-capsule radius flex">
              <view class="cu-tag bg-blue sm">
                <text class="cuIcon-group"></text>
              </view>
              <view class="cu-tag line-blue sm">
                {{ circleInfo.member }}
              </view>
            </view>
          </template>
        </uni-list-item>
        <uni-list-item title="圈范围">
          <template #footer>
            <view class="cu-capsule radius">
              <view class="cu-tag bg-black sm">
                <text class="cuIcon-radiobox"></text>
              </view>
              <view class="cu-tag line-black sm">
                {{ $formatRadius(circleInfo.radius) }}</view
              >
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item title="圈主" showArrow clickable @click="toOwner">
          <template #footer>
            <u-avatar
              :src="circleInfo.userImg"
              mode="square"
              size="mini"
            ></u-avatar>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
/**
 * custom-circle-detail 自定义圈列表组件
 * @description 本组件是适用于本项目的圈详情组件，一般用于展示圈详情的地方。
 * @property {Object} 	circleInfo 	圈数据
 */
export default {
  name: 'custom-circle-detail',

  props: {
    circleInfo: {
      type: Object,
      default: {}
    }
  },

  computed: {
    createTime() {
      return /(\d{4})\-(\d{2})\-(\d{2})/
        .exec(this.circleInfo.createTime)[0]
        .replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$1年$2月$3日')
    }
  },

  methods: {
    toOwner() {
      this.$u.route('/pages/components/person-info/person-info', {
        id: this.circleInfo.userId
      })
    }
  }
}
</script>

<style lang="scss">
</style>
