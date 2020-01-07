import Canvas from './canvas'
import JSZip from 'jszip'

class T {
  /**
   * @desc 创建一个canvas对象
   * @param {Object/String} config 配置 $el: Dom
   * */
  createCanvas(config) {
    return new Canvas(config);
  }

  /**
   * @desc 判断一个对象是否为DOM对象
   * @func
   * @param {object} element - 要判断的对象或变量
   * @return {boolean}
   * */
  isDom(element) {
    return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';
  }

  /**
   * @desc 生成随机数字
   * @func
   * @param {number} [max]=1 - 最大值，默认值为1
   * @param {number} [min]=0 - 最小值，默认值为0
   * @param {number} [fixed]=0 - 小数点位数，默认值为0
   * @return {string}
   * */
  rNumber(max = 1, min = 0, fixed = 0) {
    max < min && (max = [min, min = max][0]);
    return (Math.random() * (max - min) + min).toFixed(fixed);
  }

  /**
   * @desc 生成随机字符串
   * @func
   * @param {number} [len]=1 - 字符串长度，默认值为1
   * @param {string} [type]='a' - 生成字符串包含字符类型（数字，字母（区分大小写），汉字），默认值为a
   * @param {string} [otherStr]='' - 除上术类型中字符类型外包含的字符
   * @param {boolean} [canRepeat]=true - 字符是否可以重复， 默认可以重复
   * @return {string}
   * @example
   * rString(3, '0a', '*') //生成的字符串长度为3，可能包含数字（type中有数字），小写字母（type中有小写字母）和‘*’号
   * */
  rString(len, type, otherStr, canRepeat = true) {
    typeof type !== 'string' && (type = 'a');
    if (typeof otherStr === 'string') {
      otherStr = otherStr.split('');
    } else if (Array.isArray(otherStr)) {
      otherStr = otherStr.filter(e => e && typeof e === 'string');
    } else {
      otherStr = [];
    }
    otherStr = otherStr.map(e => [e.charCodeAt(), e.charCodeAt()]);
    isNaN(len) && (len = 1);
    let str = [];
    let reg = {
      '[a-z]': [97, 122], // a-z
      '[A-Z]': [65, 90], // A-Z
      '[0-9]': [48, 57], // 0-9
      '[\u4e00-\u9fa5]': [19968, 40869], // 汉字
    };
    let regs = Object.keys(reg)
      .filter(k => new RegExp(k).test(type))
      .map(e => reg[e]);
    regs.push(...otherStr);
    for (let l = regs.length; len > 0 && l; len--) {
      let m = this.rNumber(l - 1, 0) | 0;
      let s = regs[m];
      let n = this.rNumber(s[1], s[0]) | 0;
      if (!canRepeat && (str.includes(s) || str.includes(String.fromCharCode(n)))) {
        len++;
        if (typeof s === 'string') {
          regs.splice(m, 1);
          l--;
        }
        continue;
      }
      str.push(typeof s === 'string' ? s : String.fromCharCode(n));
    }
    return str.filter(e => e).join('');
  }

  /**
   * @desc 生成随机颜色
   * @function
   * @param {number} [min]=0 - r,g,b值的最小值，默认为0
   * @param {number} [max]=255 - r,g,b值的最大值，默认为255
   * @param {string} [type]='hex' - 返回颜色值类型，可能值rgb | hex
   * @return {string/array}
   * @example
   * rColor() // [32, 23, 200]
   * */
  rColor(min = 0, max = 255, type = 'hex') {
    min > max && (min = [max, max = min][0]);
    min = min < 0 ? 0 : min;
    max = max > 255 ? 255 : max;
    let r = this.rNumber(max, min) | 0;
    let g = this.rNumber(max, min) | 0;
    let b = this.rNumber(max, min) | 0;
    return this.color2hex([r, g, b], type);
  }

  /**
   * @desc 颜色格式转换
   * @function
   * @param {string/array} color 颜色值或数组 （[r, g, b], color, #rrggbb, rgb(r, g, b)）
   * @param {string} [type]='hex' - 返回颜色值类型，可能值rgb | hex
   * @return {string/array}
   * @example
   * */
  color2hex(color, type = 'hex') {
    if (Object.prototype.toString.call(color) === '[object Array]') {
      color = `rgb(${color[0] || 0},${color[1] || 0},${color[2] || 0})`;
    }
    let r, g, b;
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    color = ctx.fillStyle;
    r = parseInt(color.slice(1, 3), 16).toString();
    g = parseInt(color.slice(3, 5), 16).toString();
    b = parseInt(color.slice(5), 16).toString();
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else if (type === 'hex') {
      return color;
    } else {
      return [r, g, b].map(e => +e);
    }
  }

