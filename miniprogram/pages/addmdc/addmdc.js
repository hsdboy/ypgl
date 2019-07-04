// miniprogram/pages/addmdc/addmdc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {type:""}, //单个药品详情 
    button: "确认新增",
    state: '0',
    array: []
  },
  onLoad: function(options) {
    var array = []
    const db = wx.cloud.database()
    // 查询当前用户所有的 guest
    db.collection('type').get({
      success: res => {
        res.data.forEach(item => {
          array.push(item.name)
        })
        this.setData({ array })
        console.log(this.data.array)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    //获取mine页面传来参数
    // console.log(options.data)
    if (options.data !== undefined) {
      var data = JSON.parse(options.data)
      this.setData({
        datas: data,
        button: "确认修改",
        state: '1'
      })
    }
    // console.log(this.data.datas)
  },
  bindPickerChange: function (e) {
   var datas=this.data.datas
   datas.type=this.data.array[e.detail.value]
   this.setData({datas})
   console.log(this.data)
  },
  addmdc: function(e) {
    console.log(e)
    var id=e.detail.value._id;
    var data = {
      name: e.detail.value.name,
      code: e.detail.value.code,
      foctor: e.detail.value.foctor,
      type: e.detail.value.type,
      number: e.detail.value.number,
      unit: e.detail.value.unit,
      stock: e.detail.value.stock,
      retail: e.detail.value.retail,
      count: parseInt(e.detail.value.count)
    }
    if (this.data.state==1) {
      const db = wx.cloud.database()
      db.collection('counters').doc(id).update({//根据id修改
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
        info: "修改药品信息",
        date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
      }
      db.collection('operate').add({
        data: newdata,
      })
    } else {
      if (e.detail.value.name) { //添加新药品
        const db = wx.cloud.database()
        db.collection('counters').add({
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
          info: "增加药品信息",
          date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
        }
        db.collection('operate').add({
          data: newdata,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入产品名称'
        })
      }

    }
  }
})