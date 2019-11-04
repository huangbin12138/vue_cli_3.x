<template>
  <div id="app">
    <div id="nav" class="unselect">
      <template v-for="(path, i) in list">
        <router-link class="nav-item" :to="'/' + (!i ? '' : path)" :key="i">{{path}}</router-link>
        <span v-show="i !== list.length - 1"> | </span>
      </template>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          'home',
          'about',
          'wxcode',
          'mysql',
          'homepage',
        ],
      }
    },
  }
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
    border-bottom: 1px solid #000;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
