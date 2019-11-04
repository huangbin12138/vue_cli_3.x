import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const pages = {
  Home: require('../views/Home'),
  HomePage: require('../views/homepage'),
  Mysql: require('../views/mysql'),
  WxCode: require('../views/wx_err_code'),
  About: require('../views/About'),
};

function createRoutes(components, path = '/', callback) {
  if (!components) return [];
  let routes = [];
  let first = true;
  Object.keys(components).map(key => {
    let route = {
      path: path + key.toLocaleLowerCase().replace('_', '/'),
      name: key.replace('_', ''),
      components: components[key],
      children: [],
    };
    route.children.push(...createRoutes(components[key].children, route.path, callback));
    if (first) {
      route.alias = path;
      first = false;
    }
    typeof callback === 'function' && callback(route);
    routes.push(route);
  });
  routes.push({
    path: '**',
    redirect: path,
  });
  return routes;
}

export default new Router({
  routes: createRoutes(pages, '/', route => {
    //
  }),
})
