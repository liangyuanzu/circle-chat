<template>
	<view :style="style">
		<search />
	</view>
</template>

<script>
	import search from '@/components/HM-search/HM-search.vue'

	export default {
		components: {
			search
		},

		name: 'cu-custom',

		data() {
			return {

			};
		},

		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var style = `margin-top:${StatusBar}px;`;
				return style
			}
		}
	}
</script>

<style lang="scss">

</style>
