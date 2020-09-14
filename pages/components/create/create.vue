<template>
  <view>
    <u-form :model="form" ref="uForm" label-width="120">
      <!--
      <u-form-item label="头像">
        <u-upload
          width="150"
          :max-size="5 * 1024 * 1024"
          max-count="1"
          :action="action"
          @on-uploaded="onUploaded"
        ></u-upload>
      </u-form-item>
      -->

      <u-form-item label="圈名称" prop="name" required>
        <u-input v-model="form.name" maxlength="20" placeholder="请输入圈名称" />
      </u-form-item>

      <u-form-item label="圈类型" required>
        <u-radio-group v-model="form.circleType">
          <u-radio
            v-for="(item, index) in typeValueMap"
            :key="index"
            :name="item.value"
          >{{ item.name }}</u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item label="圈范围" v-if="!this.form.radius" required>
        <u-radio-group v-model="form.circleRange">
          <u-radio
            v-for="(item, index) in rangeValueMap"
            :key="index"
            :name="item.value"
          >{{ item.name }}</u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item label="有效期" required>
        <u-number-box v-model="form.effective" :min="1" :max="7" @change="valChange"></u-number-box>
        <text>（天）</text>
      </u-form-item>

      <u-form-item label="圈说明">
        <u-input type="textarea" maxlength="100" v-model="form.explain" placeholder="请输入圈说明" />
      </u-form-item>

      <u-form-item label="圈简介">
        <u-input type="textarea" maxlength="100" v-model="form.synopsis" placeholder="请输入圈简介" />
      </u-form-item>

      <u-form-item label="圈公告">
        <u-input type="textarea" maxlength="100" v-model="form.notice " placeholder="请输入公告" />
      </u-form-item>

      <view class="finish">
        <u-button type="primary" size="medium" @click="submit">完成</u-button>
      </view>
    </u-form>
  </view>
</template>

<script>
export default {
  onLoad: function (option) {
    this.form = { ...this.form, ...option };
  },

  data() {
    return {
      // 头像上传地址
      // action:
      //   "https://www.fastmock.site/mock/54236c8f1a881df6d5bb941158a9264e/api/circle/updateCirclePhoto",

      typeValueMap: [
        {
          name: "交友圈",
          value: 0,
        },
        {
          name: "固定圈",
          value: 1,
        },
        {
          name: "紧急圈",
          value: 2,
        },
      ],

      rangeValueMap: [
        {
          name: "100m",
          value: "100",
        },
        {
          name: "200m",
          value: "200",
        },
        {
          name: "500m",
          value: "500",
        },
        {
          name: "1000m",
          value: "1000",
        },
      ],

      // 表单验证
      form: {
        // avatar: [],
        name: "",
        position: "",
        radius: "",
        circleType: 0,
        circleRange: "100",
        effective: 7,
        synopsis: "",
        explain: "",
        notice: "",
      },

      // 表单校验规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入圈名称",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
        /*
        explain: [
          {
            min: 5,
            message: "圈说明不能少于5个字",
            trigger: "change",
          },
				],
				*/
      },
    };
  },

  methods: {
    // submit() {
    // 	this.$refs.uUpload.upload();
    // },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading();
          this.$store
            .dispatch("circle/creatCircle", {
              name: this.form.name,
              position: this.form.position,
              radius: this.form.radius
                ? this.form.radius
                : this.form.circleRange,
              type: this.form.circleType,
              effective: this.form.effective,
              synopsis: this.form.synopsis,
              explain: this.form.explain,
              notice: this.form.notice,
            })
            .then(() => {
              uni.hideLoading();
              uni.showToast({
                icon: "success",
                title: "创建圈成功",
              });
              setTimeout(() => {
                uni.reLaunch({
                  url: "/pages/index/index",
                });
              }, 1000);
            })
            .catch(() => {
              uni.hideLoading();
            });
        }
      });
    },

    onUploaded(lists) {
      this.filesArr = lists;
    },

    valChange(e) {
      this.form.effective = e.value;
    },
  },

  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss">
body,
html {
  background: #fff !important;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.finish {
  width: 100%;
  text-align: center;
  margin-top: 150rpx;
}
</style>
