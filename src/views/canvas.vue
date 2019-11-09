<template>
  <div class="canvas bsb pt20">
    <canvas ref="canvas" class="canvas-inner vat" width="550" height="400"></canvas>
  </div>
</template>

<script>
  export default {
    name: "Canvas",
    data() {
      return {
        canvas: null,
        ctx: null,
      }
    },
    created() {
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.initCanvas();
    },
    methods: {
      initCanvas(){},
    }
  }
</script>

<style scoped lang="less">
  .canvas {
    min-height: calc(100vh - 82px);
    background-color: #f5f5f5;
  }

  .canvas-inner {
    background-color: #fff;
  }
</style>