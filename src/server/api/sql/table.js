const DB = require('../../db');

module.exports = class {
  async index(data, next) {
    try {
      let db = new DB({table: 'test_1'});
      // await db.insert([{name: '\'hello\'', remark: '\'world\''}, {name: '\'aaa\'', remark: '\'bbb\''}]);
      // await db.and('name=\'aaa\'').or('name=\'hello\'').delete();
      await db.dropTable('test_1');
      let r = await db.clear().select();
      next && next(r);
    } catch (e) {
      next && next.error(e);
    }
  }
};