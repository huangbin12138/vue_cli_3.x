/**
 * 全局方法
 * */

export default {
  /**
   * 10位时间戳转化为年Y 月M 日D 时H 分m 秒s 毫秒S
   * number: 传入10位时间戳 / Date对象
   * format：返回格式
   */
  formatTime(number, format = 'Y-MM-DD HH:mm:ss') {
    let date = number instanceof Date ? number : !isNaN(number) ? new Date(number * 1000) : false;
    let regs = {};
    if (date !== false) {
      regs = {
        'Y': date.getFullYear(),
        'M': date.getMonth() + 1,
        'D': date.getDate(),
        'd': ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        'H': date.getHours(),
        'm': date.getMinutes(),
        's': date.getSeconds(),
        'S': date.getTime() % 1000 + '000',
      };
    }
    format = format.replace(/[ymdhs]+/ig, e => {
      let val = regs[e[0]] || 0;
      if (e.length === 2 && !/[Sd]/.test(e)) {
        return ('00' + val).slice(-2);
      } else if (/S/.test(e)) {
        return val.slice(0, e.length);
      } else {
        return val;
      }
    });
    return format;
  },

  /**
   * 毫秒数转时间 (日D 时H 分m 秒s 毫秒S)
   * number 要转换的毫秒数
   * isS 是否为毫秒数
   * format 转换的格式
   * */
  numberToTime(number, format = 'HH:mm:ss') {
    number = isNaN(number) ? 0 : number * 1;
    let regs = {
      S: number % 1000 | 0,
      s: (number / 1000 | 0) % 60,
      m: (number / 1000 / 60 | 0) % 60,
      H: (number / 1000 / 60 / 60 | 0) % 24,
      D: number / 1000 / 60 / 60 / 24 | 0,
    };
    console.log(regs);
    format = format.replace(/[smhd]+/ig, e => {
      let val = regs[e[0]] || '0';
      if (e.length === 2 && !/[Sd]/.test(e)) {
        return ('00' + val).slice(-2);
      } else if (/S/.test(e)) {
        val += '000';
        return val.slice(0, e.length);
      } else {
        return val;
      }
    });
    return format;
  },
}