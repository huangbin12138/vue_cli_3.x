/**
 * 根据目录结构生成router结构
 * */

import Vue from 'vue';
import Router from 'vue-router';

const Pages = require.context('../views', true, /\.vue$/);

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router);
}

const routes = [];
const resultRoutes = [];

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

// 分层
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

  /**
   * @desc 通过路由对象的name属性找到对应路由
   * @param {String} [name] 路由对象的名称，不传返回所有的路由包含分级
   * @param {Function} [callback] 回调，修改当前路由配置
   * @return {Object}
   * */
  setRouteByName(name, callback) {
    let route = resultRoutes;
    if (name) {
      route = routes.find(r => r.name === name);
    }
    typeof callback === 'function' && callback(route);
    return this;
  }


  /**
   * @desc 通过路由对象的path属性找到对应路由
   * @param {String} [path] 路由对象的名称，不传返回所有的路由包含分级
   * @param {Function} [callback] 回调，修改当前路由配置
   * @return {Object}
   * */
  setRouteByPath(path, callback) {
    let route = resultRoutes;
    if (path) {
      route = routes.find(r => r.path.toLocaleLowerCase() === path.toLocaleLowerCase());
    }
    typeof callback === 'function' && callback(route);
    return this;
  }

  /**
   * @desc 添加另外的路由，
   * @param {Array | Object} routeArr 要添加的路由[列表]
   * @return {Object}
   * */
  addRoutes(routeArr = []) {
    typeof routeArr === 'object' && !Array.isArray(routeArr) && (routeArr = [routeArr]);
    resultRoutes.push(...routeArr);
    routes.push(...routeArr);
    return this;
  }

  /**
   * @desc 创建router对象
   * @param {Object} [config] 同vue-router,不包含routes对象，
   * @return {Router}
   * */
  createRouter(config) {
    return new Router(Object.assign({routes: resultRoutes}, config));
  }

  /**
   * 获取所有路由配置，不包含层级关系
   * */
  get allRoutes() {
    return JSON.parse(JSON.stringify(routes));
  }

  /**
   * 获取所有路由配置，包含层级关系
   * */
  get routes() {
    return JSON.parse(JSON.stringify(resultRoutes));
  }
};
