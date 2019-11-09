import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
import mixins from './mixins'

import './assets/less/component-style.less';

Vue.config.productionTip = false;
Vue.mixin(mixins);

// 自动引入全局组件
const BaseComponent = require.context('./components', true, /\.vue$/);
let components = [];
BaseComponent.keys().map(path => {
  let component = BaseComponent(path).default || BaseComponent(path);
  // 全局组件中必须有name, name即为标签名
  components.push(component.name);
  Vue.component(component.name, component);
});
console.warn('components: ', components.join(', '));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
