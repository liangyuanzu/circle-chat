<template>
	<view>
		<nav-bar />
		<tabs />
	</view>
</template>

<script>
	import navBar from './components/nav-bar.vue'
	import tabs from './components/tabs.vue'

	export default {
		components: {
			'nav-bar': navBar,
			tabs
		},
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
</style>
