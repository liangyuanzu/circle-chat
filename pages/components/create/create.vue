<template>
	<view>
		<u-form :model="form" ref="uForm" label-width="120">

			<u-form-item label="头像">
				<u-upload width="150" max-count='1' :action="action"  @on-uploaded="onUploaded"></u-upload>
			</u-form-item>

			<u-form-item label="圈名称" prop="name">
				<u-input v-model="form.name" maxlength="20" />
			</u-form-item>

			<u-form-item label="圈类型">
				<u-radio-group v-model="typeRadio">
					<u-radio v-for="(item, index) in circleType" :key="index" :name="item.name">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>

			<u-form-item label="圈范围">
				<u-radio-group v-model="RangeRadio">
					<u-radio v-for="(item, index) in circleRange" :key="index" :name="item.name">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>

			<u-form-item label="圈说明" prop="explain">
				<u-input type="textarea" maxlength="100" height='250' auto-height v-model="form.explain" />
			</u-form-item>

			<view class="finish">
				<u-button type="primary" size="medium" @click="submit">完成</u-button>
			</view>

		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 头像上传地址
				action: '',

				typeRadio: '娱乐圈',
				RangeRadio: '100m',
				circleType: [
					{
						name: '娱乐圈'
					},
					{
						name: '固定圈'
					},
					{
						name: '紧急圈'
					}
				],
				circleRange: [
					{
						name: '100m'
					},
					{
						name: '200m'
					},
					{
						name: '500m'
					},
					{
						name: '1000m'
					}
				],

				// 表单验证
				form: {
					avatar: [],
					name: '',
					explain: ''
				},

				// 表单校验规则
				rules: {
					name: [
						{
							required: true,
							message: '请输入圈名称',
							// 可以单个或者同时写两个触发验证方式
							trigger: ['change','blur']
						}
					],
					explain: [
						{
							min: 5,
							message: '圈说明不能少于5个字',
							trigger: 'change'
						}
					]
				}
			}
		},

		methods: {
			// submit() {
			// 	this.$refs.uUpload.upload();
			// },
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			},

			onUploaded(lists) {
				this.filesArr = lists;
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
page{
	background: #fff;
	padding: 0 20rpx;
}
.finish {
	width: 100%;
	text-align: center;
	margin-top: 150rpx;
}
</style>
