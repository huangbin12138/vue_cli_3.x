// import {redirect_uri, appid} from '../config/config'
import tools from './tools'
import http from './http'

let redirect_uri, appid;

export default {
  /**
   * 微信获取授权
   * @param {string} [path] 授权后重定向到的页面/路由
   * @param [to] 不为false时直接跳转
   * */
  getAuth(path, to) {
    let url = redirect_uri;
    if (/^https?/.test(path)) {
      // 完整路径跳转
      url = path;
    } else {
      // 路由跳转
      url += path || '/';
    }
    url = encodeURIComponent(url);
    url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    to !== false && (location.href = url);
    return url;
  },

  /**
   * 获取微信用户信息
   * @param {string} [path] 授权后重定向到的页面/路由
   * */
  async getUserInfo(path) {
    let query = tools.getQuery();
    if (!query.state) {
      this.getAuth(path);
      throw 0; // 未授权
    } else if (!query.code) {
      throw 1; // 用户取消授权
    } else {
      // 已经授权
      return await http.getWxUserInfo({code: query.code});
    }
  },


  /**
   * 刷新页面
   * key 保存storage时使用的key
   * @return
   * */
  reload(key = 'reload') {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return false;
    } else {
      localStorage.setItem(key, '1');
      let url = location.href;
      if (!/\?(.+)?#/.test(url)) {
        url = url.replace('#', '?#');
      } else {
        url = url.replace(/(&\d{13})?#/i, `&${new Date().getTime()}#`);
      }
      location.replace(url);
      return true;
    }
  },

  /**
   * 调用sdk时配置config
   * @param {array} jsApiList wx.config时jsApiList
   * @param [product_id] 产品id
   * */
  setConfig(jsApiList = [], product_id = 0){
    let url = location.href.split('#')[0];
    return http.setWxConfig({
      url,
      product_id,
    }).then(res => {
      res = res.sign;
      let wxConfig = {
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.app_id, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.noncestr, // 必填，生成签名的随机串
        signature: res.sign, // 必填，签名
        jsApiList // 必填，需要使用的JS接口列表
      };
      wx.config(wxConfig);
      return res;
    });

  },

}