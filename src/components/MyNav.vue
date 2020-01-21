<template>
  <div id="nav" class="unselect">
    <div class="tal">
      <router-link to="/">Menu</router-link>
    </div>
    <template
            v-for="(path, i) in list">
      <router-link class="nav-item" :to="path.path" :key="i">{{path.name}}</router-link>
      <span v-show="i !== list.length - 1"> | </span>
    </template>
  </div>
</template>

<script>
  export default {
    name: "MyNav",
    props: {
      name: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        list: this.name ? this.$store.getters.menu.find(e => e.name === this.name).children.filter(e => e.name !== 'Menu') : this.$store.getters.menu.filter(e => e.name !== 'Menu'),
      }
    },
  }
</script>

<style scoped>

</style>