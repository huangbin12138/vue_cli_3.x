<template>
  <div class="menu-list">
    <my-nav></my-nav>
  </div>
</template>

<script>
  export default {
    name: "menu",
    created() {
      console.log(this.$store.getters.menu);
    },
  }
</script>

<style scoped>

</style>