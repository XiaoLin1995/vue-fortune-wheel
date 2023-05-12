<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-md-6">
        <h2> Canvas </h2>

        <FortuneWheel
          style="width: 500px; max-width: 100%;"
          :verify="canvasVerify"
          :canvas="canvasOptions"
          :prizes="prizesCanvas"
          @rotateStart="onCanvasRotateStart"
          @rotateEnd="onRotateEnd"
        />

        <div>
          <input type="checkbox" v-model="canvasVerify"> 模拟请求：等待 {{ verifyDuration }}s 再转
        </div>
      </div>
      <div class="col-md-6">
        <h2> Image </h2>

        <FortuneWheel
          style="width: 500px; max-width: 100%;"
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

        <div class="btn-list">
          <div class="btn" v-for="(item, idx) in prizesCanvas" :key="idx" :style="{ background: item.bgColor }" @click="onChangePrize(item.id)"></div>
        </div>
        <div class="wheel-result">
          当前 100% <span :style="{ background: prizeRes.bgColor }"></span>
          <br/> 点击按钮，可在旋转中强行改变结果,
          <br/> 最好在旋转减速前, 大约一半的时间之前, 最好一次旋转只改变一次
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FortuneWheel from './components/FortuneWheel/index.vue'
import { PrizeConfig } from './components/FortuneWheel/types'

const prizeId = ref(0)

const canvasVerify = ref(false)
const verifyDuration = 2
const canvasOptions = {
  btnWidth: 140,
  borderColor: '#584b43',
  borderWidth: 6,
  lineHeight: 30
}

const prizesCanvas: PrizeConfig[] = [
  {
    id: 1,
    name: 'Blue', // 奖品名
    value: 'Blue\'s value', // 奖品值
    bgColor: '#45ace9', // 背景色
    color: '#ffffff', // 字体色
    probability: 30 // 概率，最多保留 4 位小数
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

const prizesImage: PrizeConfig[] = [
  {
    id: 1,
    value: 'Blue\'s value', // 奖品值
    weight: 1 // 权重
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

function testRequest (verified: boolean, duration: number) { // 参数 1: 是否通过验证, 2: 延迟时间
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(verified)
    }, duration)
  })
}

function onCanvasRotateStart (rotate: Function) {
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

function onRotateEnd (prize: PrizeConfig) {
  alert(prize.value)
}

function onChangePrize (id: number) {
  prizeId.value = id
}
  
</script>

<style lang="scss" scoped>
@import './styles/bootstrap-grid.min.css';
@import './style.scss';
</style>