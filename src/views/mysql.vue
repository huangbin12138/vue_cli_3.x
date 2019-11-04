<template>
  <div class="mysql">

  </div>
</template>

<script>
  export default {
    name: "Mysql",
    data() {
      return {}
    },
    methods: {
      test() {
        console.log('start');
        this.http.post('http://12.12.12.58:3000/api/user').then(console.log).catch(console.log);
      }
    },
    created() {
      this.test();
    },
  }
</script>

<style scoped>

</style>