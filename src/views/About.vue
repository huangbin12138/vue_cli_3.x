<template>
  <div class="about">
    <my-player :videoSrc="videoSrc" :poster="poster" style="width: 550px" class="mlr-auto"></my-player>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data() {
      return {
        msg: 'hello',
        videoSrc: require('../assets/f0.mp4'),
        poster: require('../assets/ttt.jpg'),
      }
    },
    created() {
      // this.http.getList({a: 1});
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