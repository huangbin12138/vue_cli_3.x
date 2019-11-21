import md5 from './md5';
import JSON from './json';
import Base64 from './base64';

var sign = {
  params: {},
  video_params: {},
  sign: "",
  video_sign: "",
  video_key: "video_key",
  api_key: "x67K6YxCHCRHpYN4E8k39vA4tL5H94A4",

  //接口签名生成
  create_sign: function () {
    var newkey = Object.keys(this.params).sort();
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
      //遍历newkey数组
      newObj[newkey[i]] = this.params[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    var _params = newObj;
    _params = this.implode(",", _params);
    _params = _params + this.api_key;
    _params = Base64.Base64._utf8_encode(_params);
    this.sign = "";
    this.sign = md5.hex_md5(_params);
    return this.sign;
  },

  //创建data数据
  create_data: function () {
    var _params = this.params;
    // 添加公共参数
    // _params.AAPICOM_NAME = 'waiyutong';
    // _params.AAPICOM_KEY = '2hcwiwgr05y2jy0r9bn15bzdtl';
    _params = this.json_decode(_params);
    return Base64.Base64.encode(_params);
  },

  //字符串转json
  json_encode: function (str) {
    return JSON.parse(str);
  },

  //json转字符串
  json_decode: function (json) {
    return JSON.stringify(json);
  },

  //实现PHP的implode功能
  implode: function (glue, data) {
    // var glue = glue || ',';
    var retVal = new Array();
    var str = '';
    for (var i in data) {
      if (!data[i] && data[i] != '0' || data[i] === '' || data[i].length === 0) {
        continue;
      }
      if (typeof(data[i]) == 'object') {
        retVal.push(this.implode(glue, data[i]));
      } else {
        retVal.push(data[i]);
      }
    }
    if (!retVal == '') {
      for (var j in retVal) {
        str = str + retVal[j] + glue;
      }
    }
    if (str != '') {
      str = str.substr(0, str.length - 1);
    }
    // console.log(str);
    return str;
  },

  /**
   * base64编码
   * @param {Object} str
   */
  base64_encode: function (str) {
    return Base64.Base64.encode(str);
  },

  /**
   * base64解码
   * @param {Object} str
   */
  base64_decode: function (str) {
    return Base64.Base64.decode(str);
  },

  //生成请求组合参数
  encode_post: function () {
    var _prarams = this.create_data();

    var _sign = this.create_sign();
    var _data = {data: _prarams, sign: _sign};
    _data = JSON.stringify(_data);
    return _data;
  },


  //解密数据
  decode_post: function (data) {
    var _prarams = data.data;
    var _sign = data.sign;
    _prarams = Base64.Base64.decode(_prarams);
    _prarams = this.json_encode(_prarams);
    return _prarams;
  }
};

//暴露出口
export default {
  sign: sign,
  create_sign: sign.create_sign,
  implode: sign.implode,
  base64_encode: sign.base64_encode,
  base64_decode: sign.base64_decode,
  json_encode: sign.json_encode,
  json_decode: sign.json_decode,
  create_data: sign.create_data,
  encode_post: sign.encode_post,
  decode_post: sign.decode_post,
  api_key: sign.api_key,
  create_video_sign: sign.create_video_sign,
  unicode: sign.unicode
};
