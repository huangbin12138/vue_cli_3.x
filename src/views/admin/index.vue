<template>
  <div class="admin">
    <div class="body" @click.stop.prevent="selectDom" ref="body">
      <div class="">hello</div>
      <span class="">sss</span>
      <div class="">hello</div>
    </div>
    <div class="active-box poa bsb transition ovh" @click.stop.prevent="active = null" :style="activeBoxStyle"></div>
    <div class="setting-box poa" v-show="active"></div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        active: null,
        activeBoxStyle: {},
      }
    },
    created() {
      console.log();
    },
    watch: {
      active(val) {
        if (val) {
          this.activeBoxStyle = {
            width: val.offsetWidth + 'px',
            height: val.offsetHeight + 'px',
            top: val.offsetTop + 'px',
            left: val.offsetLeft + 'px',
          };
        } else {
          this.activeBoxStyle = {
            width: 0,
            height: 0,
            top: -100 + 'px',
            left: 0,
          };
        }
      },
    },
    methods: {
      selectDom(e) {
        if (this.active === e.target) return this.active = null;
        this.active = e.target;
        console.log(this.active);
      },

      layout(type = 1){
        let str = '';
        if(type === 1){
          let dom = document.createElement('div');
        } else {}
        return str;
      },
    }
  }
</script>

<style scoped lang="less">
  .active-box {
    border: 2px #00ff00 solid;
  }
</style>