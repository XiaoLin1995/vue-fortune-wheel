import { ref, computed, onMounted } from 'vue'
import { getStrArray } from '../utils'
import type { CanvasConfig, PrizeConfig, PropsType } from '../types'

const canvasDefaultConfig: CanvasConfig = {
  radius: 250, // 圆的半径
  textRadius: 190, // 奖品位置距离圆心的距离
  textLength: 6, // 奖品文本 1 行几个字符, 最多 2 行
  textDirection: 'horizontal', // 奖品文本方向
  lineHeight: 20, // 文本行高
  borderWidth: 0, // 圆的外边框
  borderColor: 'transparent', // 外边框的颜色
  btnText: 'GO', // 开始按钮的文本
  btnWidth: 140, // 按钮的宽
  fontSize: 34 // 奖品字号
}

export function useCanvas (props: PropsType) {
  const wheelEl = ref()

  const canvasConfig = computed(() => {
    return Object.assign(canvasDefaultConfig, props.canvas) as PrizeConfig
  })

  // 绘制canvas
  function drawCanvas (): void {
    const canvasEl = wheelEl.value as HTMLCanvasElement
    if (canvasEl.getContext) {
      const { radius, textRadius, borderWidth, borderColor, fontSize } = canvasConfig.value
      // 根据奖品个数计算圆周角度
      const arc = Math.PI / (props.prizes.length / 2)
      const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D
      // 在给定矩形内清空一个矩形
      ctx.clearRect(0, 0, radius * 2, radius * 2)
      // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth * 2
      // font 属性设置或返回画布上的文本内容的当前字体属性
      ctx.font = `${fontSize}px Arial`
      props.prizes.forEach((row, i) => {
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
        drawPrizeText(ctx, angle, arc, row.name)
        // 把当前画布返回（调整）到上一个save()状态之前
        ctx.restore()
        // ----绘制奖品结束----
      })
    }
  }
  // 绘制奖品文本
  function drawPrizeText (ctx: CanvasRenderingContext2D, angle: number, arc: number, name: string) {
    const { lineHeight, textLength, textDirection } = canvasConfig.value
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
  }

  onMounted(() => {
    if (props.type === 'canvas') drawCanvas()
  })

  return {
    wheelEl,
    canvasConfig,
    drawCanvas
  }
}