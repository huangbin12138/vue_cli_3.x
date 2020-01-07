/**
 * 根据目录结构生成router结构
 * */

import Vue from 'vue';
import Router from 'vue-router';

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router);
}

const routes = [];
const resultRoutes = [];

const Pages = require.context('../views', true, /\.vue$/);

Pages.keys().map(path => {
  // 开始配置路由
  let page = Pages(path).default || Pages(path);
  path = path.slice(1, -4).replace(/\/index$/, '');
  if (!page || !page.name) return; // ， 当name为空时不配置该组件路由
  routes.push({
    // 名称为相对路径大驼峰 去掉结尾index 及动态路由
    name: path.replace(/\/[a-z]/ig, s => s[1].toLocaleUpperCase()).replace(/\/_[^]*$/, ''),
    // 默认路由为相对pages的路径 _ 为: 动态路由 /adminhome/:id
    path: path.replace(/\/_/g, '/:'),
    // 组件对象
    component: page,
    // 子路由
    children: [],
    // 其它配置
    meta: {},
  });
});

const findParent = (parents, route) => {
  if (Array.isArray(parents) && parents.length) {
    for (let k in parents) {
      let parent = parents[+k];
      let parentReg = new RegExp('^' + parent.path + '/', 'i');
      let routeReg = new RegExp('^' + route.path + '/', 'i');
      if (parentReg.test(route.path)) {
        // 判断是否为parent下的子路由的子路由
        findParent(parent.children, route) || parent.children.push(route);
        return true;
      } else if (routeReg.test(parent.path)) {
        parents.splice(+k, 1, route);
        route.children.push(parent);
        return true;
      } else {
        findParent(parent.children, route);
      }
    }
  }
};

routes.map(route => (!resultRoutes.length || !findParent(resultRoutes, route)) && resultRoutes.push(route));

export default class {
  constructor(config = {}) {
  }

  setRouteByName(name, callback) {
    let route = this.routes;
    if (name) {
      route = this.allRoutes.find(r => r.name === name);
    }
    typeof callback === 'function' && callback(route);
    return this;
  }

  setRouteByPath(path, callback) {
    let route = this.routes;
    if (path) {
      route = this.allRoutes.find(r => r.path === path);
    }
    typeof callback === 'function' && callback(route);
    return this;
  }

  addRoutes(routeArr = []) {
    typeof routeArr === 'object' && !Array.isArray(routeArr) && (routeArr = [routeArr]);
    resultRoutes.push(...routeArr);
    routes.push(...routeArr);
    return this;
  }

  createRouter(config) {
    return new Router(Object.assign({routes: this.routes}, config));
  }

  get allRoutes() {
    return routes;
  }

  get routes() {
    return resultRoutes;
  }
};
