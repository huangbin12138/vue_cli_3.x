<template>
  <div class="">
    <audio controls
           src="https://api.weixin.qq.com/cgi-bin/media/get?access_token=29_eTsnKGYDYtuYfovJwmcUEU4BxH1v7XwpWuRVYulH6Gs9rMLGddTgpnhv4lYHM-iAvNtZ8SYYAAPnHrhjpZ5X6Be3x8vbl5a0F9zTVtzwvJn1sHyF-B6ylICHptS-2XwCOQlbzVCOemAmMjGbFMDbAFANUL&media_id=0w2zNDrktA7Vp-8b809FdwdjbADyMC97W59Vg_oEqOCjoKUERKSG2ihuE6yfIokN"></audio>
    <span class="ttt transition csp unselect" :style="{color}" @click="color = tools.rColor()">福</span>
  </div>
</template>

<script>
  export default {
    name: "Blessing",
    data() {
      return {
        color: '',
      }
    },
    created() {
    },
  }
</script>

<style scoped lang="less">
  .ttt {
    font-size: 300px;
    line-height: 1.5;
    font-weight: bold;
  }
</style>