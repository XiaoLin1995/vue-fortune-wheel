<template>
  <div class="fw-container">
    <!-- wheel -->
    <div
      class="fw-wheel"
      :style="rotateStyle"
      @transitionend="onRotateEnd"
      @webkitTransitionend="onRotateEnd"
    >
      <canvas
        v-if="type === 'canvas'"
        ref="wheel"
        :width="canvasConfig.radius * 2"
        :height="canvasConfig.radius * 2"
      />
      <slot name="wheel" v-else />
    </div>
    <!-- button -->
    <div class="fw-btn">
      <div
        v-if="type === 'canvas'"
        class="fw-btn__btn"
        :style="{ width: canvasConfig.btnWidth + 'px', height: canvasConfig.btnWidth + 'px'}"
        @click="handleClick">
        {{ canvasConfig.btnText }}
      </div>
      <div v-else class="fw-btn__image" @click="handleClick">
        <slot name="button"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import sumBy from 'lodash/sumBy'
import random from 'lodash/random'

interface PrizeConfig {
  /* eslint-disable */
  id: string;
  contentType: string; //text, image
  name: string;
  imageUri: string;
  image: HTMLImageElement,
  value: any;
  bgColor: string;
  color: string;
  probability: number;
  weight: number;
  [propName: string]: any;
  /* eslint-enable */
}

interface CanvasConfig {
  radius: number;
  textRadius: number;
  textLength: number;
  textDirection: string;
  lineHeight: number;
  imageSize: number;
  borderWidth: number;
  borderColor: string;
  btnText: string;
  btnWidth: number;
  fontSize: number;
}

const canvasDefaultConfig = {
  radius: 250, // 圆的半径
  textRadius: 190, // 奖品位置距离圆心的距离
  textLength: 6, // 奖品文本 1 行几个字符, 最多 2 行
  textDirection: 'horizontal', // 奖品文本方向
  lineHeight: 20, // 文本行高
  imageSize: 64,
  borderWidth: 0, // 圆的外边框
  borderColor: 'transparent', // 外边框的颜色
  btnText: 'GO', // 开始按钮的文本
  btnWidth: 140, // 按钮的宽
  fontSize: 34 // 奖品字号
}

function getStrArray (str: string, len: number) {
  const arr = []
  while (str !== '') {
    const text = str.substr(0, len)
    str = str.replace(text, '')
    arr.push(text)
  }
  return arr
}

