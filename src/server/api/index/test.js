function index(data, next, obj = {}) {
  let value = {__methods: []};
  for (let i in obj) {
    try {
      value[i] = JSON.parse(JSON.stringify(obj[i]));
    } catch (e) {
      value.__methods.push(i);
    }
  }
  next(value);
}

module.exports = {
  req(data, next) {
    index(data, next, next.req);
  },
  res(data, next) {
    index(data, next, next.res);
  },
  index(data, next) {
    next(data);
  },
};