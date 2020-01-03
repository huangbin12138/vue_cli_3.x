<template>
  <div class="about">
    <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            border
            row-key="id">
      <el-table-column
              prop="date"
              label="日期"
              width="180">
      </el-table-column>
      <el-table-column
              prop="name"
              label="姓名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="address"
              label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data() {
      return {
        msg: 'hello',
        tableData: [
          {
            id: 1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 2,
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            children: [
              {
                id: 31,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                id: 33,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                id: 32,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }
            ]
          }, {
            id: 3,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',

          }, {
            id: 4,
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      }
    },
    created() {
      // this.http.getList({a: 1});
    },
  }
</script>
<style scoped lang="less">
  .about {
    position: relative;
  }

  .gl-play-video {
    border: 1px #ddd solid;
  }

  .btn {
    margin-top: 2rem;
    line-height: 2rem;
    background-color: #ff0;
  }

  .float-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 5rem;
    height: 15rem;
    background-color: #00a0e9;
  }
</style>