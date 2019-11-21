<template>
  <div class="canvas-out clearfix">
    <div class="canvas-js fl bsb vat" ref="canvasJs"></div>
    <img v-for="(src, i) in srcs" :key="i" :src="src" alt="" class="test-img mb10 ml10 csp fl" @click="download(src, 's_' + i)">
  </div>
</template>

<script>
  export default {
    name: "CanvasJs",
    data() {
      return {
        canvas: null,
        srcs: [],
        src1: '',
      }
    },
    methods: {
      download(src, name, type = 'png') {
        this.canvas.downloadImg(name, type, src);
      }
    },
    mounted() {
      this.canvas = this.tools.createCanvas({
        $el: this.$refs.canvasJs,
        background: '#fafafa'
      });

      for (let i = 13, j = i, count = 3, r = 60; i < j + count; i++) {
        ['', 'hollow', 'line'].map((type, ind) => {
          this.canvas.stars({
            count: i,
            angle: -90,
            type,
            r,
            x: r + 2 * r * (i - j),
            y: r + ind * 2 * r,
            color: 'red'
          });
          this.srcs.push(this.canvas.getSrc('png', 2 * r * (i - j), ind * 2 * r, 2 * r, 2 * r));
        });
      }

    },
  }
</script>

<style scoped lang="less">
  .canvas-js {
    width: 550px;
    height: 400px;
  }

  .test-img {
    border: 1px solid #ddd;
  }
</style>