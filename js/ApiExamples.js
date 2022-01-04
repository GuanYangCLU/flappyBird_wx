export class ApiExamples {
  getUserInfo() {
    const params = {
      success: function (res) {
        console.log(res);
      }
    };
    wx.getUserInfo(params);
  }

  login() {
    wx.login({
      success: function (res) {
        console.log(res);
      }
    });
  }

  getSettings() {
    wx.getSetting({
      success: function (res) {
        console.log(res);
      }
    });
  }

  httpExample() {
    wx.request({
      url: 'http://127.0.0.1:8181/',
      method: 'POST',
      data: 'MyData',
      success: function (response) {
        console.log(response);
        // 可以在这里根据服务器的指示做相应的操作
      }
    });
  }

  socketExample() {
    wx.connectSocket({
      // NOT Http
      url: 'ws://127.0.0.1:8282',
      success: function () {
        console.log('client connect successfully')
      }
    });

    // 注意 发送数据必须在wx.onSocketOpen中进行
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: 'real time message from the client'
      });
      wx.onSocketMessage(function (message) {
        console.log(message);
      })
    });
  }

  download() {
    wx.downloadFile({
      url: '',
      success: function (temp) {
        console.log(JSON.stringify(temp));
      }
    });
  }
}