export default Vue.extend({
  name: 'FortuneWheel',
  props: {
    type: {
      type: String,
      default: 'canvas' // canvas || image
    },
    useWeight: {
      type: Boolean,
      default: false // 以权重算概率
    },
    disabled: {
      type: Boolean,
      default: false // 是否禁用
    },
    verify: {
      type: Boolean,
      default: false // 是否开启验证
    },
    canvas: {
      type: Object as PropType<CanvasConfig>,
      default: () => canvasDefaultConfig
    },
    duration: {
      type: Number,
      default: 6000 // 从旋转一次的时间, 单位毫秒
    },
    timingFun: {
      type: String,
      default: 'cubic-bezier(0.36, 0.95, 0.64, 1)' // 转盘的旋转的 transition 时间函数
    },
    angleBase: {
      type: Number,
      default: 10 // 旋转角度的基数, 旋转的圈数 360 * 10
    },
    prizeId: {
      type: String,
      default: '' // 0 时不使用, 其他值时, 旋转的结果为此 Id 的奖品, 可在旋转中改变
    },
    prizes: {
      type: Array as PropType<PrizeConfig[]>,
      required: true,
      default: () => [] // 奖品列表
    }
  },
  data () {
    return {
      isRotating: false, // 是否正在旋转
      rotateEndDeg: 0, // 转盘旋转的角度
      prizeRes: {} // 转盘的旋转结果
    }
  },
  computed: {
    // canvas 的参数
    canvasConfig (): CanvasConfig {
      return Object.assign(canvasDefaultConfig, this.canvas)
    },
    // 所有奖品的概率和
    probabilityTotal (): number {
      if (this.useWeight) return 100
      return sumBy(this.prizes, (row: PrizeConfig) => row.probability || 0)
    },
    // 为了概率生成的奖品id的数组
    prizesIdArr (): Array<string> {
      const idArr: string[] = []
      this.prizes.forEach((row) => {
        const count: number = this.useWeight ? (row.weight || 0) : ((row.probability || 0) * this.decimalSpaces)
        const arr = (new Array(count)).fill(row.id)
        idArr.push(...arr)
      })
      return idArr
    },
    // 奖品的概率保留几位小数, 最多保留 4 位 => ( 0: 1, 1: 10, 2: 100, 3: 1000, 4: 10000 )
    decimalSpaces (): number {
      if (this.useWeight) return 0
      const sortArr = [...this.prizes].sort((a, b) => {
        const aRes = String(a.probability).split('.')[1]
        const bRes = String(b.probability).split('.')[1]
        const aLen = aRes ? aRes.length : 0
        const bLen = bRes ? bRes.length : 0
        return bLen - aLen
      })
      const maxRes = String(sortArr[0].probability).split('.')[1]
      const idx = maxRes ? maxRes.length : 0
      return [1, 10, 100, 1000, 10000][idx > 4 ? 4 : idx]
    },
    rotateStyle (): object {
      return {
        '-webkit-transform': `rotateZ(${this.rotateEndDeg}deg)`,
        transform: `rotateZ(${this.rotateEndDeg}deg)`,
        '-webkit-transition-duration': `${this.rotateDuration}s`,
        'transition-duration': `${this.rotateDuration}s`,
        '-webkit-transition-timing-function:': this.timingFun,
        'transition-timing-function': this.timingFun
      }
    },
    // 旋转一次的时长
    rotateDuration (): number {
      return this.isRotating ? this.duration / 1000 : 0
    },
    rotateBase (): number {
      let angle = this.angleBase * 360
      if (this.angleBase < 0) angle -= 360
      return angle
    },
    canRotate (): boolean {
      return !this.disabled && !this.isRotating && this.probabilityTotal === 100
    }
  },
  watch: {
    prizeId (newVal): void {
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
    },
    prizes (newVal: PrizeConfig[]): void {
      newVal.filter(p => p.contentType === 'image').forEach(element => {
        element.image = new Image()
        element.image.src = element.imageUri
      })
    }
  },
  created (): void {
    this.checkProbability()
  },
  mounted (): void {
    this.prizes.filter(p => p.contentType === 'image').forEach(element => {
      element.image = new Image()
      element.image.src = element.imageUri
    })
    setTimeout(() => {
      if (this.type === 'canvas') this.drawCanvas()
    }, 1000)
  },
  methods: {
    // 检测总概率是否为 100
    checkProbability () {
      if (this.probabilityTotal !== 100) {
        throw new Error('Prizes Is Error: Sum of probabilities is not 100!')
      }
      return true
    },
    // 绘制canvas
    drawCanvas (): void {
      const canvasEl = this.$refs.wheel as HTMLCanvasElement
      if (canvasEl.getContext) {
        const { radius, textRadius, borderWidth, borderColor, fontSize } = this.canvasConfig
        // 根据奖品个数计算圆周角度
        const arc = Math.PI / (this.prizes.length / 2)
        const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D
        // 在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, radius * 2, radius * 2)
        // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth * 2
        // font 属性设置或返回画布上的文本内容的当前字体属性
        ctx.font = `${fontSize}px Arial`
        this.prizes.forEach((row, i) => {
          const angle = i * arc - Math.PI / 2
          ctx.fillStyle = row.bgColor
          ctx.beginPath()
          // arc(x, y, r, 起始角, 结束角, 绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(radius, radius, radius - borderWidth, angle, angle + arc, false)
          ctx.stroke()
          ctx.arc(radius, radius, 0, angle + arc, angle, true)
          ctx.fill()
          // 锁画布（为了保存之前的画布状态）
          ctx.save()
          // ----绘制奖品开始----
          ctx.fillStyle = row.color
          // translate方法重新映射画布上的 (0, 0) 位置
          ctx.translate(radius + Math.cos(angle + arc / 2) * textRadius, radius + Math.sin(angle + arc / 2) * textRadius)
          // rotate方法旋转当前的绘图
          if (row.contentType === 'image') {
            this.drawPrizeImage(ctx, angle, arc, row.image)
          } else {
            this.drawPrizeText(ctx, angle, arc, row.name)
          }
          // 把当前画布返回（调整）到上一个save()状态之前
          ctx.restore()
          // ----绘制奖品结束----
        })
      }
    },
    // 绘制奖品文本
    drawPrizeText (ctx: CanvasRenderingContext2D, angle: number, arc: number, name: string) {
      const { lineHeight, textLength, textDirection } = this.canvasConfig
      // 下面代码根据奖品类型、奖品名称长度渲染不同效果, 如字体、颜色、图片效果。（具体根据实际情况改变）
      const content = getStrArray(name, textLength)
      if (content === null) return
      textDirection === 'vertical' ? ctx.rotate(angle + arc / 2 + Math.PI) : ctx.rotate(angle + arc / 2 + Math.PI / 2)
      content.forEach((text, idx) => {
        let textX = -ctx.measureText(text).width / 2
        let textY = (idx + 1) * lineHeight
        if (textDirection === 'vertical') {
          textX = 0
          textY = (idx + 1) * lineHeight - content.length * lineHeight / 2
        }
        ctx.fillText(text, textX, textY)
      })
    },
    drawPrizeImage (ctx: CanvasRenderingContext2D, angle: number, arc: number, image: HTMLImageElement) {
      const { imageSize } = this.canvasConfig
      ctx.rotate(angle + arc / 2 + Math.PI / 2)

      const imageX = -imageSize / 2
      const imageY = -imageSize / 2
      ctx.drawImage(image, imageX, imageY, imageSize, imageSize)
    },
    handleClick (): void {
      if (!this.canRotate) return
      if (this.verify) {
        this.$emit('rotateStart', this.onRotateStart)
        return
      }
      this.$emit('rotateStart')
      this.onRotateStart()
    },
    // 开始旋转
    onRotateStart (): void {
      this.isRotating = true
      const prizeId = this.prizeId || this.getRandomPrize()
      this.rotateEndDeg = this.rotateBase + this.getTargetDeg(prizeId)
    },
    // 结束旋转
    onRotateEnd (): void {
      this.isRotating = false
      this.rotateEndDeg %= 360
      this.$emit('rotateEnd', this.prizeRes)
    },
    // 获取随机奖品的 id
    getRandomPrize (): string {
      const len = this.prizesIdArr.length
      const prizeId = this.prizesIdArr[random(0, len - 1)]
      return prizeId
    },
    // 获取奖品所在的角度
    getTargetDeg (prizeId: string): number {
      const angle = 360 / this.prizes.length
      const num = this.prizes.findIndex(row => row.id === prizeId)
      this.prizeRes = this.prizes[num]
      return 360 - (angle * num + angle / 2)
    }
  }
})
</script>

<style scoped lang="scss">
@import 'index.scss';
</style>
