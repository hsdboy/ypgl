const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth() + 1
const nowDay = date.getDate()
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月获取当月的总天数
let getDays = function (year, month) {
  if (month === 2) {
    return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
  } else {
    return daysInMonth[month - 1]
  }
}
// 根据年月日设置当前月有多少天 并更新年月日数组
let setDate = function (year, month, day, _this) {
  let daysNum = year === nowYear && month === nowMonth ? nowDay : getDays(year, month)
  day = day > daysNum ? 1 : day
  let monthsNum = year === nowYear ? nowMonth : 12
  let years = []
  let months = []
  let days = []
  let yearIndex = 9999
  let monthIndex = 0
  let dayIndex = 0
  // 重新设置年份列表
  for (let i = 1990; i <= nowYear; i++) {
    years.push(i)
  }
  years.map((v, idx) => {
    if (v === year) {
      yearIndex = idx
    }
  })
  // 重新设置月份列表
  for (let i = 1; i <= monthsNum; i++) {
    var k = i;
    months.push(k)
  }
  months.map((v, idx) => {
    if (v === month) {
      monthIndex = idx
    }
  })
  // 重新设置日期列表
  for (let i = 1; i <= daysNum; i++) {
    var k = i;
    days.push(k)
  }
  days.map((v, idx) => {
    if (v === day) {
      dayIndex = idx
    }
  })
  _this.setData({
    //时间列表参数
    years: years,
    months: months,
    days: days,
    //选中的日期
    year: year,
    month: month,
    day: day,
    value: [yearIndex, monthIndex, dayIndex],
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

    ji1:"",
    ji2:"",
    //时间列表参数
    flag: false,
    years: [],
    months: [],
    days: [],
    //选中的日期
    year: nowYear,
    month: nowMonth,
    day: nowDay,
    value: [9999, 1, 1],

    date: new Date().getFullYear() + "-" + Number(new Date().getUTCMonth() + 1) + "-" + new Date().getDate(),
    allnumi:0 ,
    allnumo: 0,
    allmoneyi: 0,
    allmoneyo: 0,
    isShowDates :false
  },
  onLoad: function (options) {
    setDate(this.data.year, this.data.month, this.data.day, this);
 

  },
  onShow: function () {
    var date = this.data.date
    var dataso = []
    var datasi = []
    var countsi = []
    var countso = []
    var allnumi = 0
    var allmoneyi = 0
    var allnumo = 0
    var allmoneyo = 0
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('payment').where({
      date: date
    }).get({
      success: res => {
        res.data.forEach(items => {
          if (items.state == "入库") {
            items.datas.forEach(item => {
              datasi.push(item)
            })
            items.count.forEach(element => {
              countsi.push(element)
            })
          } else if (items.state == "出库") {
            items.datas.forEach(item => {
              dataso.push(item)
            })
            items.count.forEach(element => {
              countso.push(element)
            })
          }

        })
        for (let i = 0; i < datasi.length; i++) {
          datasi[i].count = countsi[i]
        }
        for (let i = 0; i < dataso.length; i++) {
          dataso[i].count = countso[i]
        }
        datasi.forEach(item => {
          allnumi += item.count
          allmoneyi += item.count * item.stock
        })
        dataso.forEach(item => {
          allnumo += item.count
          allmoneyo += item.count * item.retail
        })
        this.setData({ datasi: datasi, dataso: dataso, allnumi, allmoneyi, allnumo, allmoneyo })
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
  chodate(){
    this.setData({ isShowDates :true})
  },
  bindChange: function (e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    console.log(this.data)
  },
  confirm:function(){
    let val = this.data.value
    var date = this.data.years[val[0]]+"-"+this.data.months[val[1]]+"-"+this.data.days[val[2]]
    this.setData({date:date})
    this.onShow()
    this.setData({ isShowDates: false })
  },
  cancel:function(){
    this.setData({ isShowDates: false })
  },
  in: function () {
    this.setData({
      ji1: "jil", ji2: "",
      state:"入库",
      datas:this.data.datasi,
    })
    this.onShow()
  },
  out:function(){
    this.setData({
      ji1:"",ji2:"jil",
      state:"出库",
      datas:this.data.dataso
    })
    this.onShow()
  }
})