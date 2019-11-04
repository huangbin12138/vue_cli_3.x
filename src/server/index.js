const express = require("express");
const app = express();
const host = '127.0.0.1';
const port = 8000;

let data = {key: 'hello', value: 'world'};


app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => {
  res.send(JSON.stringify(req.query));
  // res.send(JSON.stringify(res));
});

app.listen(port, host, (req, res) => {
  console.log('hello word!');
});