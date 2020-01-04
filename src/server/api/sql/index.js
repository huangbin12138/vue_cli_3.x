const DB = require('../../db');
let db = null;

module.exports = class {
  constructor(mysql) {
    db = new DB(mysql);
  }

  async getAllTable(data, next) {
    // select table_name from information_schema.tables where table_schema='当前数据库'
    let {name, columns} = data;
    db.table = 'information_schema.tables';
    name && db.and(`table_schema="${name}"`);
    return db.select(columns);
  }

  async getTableList(data, next) {
    let {table, condition, orderBy, groupBy} = data;
    db.table = table;
    return await db.select();
  }

  async createTable(data, next) {
    let {name, columns, remark, logName, admin_id} = data;
    db.clear();
    await db.setTableColumns(columns).createTable(name, remark);
    await this.addSqlLog({name: logName, sql: db.sql, admin_id});
  }

  async addSqlLog(data, next) {
    let row = {};
    ['admin_id', 'name', 'sql'].map(k => data[k] !== undefined && (row[k] = typeof data[k] === 'string' ? `"${data[k]}"` : data[k]));
    row.create_time = new Date() / 1000 | 0;
    return await db.insert(row);
  }

  async initLogTable(data, next) {
    let {name} = data;
    await db.dropTable(name);
    await this.createTable({
      name,
      remark: 'sql操作日志表',
      logName: '初始化操作日志表',
      columns: [
        {name: 'id', type: 'int', auth: '1100', defaultValue: null, remark: 'ID'},
        {name: 'admin_id', type: 'int', auth: '0001', defaultValue: 0, remark: '操作人id'},
        {name: 'name', type: 'varchar', length: 256, auth: '0001', defaultValue: '', remark: '操作名称'},
        {name: 'sql', type: 'varchar', length: 512, auth: '0001', defaultValue: '', remark: '操作sql语句'},
        {name: 'create_time', type: 'int', length: 10, auth: '0001', defaultValue: '', remark: '操作时间'},
      ]
    });
    db.clear();
    db.table = name;
    return await db.select();
  }

};