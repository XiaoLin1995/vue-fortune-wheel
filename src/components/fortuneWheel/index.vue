<template>
  <div class="vue-fortuneWheel">
    <div
      ref="fortuneWheelBox"
      class="fortuneWheel-box"
      :style="fortuneWheelStyle"
      @transitionend="onRotateEnd"
      @webkitTransitionend="onRotateEnd"
    >
      <canvas
        v-if="type === 'canvas'"
        ref="fortuneWheelCanvas"
        :width="radius * 2"
        :height="radius * 2"
      />
      <slot name="wheel" v-else />
    </div>
    <div class="fortuneWheel-wrapper">
      <div class="btn-container" @click="onRotateStart">
        <div v-if="type === 'canvas'" class="fortuneWheel-btn" :style="{ width: btnWidth, height: btnWidth}">{{ btnText }}</div>
        <slot v-else name="button"/>
      </div>
    </div>
  </div>
</template>

<script>
import { randomNum, sumBy } from '@/utils/number'
export default {
  name: 'FortuneWheel',
  props: {    
    beforeStart: {
      type: Function,
      default: () => true,
    },
    type: {
      type: String,
      default: 'canvas' // canvas || image
    },
    disabled: {
      type: Boolean,
      default: false // Whether to disable
    },
    radius: {
      type: Number,
      default: 250 // Radius of circle
    },
    textRadius: {
      type: Number,
      default: 190 // The distance between the prize position and the center of the circle
    },
    textLength: {
      type: Number,
      default: 6 // Prize text 1 line of several characters, up to 2 lines
    },
    lineHeight: {
      type: Number,
      default: 20 // Text line height
    },
    borderWidth: {
      type: Number,
      default: 0 // Round outer border
    },
    borderColor: {
      type: String,
      default: 'transparent' // Outer border color
    },
    btnText: {
      type: String,
      default: 'GO' // Start button text
    },
    btnWidth: {
      type: String,
      default: '170px' // Width of button
    },
    fontSize: {
      type: Number,
      default: 34 // Font size of prize
    },
    duration: {
      type: Number,
      default: 6000 // Time of one rotation (milliseconds)
    },
    timingFun: {
      type: String,
      default: 'cubic-bezier(0.36, 0.95, 0.64, 1)' // The transition time function of the rotation of the turntable
    },
    angleBase: {
      type: Number,
      default: 10 // The base of the rotation angle, the number of rotations 360 * 10
    },
    prizeId: {
      type: Number,
      default: 0 // When it is 0, it is not used. For other values, the result of the rotation is the prize of this Id, which can be changed during rotation
    },
    prizes: {
      type: Array,
      default: () => [] // List of prizes
    }
  },
  data() {
    return {
      isRotating: false, // Rotation status (currently not spinning)
      rotateEndDeg: 0, // The angle of turntable rotation
      prizeRes: {} // Rotation result of turntable
    }
  },
  computed: {
    // Sum total probability of all prizes
    probabilityTotal() {
      return sumBy(this.prizes, row => row.probability)
    },
    // Array of prize ids generated for probability
    prizesIdArr() {
      const idArr = []
      this.prizes.forEach((row) => {
        const count = Math.round(row.probability * this.decimalSpaces)
        const arr = (new Array(count)).fill(row.id)
        idArr.push(...arr)
      })
      return idArr
    },
    // The probability of the prize keeps several decimal places,
    // up to 4 digits => (0: 1, 1: 10, 2: 100, 3: 1000, 4: 10000)
    decimalSpaces() {
      const sortArr = [...this.prizes].sort((a, b) => {
        const aRes = String(a.probability).split('.')[1]
        const bRes = String(b.probability).split('.')[1]
        const aLen = aRes ? aRes.length : 0
        const bLen = bRes ? bRes.length : 0
        return bLen - aLen
      })
      const maxRes = String(sortArr[0].probability).split('.')[1]
      const idx = maxRes ? maxRes.length : 0
      return [1, 10, 100, 1000][idx > 4 ? 4 : idx]
    },
    // Time to spin once
    rotateDuration() {
      return this.isRotating ? this.duration / 1000 : 0
    },
    fortuneWheelStyle() {
      return {
        '-webkit-transform': `rotateZ(${this.rotateEndDeg}deg)`,
        'transform': `rotateZ(${this.rotateEndDeg}deg)`,
        '-webkit-transition-duration': `${this.rotateDuration}s`,
        'transition-duration': `${this.rotateDuration}s`,
        '-webkit-transition-timing-function:': this.timingFun,
        'transition-timing-function': this.timingFun
      }
    },
    rotateBase() {
      let angle = this.angleBase * 360
      if (this.angleBase < 0) angle -= 360
      return angle
    },
    canRotate() {
      return !this.disabled && !this.isRotating && this.probabilityTotal === 100
    }
  },
  watch: {
    prizeId(newVal) {
      if (!this.isRotating) return
      let newAngle = this.getTargetDeg(newVal)
      if (this.angleBase < 0) newAngle -= 360
      
      const prevEndDeg = this.rotateEndDeg
      let nowEndDeg = this.angleBase * 360 + newAngle
      const angle = 360 * (Math.floor((nowEndDeg - prevEndDeg) / 360))
      if (this.angleBase >= 0) {
        nowEndDeg += Math.abs(angle)
      } else {
        nowEndDeg += -360 - angle
      }
      this.rotateEndDeg = nowEndDeg
    }
  },
  created() {
    this.checkProbability()
  },
  mounted() {
    if (this.type === 'canvas') this.drawCanvas()
  },
  methods: {
    // Check whether the total probability is 100
    checkProbability() {
      if (this.probabilityTotal !== 100) {
        console.error('Prizes Is Error: Sum of probabilities is not 100!')
        return false
      }
      return true
    },
    // Draw canvas
    drawCanvas() {
      const canvas = this.$refs.fortuneWheelCanvas
      if (canvas.getContext) {
        // 根据奖品个数计算圆周角度
        const arc = Math.PI / (this.prizes.length / 2)
        const ctx = canvas.getContext('2d')
        // 在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, this.radius * 2, this.radius * 2)
        // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = this.borderWidth * 2
        // font 属性设置或返回画布上的文本内容的当前字体属性
        ctx.font = `${this.fontSize}px Arial`
        this.prizes.forEach((row, i) => {
          const angle = i * arc - Math.PI / 2
          ctx.fillStyle = row.bgColor
          ctx.beginPath()
          // arc(x, y, r, 起始角, 结束角, 绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(this.radius, this.radius, this.radius - this.borderWidth, angle, angle + arc, false)
          ctx.stroke()
          ctx.arc(this.radius, this.radius, 0, angle + arc, angle, true)
          ctx.fill()
          // 锁画布（为了保存之前的画布状态）
          ctx.save()
          // ----绘制奖品开始----
          ctx.fillStyle = row.color
          // translate方法重新映射画布上的 (0, 0) 位置
          ctx.translate(this.radius + Math.cos(angle + arc / 2) * this.textRadius, this.radius + Math.sin(angle + arc / 2) * this.textRadius)
          // rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2)
          // 下面代码根据奖品类型、奖品名称长度渲染不同效果, 如字体、颜色、图片效果。（具体根据实际情况改变）
          if (row.name.length > this.textLength) { // 奖品名称长度超过一定范围
            const content = [row.name.substring(0, this.textLength), row.name.substring(this.textLength)]
            for (let j = 0; j < content.length; j++) {
              ctx.fillText(content[j], -ctx.measureText(content[j]).width / 2, (j + 1) * this.lineHeight)
            }
          } else {
            // 在画布上绘制填色的文本。文本的默认颜色是黑色
            // measureText()方法返回包含一个对象, 该对象包含以像素计的指定字体宽度
            ctx.fillText(row.name, -ctx.measureText(row.name).width / 2, this.lineHeight)
          }
          // 把当前画布返回（调整）到上一个save()状态之前
          ctx.restore()
          // ----绘制奖品结束----
        })
      }
    },
    // Start spinning
    async onRotateStart() {      
      // Check from be
      if(!await this.beforeStart()){
        console.log('beforeStart');
        return;
      }

      if (!this.canRotate) return
      this.isRotating = true
      const prizeId = this.prizeId || this.getRandomPrize()
      this.rotateEndDeg = this.rotateBase + this.getTargetDeg(prizeId)
      this.$emit("onRotateStart")
    },
    // End rotation
    onRotateEnd() {
      this.isRotating = false
      this.rotateEndDeg %= 360
      this.$emit('onRotateEnd', this.prizeRes)
    },
    // Get random prize id
    getRandomPrize() {
      const prizeId = this.prizesIdArr[randomNum(0, 100 * this.decimalSpaces - 1)]
      return prizeId
    },
    // Get the angle of the prize
    getTargetDeg(prizeId) {
      const angle = 360 / this.prizes.length
      const num = this.prizes.findIndex(row => row.id === prizeId)
      this.prizeRes = this.prizes.filter(row => row.id === prizeId)[0] || []
      return 360 - (angle * num + angle / 2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
