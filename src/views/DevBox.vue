<template>
  <div class="dev-box-body">
    <div class="dev-box lh2 tal pof zi5 vw100 vh50 b0 l0 ova">
      <div class="header poa t0 l0 w100 unselect">
        <span class="tab dib vat pl10 pr10 csp"
              :class="{active: tab === i}"
              v-for="(t, i) in ['template', 'script', 'style']"
              @click="tab = i"
              :key="i">{{t}}</span>
      </div>
      <div class="dev-inner">
        <template v-if="!tab">
          <!-- template -->
          <div class="inner-item mb10">
            <div class="inner-label">布局</div>
            <div class="inner-content pl10">
              <div class="flex jcb">
                <span class="content-label taj">节点数</span>:
                <div class="content-inner flex-1 ml20">
                  <input type="number" min="0" v-model="active.count">
                </div>
              </div>
              <div class="flex jcb">
                <span class="content-label taj">结构</span>:
                <div class="content-inner flex-1 ml20">
                  <label class="csp"><input type="radio" v-model="active.structure" name="structure"
                                            :value="0">左右</label>
                  <label class="ml10 csp"><input type="radio" v-model="active.structure" name="structure" :value="1">上下</label>
                </div>
              </div>
            </div>
          </div>
          <div class="inner-item mb10">
            <div class="inner-label">属性</div>
            <div class="inner-content pl10">
              <div class="flex jcb">
                <span class="content-label taj">唯一标识</span>:
                <div class="content-inner flex-1 ml20">
                  <input placeholder="id" class="w75" type="text" v-model="active.id">
                </div>
              </div>
              <div class="flex jcb">
                <span class="content-label taj">类名</span>:
                <div class="content-inner flex-1 ml20">
                  <input placeholder="多个用逗号分隔" class="w75" type="text" v-model="active.className">
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DevBox",
    data() {
      return {
        tab: 0,
        active: {
          count: 0,
          structure: 1,
        },
        allDom: {},
      }
    },
  }
</script>

<style scoped lang="less">
  .dev-box {
    padding-top: 2em;
    background-color: #fff;
    border: 1px solid #c0c0c0;
    .header {
      border-bottom: 1px solid #c0c0c0;
      background-color: #f5f5f5;
    }
    .tab {
      &.active {
        font-weight: bold;
      }
    }
    .inner-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
    .inner-label {
      background-color: #f5f5f5;
    }
    .inner-content {
      background-color: #fff;
    }
    .content-label {
      width: 6em;
    }
  }
</style>