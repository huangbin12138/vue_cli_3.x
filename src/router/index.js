import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router);
}

// 自动配置路由
/**
 * 获取所有指定目标下的vue组件
 * 建议结构
 *
 *  -p1                父级1目录
 *    -p1.vue          父级1组件 /p1/p1
 *                               目录下第一个vue为父组件，
 *                               所以建议在当前目录下若有子目录(路由)时，目录下只创建一个.vue
 *    -c1
 *      -c1.vue        在父级1目录下的子目录下的组件 是p1下的子组件 /p1/c1/c1
 *      -c1_1.vue      /p1/c1/c1_1
 *    -c2
 *      -c2.vue        /p1/c2/c2
 *  -p2
 *    -p2.vue          /p2/p2
 * */
const routes = [];
let routers = [];
let errPage = ''; // 错误路由跳转页面默认第一个路由s
const Pages = require.context('../views', true, /\.vue$/);

function initRoute(route) {
  // 配置路由特殊项，只能进行同步操作，不要改动$$开头属性

  // 配置左侧菜单
  Object.assign(route, {
    title: route.name,
    icon: "el-icon-bank-card",
    breadIcon: "el-icon-bank-card",
  });

  routers.push(route.name);

  errPage || (errPage = route.path);
}

const pathObj = {}; // 初步记录组件间层级
Pages.keys().map(path => {
  // 开始配置路由
  let page = Pages(path).default || Pages(path);
  if (!page.name) return; // ， 当name为空时不配置该组件路由
  let route = {
    name: page.name, // 名称为组件内name属性，建议使用大驼峰命名
    path: path.slice(1, -4), // 默认路由为相对pages的路径 /adminhome/index;
    children: [], // 子路由
    meta: {}, // 其它配置
  };

  // 只读属性
  Object.defineProperties(route, {
    component: {value: page}, // 组件对象
    $$path: {value: route.path},
    $$parent: {value: path.slice(1, path.lastIndexOf('/'))},
  });

  initRoute(route);
  let count = path.split('/').length;
  if (pathObj[count]) {
    pathObj[count].push(route);
  } else {
    pathObj[count] = [route];
  }
});
Object.keys(pathObj).map((count, ind, arr) => {
  if (!ind) {
    routes.push(...pathObj[count]);
  } else {
    let prep = pathObj[arr[ind - 1]];
    pathObj[count].map(children => {
      let haveParent = false;

      for (let parent of prep) {
        let reg = new RegExp('^' + parent.$$path, 'i');
        let reg2 = new RegExp('^' + parent.$$parent, 'i');
        if (parent.$$path && reg.test(children.$$path) || parent.$$parent && reg2.test(children.$$path)) {
          haveParent = true;
          parent.children.push(children);
          break;
        }
      }
      haveParent || routes.push(children);
    });
  }
});
// 错误路由处理
routes.push({
  path: '**',
  redirect: errPage,
});

// console.log(routes);
console.warn('routers: ', routers.join(', '));


// 后台登录页
// const Login = resolve => require.ensure([], () => resolve(require('@/pages/admin/login/login')), 'login');

// routes end

const router = new Router({
  // mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
});


// 查找路由所在菜单位置
// function setMenu(toPath, lists) {
//   // 递归查找路由对应的menuIndex
//   function findIndex(path, list, ind = []) {
//     let arr = [];
//     for (let k in list) {
//       let e = list[k];
//       if (e.path === path) {
//         arr.push(...ind, k);
//       } else if (e.children && e.children.length) {
//         arr.push(...findIndex(path, e.children, [...ind, k]));
//       }
//       if (arr.length) break;
//     }
//     return arr;
//   }
//
//   let indexArr = findIndex(toPath, lists);
//   store.commit('setMenuIndex', indexArr.map((e, k) => k ? (e * 1 + 1) : e).join('-'));
// }

router.beforeEach((to, from, next) => {
  // 设置 title
  document.title = to.meta.title || document.title;
  // setMenu(to.path, routes.slice(0, -1));
  store.commit('setMenu', routes.slice(0, -1));

  next();
});

export default router;
