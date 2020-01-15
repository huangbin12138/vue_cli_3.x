<template>
  <div class="about lh2">
    <audio src="http://qndata.iexue100.com/12313.mp3?e=1579109426&token=VrWPMPIkZO24VMh2d3_TpyIU7KuDQGoz8--U2C30:gkXx6RD2_xBpI3ip8zibbbplPO4=" controls></audio>
  </div>
</template>

<script>

  export default {
    name: 'About',
    data() {
      return {
        msg: 'hello',
      }
    },
    methods: {},
    created() {
      // this.http.getList({a: 1});
    },
  }
</script>
<style scoped lang="less">
  .about {
    position: relative;
    > :nth-child(n) {
      cursor: pointer;
      &:hover {
        background-color: #aaa;
      }
    }
  }

</style>