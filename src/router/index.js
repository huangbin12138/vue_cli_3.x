import store from '../store';
import Router from './automation-router';

let myRouter = new Router();

myRouter.setRouteByName('Test1DB', route => {
  route.meta.title = 'DBDBDB';
}).addRoutes([
  {
    path: '*',
    redirect: '/menu'
  },
]);

let router = myRouter.createRouter({
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
});

router.beforeEach((to, from, next) => {
  store.commit('setMenu', myRouter.routes.slice(0, -1));
  next();
});

router.afterEach((to, from) => {
  document.title = to.meta.title || to.name;
});

export default router;
