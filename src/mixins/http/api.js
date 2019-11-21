const urlList = {
  getList: '/list',
  getWxUserInfo: 'wxcat/api/get_wx_userinfo_reg', // 获取微信用户信息
  setWxConfig: 'wxcat/api/get_sign', // 微信js-sdk设置config
};

const apiList = {};

Object.keys(urlList).map(k => {
  // 使用function语法，使得调用时this能指向 http
  apiList[k] = function (params = {}, config = {}) {
    this.$post(urlList[k], params, config);
  };
});

export default apiList;