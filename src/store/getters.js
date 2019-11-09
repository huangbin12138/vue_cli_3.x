import state from './state';

const getters = {};

Object.keys(state).map(key => {
  getters[key] = state => state[key];
});

const signGetters = {};

// 获取加密保存的数据（需要在set时先加密）
[
  // 'login',
  // 'userClass',
  // 'userInfo'
].map(k => {
  signGetters[k] = (state) => {
    // if (state[k]) {
    //   return JSON.parse(sign.base64_decode(state[k]));
    // } else {
    //   return {};
    // }
  }
});

Object.assign(getters, signGetters, {
//
});

export default getters;
