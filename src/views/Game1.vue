<template>
  <div class="game-1 flex jce mt20">
    <div class="flex-1 csp"
         :title="k"
         v-for="(item, k) in list" :key="k"
         :ref="'box' + k"
         @click="move(k)">
      <div :class="[k, 'box flex-col pb10 csp mlr-auto', {'active': active === k}]"
           :style="{height: length * 20 + 'px', width: Math.min(width / 2, 10) + 'px'}">
        <div class="item mt10" v-for="(e, i) in item" :key="i" :style="{width: e * width + 'px'}"></div>
      </div>
      <div class="key">{{k}}</div>
    </div>
    <div class="flex-1 result wspl csp flex-1 unselect">
      length: (<input class="dib w25" type="text" v-model.number="length">)
      count: {{count}}
      <span @click="cancel">撤 消</span>
      <br>
      <span @click="init()">重 置</span>
      <br>
      <span @click="auto()">next</span>
    </div>
    <div class="flex-1 result-1 p20 mt20 ova tal">
      <div class="lh2 dib vat w50" v-for="(item, i) in history" :key="i">{{i + 1}}、{{item}};</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Game1",
    data() {
      return {
        width: 0,
        W: 0,
        length: 4,
        list: {
          a: [],
          b: [],
          c: [],
        },
        count: 0,
        active: '',
        autoActive: '',
        history: [],
      }
    },
    watch: {
      length() {
        this.init();
      },
    },
    created() {
      this.getResult(4);
    },
    mounted() {
      this.W = this.$refs.boxa[0].offsetWidth - 40;
      this.init();
    },
    methods: {
      getResult(num = this.length){
        // let arr = new
      },

      auto() {
        let {list: {a, b, c}, length,} = this;
        let [al, bl, cl] = [a.length, b.length, c.length]; // 长度
        let [ab, bb, cb] = [al % 2, bl % 2, cl % 2]; // 长度是否为奇数
        if (al === +length) {
          this.move(ab ? 'c' : 'b', 'a');
        } else if (ab && !bb && cb) {
          this.move('c', 'a');
        }

      },
      init(num = this.length) {
        Object.values(this.list).map(e => e.splice(0, e.length));
        this.count = 0;
        this.width = this.W / num | 0;
        this.history = [];
        for (let i = 1; i <= num; i++) this.list.a.push(i);
      },
      cancel() {
        if (this.history.length) {
          this.count--;
          let arr = this.history.pop().replace(/\s+/g, '').split('->');
          this.list[arr[0]].unshift(this.list[arr[1]].shift());
        }
      },
      move(k, act) {
        let {active, list, history} = this;
        active = act || active;
        if (!active) {
          this.active = k;
        } else if (!k || k === active || !list[active] || !list[active].length) {
          this.active = '';
        } else if (!list[k].length || list[active][0] < list[k][0]) {
          this.count++;
          history.push(`${active} -> ${k}`);
          list[k].unshift(list[active].shift());
          this.active = '';
          return true;
        } else {
          this.active = '';
        }
        return false;
        //
      }
    }
  }
</script>

<style scoped lang="less">
  .game-1 {
    .box {
      width: 5px;
      justify-content: flex-end;
      align-items: center;
      background-color: #ccc;
      &.active {
        background-color: #f00;
        + .key {
          color: #f00;
        }
      }
    }
    .item {
      height: 10px;
      background-color: orange;
    }
    .result-1 {
      max-height: 50vh;
      background-color: #f5f5f5;
    }
    .key {
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }
  }
</style>