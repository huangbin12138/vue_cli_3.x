<template>
  <div class="test-model">
    <h1 @click="test++">父组件点击++ test: {{test}}</h1>
    <child v-model="test" @cf="cf"></child>
  </div>
</template>

<script>
  let child = {
    template: `<h3 @click="changed">子组件点击-1 test: {{test}}</h3>`,
    model: {
      prop: 'test',
      event: 'cf',
    },
    name: 'child',
    props: {
      test: {
        type: Number,
        default: 0,
      }
    },
    methods: {
      changed(){
        this.$emit('cf', this.test - 1, this.test);
      },
    },
  };

  export default {
    name: "testmodel",
    components: {child},
    data(){
      return {
        test: 1
      };
    },
    methods: {
      cf(val, prev){
        console.log(val, prev);
        console.log('hello world');
      },
    },
  }
</script>

<style scoped>

</style>