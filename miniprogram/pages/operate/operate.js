Page({

  /**
   * 页面的初始数据
   */
  data: {
      datas:[],
      data:[],
    ji1: "",
    ji2: "jil",
    ji0:"",
    date: new Date().getTime()
  },
  onLoad: function () {


    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('operate').get({
      success: res => {
        this.setData({ datas: res.data,data:res.data })
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
  month: function () {
    var data=[]
    this.data.datas.forEach(item=>{
      var date=new Date(item.date).getTime()
      if(this.data.date-date<2592000000){
        data.push(item)
        console.log(item)
      }
    })
    this.setData({
      ji1: "jil", ji2: "",ji0:"",
      data:data
    })
    this.onShow()
  },
  week: function () {
    var data = []
    this.data.datas.forEach(item => {
      var date = new Date(item.date).getTime()
      if (this.data.date - date < 604800000) {
        data.push(item)
      }
    })

    this.setData({
      ji1: "", ji2: "", ji0:"jil",
      data:data
    })

    this.onShow()
  },
  all: function () {
    this.setData({
      ji1: "", ji2: "jil",ji0:"",
      data:this.data.datas
    })
    this.onShow()
  }
})