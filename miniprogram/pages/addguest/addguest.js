Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [], //单个药品详情 
    button: "确认新增",
    state: '0'
  },
  onLoad: function (options) {
    //获取mine页面传来参数
    // console.log(options.data)
    if (options.data !== undefined) {
      var data = JSON.parse(options.data)
      this.setData({
        datas: data,
        button: "修改",
        state: '1'
      })
    }
    // console.log(this.data.datas)
  },
  addguest: function(e) {
    var id = e.detail.value._id;
    var data = {
      name: e.detail.value.name,
      first: e.detail.value.first,
      phone: e.detail.value.phone,
      address: e.detail.value.address,
      money: parseInt(e.detail.value.money),
    }
    if (this.data.state == 1) {
      const db = wx.cloud.database()
      db.collection('guest').doc(id).update({//根据id修改
        data: data,
        success: res => {
          wx.showToast({
            title: '修改记录成功',
          })
          console.log('[数据库] [修改记录] 成功，记录 _id: ', res._id)

        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
      var newdata = {
        info: "修改客户信息",
        date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
      }
      db.collection('operate').add({
        data: newdata,
      })
    }else{

   
    if (e.detail.value.name) { //添加新客户
      const db = wx.cloud.database()
      db.collection('guest').add({
        data: data,
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
      var newdata = {
        info: "添加客户信息",
        date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
      }
      db.collection('operate').add({
        data: newdata,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入客户姓名'
      })
    }
    }
  }
})