<template>
  <div class="gl-play-video dib vat" ref="parent" :style="{width, height}">
    <!--:src="video.src || src"-->
    <video class="w100 h100 vam video-inner"
           src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4"
           ref="video"
           :poster="video.poster || poster"
           :autoplay="autoplay"
           :loop="loop"
           @play="play"
           @pause="pause"
           @load="load"
           :muted="muted"
           :controls="controls"
           webkit-playsinline
           x-webkit-airplay
           playsinline
           x5-playsinline>
      <!--<source src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4" type="video/mp4">-->
      <!--<source src="http://www.w3school.com.cn/example/html5/mov_bbb.ogg" type="video/ogg">-->
      <!--<source src="http://www.w3school.com.cn/example/html5/mov_bbb.webm" type="video/webm">-->
    </video>
    <div class="controls">
      <div class="play dib vam"></div>

      <span class="time"></span>
      <div class="full-screen dib vam"></div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "GlPlayVideo",
    props: {
      controls: {
        type: Boolean,
        default: true,
      },
      muted: {
        type: Boolean,
        default: false,
      },
      loop: {
        type: Boolean,
        default: false,
      },
      autoplay: {
        type: Boolean,
        default: false,
      },
      addPlayRecord: {
        type: Boolean,
        default: true,
      },
      video: {
        type: Object,
        default() {
          return {}
        },
      },
      src: {
        type: String,
        default: ''
      },
      poster: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '100%',
      },
      init: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        isPlay: false,
        timer: null,
        imgsrc: '',
      }
    },
    watch: {
      init(val) {
        this.initPlay();
      }
    },
    methods: {
      load(e) {
        console.log(e);
      },
      initPlay() {
        try {
          let parent = this.$refs.parent;
          let video = parent.firstChild;
          let clone = video.cloneNode(true);
          clone.currentTime = video.currentTime;
          parent.replaceChild(clone, video);
          alert(clone.currentTime);
        } catch (e) {
          alert(e)
        }
      },
      playVideo() {
        if (this.isplay) {
          this.$refs.video.pause();
          clearInterval(this.timer);
          this.timer = null;
          this.isplay = false;
          // alert('pause');
        } else {
          this.$refs.video.play();
          // alert('play');
          this.isplay = true;
        }
      },
      play(e) {
        // let video = this.$refs.video;
        // let canvas = this.$refs.canvas;
        // let ctx = canvas.getContext('2d');
        // console.log(video, canvas, ctx);
        // canvas.width = video.videoWidth * 3;
        // canvas.height = video.videoHeight * 3;
        // this.timer = setInterval(() => {
        //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        // }, 20);
        this.$emit('play', e);
      },
      pause(e) {
      }
    },
    created() {
    },
  }
</script>

<style scoped lang="less">
  .canvas {
    vertical-align: middle;
    background-color: #fef0f0;
    width: 100%;
    height: 100%;
  }

  .gl-play-video {
    width: 100%;
    height: 100%;
    .video-inner {
      object-fit: fill;
    }
  }
</style>
