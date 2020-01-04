<template>
  <div class="d-b pt20 tal w50 mlr-auto">
    <gl-button class="mb20">添加表格</gl-button>

    <gl-table :list="list" :columns="columns">
    </gl-table>
  </div>
</template>

<script>
  export default {
    name: "DB",
    data() {
      return {
        url: '/sql/table/',
        method: 'post',
        list: [],
        columns: [
          {label: '表格名称', prop: 'name'},
          {label: '所属数据库', prop: 'database'},
          {label: '表格说明', prop: 'comment'},
        ],
      }
    },
    methods: {
      getList() {
        this.http.post('sql/index/getAllTable', {
          name: 'my_db',
          columns: 'TABLE_COMMENT `comment`,TABLE_NAME `name`,TABLE_SCHEMA `database`'
        }).then(res => {
          console.log(res);
          this.list = res;
        }).catch(console.log);
      }
    },
    created() {
      this.getList();
    },
  }
</script>

<style scoped lang="less">
  .gl-input {
    border: 1px solid #ddd;
  }
</style>