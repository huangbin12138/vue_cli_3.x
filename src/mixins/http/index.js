import axios from 'axios';
import qs from 'qs';
import apiList from './api';
import Sign from './sign';

// axios 配置
const axiosConfig = {
  baseURL: 'http://12.12.12.58:8181/',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
};


// 加/解密对象
const sign = {
  // 解密
  decode: e => {
    return Sign.decode_post(e);
  },
  // 加密
  encode: e => {
    Sign.params = e;
    return Sign.encode_post();
  },
};

// 加载中弹出层
const load = {
  // 打开弹出层
  open: () => {
    console.log('open');
  },
  // 关闭弹出层
  close: (isAll = false) => {
    if (isAll) {
      console.log('close all');
    } else {
      console.log('close');
    }
  },
};

function initData(data) {
  let out = Object.assign({}, data);
  Object.keys(out).map(k => {
    if (!out[k] && out[k] !== 0) delete out[k];
  });
  return out;
}

function initConfig(config) {
  let out = Object.assign({
    isSign: false, // 是否需要加密
    loading: true, // 是否显示loading
    resDataKey: 'data', // 返回数据内容的key
  }, axiosConfig, config);

  out.headers = Object.assign({
    ...axiosConfig.headers
  }, out.headers);

  config = Object.assign({}, out);
  delete config.isSign;
  delete config.loading;
  delete config.resDataKey;

  return out;
}

// 是否正确返回
function isSuccessRes(res) {
  return !!res;
}

class Index {

  http(url = '', data = {}, config = {}, method = 'post') {
    let params = initData(data);
    config = initConfig(config);
    let {isSign, loading, resDataKey} = config;
    isSign && (params = sign.encode(params));
    loading && load.open();
    // params = qs.stringify(params);
    return axios[method](url, params, config).then(res => {
      let result = isSign ? sign.decode(res.data) : res.data;
      if (isSuccessRes(result)) {
        return resDataKey ? result[resDataKey] || result : result;
      } else {
        throw result;
      }
    });
  }

  post(url, data, config) {
    return this.http(url, data, config, 'post');
  }

  get(url, data, config) {
    return this.http(url, data, config, 'get');
  }

  async test(...arg) {
    let [url, data, config, method] = arg;
    let configs = initConfig(Object.assign({...config}, {
      loading: false,
      resDataKey: '',
    }));
    method = method || 'post';
    console.log(url, ':data:>', data);
    console.log(url, ':initData:>', initData(data));
    console.log(url, ':config:>', configs);
    console.log(url, ':initConfig:>', initConfig({...configs}));
    try {
      let res = await this.http(url, data, configs, method);
      console.log(url, ':res:>', res);
      return res;
    } catch (err) {
      console.log(url, ':error:>', err);
      throw err;
    }
  }

  $post(url, data, config) {
    config = config || {};
    config.isSign = true;
    return this.post(url, data, config);
  }

  $err(err) {
    // 错误处理
    load.close(true);
    console.log(err);
  }

}

let http = new Index();
Object.assign(http, apiList);
export default http;