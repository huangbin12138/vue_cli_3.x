<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div @click="num = Math.random() * 1000 * 60 * 60 * 24 * 10">numberToTime: {{
      numberToTime(num, 'D天H小时m分s秒SSS毫秒')
      }}
    </div>
    <div @click="new Date()">formatTime: {{formatTime(time)}}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'hello',
        time: new Date(),
        num: 0,
      }
    },
    created(){
      console.log(this.http);
      this.http.getList({a: 1});
    },
  }
</script>
