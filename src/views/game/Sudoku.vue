<template>
  <div class="sudoku pt10 unselect por">
    <div class="div">
      <!--<input type="text" v-model.number="questionLength" @change="createQuestion(questionLength)">-->
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
             cannot: !testNum(n, x, y, questionArr),
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
        questionLength: 15,
        question: {},
        questionArr: {},
        answer: 0,
        w: 0,

        x: '',
        y: '',
        showList: [],
      }
    },
    created() {
      this.queStr();
      // this.dfList = this.initList(true);
      this.createQuestion(this.questionLength);
    },
    mounted() {
      this.w = this.$refs.outBox.offsetWidth / 9;
    },
    methods: {
      queStr() {
        let str = '';
        let all = '123456789';
        console.clear();
        for (let i = 0; i < 81; i++) {
          let [arr, x, y] = [str.split(''), i / 9 | 0, i % 9];
          let row = arr.slice(x * 9);
          let col = arr.filter((s, ind) => ind % 9 === y);
          let add = this.tools.rString(1, '', all.split('').filter(s => ![...row, ...col].includes(s)).join(''));
          if (add) {
            // i++;
            str += add;
          } else {
            // i--;
            str += 0;
          }
          // if (!str) {
          //   str += this.tools.rNumber(1, 9);
          // } else {
          //   str += this.tools.rNumber(1, 9);
          // }
          console.log(arr, x, y, row, col);
        }
        console.log(str.split('').map((s, k) => (k % 27 === 26 && k < 55) ? s + '\n' + '-'.repeat(21) + '\n' : k % 9 === 8 ? s + '\n' : k % 3 === 2 ? s + ' | ' : s + ' ').join(''));
        return str;
      },
      createQuestion(val = 6) {
        this.question = {};
        let arr = new Array(9);
        let qArr = new Array(9);
        let vs = {};
        let xs = {};
        let ys = {};
        let isSet = [];
        let i = 0;
        let j = 0;
        '123456789'.split('').map((v, ind) => {
          vs[v] = 0;
          xs[ind] = 0;
          ys[ind] = 0;
        });
        for (; i < val;) {
          j++;
          let val = +this.tools.rString(1, '', Object.keys(vs).filter(k => vs[k] < 9).join(''));
          let x = +this.tools.rString(1, '', Object.keys(xs).filter(k => xs[k] < 9).join(''));
          let y = +this.tools.rString(1, '', Object.keys(ys).filter(k => ys[k] < 9).join(''));
          if (isSet.includes('' + x + y)) continue;
          if (this.testNum(val, x, y, arr)) {
            this.question[x] = this.question[x] || {};
            this.question[x][y] = val;
            arr[y] = arr[y] || new Array(9);
            arr[y][x] = [val];
            qArr[x] = qArr[x] || new Array(9);
            qArr[x][y] = [val];

            i++;
            vs[val]++;
            xs[x]++;
            ys[y]++;
            isSet.push('' + x + y);
          }
        }
        // console.log(j);
        this.answer = i;
        this.questionArr = qArr;
        this.showList = this.initList(this.question);
      },
      testNum(val, x, y, showList = this.showList) {
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
          e[x] && e[x].length === 1 && col.push(e[x][0]);
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
        }
        !arr.length ? this.answer-- : (arr.length === 1 && this.answer++);
        if (this.answer === 81) {
          console.log('success');
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