<template>
	<view>
		<nav-bar />
		<list />
	</view>
</template>

<script>
	import navBar from './components/nav-bar.vue'
	import list from './components/list.vue'

	export default {
		components: {
			'nav-bar': navBar,
			list
		},
		data() {
			return {

			};
		},

		computed: {

		}
	}
</script>

<style lang="scss">

</style>
