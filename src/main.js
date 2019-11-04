import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
import mixins from './mixins'

import './assets/less/component-style.less';

Vue.config.productionTip = false;
Vue.mixin(mixins);

const components = {
  'gl-play-video': require('./components/playvideo'),
};

Object.keys(components).map(name => Vue.component(name, components[name].default));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
