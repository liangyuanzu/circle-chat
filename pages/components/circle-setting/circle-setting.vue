<template>
  <view>
    <custom-avatar
      :src="circleInfo.img"
      :title="circleInfo.circleName"
      showArrow
      clickable
      @click="toCircleDetail"
    >
      <template #bottom>
        <view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ circleInfo.circleId }}
          </view>
          <view class="text-sm text-grey text-cut" style="width: 470rpx">
            {{ circleInfo.synopsis }}
          </view>
        </view>
      </template>
    </custom-avatar>

    <uni-list class="margin-top-sm">
      <uni-list-item direction="column" clickable @click="toCircleMember">
        <template #header>
          <view class="flex justify-between">
            <view class="text-lg text-black">圈聊成员</view>
            <view class="text-sm text-grey">
              <text class="margin-right-xs">共{{ circleInfo.member }}人</text>
              <text class="cuIcon-right"> </text>
            </view>
          </view>
        </template>
        <template #body>
          <view class="grid col-5 margin-top-lg" style="text-align: center">
            <view
              v-for="item in bannerMember"
              :key="item.userId"
              @click.stop="toPersonInfo(item.userId)"
            >
              <u-avatar :src="item.img" mode="square"></u-avatar>
              <view class="text-sm">{{ item.username }}</view>
            </view>

            <view v-if="isOwner" @click.stop="toInviteMember">
              <view
                class="text-grey cuIcon-roundaddfill"
                style="font-size: 90rpx"
              >
              </view>
              <view class="text-sm text-grey">邀请</view>
            </view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-list class="margin-top-sm">
      <uni-list-item
        v-for="(item, index) in infoList"
        :key="index"
        :title="item.title"
        :rightText="item.rightText"
        :note="item.note"
        noteEllipsis="2"
        :border="false"
        showArrow
        clickable
        @click="onClick(item.title)"
      >
      </uni-list-item>
    </uni-list>

    <uni-list v-if="isOwner">
      <uni-list-item
        title="管理圈"
        rightText="编辑圈聊资料"
        :border="false"
        showArrow
        clickable
        @click="toManageCircle"
      >
      </uni-list-item>
    </uni-list>

    <uni-list class="margin-top-sm">
      <uni-list-item title="圈类型" :border="false">
        <template #footer>
          <u-tag :text="circleInfo.type" size="mini" :type="formatType" />
        </template>
      </uni-list-item>
      <uni-list-item title="圈范围" :border="false">
        <template #footer>
          <view class="cu-capsule radius">
            <view class="cu-tag bg-black sm">
              <text class="cuIcon-radiobox"></text>
            </view>
            <view class="cu-tag line-black sm"> {{ circleInfo.radius }}</view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-list class="margin-top-sm">
      <uni-list-item title="置顶">
        <template #footer>
          <u-switch
            size="40"
            v-model="setTop"
            :loading="setTopLoading"
          ></u-switch>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-list>
      <uni-list-item title="消息免打扰">
        <template #footer>
          <u-switch
            size="40"
            v-model="noNotice"
            :loading="noNoticeLoading"
          ></u-switch>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-list class="margin-top-sm">
      <uni-list-item
        title="清空聊天记录"
        showArrow
        clickable
        @click="clearChatDetail"
      >
      </uni-list-item>
    </uni-list>

    <uni-list class="margin-top-sm margin-bottom-xl">
      <uni-list-item clickable @click="delExit">
        <template #body>
          <view class="text-center text-red text-df" style="width: 100%"
            >删除并退出</view
          >
        </template>
      </uni-list-item>
    </uni-list>

    <u-modal
      v-model="showModal"
      :show-title="false"
      :content="modalContent"
      show-cancel-button
      confirm-color="#fa3534"
      @confirm="confirm"
      ref="uModal"
    ></u-modal>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      setTop: false,
      setTopLoading: false,
      noNotice: false,
      noNoticeLoading: false,
      showModal: false,
      modalTitle: '',
      modalContent: ''
    }
  },

  computed: {
    ...mapGetters('circle', ['circleInfo', 'circleMember']),
    ...mapGetters('user', ['userId']),
    isOwner() {
      if (this.userId == this.circleInfo.userId) return true
      return false
    },
    bannerMember() {
      if (this.circleMember.length < 4) return this.circleMember
      return this.circleMember.slice(0, 4)
    },
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
        }
      ]
    },
    formatType() {
      if (this.circleInfo.type === '固定圈') return 'warning'
      if (this.circleInfo.type === '紧急圈') return 'error'
    },
    formatRadius() {
      if (this.circleInfo.radius > 0 && this.circleInfo.radius < 1000) {
        return this.circleInfo.radius + ' m'
      } else {
        return parseInt(this.circleInfo.radius / 1000) + ' km'
      }
    }
  },

  onLoad({ circleId }) {
    this.$store.dispatch('circle/getCircleInfo', circleId)
    this.$store.dispatch('circle/getCircleMember', circleId)
  },

  methods: {
    changeCircleAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          uni.showLoading()
          this.$store
            .dispatch('circle/updateCirclePhoto', {
              circleId: '1',
              img: JSON.stringify(res.tempFilePaths[0])
            })
            .then(() => {
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                position: 'bottom',
                title: '修改成功'
              })
            })
            .catch(() => {
              uni.hideLoading()
            })
        }
      })
    },

    toCircleDetail() {
      this.$u.route('/pages/components/circle-detail/circle-detail', {
        info: encodeURIComponent(JSON.stringify(this.circleInfo))
      })
    },

    toCircleMember() {
      this.$u.route('/pages/components/circle-member/circle-member', {
        circleId: this.circleInfo.circleId
      })
    },

    toPersonInfo(id) {
      this.$u.route('/pages/components/person-info/person-info', { id })
    },

    toInviteMember() {
      this.$u.route('/pages/components/invite-member/invite-member')
    },

    toManageCircle() {
      this.$u.route('/pages/components/manage-circle/manage-circle', {
        circleId: this.circleInfo.circleId
      })
    },

    onClick(title) {
      this.$u.route(
        '/pages/components/edit-circle-info/components/change-circle-info/change-circle-info',
        {
          title,
          isEdit: this.isOwner,
          circleInfo: encodeURIComponent(JSON.stringify(this.circleInfo))
        }
      )
    },

    delExit() {
      this.modalTitle = '删除并退出'
      this.modalContent = '删除并退出后，将不再接收此圈聊信息'
      this.showModal = true
    },

    clearChatDetail() {
      this.modalTitle = '清空聊天记录'
      this.modalContent = '确定删除圈的聊天记录吗?'
      this.showModal = true
    },

    confirm() {
      switch (this.modalTitle) {
        case '删除并退出':
          uni.showLoading()
          this.$store
            .dispatch('circle/exitCircle', {
              circleId: this.circleInfo.circleId
            })
            .then(() => {
              uni.hideLoading()
              setTimeout(() => {
                uni.showToast({
                  title: '退出成功',
                  icon: 'none'
                })
                setTimeout(() => {
                  this.$u.route({
                    url: '/pages/msg/msg',
                    type: 'switchTab'
                  })
                }, 500)
              }, 500)
            })
            .catch(() => {
              uni.hideLoading()
            })
          break

        case '清空聊天记录':
          const key =
            'chatDetail_' + this.userId + '_' + this.circleInfo.circleId
          uni.removeStorageSync(key)
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
