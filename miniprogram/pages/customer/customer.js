Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: '',
    content: '',
    id: '',
    hiddenmodalput: true,
    out: false
  },
  onLoad: function(options) {
    if (options.out !== undefined) {
      const out = options.out
      this.setData({
        out: out
      })
      console.log(out)
    }

  },
  onShow: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 guest
    db.collection('guest').get({
      success: res => {
        this.setData({
          datas: res.data,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  get: function(item) {
    return item._id == this.data.id
  },

  choose: function(e) {
    if (this.data.out) {
      var name = JSON.stringify({
        id: e.currentTarget.dataset.id,
        name: e.currentTarget.dataset.name,
        out:this.data.out
      })
      wx.navigateTo({
        url: '../enter2/enter2?name=' + name,
        success: function(res) {
          // success
        },
      })
    } else {
      console.log(e)
      this.setData({
        id: e.currentTarget.dataset.id //1.让data.id=鼠标选中id
      })
      var name = this.data.datas.find(this.get).name
      var data = JSON.stringify(this.data.datas.find(this.get)) //2.get方法获取对应id的对象
      var that = this
      wx.showActionSheet({
        itemList: ['查看详情', '收款', '收款记录'],
        success: function(res) {
          console.log(data)
          if (res.tapIndex == 0) { //详情
            wx.navigateTo({
              url: '../addguest/addguest?data=' + data,
              success: function(res) {
                // success
              },
            })
          } else if (res.tapIndex == 1) { //收款
            that.setData({
              hiddenmodalput: false
            })
          } else if (res.tapIndex == 2) { //收款详情
            wx.navigateTo({
              url: '../payment/payment?name='+name,
              success: function(res) {
                // success
              },
            })
          }
        },

      })
    }


  },
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  confirmM: function(e) {
    var newdata = []
    var peyment=[]
    for (let i in this.data.datas) {
      if (this.data.id == this.data.datas[i]._id) {
        peyment = this.data.money
        this.data.datas[i].money -= this.data.money
        newdata = this.data.datas[i]
      }
    }
    const db = wx.cloud.database()
    delete newdata._openid
    var id = newdata._id
    delete newdata._id
    db.collection('guest').doc(id).update({ //根据id修改
      data: newdata,
      success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        console.log('[数据库] [修改记录] 成功，记录 _id: ', res._id)
        this.cancelM()
        this.onShow();
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
    newdata.money=peyment
    newdata.date = new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate(),
    db.collection('payment').add({
      data: newdata,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    var newdata2 = {
      info: "收款",
      date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
    }
    db.collection('operate').add({
      data: newdata2,
    })
  },

  money: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  add: function() {
    wx.navigateTo({
      url: '../addguest/addguest',
      success: function(res) {
        // success
      },
    })
  },
  search: function (e) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('guest').where({
      // name: _name,
      name: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).get({
      success: res => {
        this.setData({
          datas: res.data,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})