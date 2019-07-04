// pages/enter2/enter2.js
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    count: [],
    datas: [],
    state: '',
    ids: '',
    name: '请选择客户...',
    hiddenmodalput: true
  },
  onLoad: function(options) {
    console.log(options)

    if (options.value !== undefined) {

      var value = JSON.parse(options.value)
      this.setData({
        state: value.state,
        ids: value.ids,
  
      })
    }
    if (options.name !== undefined) {
      var value = JSON.parse(options.name)
      var out = JSON.parse(value.out)
      console.log(value,out)
      this.setData({
        name: value.name,
        idp: value.id,
        hiddenmodalput: false,
        state: out.state,
        ids: out.ids,
        data: out.datas,
        count: out.count
      })
    }
    console.log(this.data)
    // console.log(this.data)
  },
  onShow: function() {
    const db = wx.cloud.database()
    var datas = [];
    // 查询当前用户所有的 counters
    var count = []
    this.data.ids.forEach(item => {
      db.collection('counters').where({
        _id: item
      }).get({
        success: res => {
          datas.push(res.data[0])
          this.setData({
            datas: datas,
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

      count.push(0)

      if(this.data.count.length==0){
        this.setData({
          count: count,
        })
  
      }
   
    })
  },
  click: function(e) {
    // console.log(e)
    var count = this.data.count;
    var target = e.target.id
    var index = e.currentTarget.dataset.index
    // console.log(target)
    if (target == 'add') {
      count[index]++
        this.setData({
          count: count
        })
    } else if (target == 'reduce') {
      if (count[index] > 0) {
        count[index]--
      }
      this.setData({
        count: count
      })
    } else if (target == 'delete') {
      count.splice(index, 1);
      var datas = this.data.datas
      datas.splice(index, 1)
      this.setData({
        count: count,
        datas: datas
      })
    }

  },
  right: function() {
    const newdata = this.data.datas

    if (this.data.state == '入库') {
      for (let i in newdata) {
        newdata[i].count += this.data.count[i]
      }
      this.payment()
      this.operate()
      this.button(newdata)
      wx.showToast({
        title: '药品入库成功',
      })
      wx.navigateBack({
        delta: 1
      })

    } else if (this.data.state == '出库') {
      for (let i in newdata) {
        newdata[i].count -= this.data.count[i]
      }
      this.setData({
        hiddenmodalput: false,
        datas: newdata
      })
    }

  },
  name: function() {
    const out = JSON.stringify({
      ids: this.data.ids,
      state: this.data.state,
      datas: this.data.datas,
      count:this.data.count
    })
    wx.navigateTo({
      url: '../customer/customer?out=' + out,
      success: function(res) {
        // success
      },
    })
  },
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  confirmM: function(e) {
    if (this.data.name == "请选择客户...") {
      wx.showToast({
        title: '请选择客户',
      })
    } else {
      this.payment()
      this.operate()
      this.button(this.data.data)
      wx.navigateBack({
        delta: 3
      })
    }

  },
  payment: function() {
    var newdata = {
      state: this.data.state,
      count:this.data.count,
      datas:this.data.datas,
      name :this.data.name,
      money:this.data.money,
      date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
    }
    const db = wx.cloud.database()
    db.collection('payment').add({
      data: newdata,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        if(this.data.state=="出库"){
        wx.showToast({
          title: '药品出库成功',
        })}else{
          wx.showToast({
            title: '药品入库成功',
          })
        }
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '药品出库失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  operate: function () {
    var newdata = {
      info: this.data.state,
      date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
    }
    const db = wx.cloud.database()
    db.collection('operate').add({
      data: newdata,
    })
  },
  button: function(newdata) {
    this.setData({
      datas: newdata
    })
    for (let i = 0; i < newdata.length; i++) {
      const db = wx.cloud.database()
      delete newdata[i]._openid
      var id = newdata[i]._id
      delete newdata[i]._id
      db.collection('counters').doc(id).update({ //根据id修改
        data: newdata[i],
        success: res => {
          console.log('[数据库] [修改记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }

  },
  money: function(e) {
    this.setData({
      money: e.detail.value
    })
  },


})