  /**
   * @desc 改变颜色亮度
   * @function
   * @param {string/array} color 颜色值或数组 （[r, g, b], color, #rrggbb, rgb(r, g, b)）
   * @param {number/string} [light]=0 - 增加色值
   * @param {string} [type]='hex' - 返回颜色值类型，可能值rgb | hex
   * @return {string/array}
   * */
  changeColor(color, light = 0, type = 'hex') {
    color = this.color2hex(color, '').map(e => {
      e = +e + light;
      return e < 0 ? 0 : e > 255 ? 255 : e;
    });
    return this.color2hex(color, type);
  }

  /**
   * @desc 10位时间戳转化为年Y 月M 日D 时H 分m 秒s 毫秒S
   * @function
   * @params {number/date} number: 传入10位时间戳 / Date对象
   * @params {string} [format]：返回格式
   * @return {string}
   */
  formatDate(number, format = 'Y-MM-DD HH:mm:ss') {
    let time = number instanceof Date ? number : !isNaN(number) ? new Date(number * 1000) : false;
    let obj = {
      'Y': time.getFullYear(),
      'M': time.getMonth() + 1,
      'W': ['七', '一', '二', '三', '四', '五', '六'][time.getDay()],
      'w': time.getDay() || 7,
      'D': time.getDate(),
      'A': time.getHours() > 12 ? 'PM' : 'AM',
      'a': time.getHours() > 12 ? 'pm' : 'am',
      'H': time.getHours(),
      'h': time.getHours() % 12 || 12,
      'm': time.getMinutes(),
      's': time.getSeconds(),
      'S': time.getTime() % 1000,
    };
    format = format.replace(/([YMWDAHSwahms])\1*/g, e => e.length === 2 && !/[SaAWw]/g.test(e) ? ('00' + obj[e[0]]).slice(-2) : obj[e[0]]);
    return format;
  }

  /**
   * @desc 毫秒数转时间 (日D 时H 分m 秒s 毫秒S)
   * @param {number} number 要转换的毫秒数
   * @param {string} [format] 转换的格式
   * @return String
   * */
  numberToTime(number, format = 'HH:mm:ss') {
    number = isNaN(number) ? 0 : (number || 0);
    let regs = {
      S: number | 0,
      s: number / 1000 | 0,
      m: number / 1000 / 60 | 0,
      H: number / 1000 / 60 / 60 | 0,
      D: number / 1000 / 60 / 60 / 24 | 0,
    };
    // 保留要输出的最高位 如：防止 format = 'mm:ss' 时 '60:00' 变为 '00:00'
    if (format.indexOf('s') >= 0) regs.S %= 1000;
    if (format.indexOf('m') >= 0) regs.s %= 60;
    if (format.indexOf('H') >= 0) regs.m %= 60;
    if (format.indexOf('D') >= 0) regs.H %= 24;

    format = format.replace(/([smhd])\1*/ig, e => {
      let val = regs[e[0]] || 0;
      val += '';
      if (e.length === 2 && val.length < 2) {
        return e.indexOf('S') < 0 ? '0' + val : val.slice(0, 2);
      } else {
        return val;
      }
    });
    return format;
  }

  /**
   * 获取地址上 /？。。。#/ 间的数据
   * @param [key] 获取此字段的数据 不传返回包含所有数据的对象
   * */
  getQuery(key) {
    let query = {};
    location.search.slice(1).split('&').map(str => {
      let arr = str.split('=');
      arr[0] && (query[arr[0]] = arr[1]);
    });
    return key ? query[key] : query;
  }

  /**
   * base64图片转File对象
   * @param {string} baseStr: 图片base64编码
   * @param filename: 转换后文件名，true:生成随机名字
   * */
  base2img(baseStr, filename = true) {
    let arr = baseStr.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    filename === true && (filename = `file_${(Math.random() * 9999) | 0}.${mime.split('/')[1]}`);
    return new File([u8arr], filename, {type: mime});
  }

