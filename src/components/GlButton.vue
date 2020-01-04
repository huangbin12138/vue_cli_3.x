<template>
  <div class="gl-button csp pl20 pr20 dib vam unselect transition" :class="type">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "GlButton",
    props: {
      type: {
        type: String,
        default: 'primary'
      }
    }
  }
</script>

<style scoped lang="less">
  .color(@color) {
    color: @color;
    border-color: @color;
    background-color: lighten(@color, 35);
    &:hover {
      color: lighten(@color, 35);
      background-color: @color;
    }
  }

  .gl-button {
    line-height: 2;
    border-radius: 5px;
    border: 1px #f5f5f5 solid;
  }

  .primary {
    .color(#39f);
  }
</style>