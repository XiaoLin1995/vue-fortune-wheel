
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
      style="width: 500px"
      type="image"
      :useWeight="true"
      :prizes="prizes"
      :angleBase="-10"
      @rotateStart="onImageRotateStart"
      @rotateEnd="onRotateEnd"
    >
      <img slot="wheel" src="@/assets/wheel.png" />
      <img slot="button" src="@/assets/button.png" />
    </FortuneWheel>

    <!-- type: canvas -->
    <FortuneWheel
      style="width: 500px"
      :canvas="canvasOptions"
      :prizes="prizes"
      :verify="cavansVerify"
      @rotateStart="onCanvasRotateStart"
      @rotateEnd="onRotateEnd"
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
      cavansVerify: true, // Whether the turntable in canvas mode is enabled for verification
      canvasOptions: {
        borderWidth: 6,
        borderColor: '#584b43'
      },
      prizes: [
        {
          id: 1, //* The unique id of each prize, an integer greater than 0
          name: 'Blue', // Prize name, display value when type is canvas (this parameter is not needed when type is image)
          value: 'Blue\'s value', //* Prize value, return value after spinning
          bgColor: '#45ace9', // Background color (no need for this parameter when type is image)
          color: '#ffffff', // Font color (this parameter is not required when type is image)
          probability: 30, //* Probability, up to 4 decimal places (the sum of the probabilities of all prizes
          weight: 1 // Weight, if useWeight is true, the probability is calculated by weight (weight must be an integer), so probability is invalid
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
  methods: {
    onImageRotateStart() {
      console.log('onRotateStart')
    },
    onCanvasRotateStart(rotate) {
      if (this.canvasVerify) {
        const verified = true // true: the test passed the verification, false: the test failed the verification
        this.DoServiceVerify(verified, 2000).then((verifiedRes) => {
          if (verifiedRes) {
            console.log('Verification passed, start to rotate')
            rotate() // Call the callback, start spinning
            this.canvasVerify = false // Turn off verification mode
          } else {
            alert('Failed verification')
          }
        })
        return
      }
      console.log('onCanvasRotateStart')
    },
    onRotateEnd(prize) {
      alert(prize.value)
    },
    // Simulate the request back-end interface, verified: whether to pass the verification, duration: delay time
    DoServiceVerify(verified, duration) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(verified)
        }, duration)
      })
    }
  }
}
```

## FortuneWheel Events
| Event name | Description | Callback parameters |
| ------ | ------ | ------ |
| rotateStart | Triggered when the dial button is clicked | When `verify` is true, there will be a callback, and the callback function will be called to start spinning |
| rotateEnd | Triggered at the end of the turntable animation | The entire prize Object |

## FortuneWheel Attributes
| Parameters | Description | Type | Default Value |
| ------ | ------ | ------ | ----- |
| type | Type of turntable (canvas, image) | String | canvas |
| useWeight | Whether to calculate probability by weight | Boolean | false |
| disabled | Whether to disable (after disabled, click the button will not rotate) | Boolean | false |
| verify | Whether to enable verification mode | Boolean | false |
| canvas.radius | Radius of circle (type: canvas) | Number | 250 |
| canvas.textRadius | The distance of the text from the center of the circle (type: canvas) | Number | 190 |
| canvas.textLength | A few characters in one line of the prize, beyond the line break (maximum two lines) | Number | 6 |
| canvas.textDirection | Prize text direction (horizontal, vertical) | String | horizontal |
| canvas.lineHeight | Text line height (type: canvas) | Number | 20 |
| canvas.borderWidth | Round outer border (type: canvas) | Number | 0 |
| canvas.borderColor | Color value of the outer border (type: canvas) | String | transparent |
| canvas.btnText | Button text (type: canvas) | String | GO |
| canvas.btnWidth | Button width (px) | Number | 140 |
| canvas.fontSize | Prize size (px) | Number | 34 |
| duration | Time to complete one rotation (unit: ms) | Number | 6000 |
| timingFun | Css time function of rotation transition | String | cubic-bezier(0.36, 0.95, 0.64, 1) |
| angleBase | Number of rotations (angleBase * 360 is the total angle of one rotation, it can be reversed when it is a negative number) | Number | 10 |
| prizeId | Specify the id, it will spin to the prize of this id every time (when it is 0, the value can be changed during the rotation according to the probability of each prize itself to complete various show operations) | Number | 0 |
| prizes | Prize list (structure reference Usage) | Array | / |

