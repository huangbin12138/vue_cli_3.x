<template>
  <div class="canvas bsb por dib csp">
    <!--<div class="my-canvas" :style="{width: '400px', height: '400px', backgroundColor: '#f5f5f5'}" ref="myCanvas"></div>-->
    <div class="dib vat gl-edit-img ovh">
      <canvas ref="canvas" class="canvas-inner vat"
              :class="{transition: !start}"
              :style="style" width="400" height="400"></canvas>
    </div>
    <div @mousewheel.prevent="mouseWheel"
         @mousedown.prevent="startMove"
         @mouseout.prevent="endMove('hide')"
         @mouseup.prevent="endMove"
         @mousemove.prevent="move"
         :style="{borderWidth: hb + 'px ' + wb + 'px'}"
         class="abs-mc bsb w100 h100 ctrl transition">
    </div>
    <!--<input type="number" @click="initCanvas(config)" placeholder="boxW" class="poa">-->
  </div>
</template>

<script>
  export default {
    name: "Canvas",
    props: {
      config: {
        type: Object,
        default() {
          return {
            src: require('../assets/ttt.jpg'),
            // src: require('../assets/tl.jpg'),
            // src: require('../assets/tf.jpg'),
            width: 256,
            height: 256,
            type: 'image',
          }
        },
      }
    },
    data() {
      return {
        canvas: {},
        ctx: null,
        active: false,
        wb: 0,
        hb: 0,
        boxW: 0,
        boxH: 0,
        padding: 0,
        start: false,
        style: {
          transform: '',
        },
        scale: 1,
        imgArg: {
          image: null,
          sx: 0,
          sy: 0,
          swidth: 0,
          sheight: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      }
    },
    watch: {
      'imgArg.width'(val) {
        if (val) {
          let {image} = this.imgArg;
          let out = val / image.width * image.height;
          this.imgArg.height = Math.max(this.hb, out);
        }
      },
      'imgArg.height'(val) {
        if (val) {
          let {image} = this.imgArg;
          let out = val / image.height * image.width;
          this.imgArg.width = Math.max(this.wb, out);
          this.endMove(true);
        }
      },
      boxW(w) {
        this.wb = Math.max((this.canvas.width - w) / 2, 0);
        this.hb = Math.max((this.canvas.height - this.boxH) / 2, 0);
        this.endMove(true);
      },
      boxH(h) {
        this.hb = Math.max((this.canvas.height - h) / 2, 0);
        this.wb = Math.max((this.canvas.width - this.boxW) / 2, 0);
        this.endMove(true);
      },
    },
    created() {
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      // this.canvas = this.tools.createCanvas({$el: this.$refs.myCanvas});
      console.log(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.initCanvas(this.config);
    },
    methods: {
      startMove(e) {
        this.start = true;
      },
      endMove(e) {
        e === 'hide' && setTimeout(() => this.active = false, 3000);
        if (this.start || e === true) {
          let {width, height} = this.canvas;
          let {x, y, width: w, height: h} = this.imgArg;
          if (w < this.boxW) this.imgArg.width = w = this.boxW;
          if (h < this.boxH) this.imgArg.height = h = this.boxH;
          if (this.wb < x) {
            this.imgArg.x = this.wb;
          } else if (x < width - this.wb - w) {
            this.imgArg.x = width - this.wb - w;
          }
          if (this.hb < y) {
            this.imgArg.y = this.hb;
          } else if (y < height - this.hb - h) {
            this.imgArg.y = height - this.hb - h;
          }
          this.drawImage();
        }
        this.start = false;
      },
      move(e) {
        this.active = true;
        if (this.start) {
          let {movementX: x, movementY: y} = e;
          this.imgArg.x += x;
          this.imgArg.y += y;
          this.drawImage();
        }
      },
      mouseWheel(e) {
        let s = e.wheelDelta;
        this.imgArg.width /= this.scale;
        if (s > 0) {
          // 放大
          this.scale < 5 && (this.scale += .1);
        } else if (s < 0) {
          // 缩小
          this.scale > 1 && (this.scale -= .1);
        }
        this.imgArg.width *= this.scale;
      },
      drawImage() {
        let {width, height} = this.canvas;
        let {image, width: w, height: h, sx, sy, swidth, sheight, x, y} = this.imgArg;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(image, sx, sy, swidth, sheight, x, y, w, h);
      },
      initCanvas(config, init) {
        let {src, type, width: innerW, height: innerH} = config;
        switch (type) {
          case 'image':
            let {width: W, height: H} = this.canvas;
            let [width, height, x, y, sx, sy] = [0, 0, 0, 0, 0, 0];
            let image = new Image();
            image.src = src;
            image.onload = () => {
              let {width: w, height: h} = image;
              this.boxW = innerW;
              this.boxH = innerH || this.boxW * h / w || H * .8;
              this.boxW || (this.boxW = this.boxH * w / h || H * .8);
              w > h ? (height = this.boxH) : (width = this.boxW);

              width = width || height * w / h;

              this.imgArg = {image, sx, sy, swidth: w, sheight: h, x, y, width, height};
            };
            break;
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .canvas-inner {
    background-color: #fff;
  }

  .ctrl {
    border: rgba(0, 0, 0, .5) 0 solid;
  }
</style>