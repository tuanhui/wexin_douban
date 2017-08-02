var sliderWidth = 116; // 需要设置slider的宽度，用于计算中间位置
var pageSize = 20;
Page({
  data: {
    current_city:'北京',
    tabs: ["正在热映", "即将上映"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    screenH: 0,
    in_theaters:{},
    coming_soon:{},
    in_theaters_page:1,
    coming_soon_page:1,
    in_theaters_nomore: false,
    coming_soon_nomore: false,
    in_theaters_loadmore: false,
    coming_soon_loadmore: false,
    loading: true,
  },
  loadMore: function(){
    switch (this.data.activeIndex) {
      case 0:
        if (!this.data.in_theaters_nomore && !this.data.in_theaters_loadmore){
          this.setData({
            in_theaters_loadmore: true
          });
          this.get_in_theaters(this.data.in_theaters_page + 1);
        }
        break;
      case 1:
        if (!this.data.coming_soon_nomore && !this.data.coming_soon_loadmore) {
          this.setData({
            coming_soon_loadmore: true
          });
          this.get_coming_soon(this.data.in_theaters_page + 1);
        }
        break;
    }
   
  },
  // 正在上映
  get_in_theaters:function(page){
    console.log('page='+page);
    this.setData({
      in_theaters_page: page,
    });
    var that = this;
    wx.request({ 
      url: 'https://api.douban.com/v2/movie/in_theaters',
      method: 'post',
      data: {
        start: (that.data.in_theaters_page - 1)*pageSize,
        count: pageSize,
        city: that.data.current_city
      }, success: function (result) {
        console.log(result);
        var nomore = result && result.data && result.data.subjects.length == 0;
        var realTotal = result.data.total;
        var total = that.data.in_theaters_page * pageSize;
        if (!nomore) {
            nomore = total > realTotal;
        }
        var dataList;
        if (that.data.in_theaters_page == 1) {
            dataList = result.data;
        } else {
            dataList = that.data.in_theaters;
            dataList.subjects = dataList.subjects.concat(result.data.subjects);
        }
        that.setData({
          in_theaters: dataList,
          in_theaters_nomore: nomore,
          loading: false,
          in_theaters_loadmore: false
        })
      }, fail: function (error) {
        console.log(error);
        that.setData({
          loading: false
        })
      }
    })
  },
  // 即将上映
  get_coming_soon: function(page){
    this.setData({
      coming_soon: {
        page: page,
      },
    });
    var that = this;
    wx.request({
      url: 'https://api.douban.com/v2/movie/coming_soon',
      method: 'post',
      data: {
        start: (that.data.coming_soon.page - 1)*pageSize ,
        count: pageSize,
        city: that.data.current_city
      }, success: function (result) {
        var realTotal = result.data.total;
        var total = that.data.in_theaters.page * pageSize;
        that.setData({
            coming_soon: result.data,
            coming_soon_nomore: total > realTotal,
            loading: false
        })
      }, fail: function (error) {
        console.log(error);
        that.setData({
          loading: false
        })
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  chooseCity: function(){
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  onLoad: function (e) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenH: res.screenHeight-210
        });
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
      wx.getLocation({
        success: function(res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            // wx.request({
            //   url: 'http://api.map.baidu.com/geocoder/v2/?ak=Y4NcP7YcxEkiwSuYedq5vW09&output=json&location=' + latitude + ',' + longitude + '&pois=1',
            //   method:'get',
            //   success: function(res) {
            //       console.log(Res);
            //   },fail: function(error) {
            //       console.log(error);
            //   }
            // })
            that.get_in_theaters(that.data.in_theaters_page);
      },
    })
  },
  tabClick: function (e) {
    var tabId = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if(tabId == 0) {
      console.log('正在热映');
      if (!this.data.in_theaters.subjects) {
        this.setData({
          loading:true
        });
        this.get_in_theaters(this.data.in_theaters.page);
      }
     
    } else if(tabId == 1) {
      console.log('即将上映');
      if (!this.data.coming_soon.subjects) {
        this.setData({
          loading: true
        });
        this.get_coming_soon(this.data.coming_soon.page);
      }
    }
  }
});