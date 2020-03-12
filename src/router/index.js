import Vue from 'vue';
import store from '../store';
import autoRouter from './automation-router';
import Router from 'vue-router';

Vue.use(Router);
Vue.use(autoRouter);

let routes = Vue.$autoRouter.routes;

let router = new Router({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
});

router.beforeEach((to, from, next) => {
  store.commit('setMenu', routes.slice(0, -1));
  next();
});

router.afterEach((to, from) => {
  document.title = to.meta.title || to.name;
});

export default router;