  /**
   * 图片转base64
   * @param file: 要编码的图片
   * @return: Promise
   * */
  img2base(file) {
    return new Promise(res => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = r => {
        res(r.target.result);
      };
    });
  }

  /**
   * @desc 数字格式化为货币形式 100000.5 -> 100,000.50
   * @func
   * @params {number/string} number 要格式化数字
   * @params {number} points 保留小数点位数
   * @params {number} count 整数部分每位长度
   * @params {string} separator 分隔符
   * @returns {string/number}
   * */
  moneyNumber(number = 0, points = 0, count = 3, separator = ',') {
    if (isNaN(number)) return number;
    let str = '';
    let point = (number % 1).toFixed(points).slice(1);
    number = Math.floor(number) + '';
    let y = count - number.length % count;
    number = separator.repeat(y) + number;
    str = number.match(new RegExp(`[^]{${count}}`, 'g'));
    str = str ? str.join(separator).split(separator).filter(e => !!e).join(separator) : '';
    return str + point;
  }

  /**
   * @desc 返回当前日期的相对时间段
   * @function
   * @params {number/string} val:
   *         类型 n(近n天) , tm(本月), ty(本年), nlm(前n月), nly(前n年), nm(近n月), ny(近n年)
   * @return {array} [start(00:00:00), end(23:59:59)]
   */
  typeToDate(val) {
    if (typeof val !== 'number' && typeof val !== 'string') return [,];
    let start = new Date();
    let end = new Date();
    let num = parseInt(val);
    if (!isNaN(val)) {
      // 近num天 num
      val && start.setDate(start.getDate() - num);
    } else if (/tm$/i.test(val)) {
      // 本月 tm
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (/ty$/i.test(val)) {
      // 本年 ty
      start.setMonth(0);
      start.setDate(1);
      end.setMonth(11);
      end.setDate(31);
    } else if (/l$/i.test(val)) {
      // 前num天 nl
      end.setDate(end.getDate() - 1);
      start.setDate(start.getDate() - num);
    } else if (/lm$/i.test(val)) {
      // 前num个月 nlm
      end.setDate(0);
      start.setMonth(start.getMonth() - num);
      start.setDate(1);
    } else if (/ly$/i.test(val)) {
      // 前num年 nly
      end.setMonth(-1);
      end.setDate(31);
      start.setFullYear(start.getFullYear() - num);
      start.setMonth(0);
      start.setDate(1);
    } else if (/m$/i.test(val)) {
      // 近num月 nm
      start.setMonth(start.getMonth() - num);
    } else if (/y$/i.test(val)) {
      // 近num年 ny
      start.setFullYear(start.getFullYear() - num);
    }
    let arr = [start, end];
    arr = arr.map((d, i) => new Date(this.formatDate(d, 'Y-M-D ' + (!i ? '00:00:00' : '23:59:59'))));
    return arr;
  }

  /**
   * 下载文件
   * @param {string} name 下载后文件名
   * @param {string} src 文件路径
   * */
  download(name, src) {
    let a = document.createElement('a');
    if (typeof src === 'string') {
      a.href = src;
    } else {
      a.href = URL.createObjectURL(src);
    }
    a.download = name || '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /**
   * 打包下载图片
   * @param {string} name 下载后文件名
   * @param {Array} srcList 文件路径
   * @param {array} names 图片名称列表
   * */
  zipDownload(name, srcList = [], names = []) {
    let zip = new JSZip();
    let count = 0;
    return new Promise((res, req) => {
      srcList.map((src, i) => {
        let image = new Image();
        image.src = src;
        image.onload = () => {
          let canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL();
          zip.file(names[i] || '', url.split(',').pop(), {base64: true});
          count++;
          if (count >= srcList.length) {
            zip.generateAsync({type: 'blob'}).then(content => {
              // see FileSaver.js
              res(content);
            });
          }
        }
      });
    });
  }

  /**
   * @desc 动态设置style css
   * @param {Array} classArr 样式表对象
   * @param {String} [scopedName] scoped时的名称 data-v-xxx
   * @param {String} [styleName] 新增样式表唯一标识
   * */
  addStyleSheet(classArr = [], scopedName = '', styleName = 'add-style-sheet') {
    let style = document.querySelector(`[${styleName}]`);
    if (!style) {
      style = document.createElement('style');
      style.setAttribute(styleName, '');
      style.type = 'text/css';
    }
    let html = style.innerHTML;
    classArr.map(obj => {
      let reg = new RegExp(`${obj.name}[${scopedName}]{`.replace(/[._\-[{\]\}]/gi, s => '\\' + s) + '[^}]*}', 'ig');
      html = html.replace(reg, '');
      html += `${obj.name}[${scopedName}]{`;
      obj.style && Object.keys(obj.style).map(key => {
        html += key.replace(/[A-Z]/g, s => '-' + s.toLocaleLowerCase()) + ':';
        html += obj.style[key] + ';';
      });
      html += '}';
    });
    style.innerHTML = html;
    document.getElementsByTagName('head')[0].appendChild(style);
    console.dir(style);
    return style;
  }
}

export default new T();