const express = require('express');
const next = require('next');
require('dotenv').config();
require('colors');
const _NODE_ENV = process.env.NODE_ENV;
const _PORT = process.env.PORT;
const _API = process.env.REACT_APP_API_URL;
// launch next in dev mode ?
const dev = _NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.get('*', (req, res) => handle(req, res));
  server.listen(_PORT, (err) => {
    if (err) throw err;
    console.log(`✅ you are in ${_NODE_ENV}`.green);
    console.log(`🤘 access url is http://localhost:${_PORT}`.green);
    console.log(`📡 you fire on ${_API}`.green)
  });
});
