<template>
  <div id="app" class="container">
    <div class="row">
      <!-- canvas -->
      <div class="col-md-6">
        <h2> Canvas </h2>
        <FortuneWheel
          style="width: 500px"
          borderColor="#584b43"
          :borderWidth="6"
          :prizes="prizes"
          :btnWidth="btnWidth"
          :beforeStart="checkBeforeStart"
          @onRotateStart="onRotateStart"
          @onRotateEnd="onRotateEnd"
        />        
        <button :class="{'disable': status === false, 'enable': status === true }" @click="onChangeStatus">
            Current {{ status === false ?'Disable':'Enable'}}, after clicking this button the wheel is {{ status === true ?'Disable':'Enable'}}
        </button>
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
          :beforeStart="checkBeforeStart"
          @onRotateStart="onRotateStart"
          @onRotateEnd="onRotateEnd"
        >
          <img slot="wheel" src="@/assets/wheel.png" style="transform: rotateZ(60deg)" />
          <img slot="button" src="@/assets/button.png" />
        </FortuneWheel>
        <button :class="{'blue': prizeId === 1, 'red': prizeId === 2}" @click="onChangePrize">
            Current 100% {{ prizeId === 1?'Blue':'Red'}}, after clicking this button 100% {{ prizeId === 1?'Red':'Blue'}},
           <br/> You can try to forcibly change the result during rotation,
           <br/> It’s better to change only once per rotation before about half the time before the rotation is decelerated.
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
      status: false,
      btnWidth: '120px',
      prizes: [
        {
          id: 1,
          name: 'Blue', // Prize name
          value: 'Blue\' value', // Prize value
          bgColor: '#45ace9', // Background color
          color: '#ffffff', // Font color
          probability: 30 // Probability, up to 4 decimal places
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
    // Q: Why  have this case?
    // A: Because many cases have to check in the backend to see if users are eligible to dial before dialing!
    checkBeforeStart(){
      console.log('Check start')
      if(!this.status){
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
    },
    onChangePrize() {
      this.prizeId = this.prizeId === 1 ? 2 : 1
    },
    onChangeStatus()
    {
      this.status = this.status === true ? false : true
    }
  }
}
</script>

<style lang="scss">
@import './styles/bootstrap-grid.min.css';
@import './styles/reset.css';
@import './app.scss';
</style>
