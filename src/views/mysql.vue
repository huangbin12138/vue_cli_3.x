<template>
  <div class="mysql pt20 tal w50 mlr-auto">
    method: <input type="text" class="gl-input mb20" v-model="method" placeholder="method">
    <br>
    url: <input type="text" class="gl-input mb20" v-model="url" placeholder="url">
    <br>
    <span class="test csp fs24 lh24" @click="test">send</span>
  </div>
</template>

<script>
  export default {
    name: "Mysql",
    data() {
      return {
        url: '/sql/table/',
        method: 'post',
      }
    },
    methods: {
      test() {
        this.http.test('http://12.12.12.58:8181' + this.url, {
          table: 'test_1',
          value: [
            {name: new Date() % 7777, remark: new Date() * 1},
            {name: new Date() % 5555, remark: new Date() * 1},
            {name: new Date() % 3333, remark: new Date() * 1},
          ]
        }, {}, this.method).then(console.log).catch(console.log);
      }
    },
    created() {
      this.test();
    },
  }
</script>

<style scoped lang="less">
  .gl-input {
    border: 1px solid #ddd;
  }
</style>