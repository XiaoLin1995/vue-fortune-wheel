<template>
  <div class="fw-container">
    <!-- wheel -->
    <div
      class="fw-wheel"
      :style="rotateStyle"
      @transitionend="onRotateEnd"
      @webkitTransitionend="onRotateEnd"
    >
      <canvas
        v-if="type === 'canvas'"
        ref="wheelEl"
        :width="canvasConfig.radius * 2"
        :height="canvasConfig.radius * 2"
      />
      <slot name="wheel" v-else />
    </div>
    <!-- button -->
    <div class="fw-btn">
      <div
        v-if="type === 'canvas'"
        class="fw-btn__btn"
        :style="{ width: canvasConfig.btnWidth + 'px', height: canvasConfig.btnWidth + 'px'}"
        @click="handleClick">
        {{ canvasConfig.btnText }}
      </div>
      <div v-else class="fw-btn__image" @click="handleClick">
        <slot name="button"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PrizeConfig, CanvasConfig } from './types'
import { useCanvas } from './hooks/useCanvas'
import { useRotate } from './hooks/useRotate'

interface PropsType {
  type: string;
  useWeight: boolean;
  disabled: boolean;
  verify: boolean;
  canvas: CanvasConfig;
  duration: number;
  timingFun: string;
  angleBase: number;
  prizeId: number;
  prizes: PrizeConfig[];
}

const props = withDefaults(
  defineProps<PropsType>(),
  {
    type: 'canvas', // canvas || image
    useWeight: false, // 以权重算概率
    disabled: false, // 是否禁用
    verify: false, // 是否开启验证
    canvas: () => ({}),
    duration: 6000, // 从旋转一次的时间, 单位毫秒
    timingFun: 'cubic-bezier(0.36, 0.95, 0.64, 1)', // 转盘的旋转的 transition 时间函数
    angleBase: 10, // 旋转角度的基数, 旋转的圈数 360 * 10
    prizeId: 0, // 0 时不使用, 其他值时, 旋转的结果为此 Id 的奖品, 可在旋转中改变
    prizes: () => [] // 奖品列表
  }
)

const emit = defineEmits(['rotateStart', 'rotateEnd'])

const { wheelEl, canvasConfig } = useCanvas(props)
const { handleClick, rotateStyle, onRotateEnd } = useRotate(props, emit)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>