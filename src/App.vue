<template>
  <div id="app" class="container">
    <div class="row">
      <!-- canvas -->
      <div class="col-md-6">
        <h2> Canvas </h2>
        <FortuneWheel
          style="width: 500px"
          btnWidth="30%"
          borderColor="#584b43"
          :borderWidth="6"
          :prizes="prizes"
          @onRotateStart="onRotateStart"
          @onRotateEnd="onRotateEnd"
        />
      </div>

      <!-- image -->
      <div class="col-md-6">
        <h2> Image </h2>
        <FortuneWheel
          style="width: 500px"
          type="image"
          :prizeId="prizeId"
          :prizes="prizes"
          :angleBase="-1"
          @onRotateStart="onRotateStart"
          @onRotateEnd="onRotateEnd"
        >
          <img slot="wheel" src="@/assets/wheel.png" style="transform: rotateZ(60deg)" />
          <img slot="button" src="@/assets/button.png" />
        </FortuneWheel>
        <button :class="{'blue': prizeId === 1, 'red': prizeId === 2}" @click="onChangePrize">
          当前 100% {{ prizeId === 1 ? '蓝' : '红'}}, 点击此按钮后 100% {{ prizeId === 1 ? '红' : '蓝'}},
          <br/> 可在旋转中尝试强行改变结果,
          <br/> 最好在旋转减速前, 大约一半的时间之前, 最好一次旋转只改变一次
        </button>
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
      prizes: [
        {
          id: 1,
          name: 'Blue', // 奖品名
          value: 'Blue\' value', // 奖品值
          bgColor: '#45ace9', // 背景色
          color: '#ffffff', // 字体色
          probability: 30 // 概率，最多保留 4 位小数
        },
        {
          id: 2,
          name: 'Red',
          value: 'Red\' value',
          bgColor: '#dd3832',
          color: '#ffffff',
          probability: 40
        },
        {
          id: 3,
          name: 'Yellow',
          value: 'Yellow\' value',
          bgColor: '#fef151',
          color: '#ffffff',
          probability: 30
        }
      ]
    }
  },
  methods: {
    onRotateStart() {
      console.log('onRotateStart')
    },
    onRotateEnd(val) {
      alert(val)
    },
    onChangePrize() {
      this.prizeId = this.prizeId === 1 ? 2 : 1
    }
  }
}
</script>

<style lang="scss">
@import './styles/bootstrap-grid.min.css';
@import './styles/reset.css';
@import './app.scss';
</style>
