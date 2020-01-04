<template>
  <div class="gl-table" :class="tableType">
    <div class="gl-table-header flex">
      <div class="header-col flex-1 bsb p10" v-for="(col, i) in columns" :key="i">{{col.label}}</div>
    </div>
    <div class="gl-table-body lh2">
      <template v-if="list.length">
        <div class="gl-table-row flex" v-for="(row, i) in list" :key="i">
          <div class="gl-table-col flex-1 bsb pl10 pr10 wot1" v-for="(col, j) in columns" :key="j">
            <slot :row="row" :col="col" :name="col.slot">
              <div class="col-inner" v-html="formatCell(row, col, i)"></div>
            </slot>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="gl-table-no-data tac fs20 lh3">
          <slot name="no-data">暂无数据</slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GlTable",
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      tableType: {
        type: String,
        default: '',
      }
    },
    methods: {
      formatCell(row, col, ind) {
        switch (typeof col.format) {
          case 'string':
            return col.format.replace(/s%/g, row[col.prop]);
          case 'function':
            return col.format(row[col.prop], ind, row, col);
        }

        return row[col.prop];
      },
    },
  }
</script>

<style scoped lang="less">
  .gl-table {
    font-size: 16px;
  }

  .gl-table-header {
    background-color: #f5f5f5;
    color: #666;
    font-weight: 600;
  }

  .gl-table-row {
    &:not(:last-child) {
      border-bottom: 1px #f5f5f5 solid;
    }
  }

  .gl-table-no-data {
    color: #ccc;
  }
</style>