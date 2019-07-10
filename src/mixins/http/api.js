const urlList = {
  getList: '/list'
};

const apiList = {};

Object.keys(urlList).map(k => {
  // 使用function语法，使得调用时this能指向 http
  apiList[k] = function (params = {}, config = {}) {
    this.$post(urlList[k], params, config);
  };
});

export default apiList;