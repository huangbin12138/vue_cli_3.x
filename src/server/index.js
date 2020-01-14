const http = require('http');
const fs = require('fs');

const Msg = require('./error');
const Config = require('./config');

const next = (data = {}, config = {}) => {
  let {req, res} = next;
  let {writeHeadCode} = config;
  delete config.writeHeadCode;
  if (typeof data === 'number' || typeof data === 'string') {
    data = {
      code: data,
      msg: Msg[data],
    };
  } else if (!data.code) {
    data = {
      code: Config.ok,
      msg: Msg[Config.ok],
      data
    };
  }

  if (data.code && !Msg[data.code] && data.msg) {
    Msg[data.code] = data.msg;
    fs.writeFileSync('./error.js', 'module.exports=' + JSON.stringify(Msg));
    // fs.writeFile('error.js', 'module.exports=' + JSON.stringify(Msg), (err) => {
    //   console.log(err);
    // });
  }

  data.time = new Date().getTime();

  res.writeHead(writeHeadCode || 200, {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    ...config,
  });
  let outString = JSON.stringify(data);
  if (writeHeadCode === 404) {
    outString = '<h1 style="color: red"><b><i>404 NOT FOUND!</i></b></h1>'
    // outString = ''
  } else if(writeHeadCode === 500){
    outString = data.data;

  }
  res.end(outString);
};
next.notFind = () => {
  next('', {
    writeHeadCode: 404,
    'Content-Type': 'text/html',
  });
};
next.error = (err) => {
  next(err, {
    writeHeadCode: 500,
    'Content-Type': 'text/html',
  });
};

const callback = async (api, data, fun) => {
  try {
    if (api[fun]) {
      let res = await api[fun](data, next);
      next(res);
    } else {
      next.notFind();
    }
  } catch (e) {
    next.error(e);
  }
};

http.createServer((req, res) => {
  let {body: data, url, headers, method, domain} = req;
  let path = url.slice(1).split('?')[0].split('/');
  let fun = 'index';
  let api = null;
  next.req = req;
  next.res = res;
  if (path.length === 3) {
    fun = path.pop() || fun;
  }

  try {
    api = require(Config.api + path.join('/') + '.js');
    api = new api();
  } catch (e) {
    next.notFind();
  }

  // 发送响应数据 "Hello World"
  // req  url,headers,method,domain,_readableState
  if (method === 'GET') {
    data = {};
    url.split('?').pop().split(/&+/).map(e => {
      let [k, v] = e.split('=');
      data[k] = v;
    });
    callback(api, data, fun);
  }
  req.on('data', params => {
    data = JSON.parse(params + '');
    callback(api, data, fun);
  });
  req.on('end', () => {
    console.log('end');
  });
  req.on('close', () => {
    console.log('close');
  });

}).listen(Config.port, () => {
  console.log('ok');
});
