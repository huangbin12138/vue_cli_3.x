<template>
  <div class="routers">
    ,,index
    <div class="mt20">default:::</div>
    <router-view></router-view>
    <div class="mb20">default-end:::</div>
    <div class="">left:::</div>
    <router-view name="Left"></router-view>
    <div class="">left-end:::</div>
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped>

</style>