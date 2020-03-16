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
 * */

const Pages = require.context('@', true, /^((?!\/node_modules\/).)*\.vue$/);

const AllFile = Pages.keys().map(path => {
  return Pages(path).default || {...Pages(path)};
});

const setView = (name, parent, view) => {
  if (parent) {
    parent.components[name] = view;
    parent.children && parent.children.map(child => setView(name, child, view));
  }
};

const delNoPath = routes => {
  for (let [ind, route] of routes.entries()) {
    if (route.path) {
      delNoPath(route.children);
    } else {
      routes.splice(ind, 1, ...route.children);
      delNoPath(routes);
    }
  }
};

const initRoute = (route, config) => {
  if (typeof config === 'function') {
    return config(route);
  } else if (typeof config === 'object') {
    Object.assign(config.components || {}, route.components);
    return Object.assign(route, config);
  }
  return route;
};

export default {
  install(Vue, options = {}) {
    let opt = Object.assign({
      views: 'views',
      components: 'components',
      config: {},
    }, options);
    let {views, components, config} = opt;
    let autoRouter = {
      allFile: AllFile,
      components: [],
      views: [],
      routes: [],
    };
    let viewsReg = new RegExp(`^src/${views}/`);
    let compReg = new RegExp(`^src/${components}/`);
    if(process.env.NODE_ENV === 'production'){
      // build时读取组件路径错误
      viewsReg = new RegExp(`^\\./${views}/`);
      compReg = new RegExp(`^\\./${components}/`);
    }
    let viewReg = /View\.\w+$/; // 判断是否为命名视图;

    AllFile.forEach(file => {
      let {__file, routerConfig} = file;
      let path = __file.slice(0, -4).replace(/\/index$/i, '').split('/').slice(2);
      if (views && viewsReg.test(__file)) {
        // 需要自动配置路由的页面
        autoRouter.views.push(file);

        let len = path.length;
        let curr = autoRouter.routes;
        let parent = {components: {}};
        let name = '';

        path.forEach((key, ind) => {
          name += key.replace(/^[a-z]/i, s => s.toLocaleUpperCase()).replace(/^_.*/i, '');
          let child = curr.find(item => item.name === name);
          if (ind + 1 === len) {
            // 文件
            if (viewReg.test(key)) {
              // 命名视图
              setView(key.split('.')[1], parent, file);
            } else {
              // 子路由
              let route = {
                name,
                path: '/' + path.map(s => s.toLocaleLowerCase().replace(/^_/, ':')).join('/'),
                meta: {},
                children: [],
                components: {
                  default: file,
                },
              };
              route = initRoute(route, config);
              route = initRoute(route, routerConfig);

              Object.keys(parent.components || {})
                .filter(e => e !== 'default')
                .map(k => setView(k, route, parent.components[k]));
              curr.push(route);
              curr = autoRouter.routes;
            }
          } else if (child) {
            parent = child;
            curr = child.children || [];
          } else {
            let route = {
              name,
              components: {},
              children: [],
            };
            curr.push(route);
            parent = route;
            curr = route.children;
          }
        })
      } else if (components && compReg.test(__file)) {
        // 自动引入的全局组件
        autoRouter.components.push(file);
        file.name && Vue.component(path.join(''), file);
      }
    });

    delNoPath(autoRouter.routes);

    Vue.$autoRouter = autoRouter;
  }
}
