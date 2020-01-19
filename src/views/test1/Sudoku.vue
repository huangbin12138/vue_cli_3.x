<template>
  <div class="sudoku pt10">
    <div class="out-box flex fww w100 mlr-auto" ref="outBox">
      <div class="inner-box flex-1 flex fww" v-for="(inner, i) in showList" :key="i">
        <div class="item flex-1" :style="{height: w + 'px'}" :key="j" v-for="(item, j) in inner">{{item.toString()}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sudoku",
    data() {
      return {
        dfList: [],
        showList: [],
        w: 0,
      }
    },
    created() {
      // this.dfList = this.initList(true);
      this.showList = this.initList();
    },
    mounted() {
      this.w = this.$refs.outBox.offsetWidth / 9;
    },
    methods: {
      initList(init) {
        let arr = [];
        for (let x = 0; x < 9; x++) {
          arr.push([]);
          for (let y = 0; y < 9; y++) {
            arr[x].push([]);
            arr[x][y].push(x * 9 + y);
            if (!init) continue;
            for (let z = 1; z < 10;) {
              arr[x][y].push(z++);
            }
          }
        }
        return arr;
      },
    }
  }
</script>

<style scoped lang="less">
  .out-box {
    max-width: 300px;
  }

  .flex-1 {
    min-width: 30%;
    border: .5px #ddd solid;
  }
</style>