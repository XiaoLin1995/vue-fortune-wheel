<template>
  <div>
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

<script>
import FortuneWheel from "vue-fortune-wheel/lib/vue-fortune-wheel.umd";
import "vue-fortune-wheel/lib/vue-fortune-wheel.css";

export default {
  components: {
    FortuneWheel
  },
  data() {
    return {
      canvasOptions: {
        borderWidth: 6,
        borderColor: "#584b43",
        textDirection: "horizontal",
        fontSize: 25,
        textLength: 16,
        btnText:'ໄປ'
      },
      canvasVerify: true, // Whether the turntable in canvas mode is enabled for verification
      prizes: [
        {
          id: 1, //* The unique id of each prize, an integer greater than 0
          name: "ປາ", // Prize name, display value when type is canvas (this parameter is not needed when type is image)
          value: "Blue's value", //* Prize value, return value after spinning
          bgColor: "#45ace9", // Background color (no need for this parameter when type is image)
          color: "#ffffff", // Font color (this parameter is not required when type is image)
          probability: 4, //* Probability, up to 4 decimal places (the sum of the probabilities of all prizes
          img: "https://static.posttoday.com/media/content/2016/10/31/9C1D0E60C88B437A936B88C5B3313BAE.jpg"
        },
        {
          id: 2,
          name: "ນ້ຳເຕົ້າ",
          value: "Red's value",
          bgColor: "#dd3832",
          color: "#ffffff",
          probability: 90,
          img: "https://png.pngtree.com/element_our/20200703/ourmid/pngtree-yellow-gourd-ornament-illustration-image_2299631.jpg"
        },
        {
          id: 3,
          name: "ກະປູ",
          value: "Yellow's value",
          bgColor: "#fef151",
          color: "#ffffff",
          probability: 2,
          img: "https://png.pngtree.com/png-vector/20201105/ourlarge/pngtree-crab-clipart-clip-art-style-cartoon-vector-crab-png-image_2395919.jpg"
        },
        {
          id: 4,
          name: "ກຸ້ງ",
          value: "Yellow's value",
          bgColor: "#FF8CDB",
          color: "#ffffff",
          probability: 2,
          img: "https://www.engdict.com/data/dict/media/images_public/shrim-00064880_normal.png"
        },
        {
          id: 5,
          name: "ໄກ່",
          value: "Yellow's value",
          bgColor: "#7A6EFF",
          color: "#ffffff",
          probability: 2,
          img: "https://miyd23.files.wordpress.com/2013/12/2013_04_25_131519_0_akoknqse.jpg"
        }
      ]
    };
  },
  computed: {
    isVerifiedCanvas: function () {
      return this.canvasVerify;
    }
  },
  methods: {
    onImageRotateStart() {
      console.log("onRotateStart");
    },
    onCanvasRotateStart(rotate) {
      console.log(rotate);
      console.log(this.isVerifiedCanvas);
      if (this.isVerifiedCanvas) {
        const verified = true; // true: the test passed the verification, false: the test failed the verification
        this.DoServiceVerify(verified, 2000).then(verifiedRes => {
          if (verifiedRes) {
            console.log("Verification passed, start to rotate");
            rotate(); // Call the callback, start spinning
            this.canvasVerify = false; // Turn off verification mode
          } else {
            alert("Failed verification");
          }
        });
        return;
      }
      console.log("onCanvasRotateStart");
    },
    onRotateEnd() {
      // alert(prize.value);
    },
    // Simulate the request back-end interface, verified: whether to pass the verification, duration: delay time
    DoServiceVerify(verified, duration) {
      return new Promise(resove => {
        setTimeout(() => {
          resove(verified);
        }, duration);
      });
    }
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
