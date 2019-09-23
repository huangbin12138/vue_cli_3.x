<template>
  <div class="about">
    <gl-play-video :init="init"></gl-play-video>
    <div class="float-box" v-if="show"></div>
    <div class="btn" @click="show = !show; init = !init">click</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'hello',
        time: new Date(),
        num: 0,
        ranNum: 0,
        max: 10,
        min: 3,
        fixed: 1,
        show: false,
        init: false
      }
    },
    created() {
      // this.http.getList({a: 1});
      window.tools = this.tools;
      console.log('create');
    },
  }
</script>
<style scoped lang="less">
  .about {
    position: relative;
  }

  .gl-play-video {
    border: 1px #ddd solid;
  }

  .btn {
    margin-top: 2rem;
    line-height: 2rem;
    background-color: #ff0;
  }

  .float-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 5rem;
    height: 15rem;
    background-color: #00a0e9;
  }
</style>