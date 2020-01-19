<template>
  <div class="mysql pt20 tal w50 mlr-auto">
    method: <input class="gl-input vam" v-model="method" placeholder="method">
    <div class="mb10"></div>
    data: <textarea rows="2" class="gl-textarea gl-input vam w66" v-model="data" placeholder="method"></textarea>
    <br class="mb10">
    <div class="mb10"></div>
    url: <textarea rows="2" class="gl-textarea gl-input vam w66" v-model="url" placeholder="url"></textarea>
    <div class="mb10"></div>
    <span class="test csp fs24 lh24" @click="test">send</span>
  </div>
</template>

<script>
  export default {
    name: "Mysql",
    data() {
      return {
        url: 'http://12.12.12.57:4003/php/opening/upload.Qupload/del_file',
        method: 'post',
        data: '{"key":"media/55125e1ecccea3083.mp3","bucket":"iexue"}',
      }
    },
    methods: {
      test() {
        this.http.test(this.url, JSON.parse(this.data), {}, this.method).then(console.log).catch(console.log);
      }
    },
    created() {
      // this.test();
    },
  }
</script>

<style scoped lang="less">
  .gl-input {
    border: 1px solid #ddd;
  }
</style>