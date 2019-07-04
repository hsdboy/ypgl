import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function getDate(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  var d = dd.getDate();
  return y + '-' + m + '-' + d;
}

function initChart(canvas, width, height) {
  const db = wx.cloud.database()
  // 查询当前用户所有的 counters
  var date = []
  var incount = [];
  var outcount = [];
  var inmoney = [];
  var outmoney = [];
  var option = {
    title: {
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3"],
    legend: {
      data: ['入库数量', '出库数量'],
      top: 50,
      left: 'center',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '入库数量',
      type: 'line',
      smooth: true,
      data: incount
    }, {
      name: '出库数量',
      type: 'line',
      smooth: true,
      data: outcount
    }]
  };
  for (let i = -6; i < 1; i++) {
    incount.push(0)
    outcount.push(0)
    inmoney.push(0)
    outmoney.push(0)
    date.push(getDate(i))
    db.collection('payment').where({
      date: getDate(i)
    }).get({
      success: res => {
        res.data.forEach(item => {
          if (item.state !== undefined && item.datas.length > 0) {
            if (item.state == "入库") {
              for (var j = 0; j < item.count.length; j++) {
                incount[6 + i] += item.count[j]
                inmoney[6 + i] += item.count[j] * Number(item.datas[j].stock)
              }
            } else if (item.state == "出库") {
              for (var j = 0; j < item.count.length; j++) {
                outcount[6 + i] += item.count[j]
                outmoney[6 + i] += item.count[j] * Number(item.datas[j].retail)
              }
            }
          }

        })
        console.log(incount, outcount)
        chart.setOption(option);
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
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}

function initChart1(canvas, width, height) {
  const db = wx.cloud.database()
  // 查询当前用户所有的 counters
  var date = []
  var incount = [];
  var outcount = [];
  var inmoney = [];
  var outmoney = [];
  var option = {
    title: {
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3"],
    legend: {
      data: ['入库金额', '出库金额'],
      top: 50,
      left: 'center',

      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '入库金额',
      type: 'line',
      smooth: true,
      data: inmoney
    }, {
      name: '出库金额',
      type: 'line',
      smooth: true,
      data: outmoney
    }]
  };
  for (let i = -6; i < 1; i++) {
    incount.push(0)
    outcount.push(0)
    inmoney.push(0)
    outmoney.push(0)
    date.push(getDate(i))
    db.collection('payment').where({
      date: getDate(i)
    }).get({
      success: res => {
        res.data.forEach(item => {
          if (item.state !== undefined && item.datas.length > 0) {
            if (item.state == "入库") {
              for (var j = 0; j < item.count.length; j++) {
                incount[6 + i] += item.count[j]
                inmoney[6 + i] += item.count[j] * Number(item.datas[j].stock)
              }
            } else if (item.state == "出库") {
              for (var j = 0; j < item.count.length; j++) {
                outcount[6 + i] += item.count[j]
                outmoney[6 + i] += item.count[j] * Number(item.datas[j].retail)
              }
            }
          }

        })
        console.log(incount, outcount)
        chart.setOption(option);
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
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    incount: [],
    outcount: [],
    inmoney: [],
    outmoney: [],
    ji1: "jil",
    ji2: "",
    count: 0,
    money: "100%",
    ec: {
      onInit: initChart
    },
    em: {
      onInit: initChart1
    }
  },
  onLoad: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    var incount = [];
    var outcount = [];
    var inmoney = [];
    var outmoney = [];
    for (let i = -6; i < 1; i++) {
      incount.push(0)
      outcount.push(0)
      inmoney.push(0)
      outmoney.push(0)
      db.collection('payment').where({
        date: this.getDate(i)
      }).get({
        success: res => {
          res.data.forEach(item => {
            if (item.state !== undefined && item.datas.length > 0) {
              if (item.state == "入库") {
                for (var j = 0; j < item.count.length; j++) {
                  incount[6 + i] += item.count[j]
                  inmoney[6 + i] += item.count[j] * Number(item.datas[j].stock)
                }
              } else if (item.state == "出库") {
                for (var j = 0; j < item.count.length; j++) {
                  outcount[6 + i] += item.count[j]
                  outmoney[6 + i] += item.count[j] * Number(item.datas[j].retail)
                }
              }
            }

          })
          console.log(incount, outcount)
          this.setData({
            incount: this.addattr(incount),
            outcount: this.addattr(outcount),
            inmoney: this.addattr(inmoney),
            outmoney: this.addattr(outmoney)
          })
          console.log(this.data)
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

  },
  addattr: function(attr) {
    var all = 0
    attr.forEach(item => {
      all += item
    })
    return all
  },
  getDate: function(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    return y + '-' + m + '-' + d;
  },
  count: function() {
    this.setData({
      ji1: "jil",
      ji2: "",
      count: 0,
      money: "100%"
    })
  },
  money: function() {
    this.setData({
      ji1: "",
      ji2: "jil",
      count: "-100%",
      money: 0
    })
  }
})