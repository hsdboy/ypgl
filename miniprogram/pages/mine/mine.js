Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: '',
    content: '',
    id: '',
    array: [],
    type: "全部"
  },
  onShow: function() {
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
    // 查询当前用户所有的 counters
    db.collection('counters').get({
      success: res => {
        this.setData({
          datas: res.data,
        })
        console.log(res)
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
    this.setData({
      id: e.currentTarget.dataset.id//1.让data.id=鼠标选中id
    })
    // console.log(this.data.id)
    // console.log(this.data.datas.find(this.get));
    var data = JSON.stringify(this.data.datas.find(this.get))//2.get方法获取对应id的对象
    // console.log(data)
    var that=this
    wx.showActionSheet({
      itemList: ['产看详情', '编辑药品', '删除'],
      success: function(res) {
        if (res.tapIndex == 0) {//详情
          wx.navigateTo({
            url: '../details/details?data=' + data,
            success: function (res) {
              // success
            },
          })
        }
        else if (res.tapIndex == 1) {//编辑
          wx.navigateTo({
            url: '../addmdc/addmdc?data=' + data,
            success: function(res) {
              // success
            },
          })
        } else if (res.tapIndex == 2) { //删除
          if (that.data.id) {
            const db = wx.cloud.database()
            db.collection('counters').doc(that.data.id).remove({
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
              info: "删除药品信息",
              date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate()
            }
            db.collection('operate').add({
              data: newdata,
            })
          } else {
            wx.showToast({
              title: '无记录可删，请见创建一个记录',
            })
          }
        }
      },
  
    })

  },

  search: function (e) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
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
  },
  bindPickerChange: function (e) {
    var i = e.detail.value
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      type: this.data.array[i]
    }).get({
      success: res => {
        this.setData({
          datas: res.data,
          type: this.data.array[i]
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