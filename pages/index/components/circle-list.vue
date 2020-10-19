<template>
  <view>
    <uni-list :border="false">
      <uni-list-item
        v-for="item in circleList"
        :key="item.circleId"
        :title="item.name"
        ellipsis="1"
        :thumb="item.img"
        thumbSize="lg"
        :note="item.synopsis"
        clickable
        @click="toDetail(item)"
      >
        <template slot="right">
          <view class="custom-right">
            <text>人数：100人</text>
            <text>范围：{{ item.radius + '米' }}</text>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted() {
    // uni.showLoading()
    // this.$store
    //   .dispatch('circle/nearlyCircle')
    //   .then(() => {
    //     uni.hideLoading()
    //   })
    //   .catch(() => {
    //     uni.hideLoading()
    //   })

    this.circleList = [
      {
        circleId: 100001,
        name: '交友呀111111111111111111111111111111111111111111111111111111111',
        synopsis:
          '圈简介2222222222222222222222222222222222222222222222222222222222222222222222222244444444444444444444444444444444444444444',
        geographicalPosition: '114.940278,25.85097',
        radius: 10000,
        img:
          'http://39.99.156.255:8080/CircleChat/img/672c1250-cc59-4df3-a960-aa78126e689e.jpeg',
        type: '交友圈',
        userId: 9,
        createTime: '2020-08-18T06:07:22.000+0000',
        explain: null,
        effective: 5,
        notice: '文明交友',
        updateTime: '2020-10-17T08:00:37.000+0000',
        valid: true
      }
    ]
  },

  data() {
    return {
      circleList: [],
      type: 0,
      clrcleTypeMap: [
        { type: 0, value: '交友圈' },
        { type: 1, value: '固定圈' },
        { type: 2, value: '紧急圈' },
        { type: 3, value: '我的圈' }
      ]
    }
  },

  computed: {
    // ...mapState('circle', ['circleList'])
  },

  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: '/pages/components/detail/detail?info=' + JSON.stringify(item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-right {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #999;
}
</style>
