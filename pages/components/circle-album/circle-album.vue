<template>
  <view class="wrap">
    <view class="empty" v-if="!isOwner && circleAlbum.length === 0">
      <u-empty text="圈主还没创建圈相册"> </u-empty>
    </view>

    <view class="grid col-2" v-else>
      <view
        class="padding-xs margin-bottom-sm"
        @click="toCreateAlbum"
        v-if="isOwner"
      >
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
          ><u-loading slot="loading"></u-loading
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
      :del="isOwner"
      @delImg="delAlbum"
    ></custom-previewImage>

    <u-modal
      v-model="showModal"
      :show-title="false"
      content="是否确认删除该相册"
      show-cancel-button
      confirm-color="#fa3534"
      @confirm="confirm"
      ref="uModal"
    ></u-modal>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tId: 0,
      showModal: false
    }
  },

  computed: {
    ...mapState('circle', ['circleAlbum', 'circleInfo']),
    ...mapState('user', ['userId']),
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
    },
    isOwner() {
      if (this.circleInfo.userId === this.userId) return true
      return false
    }
  },

  onLoad() {
    this.$store.dispatch('circle/getAlbum', this.circleInfo.circleId)
  },

  methods: {
    toCreateAlbum() {
      this.$u.route('/pages/components/circle-album/create-album')
    },

    previewAlbum(url) {
      this.$refs.previewImage.open(url)
    },

    delAlbum({ tId }) {
      this.tId = tId
      this.showModal = true
    },

    confirm() {
      this.showModal = false
      uni.showLoading({
        title: '正在删除...'
      })
      this.$store
        .dispatch('circle/delAlbum', {
          circleId: this.circleInfo.circleId,
          tId: this.tId
        })
        .then(() => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.$u.route({
                type: 'redirect',
                url: '/pages/components/circle-album/circle-album'
              })
            }, 500)
          }, 500)
        })
        .catch(() => {
          uni.hideLoading()
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
  padding: 20rpx;

  .add-alubum {
    width: 100%;
    height: 300rpx;
    border-radius: 20rpx;
  }
}
</style>
