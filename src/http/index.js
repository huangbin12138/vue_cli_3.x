import axios from 'axios';

// axios 配置
const axiosConfig = {
  baseURL: '',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
};

// 加/解密对象
const sign = {
  // 解密
  decode: data => data,
  // 加密
  encode: data => data,
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
    resDataKey: '', // 返回数据内容的key
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

class Http {
  http(url = '', data = {}, config = {}, method = 'post') {
    let params = initData(data);
    let {isSign, loading, resDataKey} = initConfig(config);
    isSign && (params = sign.encode(params));
    loading && load.open();
    return axios[method](url, params, config).then(res => {
      let result = isSign ? sign.decode(res.data) : res.data;
      if (isSuccessRes(result)) {
        return resDataKey ? result[resDataKey] : result;
      } else {
        throw result;
      }
    });
  };

  post(...arg) {
    return this.http(...arg, 'post');
  }

  get(...arg) {
    return this.http(...arg, 'get');
  }

  test(...arg) {
    let [url, data, config, method] = arg;
    let configs = initConfig(Object.assign({...config}, {
      loading: false,
      resDataKey: '',
    }));
    let out = {};
    method = method || 'post';
    console.log(url, ':data:>', data);
    console.log(url, ':initData:>', initData(data));
    console.log(url, ':config:>', config);
    console.log(url, ':initConfig:>', initConfig({...config}));
    this.http(url, data, configs, method).then(res => {
      console.log(url, ':res:>', res);
      Object.assign(out, res);
      if (!Object.keys(out).length) out.status = true;
    }).catch(err => {
      Object.assign(out, err);
      if (!Object.keys(out).length) out.status = false;
      console.log(url, ':error:>', err);
    });
    for (; !Object.keys(out).length;) {
    }
    return out;
  }

  $post(...arg) {
    arg[2].isSign = true;
    return post(...arg);
  }

  $err(err) {
    // 错误处理
    load.close(true);
    console.log(err);
  }
}

export default new Http();