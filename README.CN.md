
# Vue-Fortune-Wheel For Vue3

组件名称: Wheel of Fortune, 命运之轮, 幸运转盘

应用场景: 抽奖

## For Vue2
[查看](https://github.com/XiaoLin1995/vue-fortune-wheel/tree/vue2)


## Install
```
yarn add vue-fortune-wheel
```
or
```
npm install vue-fortune-wheel
```

## Language

[English (By Google Translate)](./README.md)| [中文](./README.CN.md)

## Demo

### online
https://xiaolin1995.github.io/vue-fortune-wheel/demo/

## Usage

```html
<template>
  <div>
    <!-- type: image -->
    <FortuneWheel
      style="width: 500px; max-width: 100%;"
      ref="wheelEl"
      type="image"
      :useWeight="true"
      :verify="canvasVerify"
      :prizeId="prizeId"
      :angleBase="-2"
      :prizes="prizesImage"
      @rotateStart="onImageRotateStart"
      @rotateEnd="onRotateEnd"
    >
      <template #wheel>
        <img src="./assets/wheel.png" style="width: 100%;transform: rotateZ(60deg)" />
      </template>
      <template #button>
        <img src="./assets/button.png" style="width: 180px"/>
      </template>
    </FortuneWheel>


    <!-- type: canvas -->
    <FortuneWheel
      style="width: 500px; max-width: 100%;"
      :verify="canvasVerify"
      :canvas="canvasOptions"
      :prizes="prizesCanvas"
      @rotateStart="onCanvasRotateStart"
      @rotateEnd="onRotateEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FortuneWheel from 'vue-fortune-wheel'
import 'vue-fortune-wheel/style.css'

const prizeId = ref(0)

const wheelEl = ref()
const canvasVerify = ref(false) // canvas 模式的转盘是否开启验证
const verifyDuration = 2
const canvasOptions = {
  btnWidth: 140,
  borderColor: '#584b43',
  borderWidth: 6,
  lineHeight: 30
}

const prizesCanvas = [
  {
    id: 1, //* 每个奖品唯一的 id, 大于 0 的整数
    name: 'Blue', // 奖品名, type 为 canvas 时的显示值 (type 为 image 时无需此参数)
    value: 'Blue\'s value', //* 奖品值, 旋转结束后的返回值
    bgColor: '#45ace9', // 背景色 (type 为 image 时无需此参数)
    color: '#ffffff', // 字体色 (type 为 image 时无需此参数)
    probability: 30 //* 概率, 最多保留 4 位小数 （所有奖品的概率和必须为 100）
  },
  {
    id: 2,
    name: 'Red',
    value: 'Red\'s value',
    bgColor: '#dd3832',
    color: '#ffffff',
    probability: 40
  },
  {
    id: 3,
    name: 'Yellow',
    value: 'Yellow\'s value',
    bgColor: '#fef151',
    color: '#ffffff',
    probability: 30
  }
]

const prizesImage = [
  {
    id: 1, //* 每个奖品唯一的 id, 大于 0 的整数
    value: 'Blue\'s value', //* 奖品值, 旋转结束后的返回值
    weight: 1 // 权重, 如果 useWeight 为 true, 则以 weight 计算概率 (即 probability 无效), weight 必须为整数
  },
  {
    id: 2,
    value: 'Red\'s value',
    weight: 0
  },
  {
    id: 3,
    value: 'Yellow\'s value',
    weight: 0
  }
]

const prizeRes = computed(() => {
  return prizesCanvas.find(item => item.id === prizeId.value) || prizesCanvas[0]
})


onMounted(() => {
  wheelEl.value.startRotate() // 可调用 startRotate 旋转
})

function testRequest (verified, duration) { // 参数 1: 是否通过验证, 2: 延迟时间
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(verified)
    }, duration)
  })
}

function onCanvasRotateStart (rotate) {
  if (canvasVerify.value) {
    const verified = true // true: 测试通过验证, false: 测试未通过验证
    testRequest(verified, verifyDuration * 1000).then((verifiedRes) => {
      if (verifiedRes) {
        console.log('验证通过, 开始旋转')
        rotate() // 调用回调, 开始旋转
        canvasVerify.value = false // 关闭验证模式
      } else {
        alert('未通过验证')
      }
    })
    return
  }
  console.log('onCanvasRotateStart')
}

function onImageRotateStart () {
  console.log('onImageRotateStart')
}

function onRotateEnd (prize) {
  alert(prize.value)
}

function onChangePrize (id) {
  prizeId.value = id
}
</script>
```

## FortuneWheel Events
| 事件名称 | 说明 | 回调参数 |
| ------ | ------ | ------ |
| rotateStart | 点击转盘按钮时触发 | 当 `verify` 为 `true` 时, 会有回调, 调用回调函数才开始旋转 |
| rotateEnd | 转盘动画结束时触发 | 奖品的整个 Object |

## FortuneWheel Methods
| 事件名称 | 说明 | 回调参数 |
| ------ | ------ | ------ |
| startRotate | 可触发旋转 | 当 `verify` 为 `true` 时, 需在 rotateStart 事件中触发回调函数 |

## FortuneWheel Attributes
| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ----- |
| type | 转盘的类型 (canvas, image) | String | canvas |
| useWeight | 是否以权重计算概率 | Boolean | false |
| disabled | 是否禁用 (禁用后, 点击按钮不会旋转) | Boolean | false |
| verify | 是否开启验证 | Boolean | false |
| canvas.radius | 圆的半径 (type: canvas) | Number | 250 |
| canvas.textRadius | 文本距圆心的距离 (type: canvas) | Number | 190 |
| canvas.textLength | 奖品一行几个字符, 超出换行 (最多两行) | Number | 6 |
| canvas.textDirection | 奖品文本方向 (horizontal, vertical) | String | horizontal |
| canvas.lineHeight | 文本行高 (type: canvas) | Number | 20 |
| canvas.borderWidth | 圆的外边框 (type: canvas) | Number | 0 |
| canvas.borderColor | 外边框的色值 (type: canvas) | String | transparent |
| canvas.btnText | 按钮文本 (type: canvas) | String | GO |
| canvas.btnWidth | 按钮的宽 (px) | Number | 140 |
| canvas.fontSize | 奖品字号 (px) | Number | 34 |
| duration | 完成一次旋转的时间 (单位 ms) | Number | 6000 |
| timingFun | 旋转过渡的 css 时间函数 | String | cubic-bezier(0.36, 0.95, 0.64, 1) |
| angleBase | 旋转圈数 (angleBase * 360 为一次旋转的总角度, 为负数时可反向旋转) | Number | 10 |
| prizeId | 指定 id, 会每次旋转到此 id 的奖品 (为 0 时, 则根据每个奖品自身的概率, 可在旋转中改变值, 以此完成各种骚操作 ) | Number | 0 |
| prizes | 奖品列表 (结构参考 Usage) | Array | / |

