//引入mysql模块
const MYSQL = require('mysql');

class DB {
  constructor(mysql = {}) {
    this.mysql = Object.assign({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'my_db',
      defaultCharLength: 32,
      port: '3306'
    }, mysql);
    this.sql = '';
    this.table = mysql.table;
  }

  clear() {
    this.sql = '';
    return this;
  }

  send() {
    const conn = MYSQL.createConnection(this.mysql);
    conn.connect();
    return new Promise((res, req) => {
      conn.query(this.sql, (e, r) => {
        if (e) {
          req({code: 50001, msg: 'sql语句错误', data: e});
          // req({code: 50001, msg: 'sql语句错误', data: e.sqlMessage});
        } else {
          res(r);
        }
      });
      conn.end();
    });
  }

  createTable(name) {
    this.table = name;
    this.columns = this.columns || [];
    let columnsStr = [];
    this.columns.map(column => {
      let type = column.type.toLocaleUpperCase();
      let auth = '';
      let authStr = '0000';
      switch (type) {
        case 'INT':
          column.length && (type += `(${column.length})`);
          break;
        case 'VARCHAR':
        case 'CHAR':
          type += `(${column.length || this.mysql.defaultCharLength})`;
          break;
      }
      if (column.auth) {
        authStr += column.auth;
        authStr = authStr.slice(-4);
        !!+authStr[0] && (auth += 'PRIMARY KEY'); // 1*** 主键
        !!+authStr[1] && (auth += ' AUTO_INCREMENT'); // *1** 自增
        !!+authStr[2] && (auth += ' UNIQUE'); // **1* 唯一
        !!+authStr[3] && (auth += ' NOT NULL'); // ***1 非空
      }

      columnsStr.push(`${column.name} ${type} ${auth}`);
    });

    this.sql = `CREATE TABLE ${name}(${columnsStr.join(',')})ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    return this.send();
  }

  dropTable(name) {
    this.sql = 'DROP TABLE IF EXISTS ' + name;
    return this.send();
  }

  setTableColumn(name, type, auth, length, defaultValue, remark) {
    this.columns = this.columns || [];
    this.columns.push({name, type, auth, length, defaultValue, remark});
    return this;
  }

  setTableColumns(columns) {
    columns.map(column => this.setTableColumn(column.name, column.type, column.auth, column.length, column.defaultValue, column.remark));
    return this;
  }

  and(condition) {
    if (this.condition && condition) {
      this.condition = `(${this.condition}) && (${condition})`;
    } else {
      this.condition = condition || '';
    }
    return this;
  }

  or(condition) {
    if (this.condition && condition) {
      this.condition = `(${this.condition}) || (${condition})`;
    } else {
      this.condition = condition || '';
    }
    return this;
  }

  select(columns) {
    if (!columns) {
      columns = '*';
    } else {
      columns = `(${columns.replace(/\s+/ig, ' AS ')})`
    }
    this.sql = `SELECT ${columns} FROM ${this.table}`;
    if (this.condition) {
      this.sql += ' WHERE ' + this.condition;
    }
    return this.send();
  }

}

module.exports = DB;