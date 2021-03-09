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
          <img slot="wheel" src="@/assets/wheel.png" style="transform: rotateZ(60deg)" />
          <img slot="button" src="@/assets/button.png" style="width: 180px"/>
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

<script lang="ts">
import Vue from 'vue'
import FortuneWheel from './components/fortuneWheel/index.vue'

interface PrizeConfig {
  /* eslint-disable */
  id: number;
  name: string;
  value: any;
  bgColor: string;
  color: string;
  probability: number;
  weight: number;
  [propName: string]: any;
  /* eslint-enable */
}

export default Vue.extend({
  name: 'App',
  components: {
    FortuneWheel
  },
  data () {
    return {
      prizeId: 0,
      canvasVerify: false,
      canvasOptions: {
        btnWidth: 140,
        borderColor: '#584b43',
        borderWidth: 6,
        lineHeight: 30
      },
      prizesCanvas: [
        {
          id: 1,
          contentType: 'text',
          name: 'Blue', // 奖品名
          value: 'Blue\'s value', // 奖品值
          bgColor: '#45ace9', // 背景色
          color: '#ffffff', // 字体色
          probability: 30 // 概率，最多保留 4 位小数
        },
        {
          id: 2,
          contentType: 'text',
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#dd3832',
          color: '#ffffff',
          probability: 40
        },
        {
          id: 3,
          contentType: 'image',
          imageUri: 'https://perperook.ir/img/icons/offers.png',
          value: 'Yellow\'s value',
          bgColor: '#fef151',
          color: '#ffffff',
          probability: 30
        }
      ],
      prizesImage: [
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
    }
  },
  computed: {
    prizeRes (): object {
      return this.prizesImage.filter(item => item.id === this.prizeId)[0] || {}
    }
  },
  methods: {
    onCanvasRotateStart (rotate: Function) {
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
    onImageRotateStart () {
      console.log('onImageRotateStart')
    },
    onRotateEnd (prize: PrizeConfig) {
      alert(prize.value)
    },
    onChangePrize (id: number) {
      this.prizeId = id
    },
    DoServiceVerify (verified: boolean, duration: number) { // 参数 1: 是否通过验证, 2: 延迟时间
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(verified)
        }, duration)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import './styles/bootstrap-grid.min.css';
@import './app.scss';
</style>
