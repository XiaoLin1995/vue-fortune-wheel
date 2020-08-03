
# Vue-Fortune-Wheel

Component name: Wheel of Fortune, Wheel of Fortune, Wheel of Fortune

Application scenario: lottery

## Install
```
yarn add vue-fortune-wheel
```
or
```
npm install vue-fortune-wheel
```
## Language

[English](./README.md)| [Chinese](./README_CN.md)

## Usage

```html
<template>
  <div>
    <!-- type: image -->
    <FortuneWheel
      style="width: 500px"
      type="image"
      :prizes="prizes"
      :angleBase="-10"
      :beforeStart="checkBeforeStart"
      @onRotateStart="onRotateStart"
      @onRotateEnd="onRotateEnd"
    >
      <img slot="wheel" src="@/assets/wheel.png" />
      <img slot="button" src="@/assets/button.png" />
    </FortuneWheel>

    <!-- type: canvas -->
    <FortuneWheel
      style="width: 500px"
      btnWidth="30%"
      borderColor="#584b43"
      :beforeStart="checkBeforeStart"
      :borderWidth="6"
      :prizes="prizes"
      @onRotateStart="onRotateStart"
      @onRotateEnd="onRotateEnd"
    />
  </div>
</template>
```

```js
import FortuneWheel from 'vue-fortune-wheel'
import 'vue-fortune-wheel/lib/vue-fortune-wheel.css'

export default {
  components: {
    FortuneWheel
  },
  data() {
    return {
      prizes: [
        {
          id: 1, //* The unique id of each prize, an integer greater than 0
          name: 'Blue', // Prize name, display value when type is canvas (this parameter is not needed when type is image)
          value: 'Blue\' value', //* Prize value, return value after spinning
          bgColor: '#45ace9', // Background color (no need for this parameter when type is image)
          color: '#ffffff', // Font color (this parameter is not required when type is image)
          probability: 30 //* Probability, up to 4 decimal places (the sum of the probabilities of all prizes must be 100)
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
    checkBeforeStart(){
      console.log('Check start')
      var status = false;
      if(this.status){
        alert('Rotation is not available')
        return false;
      }      
      alert('Rotation is available')
      return true;
    },
    onRotateStart() {
      console.log('onRotateStart')
    },
    onRotateEnd(prize) {
      alert(prize.value)
    }
  }
}
```

## Demo

### online
https://xiaolin1995.github.io/vue-fortune-wheel/demo/

## FortuneWheel Events
| Event name | Description | Callback parameters |
| ------ | ------ | ------ |
| beforeStart | Add cases to test before executing the onRotateStart function | / |
| onRotateStart | Triggered when the dial button is clicked | / |
| onRotateEnd | Triggered at the end of the turntable animation | The entire prize Object |

## FortuneWheel Attributes
| Parameters | Description | Type | Default Value |
| ------ | ------ | ------ | ----- |
| type | Type of turntable (canvas, image) | String | canvas |
| disabled | Whether to disable (after disabled, click the button will not rotate) | Boolean | false |
| radius | Radius of circle (type: canvas) | Number | 250 |
| textRadius | The distance of the text from the center of the circle (type: canvas) | Number | 190 |
| textLength | A few characters in one line of the prize, beyond the line break (maximum two lines)| Number | 6 |
| lineHeight | Text line height (type: canvas) | Number | 20 |
| borderWidth | Round outer border (type: canvas) | Number | 0 |
| borderColor | Color value of the outer border (type: canvas) | String | transparent |
| btnText | Button text (type: canvas) | String | GO |
| btnWidth | Button width (Enter your own unit) | String | 170px |
| fontSize | Prize size (px) | Number | 34 |
| duration | Time to complete one rotation (unit: ms) | Number | 6000 |
| timingFun | Css time function of rotation transition | String | cubic-bezier(0.36, 0.95, 0.64, 1) |
| angleBase | Number of rotations (angleBase * 360 is the total angle of one rotation, it can be reversed when it is a negative number) | Number | 10 |
| prizeId | Specify the id, it will spin to the prize of this id every time (when it is 0, the value can be changed during the rotation according to the probability of each prize itself to complete various show operations) | Number | 0 |
| prizes | Prize list (structure reference Usage) | Array | / |

