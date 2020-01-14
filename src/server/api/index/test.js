function index(data, next, obj = {}) {
  let value = {__methods: []};
  for (let i in obj) {
    try {
      value[i] = JSON.parse(JSON.stringify(obj[i]));
    } catch (e) {
      value.__methods.push(i);
    }
  }
  return value;
}

module.exports = class {
  async req(data, next) {
    return index(data, next, next.req);
  }

  res(data, next) {
    return index(data, next, next.res);
  }

  index(data, next) {
    return data;
  }
};