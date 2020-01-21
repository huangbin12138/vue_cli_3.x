<template>
  <div class="sudoku pt10 unselect por">
    <div class="div">
      <input type="text" v-model.number="questionLength" @change="createQuestion(questionLength)">
    </div>
    <div class="out-box dib w100 vat" ref="outBox">
      <div class="row flex fww" v-for="(inner, i) in showList" :key="i">
        <div :class="[{
        'is-question': question[i] && question[i][j] !== undefined,
        'active-item': x === j && y === i
        }, 'col flex flex-1 fww ovh']"
             :style="{height: w + 'px'}"
             @click="checkCell(j, i, question[i] && question[i][j] !== undefined)"
             :key="j" v-for="(col, j) in inner">
          <div class="item flex-1" v-for="(item, z) in col" :key="z">{{item}}</div>
        </div>
      </div>
    </div>
    <div class="abs-mc bsb">
      <div class="flex fww jcb box" v-if="x !== '' && y !== ''"
           :style="{maxWidth: w * 3.5 + 'px', height: w * 3.5 + 'px'}">
        <div :style="{width: w + 'px', lineHeight: w + 'px'}"
             :class="['set-num', {
             cannot: !testNum(n, x, y),
             check: showList[y][x].includes(n)
             }]"
             @click="setCell(n, x, y)"
             v-for="n in 9" :key="n">{{n}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sudoku",
    data() {
      return {
        questionLength: 6,
        question: {},
        answer: [],
        w: 0,

        x: '',
        y: '',
        showList: [],
      }
    },
    created() {
      // this.dfList = this.initList(true);
      this.showList = this.initList();
      this.createQuestion(this.questionLength);
      // this.question = this.initList();
    },
    mounted() {
      this.w = this.$refs.outBox.offsetWidth / 9;
    },
    methods: {
      createQuestion(val = 6) {
        this.question = {};
        for (let i = 0; i < val;) {
          let val = +this.tools.rNumber(1, 9);
          let x = +this.tools.rNumber(0, 8);
          let y = +this.tools.rNumber(0, 8);
          if (this.setCell(val, x, y, true)) {
            this.question[x] = this.question[x] || {};
            this.question[x][y] = val;
            i++;
          }
        }
        this.showList = this.initList(this.question);
      },
      testNum(val, x, y) {
        let {showList} = this;
        let [x1, x2] = [x - 2, x - 1, x, x + 1, x + 2].splice(2 - x % 3, 3).filter(n => n !== x);
        let [y1, y2] = [y - 2, y - 1, y, y + 1, y + 2].splice(2 - y % 3, 3).filter(n => n !== y);

        let row = [];
        let col = [];
        let rect = [];


        rect.push(showList[y1] ? showList[y1][x1] : '');
        rect.push(showList[y1] ? showList[y1][x2] : '');
        rect.push(showList[y2] ? showList[y2][x1] : '');
        rect.push(showList[y2] ? showList[y2][x2] : '');

        rect = rect.filter(a => a && a.length === 1).map(a => a[0]);

        showList.map((e, i) => {
          i === y && (row.push(...e.filter(num => num.length === 1).map(num => num[0])));
          e[x].length === 1 && col.push(e[x][0]);
        });

        return !row.includes(val) && !col.includes(val) && !rect.includes(val);
      },
      setCell(val, x, y, only) {
        let {showList} = this;
        let arr = showList[y][x];
        if (arr.includes(val)) {
          arr.splice(arr.indexOf(val), 1);
        } else if (this.testNum(val, x, y) && (!only || !arr.length)) {
          arr.push(val);
          arr.sort((a, b) => a - b);
          return true;
        }
      },
      checkCell(x, y, isQue) {
        this.testNum(undefined, x, y);
        if (isQue || x === this.x || this.x !== '') {
          this.x = '';
          this.y = '';
        } else {
          this.x = x;
          this.y = y;
        }
      },
      initList(init) {
        let arr = [];
        for (let x = 0; x < 9; x++) {
          arr.push([]);
          for (let y = 0; y < 9; y++) {
            arr[x].push([]);
            if (init === true) {
              for (let z = 1; z < 10;) {
                arr[x][y].push(z++);
              }
            } else if (typeof init === 'object' && init[x] && init[x][y] !== undefined) {
              arr[x][y].push(init[x][y]);
            }
          }
        }
        return arr;
      },
    }
  }
</script>

<style scoped lang="less">
  .out-box,
  .set-box {
    max-width: 300px;
    border: 1px #666 solid;
    background-color: #fff;
    &.set-box {
      border: 0;
      background-color: transparent;
    }
  }

  .row,
  .col {
    &:not(:last-child) {
      border-bottom: 1px #ddd solid;
      &.col {
        border-bottom: 0;
        border-right: 1px #ddd solid;
      }
    }
    &[class]:nth-child(3n) {
      border-color: #999;
    }
  }

  .col {
    align-items: center;
    font-size: 14px;
    line-height: 1;
    > :only-child {
      font-size: 24px;
    }
  }

  .is-question {
    background-color: #eee;
  }

  .active-item {
    background-color: lightblue;
  }

  .box {
    align-items: center;
  }

  .set-num {
    background-color: #fff;
    border: 1px #ddd solid;
    border-radius: 5px;
    &.cannot {
      &:not(.check) {
        background-color: #ddd;
      }
    }
    &.check {
      border-color: #0f0;
    }
  }
</style>