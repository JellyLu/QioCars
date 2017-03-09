const AV = require('./libs/av-weapp-min.js');

AV.init({
  appId: '7MQo5KknwNfx0fOOjN8OIewg-gzGzoHsz',
  appKey: '7JbMwtaL1I4ErgEvIIKiOHaU',
});

App({
  onLaunch: function () {

    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    this.loginWithLCAndWeapp()
  },

  loginWithLCAndWeapp: function () {
    AV.Promise.resolve(AV.User.current()).then(user =>
    user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user =>
    user ? user : AV.User.loginWithWeapp()
    ).then((user) => {
      this.judgeRole();
    this.globalData.user = user
  }).catch(error => console.error(error.message));
  },

  judgeRole: function () {
    var roleQuery = new AV.Query(AV.Role);
    roleQuery.equalTo('name', 'hr');
    roleQuery.equalTo('users', AV.User.current());
    roleQuery.find().then(function (results) {
      if (results.length > 0) {
        wx.setStorageSync('role', 'HR');
      } else {
        wx.setStorageSync('role', 'USER');

        // var refereeRole = new AV.Role('referee');
        var refereeRole = AV.Query(AV.Role);
        refereeRole.equalTo('name', 'referee');
        refereeRole.equalTo('user', AV.User.current())
            .find().then(function (results) {
          if (results.length = 0) {
            relation.add(AV.User.current());
          }
        });
        return refereeRole.save();
      }
    }).then().catch(function (error) {
    });
  },
//TODO: Understand Why It Uses Callback func here
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    user: null
  }
});