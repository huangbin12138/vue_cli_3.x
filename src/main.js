import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
import mixins from './mixins'

import GlPlayVideo from './components/playvideo'

Vue.config.productionTip = false;
Vue.mixin(mixins);

Vue.component('gl-play-video', GlPlayVideo);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
