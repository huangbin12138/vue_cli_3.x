<template>
  <div class="vw100 vh100 bsb"
       @mousewheel.prevent="mouseWheel"
       @touchstart.prevent="startMove"
       @touchend.prevent="endMove"
       @touchmove.prevent="touchMove">
    <div class="albums abs-mc csp"
         @mousedown.prevent="start = true"
         @mouseup.prevent="start = false"
         @mousemove.prevent="move">
      <div class="por box" :style="{
      width: size + 'px',
      height: size + 'px',
      transform: rotateStr,
      }">
        <div class="album bsb poa w100 h100"
             :style="{
             zIndex: albums.length - i,
             transform: transform(i, translate),
             backgroundImage: `url(${album.src})`,
             opacity: 1 * ((i / 6) < times)
             }"
             @dblclick.stop.prevent="changeImg(album)"
             v-for="(album, i) in albums" :key="i">
        </div>
      </div>
    </div>
    <input type="file" class="ovh w0 h0" ref="file" @change="fileChange" accept="image/*">
  </div>
</template>

<script>
  export default {
    name: "Album",
    data() {
      return {
        albums: [],
        photo: {},
        start: false,
        size: 100,
        translate: 150,
        times: 1,
        rotate: [0, 0, 0, 0],
        rotateStr: '',
        pageXY: [],
        touchLength: 0,
      }
    },
    watch: {
      rotate(val) {
        // this.rotateStr = val.join(',') + 'deg'

        let [x, y] = val;
        this.rotateStr = `rotateX(${x}deg) rotateY(${y}deg)`;
      },
    },
    methods: {
      fileChange(e) {
        let {files} = e.target;
        let file = files[0];
        if (file) {
          console.log(file);
          this.tools.img2base(file).then(src => this.photo.src = src).catch(console.log)
        }

      },
      changeImg(item) {
        if (this.start && !this.count) return;
        this.photo = item;
        this.$refs.file.click();
      },
      mouseWheel(e) {
        let s = e.wheelDelta;
        let max = this.albums.length / 6;
        let min = 1;
        this.translate /= this.times;

        if (s > 0 && this.times < max) {
          this.times++;
        } else if (s < 0 && this.times > min) {
          this.times--;
        }

        this.translate *= this.times;
      },
      startMove(e, album) {
        console.log(e);
        this.touchLength++;
        this.start = true;
        this.pageXY = [];
        let {targetTouches} = e;
        for (let ind in targetTouches) {
          if (!isNaN(ind)) {
            let item = targetTouches[ind];
            this.pageXY.push(item.pageX, item.pageY);
          }
        }
      },
      endMove(e) {
        this.start = false;
        this.touchLength = 0;
      },
      touchMove(e) {
        if (this.start) {
          let {targetTouches, changedTouches} = e;
          let [x, y, z, deg] = this.rotate;

          if (this.touchLength === 1) {
            let {pageX: px, pageY: py} = targetTouches[0];
            let [sx, sy] = this.pageXY;
            x -= py - sy;
            y += px - sx;
            this.pageXY = [px, py];
            this.rotate = [x % 360, y % 360];
          } else if (this.touchLength === 2) {
            let [x1, y1, x2, y2] = this.pageXY;
            console.log(targetTouches, this.touchLength);
            let {pageX: tx1, pageY: ty1} = targetTouches[0];
            let {pageX: tx2, pageY: ty2} = targetTouches[1];
            let sDistance = (x2 - x1) ** 2 + (y2 - y1) ** 2;
            let distance = (tx2 - tx1) ** 2 + (ty2 - ty1) ** 2;
            if (sDistance) {
              this.pageXY = [];
              this.mouseWheel({wheelDelta: distance - sDistance});
            }
          }
        }
      },
      move(e) {
        if (this.start) {
          let {movementX: mx, movementY: my} = e;
          let [x, y, z, deg] = this.rotate;
          x -= my;
          y += mx;
          this.rotate = [x % 360, y % 360];
        }
      },
      transform(i, t, r) {
        // transform: translateZ(100px) rotateY(0)
        let str = 'translate';
        t = t / ((i / 6 | 0) + 1);
        switch (i % 6) {
          case 0:
            str += `Z(${t}px) rotateY(0)`;
            break;
          case 1:
            str += `Z(-${t}px) rotateY(180deg)`;
            break;
          case 2:
            str += `Y(-${t}px) rotateX(90deg)`;
            break;
          case 3:
            str += `Y(${t}px) rotateX(-90deg)`;
            break;
          case 4:
            str += `X(${t}px) rotateY(90deg)`;
            break;
          case 5:
            str += `X(-${t}px) rotateY(-90deg)`;
            break;
        }
        return str;
      }
    },
    mounted() {
      for (let i = 6, j = i, count = 12, r = this.size; i < j + count; i++) {
        let canvas = this.tools.createCanvas({
          background: this.tools.rColor(200, 255)
        });
        ['', 'line'].map((type, ind) => {
          canvas.stars({
            count: i,
            angle: -90,
            type,
            r,
            x: r,
            y: r,
            color: this.tools.rColor(80, 180),
          });
          this.albums.push({
            src: canvas.getSrc('png', 0, 0, 2 * r, 2 * r),
          });
        });
      }
      this.rotate = [-30, -30];
      this.translate = this.size / 2;
    },
  }
</script>

<style scoped lang="less">
  .box {
    transform-style: preserve-3d;
  }

  .album {
    perspective: 1000px;
    background: no-repeat center center / 100%;
    transition: .3s linear;
  }
</style>