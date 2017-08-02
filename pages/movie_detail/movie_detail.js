Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://api.douban.com/v2/movie/subject/'+options.id,
      method: 'get',
      header: {
        // "Content-Type":"application/json"
        //这里修改json为text   json的话请求会返回400（bad request）
        "Content-Type": "application/text"
      },
      success : function(res){
        if (res.statusCode == 200) {
            var movie = res.data;
            console.log(movie);
            that.setData({
              movie: movie
            });
            setTimeout(function(){
              that.setData({
                loading: false
              })
            },1000);
          }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})