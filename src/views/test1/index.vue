<template>
  <div class="index1">
    <div id="nav" class="unselect">
      <template v-for="(path, i) in list">
        <router-link class="nav-item" :to="path.path" :key="i">{{path.name}}</router-link>
        <span v-show="i !== list.length - 1"> | </span>
      </template>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        list: this.$store.getters.menu[1].children,
      }
    },
    created(){
      // console.log(this.list);
    },
  }
</script>

<style scoped>

</style>