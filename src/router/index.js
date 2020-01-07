import store from '../store';
import Router from './automation-router';

let myRouter = new Router();

myRouter.setRouteByName('DB', route => {
  console.log(route);
  route.meta.title = 'DBDBDB';
}).addRoutes([
  {
    path: '*',
    redirect: myRouter.routes[0]
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
  document.title = to.meta.title || '';
});

export default router;
