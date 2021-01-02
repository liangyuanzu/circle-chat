<template>
  <view class="wrap">
    <view class="grid col-2">
      <view class="padding-xs margin-bottom-sm" @click="toCreateAlbum">
        <view class="margin-bottom">
          <view
            class="add-alubum flex align-center justify-center"
            style="background-color: #f3f4f6"
          >
            <view class="text-center text-blue">
              <view class="text-xsl">
                <view class="cuIcon-add"></view>
              </view>
              <view class="text-lg">新建相册</view>
            </view>
          </view>
        </view>
        <view class="text-lg text-black text-cut"></view>
      </view>
      <view
        class="padding-xs margin-bottom-sm"
        v-for="item in circleAlbum"
        :key="item.tId"
        @tap="previewAlbum(item.picture)"
      >
        <view class="margin-bottom">
          <u-image
            width="100%"
            height="300rpx"
            border-radius="20"
            :src="item.picture"
          ></u-image>
        </view>
        <view class="text-lg text-black text-cut">{{ item.name }}</view>
      </view>
    </view>

    <custom-previewImage
      ref="previewImage"
      :imgs="urls"
      :titles="titles"
      :descs="descs"
      :tIds="tIds"
      :opacity="1"
      :del="true"
      @delImg="delAlbum"
    ></custom-previewImage>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      circleId: 0,
      ownerId: 0
    }
  },

  computed: {
    ...mapState('circle', ['circleAlbum']),
    urls() {
      return this.circleAlbum.map((i) => i.picture)
    },
    titles() {
      return this.circleAlbum.map((i) => i.name)
    },
    descs() {
      return this.circleAlbum.map((i) => i.introduction)
    },
    tIds() {
      return this.circleAlbum.map((i) => i.tId)
    }
  },

  onLoad({ circleId, ownerId }) {
    this.circleId = circleId
    this.ownerId = ownerId
    this.$store.dispatch('circle/getAlbum', circleId)
  },

  methods: {
    toCreateAlbum() {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/circle-album/create-album',
        params: {
          circleId: this.circleId
        }
      })
    },

    previewAlbum(url) {
      this.$refs.previewImage.open(url)
    },

    delAlbum({ tId }) {
      console.log('删除', tId)
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.wrap {
  padding: 20rpx;

  .add-alubum {
    width: 100%;
    height: 300rpx;
    border-radius: 20rpx;
  }
}
</style>
