<template>
	<view>
		<nav-bar />
		<tabs />
		<list />
	</view>
</template>

<script>
	import navBar from './components/nav-bar.vue'
	import tabs from './components/tabs.vue'
	import list from './components/list.vue'

	export default {
		components: {
			'nav-bar': navBar,
			tabs,
			list
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
