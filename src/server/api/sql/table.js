const DB = require('../../db');

async function insert(data, next) {
  try {
    let {table, value} = data;
    let keys = [];
    let values = [];
    value.map(val => {
      keys.length || keys.push(Object.keys(val));
      values.push(`(${Object.values(val).join(',')})`);
    });
    let res = await send(`INSERT INTO ${table} (${keys.join(',')}) VALUES ${values.join(',')}`);
    next && next(res);
  } catch (e) {
    next && next.error(e);
  }
}

async function update(data, next) {
  try {
    let {table, value} = data;
    let keys = [];
    let values = [];
    value.map(val => {
      keys.length || keys.push(Object.keys(val));
      values.push(`(${Object.values(val).join(',')})`);
    });
    let res = await send(`UPDATE ${table} SET ${value} WHERE ${values.join(',')}`);
    next && next(res);
  } catch (e) {
    next && next.error(e);
  }
}

async function index(data, next) {
  try {
    let db = new DB({table: 'test_1'});
    let res = await db.and('id <= 2').select();
    next && next(res);
  } catch (e) {
    next && next.error(e);
  }
}


module.exports = {
  index,
};