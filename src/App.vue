<template>
  <div id="app" class="container">
    <div class="row">
      <!-- canvas -->
      <div class="col-md-6">
        <h2> Canvas </h2>
        <FortuneWheel
          style="width: 500px"
          :btnWidth="140"
          borderColor="#584b43"
          :borderWidth="6"
          :prizes="prizes"
          :verify="canvasVerify"
          @rotateStart="onCanvasRotateStart"
          @rotateEnd="onRotateEnd"
        />
      </div>

      <!-- image -->
      <div class="col-md-6">
        <h2> Image </h2>
        <FortuneWheel
          style="width: 500px"
          type="image"
          :useWeight="true"
          :prizeId="prizeId"
          :prizes="prizes"
          :angleBase="-2"
          @rotateStart="onImageRotateStart"
          @rotateEnd="onRotateEnd"
        >
          <img slot="wheel" src="@/assets/wheel.png" style="transform: rotateZ(60deg)" />
          <img slot="button" src="@/assets/button.png" style="width: 180px"/>
        </FortuneWheel>
        <div class="btn-list">
          <div class="btn" v-for="(item, idx) in prizes" :key="idx" :style="{ background: item.bgColor }" @click="onChangePrize(item.id)"></div>
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

<script>
import FortuneWheel from './components/fortuneWheel'

export default {
  name: 'app',
  components: {
    FortuneWheel
  },
  data() {
    return {
      prizeId: 1,
      canvasVerify: true, // 是否开始 canvas 的验证模式
      prizes: [
        {
          id: 1,
          name: 'Blue', // 奖品名
          value: 'Blue\'s value', // 奖品值
          bgColor: '#45ace9', // 背景色
          color: '#ffffff', // 字体色
          probability: 30, // 概率，最多保留 4 位小数
          weight: 1
        },
        {
          id: 2,
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#dd3832',
          color: '#ffffff',
          probability: 40,
          weight: 1
        },
        {
          id: 3,
          name: 'Yellow',
          value: 'Yellow\'s value',
          bgColor: '#fef151',
          color: '#ffffff',
          probability: 30,
          weight: 1
        }
      ]
    }
  },
  computed: {
    prizeRes() {
      return this.prizes.filter(item => item.id === this.prizeId)[0] || []
    }
  },
  methods: {
    onCanvasRotateStart(rotate) {
      if (this.canvasVerify) {
        const verified = true // true: 测试通过验证, false: 测试未通过验证
        this.DoServiceVerify(verified, 2000).then((verifiedRes) => {
          if (verifiedRes) {
            console.log('验证通过, 开始旋转')
            rotate() // 调用回调, 开始旋转
            this.canvasVerify = false // 关闭验证模式
          } else {
            alert('未通过验证')
          }
        })
        return
      }
      console.log('onCanvasRotateStart')
    },
    onImageRotateStart() {
      console.log('onImageRotateStart')
    },
    onRotateEnd(prize) {
      alert(prize.value)
    },
    onChangePrize(id) {
      this.prizeId = id
    },
    DoServiceVerify(verified, duration) { // 参数 1: 是否通过验证, 2: 延迟时间
      return new Promise((resove) => {
        setTimeout(() => {
          resove(verified)
        }, duration)
      })
    }
  }
}
</script>

<style lang="scss">
@import './styles/bootstrap-grid.min.css';
@import './styles/reset.css';
@import './app.scss';
</style>
