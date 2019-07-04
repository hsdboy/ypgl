Page({

  /**
   * 组件的初始数据
   */
  data: {
    datas: {},
    hiddenmodalput: true,
    type: "",
    updata: false
  },
  onShow: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 guest
    db.collection('type').get({
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
  add: function() {
    this.setData({
      hiddenmodalput: false,
      updata: false
    })
  },
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  type: function(e) {
    this.setData({
      type: e.detail.value
    })
  },
  choose: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showActionSheet({
      itemList: ['编辑', '删除', ],
      success: function (res) {
        if (res.tapIndex == 0) { //详情         
          that.setData({
            hiddenmodalput: false,
            updata: true,
            id: id
          })
        } else if (res.tapIndex == 1) { //删除
          const db = wx.cloud.database()
          db.collection('type').doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              that.onShow()
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', err)
            }
          })
          var newdata = {
            info: "删除药品类型",
            date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
          }
          db.collection('operate').add({
            data: newdata,
          })
          this.onShow()
        }
      },

    })

  },
  confirmM: function(e) {
    const db = wx.cloud.database()
    var type = {
      name: this.data.type
    }


    if (this.data.updata) {
      db.collection('type').doc(this.data.id).update({ //根据id修改
        data: type,
        success: res => {
          wx.showToast({
            title: '修改记录成功',
          })
          console.log('[数据库] [修改记录] 成功，记录 _id: ', id)
          this.cancelM()
          this.onShow();
        },
        fail: err => {
          icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
      var newdata = {
        info: "修改药品类型",
        date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
      }
      db.collection('operate').add({
        data: newdata,
      })
    } else {
      db.collection('type').add({
        data: type,
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
        info: "添加药品类型",
        date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
      }
      db.collection('operate').add({
        data: newdata,
      })
    }
    this.onShow()
    this.setData({
      hiddenmodalput: true,
    })
  }
})