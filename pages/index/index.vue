<template>
  <view>
    <nav-bar />
    <tabs />
    <circle-list />
  </view>
</template>

<script>
import navBar from './components/nav-bar.vue'
import tabs from './components/tabs.vue'
import circleList from './components/circle-list.vue'

export default {
  components: {
    'nav-bar': navBar,
    tabs,
    'circle-list': circleList
  },
  data() {
    return {}
  },
  onLoad() {},
  methods: {}
}
</script>

<style>
</style>
