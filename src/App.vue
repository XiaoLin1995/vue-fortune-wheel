<template>
  <div id="app">
    <FortuneWheel
      style="width: 500px"
      btnWidth="30%"
      borderColor="#584b43"
      :borderWidth="6"
      :prizes="prizes"
      @onRotateStart="onRotateStart"
      @onRotateEnd="onRotateEnd"
    />
    <FortuneWheel
      style="width: 500px"
      type="image"
      :prizeId="prizeId"
      :prizes="prizes"
      :angleBase="-10"
      @onRotateStart="onRotateStart"
      @onRotateEnd="onRotateEnd"
    >
      <img slot="wheel" src="@/assets/wheel.png" style="transform: rotateZ(60deg)" />
      <img slot="button" src="@/assets/button.png" />
    </FortuneWheel>

    <button @click="prizeId = 2">change PrizeId Red</button>
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
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  max-width: 100%;
}
</style>
