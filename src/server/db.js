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
    this.condition = '';
    this.table = this.mysql.table;
    return this;
  }

  send(sql) {
    const conn = MYSQL.createConnection(this.mysql);
    conn.connect();
    console.log(sql || this.sql);
    return new Promise((res, req) => {
      conn.query(sql || this.sql, (e, r) => {
        if (e) {
          req({code: +e.sqlState || 50001, msg: e.sqlMessage.split(';')[0] || 'sql语句错误', data: e});
        } else {
          res(r);
        }
      });
      conn.end();
    });
  }

  createTable(name, COMMENT) {
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

      if (column.defaultValue) {
        column.defaultValue = `DEFAULT ${column.defaultValue}`;
      }
      if (column.remark) {
        column.remark = `COMMENT \'${column.remark}\'`;
      }

      columnsStr.push(`\`${column.name}\` ${type} ${auth} ${column.defaultValue || ''} ${column.remark || ''}`);
    });

    this.sql = `CREATE TABLE \`${name}\`(${columnsStr.join(',')})ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='${COMMENT || ''}'`;
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

  orderBy(by) {
    this.orderByStr = this.orderByStr || [];
    this.orderByStr.push(...by.replace(/^\s*|\s*$/ig, '').split(/\s*,\s*/ig));
  }

  groupBy(column) {
    this.groupByStr = column;
  }

  and(condition) {
    if (this.condition && condition) {
      this.condition = `(${this.condition}) AND (${condition})`;
    } else {
      this.condition = condition || '';
    }
    return this;
  }

  or(condition) {
    if (this.condition && condition) {
      this.condition = `(${this.condition}) OR (${condition})`;
    } else {
      this.condition = condition || '';
    }
    return this;
  }

  select(columns) {
    if (!columns) {
      columns = '*';
    } else {
      columns = columns.replace(/\s+/ig, ' AS ')
    }
    this.sql = `SELECT ${columns} FROM ${this.table}`;
    if (this.condition) {
      this.sql += ' WHERE ' + this.condition;
    }
    if (this.orderByStr && this.orderByStr.length) {
      this.sql += ' ORDER BY ' + this.orderByStr.join(',');
    }
    if (this.groupByStr) {
      this.sql += ' GROUP BY ' + this.groupByStr;
    }
    return this.send();
  }

  insert(columns) {
    let keys = [];
    let values = [];
    !Array.isArray(columns) && (columns = [columns]);
    columns.map(val => {
      keys.length || keys.push(...Object.keys(val).map(s => `\`${s}\``));
      values.push(`(${Object.values(val).join(',')})`);
    });
    this.sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES ${values.join(',')}`;
    return this.send();
  }

  update(columns) {
    let col = [];
    if (typeof columns === 'string') {
      col = columns;
    } else {
      Object.keys(columns).map(k => {
        col.push(`${k}=${columns[k]}`);
      });
      col = col.join(',');
    }
    this.sql = `UPDATE ${this.table} SET ${col}`;
    if (this.condition) {
      this.sql += ' WHERE ' + this.condition;
    }
    return this.send();
  }

  delete(table = this.table) {
    this.sql = `DELETE FROM ${table}`;
    if (this.condition) {
      this.sql += ' WHERE ' + this.condition;
    }
    return this.send();
  }

}

module.exports = DB;