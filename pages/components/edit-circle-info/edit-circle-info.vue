<template>
  <view>
    <custom-update-avatar
      title="头像"
      :src="circleInfo.img"
      isCircle
      :circleId="circleInfo.circleId"
    ></custom-update-avatar>

    <view class="margin-top-sm">
      <uni-list>
        <uni-list-item
          v-for="(item, index) in infoList"
          :key="index"
          :title="item.title"
          :rightText="item.rightText"
          :note="item.note"
          noteEllipsis="2"
          showArrow
          clickable
          @click="onClick(item.title)"
        ></uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapGetters('circle', ['circleInfo']),
    infoList() {
      return [
        {
          title: '圈聊名称',
          rightText: this.circleInfo.circleName
        },
        {
          title: '圈简介',
          rightText:
            this.circleInfo.synopsis?.length <= 20
              ? this.circleInfo.synopsis
              : '',
          note:
            this.circleInfo.synopsis?.length > 20
              ? this.circleInfo.synopsis
              : ''
        },
        {
          title: '圈公告',
          rightText:
            this.circleInfo.notice?.length <= 20 ? this.circleInfo.notice : '',
          note:
            this.circleInfo.notice?.length > 20 ? this.circleInfo.notice : ''
        },
        {
          title: '入圈声明',
          rightText:
            this.circleInfo.explain?.length <= 20
              ? this.circleInfo.explain
              : '',
          note:
            this.circleInfo.explain?.length > 20 ? this.circleInfo.explain : ''
        },
        {
          title: '有效时间',
          rightText: this.circleInfo.effective + ' 天'
        }
      ]
    }
  },

  onLoad({ circleId }) {
    this.$store.dispatch('circle/getCircleInfo', circleId)
  },

  methods: {
    onClick(title) {
      this.$u.route(
        '/pages/components/edit-circle-info/components/change-circle-info/change-circle-info',
        {
          title,
          isEdit: true,
          circleId: this.circleInfo.circleId
        }
      )
    }
  }
}
</script>

<style lang="scss">
</style>
