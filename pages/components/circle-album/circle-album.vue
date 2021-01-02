<template>
  <view class="wrap">
    <view class="grid col-2">
      <view class="padding-xs margin-bottom-sm">
        <view class="margin-bottom">
          <view class="add-alubum bg-gray flex align-center justify-center">
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
      <view class="padding-xs margin-bottom-sm">
        <view class="margin-bottom">
          <u-image
            width="100%"
            height="300rpx"
            border-radius="20"
            :src="src"
          ></u-image>
        </view>
        <view class="text-lg text-black text-cut">测试</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      src: 'https://img95.699pic.com/photo/50050/3205.jpg_wh300.jpg'
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
