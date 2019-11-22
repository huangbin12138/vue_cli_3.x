class Canvas {
  constructor(config) {
    this.$unit = config.unit || 'px';
    let $el = config.$el || document.createElement('div');
    $el.innerHTML = '';
    let $canvas = document.createElement('canvas');
    let $cxt = $canvas.getContext('2d');
    $canvas.width = $el.offsetWidth || $canvas.width;
    $canvas.height = $el.offsetHeight || $canvas.height;
    $cxt.save();

    $cxt.fillStyle = config.background;
    config.background && $cxt.rect(0, 0, $canvas.width, $canvas.height);
    $cxt.fill();

    $cxt.restore();

    $el.appendChild($canvas);
    Object.defineProperties(this, {
      $el: {value: $el},
      $canvas: {value: $canvas},
      $cxt: {value: $cxt},
      $config: {value: config},
      $history: {value: []},
      $id: {value: $el.id || config.id || ('cvs_' + (Math.random() * 10000 | 0))},
    });
  }

  clear(){
    let $cxt = this.$cxt;
    let $canvas = this.$canvas;
    let config = this.$config;
    $cxt.clearRect(0, 0, $canvas.width, $canvas.height);
    $cxt.save();

    $cxt.fillStyle = config.background;
    config.background && $cxt.rect(0, 0, $canvas.width, $canvas.height);
    $cxt.fill();

    $cxt.restore();
  }

  saveHistory(arr, fn, type) {
    if (Array.isArray(arr)) {
      this.$history.length = 0;
      this.$history.push(...arr);
    } else if (arr) {
      this.$history.push(Object.assign({$fn: fn, $type: type}, arr));
    }
  }

  pic(type, obj, fn) {
    if (type === false) return;
    obj && this.saveHistory(obj, fn, type);
    let types = ['stroke', 'fill', 'all'];
    type = typeof types[type] === 'string' ? types[type] : type || 'stroke';
    let cxt = this.$cxt;
    if (type === 'all') {
      cxt.fill();
      cxt.stroke();
    } else {
      cxt[type]();
    }
  }

  arc(obj = {}, type = 'stroke') {
    let {r, x, y, color, s, e, direction, close, fColor, sColor} = obj;
    let cxt = this.$cxt;
    s = s || 0;
    e = e || 360;
    s = s / 180 * Math.PI;
    e = e / 180 * Math.PI;
    cxt.save();
    cxt.fillStyle = fColor || color;
    cxt.strokeStyle = sColor || color;
    cxt.beginPath();
    cxt.arc(x, y, r, s, e, !!direction);
    close && cxt.closePath();
    this.pic(type, obj, 'arc');
    cxt.restore();
    return obj;
  }

  line(obj = {}, type = 'stroke') {
    let {points, close, color, fColor, sColor} = obj;
    let cxt = this.$cxt;
    cxt.save();
    cxt.fillStyle = fColor || color;
    cxt.strokeStyle = sColor || color;
    cxt.beginPath();
    points && typeof points.map === 'function' && points.map((point, i) => {
      typeof point === 'number' && (point = [point, point]);
      cxt[!i ? 'moveTo' : 'lineTo'](point[0], point[1]);
    });
    close !== false && cxt.closePath();
    this.pic(type, obj, 'line');
    cxt.restore();
    return obj;
  }

  regularPolygon(obj = {}, type = 'stroke') {
    typeof obj === 'number' && (obj = {
      count: obj,
    });
    let {count, color, r, l, a, x, y, angle} = obj;
    count = count < 3 ? 3 : count || 3;

    a = a || (l / count);
    r = r || (a / 2 / Math.sin(Math.PI / count));
    a = r * 2 * Math.sin(Math.PI / count);
    let points = [];
    let deg = 360 / count;
    angle = angle || 0;
    for (let d = angle; points.length < count; d += deg) {
      let v = d / 180 * Math.PI;
      points.push([
        x + r * Math.cos(v), // x
        y + r * Math.sin(v), // y
      ]);
    }

    this.line({
      points,
      ...obj,
    }, type);
    return {
      points,
      ...obj,
    };
  }

  stars(obj = {}, type = 'stroke') {
    typeof obj === 'number' && (obj = {
      count: obj,
    });

    let {count, color, r, l, a, x, y, angle, hollow, type: t} = obj;
    count = count < 3 ? 3 : count || 3;
    let ang = Math.PI / count / 2;
    a = a || (l / count);
    r = r || (a / 2 / Math.sin(ang));
    a = r * 2 * Math.sin(ang);

    let {points} = this.regularPolygon(obj, false);
    let {points: pointsInner} = this.regularPolygon({
      ...obj, ...{
        // r = R*t(a)/(s(2a)+c(2a)t(a));
        r: r * Math.tan(ang) / (Math.sin(2 * ang) + Math.cos(2 * ang) * Math.tan(ang)),
        angle: angle + (180 / count)
      }
    }, t === 'hollow' ? '' : false);
    let res = [];
    for (let i = 0; i < count; i++) {
      if (t === 'line') {
        if (count % 2) {
          res.push(points[i * (1 + count / 2 | 0) % count]);
        } else {
          res.push(points[i]);
          res.push(pointsInner[i]);
          if (i < count / 2) {
            this.line({
              points: [pointsInner[i], pointsInner[i + count / 2]],
              ...obj,
            });
          }
        }
      } else {
        res.push(points[i]);
        res.push(pointsInner[i]);
      }
    }
    this.line({
      points: res,
      ...obj,
    }, type);
    return {
      points: res,
      ...obj,
    };
  }

  getSrc(type = 'png', x = 0, y = 0, w, h) {
    let canvas = document.createElement('canvas');
    let cxt = canvas.getContext('2d');
    w = w || (this.$canvas.width - x);
    h = h || (this.$canvas.height - y);
    canvas.width = w;
    canvas.height = h;
    cxt.putImageData(this.$cxt.getImageData(x, y, w, h), 0, 0, 0, 0, w, h);
    return canvas.toDataURL('image/' + type);
  }

  downloadImg(name, type, x, y, w, h) {
    let a = document.createElement('a');
    if (arguments.length === 3) {
      a.href = x;
    } else {
      a.href = this.getSrc(type, w, y, w, h);
    }
    a.download = name || '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

}

export default Canvas;