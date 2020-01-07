<template>
  <div class="gl-button csp pl20 pr20 dib vam unselect transition"
       :style="{lineHeight: height}"
       @click="$emit('click')"
       :class="[type, {'my-color': color}]">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "GlButton",
    props: {
      type: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: '',
      },
      backgroundColor: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        dataV: '',
      }
    },
    watch: {
      color(val) {
        this.initColor(this.color, this.backgroundColor);
      },
      backgroundColor(val) {
        this.initColor(this.color, this.backgroundColor);
      },
    },
    methods: {
      initColor(color, backgroundColor) {
        color && this.tools.addStyleSheet([{
          name: '.my-color',
          style: {
            color,
            borderColor: color,
            backgroundColor: backgroundColor || '#fff',
          }
        }, {
          name: '.my-color:hover',
          style: {
            color: backgroundColor || '#fff',
            backgroundColor: color,
          }
        }], this.dataV);
      }
    },
    mounted() {
      let props = this.$el.attributes;
      this.dataV = props && props[0] && props[0].name;
      this.initColor(this.color, this.backgroundColor);
    },
  }
</script>

<style scoped lang="less">
  .color(@color) {
    color: @color;
    border-color: @color;
    background-color: lighten(@color, 32);
    &:hover {
      color: lighten(@color, 32);
      background-color: @color;
    }
  }

  .gl-button {
    line-height: 2;
    border-radius: 5px;
    border: 1px solid #ddd;
    &:hover {
      background-color: #f5f5f5;
    }
  }

  .primary {
    .color(#39f);
  }

  .success {
    .color(#9f3);
  }

  .danger {
    .color(#f39);
  }

</style>
