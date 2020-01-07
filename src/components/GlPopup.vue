<template>
  <div class="gl-popup pof r0 b0 l0 t0" :class="[type]" v-if="show" @click="close">
    <slot name="inner-box">
      <div class="gl-popup-box abs-mc" @click.stop :style="{width}">
        <slot>
          <slot name="title">
            <div class="gl-popup-title por pl20 pr20 unselect tac">
              {{title}}
              <i class="gl-popup-close poa" v-show="type !== 'alert'"></i>
            </div>
          </slot>
          <div class="gl-popup-inner p20" v-html="content"></div>
          <slot name="footer">
            <div class="gl-popup-footer tar">
              <gl-button class="cancel" type="" @click="close">{{cancelText}}</gl-button>
              <gl-button type="primary" class="sure ml20" @click="sure">{{sureText}}</gl-button>
            </div>
          </slot>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "GlPopup",
    model: {
      prop: 'show',
      event: 'input'
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'alert'
      },
      width: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: '提 示'
      },
      cancelText: {
        type: String,
        default: '取 消'
      },
      sureText: {
        type: String,
        default: '确 定'
      },
      content: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    watch: {
      show(val) {
        if (val) {
          this.$emit('open');
        }
      }
    },
    methods: {
      close() {
        this.$emit('input', false);
        this.$emit('close');
      },
      sure() {
        this.$emit('sure', this.close);
      },
    }
  }
</script>

<style scoped lang="less">
  .alert {
    .gl-popup-box {
      width: 30vw;
    }
  }

  .gl-popup {
    background-color: rgba(0, 0, 0, .5);
  }

  .gl-popup-box {
    width: 60vw;
    background-color: #fff;
    border-radius: 5px;
  }

  .gl-popup-title {
    line-height: 2;
    font-size: 24px;
    color: #333;
    border-bottom: 1px #ddd solid;
  }

  .gl-popup-inner {
    color: #666;
  }

  .gl-popup-footer {
    padding: 10px 20px;
    border-top: 1px #eee solid;
  }
</style>