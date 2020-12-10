/* eslint-disable */
import FortuneWheel from './index.vue'
 
// 为组件添加 install 方法，用于按需引入
FortuneWheel.install = function (Vue) {
  Vue.component(FortuneWheel.name, FortuneWheel)
}
 
export default FortuneWheel
