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
      <div class="key">{{k}}({{item.length}})</div>
    </div>
    <div class="flex-1 result wspl csp flex-1 unselect">
      length: (<input class="dib w25" type="text" v-model.number="length">)
      count: {{count}}
      <span @click="cancel">撤 消</span>
      <br>
      <span @click="init()">重 置</span>
      <br>
      <span @click="auto()">next</span>
      <br>
      <span @click="allResult(100)">result</span>
    </div>
    <div class="flex-1 result-1 p20 ova tal">
      <div class="lh2 dib vat w50" v-for="(item, i) in history" :key="i">{{i + 1}}、{{item[0]}} -> {{item[1]}};</div>
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
        result: [],
      }
    },
    watch: {
      length() {
        this.init();
      },
    },
    created() {
    },
    mounted() {
      this.W = this.$refs.boxa[0].offsetWidth - 40;
      this.init();
    },
    methods: {
      getResult(count, a = 'a', c = 'c') {
        let res = [];
        // debugger;
        if (count === 1) {
          res.push([a, c]);
        } else if (count < 1) {
          // do not thing
        } else {
          let b = ['a', 'b', 'c'].find(s => s !== a && s !== c);
          res.push(...this.getResult(count - 1, a, b)); // count - 1, a -> b
          res.push([a, c]); // a -> c
          res.push(...this.getResult(count - 1, b, c)); // count - 1, b -> c
        }
        return res;
      },

      allResult(time = 500) {
        this.init();
        this.result.map((e, i) => {
          // Promise.resolve().then(() => {
          // });
          setTimeout(() => {
            Promise.resolve().then(() => {
              this.move(e[1], e[0]);
              // let {a, b, c} = this.list;
              // console.group('index: ' + i, 'average: ' + (this.length / 3).toFixed(3));
              // console.log('name  :  a b c');
              // console.log('length: ', a.length, b.length, c.length);
              // console.groupEnd();
            })
          }, time * i)
        });
        // console.log(this.result.length);
      },

      auto() {
        let {result, history, count} = this;
        let step = result[count];
        step && this.move(step[1], step[0]);
      },
      init(num = this.length) {
        Object.values(this.list).map(e => e.splice(0, e.length));
        this.count = 0;
        this.width = this.W / num | 0;
        this.history = [];
        for (let i = 1; i <= num; i++) this.list.a.push(i);
        this.result = this.getResult(num);
      },
      cancel() {
        if (this.history.length) {
          this.count--;
          let arr = this.history.pop();
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
          history.push([active, k]);
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