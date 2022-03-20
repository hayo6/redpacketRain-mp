// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageState: 3, // 1.游戏开始 2.倒计时 3.红包雨
    countdown: {
      time: 3,
      fontsize: 32,
      color: '#000000'
    },
    ww: 0,
    wh: 0,
    rpx: 0, // 坐标转换
    rainNum: 32, // 红包雨数量
    redEnvelopes: [], // 红包数组
    dropIndex: 0, // 已下落的红包个数
    speed: 6, // 下落速度
    men: { // 底部小人
      src: '',
      x: 0,
      y: 0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取手机屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
        let rpx = res.windowWidth / 375
        self.data.ww = res.windowWidth
        self.data.wh = res.windowHeight
        self. data.rpx = rpx
        let men = {
          x : res.windowWidth / 2 - 50 * rpx,
          y :  res.windowHeight - 80 * rpx,
          w : 100 * rpx,
          h: 75 * rpx
        }
        self.data.men = men
      },
    })
    this.initCanvas()
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
  startGame() {
    this.setData({
      pageState: 2
    })
  },
  countDownEnd() {
    this.setData({
      pageState: 3
    })
    this.initCanvas()
  },
  initCanvas() {
    let self = this
    const query = wx.createSelectorQuery()
    query
      .select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        this.downloadImage('./images/men.png', canvas).then(src => {
          this.data.men.src = src
        })
        this.initRainDrops(canvas).then(() => {
          this.initGame(canvas, ctx)
        })
      })
  },
  initRainDrops(canvas) {
    return new Promise(async(reslove, reject) => {
      const bombImg = await this.downloadImage('./images/bomb.png', canvas)
      const rpImg = await this.downloadImage('./images/redpacket.png', canvas)
      const packlist = [
        {
          src: rpImg,
          w: 121,
          h: 120,
          isBoom: false,
        },
        {
          src: bombImg,
          w: 95,
          h: 95,
          isBoom: true,
        },
      ]
      const { rainNum, ww } = this.data
      for(let i = 0; i < rainNum; i++) {
        // 可以通过num来控制 炸弹落下
        let num = 2
        let item = packlist[Math.floor(Math.random() * num)]
        let x = Math.floor(Math.random() * (ww - item.w))
        let y =  -Math.floor((1 + Math.random()) * item.h)
        this.data.redEnvelopes.push({
          ...item,
          x: x,
          y: y,
          isEnd: false,
        })
      }
      reslove()
    })
  },
  initGame(canvas, ctx) {
    let { rainNum, ww, wh, dropIndex, rpx, speed, redEnvelopes, men} = this.data
    let self = this
    console.log(this.data.redEnvelopes)
    this.data.dropIndex += 1 + Math.floor(Math.random() * 2)
    ctx.save()
    ctx.clearRect(0, 0, ww, wh) // 清除画布
    for(let i = 0; i < dropIndex; i ++) {
      // 判断元素是否被接住或者超出屏幕
      if(redEnvelopes[i].y > wh) {
        redEnvelopes[i].isEnd = true
      } else {
        ctx.drawImage(redEnvelopes[i].src, redEnvelopes[i].x, redEnvelopes[i].y, redEnvelopes[i].w, redEnvelopes[i].h)
        redEnvelopes[i].y += speed
      }
    }
    ctx.drawImage(men.src, men.x, men.y, men.w, men.h)
    ctx.restore()  
    // 红包未掉完
    if (dropIndex < rainNum) {
      canvas.requestAnimationFrame(() => {
        self.initGame(canvas, ctx)
      })
    } 
  },
  // 预加载图片，canvas绘制图片时必须先进行图片预加载
  downloadImage(src, canvas) {
    return new Promise((reslove, reject) => {
      const image = canvas.createImage()
      image.src = src
      image.onload = function() {
        reslove(image)
      }
    })
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