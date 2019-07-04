Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    console.log(options)
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('payment').where({
      name: options.name
    }).get({
      success: res => {
        this.setData({datas:res.data})
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
})