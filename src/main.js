import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
import mixins from './mixins'

import './assets/less/component-style.less';

Vue.config.productionTip = false;
Vue.mixin(mixins);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
