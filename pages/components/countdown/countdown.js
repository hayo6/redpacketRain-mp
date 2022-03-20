// pages/components/countdown/countdown.js
let timer = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time: {
      type: Number,
      value: 3
    },
    fontSize: {
      type: Number,
      value: 144
    },
    color: {
      type: String,
      value: '#000000'
    }
  },
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    attached: function() {
      this.countDown(this.data.time)
    },
    detached: function() {
      clearInterval(timer)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    distime: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countDown(time) {
      let distime = time
      timer = setInterval(() => {
        console.log(distime)
        this.setData({
          distime
        })
        if(--distime <= 0) {
          clearInterval(timer)
          this.triggerEvent('end')
        }
      }, 1000)
    }
  }
})
