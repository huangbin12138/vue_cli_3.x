import state from './state';

const mutations = {};

Object.keys(state).map(key => {
  mutations[`set${key.replace(/^[a-z]/i, s => s.toUpperCase())}`] = (state, value) => state[key] = value;
});

const signMutations = {};
// 加密保存的数据
[
  // 'login',
  // 'userClass',
  // 'userInfo'
].map(k => {
  // signMutations[`set${k.replace(/^[a-z]/i, s => s.toUpperCase())}`] = (state, value) => state[k] = sign.base64_encode(JSON.stringify(value));
});

Object.assign(mutations, signMutations, {
});

export default mutations;
