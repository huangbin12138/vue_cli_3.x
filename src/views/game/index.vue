<template>
  <div class="index1">
    <my-nav name="Game"></my-nav>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        list: this.$store.getters.menu.find(e => e.name === 'Game').children,
      }
    },
    created() {
      // console.log(this.list);
    },
  }
</script>

<style scoped>

</style>