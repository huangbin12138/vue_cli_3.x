/**
 * 根据目录结构生成router结构
 * ../views 目录下的所有有name的vue文件
 *
 * ../views/p1/p2/p3.vue, ../views/p1/p2/p3/index.vue  ->  /p1/p2/p3
 *
 *
 * 配置规则：
 * 1、 子目录下的为同级同名vue文件的子路由
 *   /p.vue
 *   /p/c.vue
 *   {
 *     path: '/p',
 *     ...
 *     children: [
 *       {
 *         path: '/p/c',
 *         ...
 *       }
 *     ]
 *   }
 *
 * 2、 名字以 '_' 开头的文件或文件夹为动态路由
 *   /abc/_id/_type.vue  -> /abc/:id/:type
 *   /abc/_type.vue  -> /abc/:type
 *   /abc/_type/index.vue  -> /abc/:type
 *
 * 3、 'View.name.vue' 为路由下的命名视图，视图名称为 name
 *   {
 *      ...
 *      components: {
 *        default: ...,
 *        name: ...,
 *      }
 *      ...
 *   }
 *
 * 4、 可以通过同级同名的js文件来覆盖配置 或者用 setRouteByName, setRouteByPath 方法覆盖
 *   /a.js {path: '/js'}
 *   myRouter.setRouteByName('A', route => route.path = '/js')
 *      --> /a.vue -> /js
 *
 * */

import Vue from 'vue';
import Router from 'vue-router';

const Pages = require.context('../views', true, /\.vue$/);
const Configs = require.context('../views', true, /\.js$/);

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router);
}

const routes = [];
const resultRoutes = [];

const setView = (name, parent, view) => {
  if (parent) {
    parent.components[name] = view;
    parent.children && parent.children.map(child => setView(name, child, view));
  }
};

// 分层
const findParent = (parents, route, start = 0) => {
  if (Array.isArray(parents) && parents.length) {
    for (let i in parents) {
      // 从最新添加的parent开始查找，好像不用找那么多次[手动狗头]
      let k = parents.length - i - 1;
      let parent = parents[+k];
      let parentReg = new RegExp('^' + parent.___ + '/', 'i');
      let routeReg = new RegExp('^' + route.___ + '/', 'i');

      let viewReg = /View\.\w+$/; // 判断是否为命名视图

      if (parentReg.test(route.___) && !findParent(parent.children, route)) {
        if (viewReg.test(route.___)) {
          // route 为 parent 的命名视图
          setView(route.___.split('.')[1], parent, route.components.default);
        } else {
          // route 为 parent 的子路由
          Object.keys(parent.components).filter(n => n !== 'default').map(viewName => {
            // 设置子路由的命名视图
            route.components[viewName] = parent.components[viewName];
          });
          parent.children.push(route);
        }
        return true;
      } else if (parentReg.test(route.___)) {
        // route 为 parent 下的子路由下的子路由
        return true;
      } else if (routeReg.test(parent.___)) {
        if (parents.includes(route)) {
          // 避免重复添加同样的配置
          parents.splice(+k, 1);
        } else {
          parents.splice(+k, 1, route);
        }
        findParent(parents, route); // 避免多个子路由在父路由前先被配置，而成为父路由的同级路由
        if (viewReg.test(parent.___)) {
          // parent 为 route 的命名视图
          setView(parent.___.split('.')[1], route, parent.components.default);
        } else {
          // parent 为 route 的子路由
          Object.keys(route.components).filter(n => n !== 'default').map(viewName => {
            // 设置子路由的命名视图
            parent.components[viewName] = route.components[viewName];
          });
          route.children.push(parent);
        }
        return true;
      } else {
        findParent(parent.children, route);
      }
    }
  }
};

Pages.keys().map(path => {
  let configPath = path.replace(/\.vue$/, '.js');
  // 开始配置路由
  let page = Pages(path).default || Pages(path);
  let config = {};
  try {
    // 获取对应的js配置 若存在
    config = Configs(configPath).default || Configs(configPath);
  } catch (e) {

  }
  if (!page || !page.name) return; // ， 当name为空时不配置该组件路由
  path = path.slice(1, -4).replace(/\/index$/, '');
  let route = {
    // 名称为相对路径大驼峰 去掉结尾index 及动态路由
    name: path.replace(/\/[a-z]/ig, s => s[1].toLocaleUpperCase()).replace(/\/_[^]*$/, ''),
    // 默认路由为相对pages的路径 _ 为: 动态路由 /adminhome/:id
    path: path.replace(/\/_/g, '/:'),
    // 组件对象
    components: {
      default: page
    },
    // 子路由
    children: [],
    // 其它配置
    meta: {},
    ...config,
    ___: path.replace(/\/_/g, '/:'), // 判断层级
  };

  /\/\w+\.\w+$/.test(route.path) || routes.push(route);
  (!resultRoutes.length || !findParent(resultRoutes, route)) && resultRoutes.push(route)
});

routes.map(route => delete route.___); // 去掉多余属性
// console.log(resultRoutes);

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
    let route = this.routes;
    if (name) {
      route = this.allRoutes.find(r => r.name === name);
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
    let route = this.routes;
    if (path) {
      route = this.allRoutes.find(r => r.path.toLocaleLowerCase() === path.toLocaleLowerCase());
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
    return new Router(Object.assign({routes: this.routes}, config));
  }

  /**
   * 获取所有路由配置，不包含层级关系
   * */
  get allRoutes() {
    return routes;
  }

  /**
   * 获取所有路由配置，包含层级关系
   * */
  get routes() {
    return resultRoutes;
  }
};
