// miniprogram/pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取mine页面传来参数
    // console.log(options.data)
    if (options.data !== undefined) {
      var data = JSON.parse(options.data)
      this.setData({
        data: data,
        button: "确认修改",
        state: '1'
      })
    }
    console.log(this.data.data)
  },
  updown:function(){
   
  }
})