// npm i ws, install node module ws under this directory first then you can test ws
(function () {
  'use strict';
  const WebSocketServer = require('ws').Server;
  const ws = new WebSocketServer({
    port: 8282
  });
  ws.on('connection', function (ws) {
    console.log('client connected');
    // 接收到小游戏发送的数据所调用的方法
    ws.on('message', function (message) {
      console.log(message);
      ws.send('response from socket server');
    })
  })
})();
