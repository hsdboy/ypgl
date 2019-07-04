Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: [],
    datas: '',
    content: '',
    queryResult: '',
    state: '',
    array:[],
    type:"全部"

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
    if (options.state == "1") {
      this.setData({
        state: '入库'
      })
    } else {
      this.setData({
        state: '出库'
      })
    }

  },
  onShow: function() {
    this.setData({
      ids: []
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').get({
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
  indexOf: function(val) { //查找指定的元素在数组中的位置
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) return i;
    }
    return -1;
  },

  choose: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var id = e.currentTarget.dataset.id;
    var item = "datas[" + index + "].success";
    var type = this.data.datas[index].success;
    var ids = this.data.ids;
    if (type !== 'success') {
      ids.push(id);
      this.setData({
        [item]: 'success',
        ids: ids
      })
    } else {
      var index = ids.indexOf(id); //通过这个元素的索引删除这个元素
      if (index > -1) {
        ids.splice(index, 1);
      }
      this.setData({
        [item]: '',
        ids: ids
      })
    }
    // console.log(ids)
  },
  right: function() {
    var state = this.data.state
    var ids = this.data.ids
    var value = JSON.stringify({
      state: state,
      ids: ids
    })
    if (this.data.ids != "") {
      wx.navigateTo({
        url: '../enter2/enter2?value=' + value,
        success: function(res) {
          // success
        },
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择药品'
      })
    }

  },
  search:function(e){
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
  bindPickerChange:function(e){
    var i = e.detail.value
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      type:this.data.array[i]
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