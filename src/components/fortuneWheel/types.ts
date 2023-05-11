interface PrizeConfigBase {
  id: number;
  value: any;
  [propName: string]: any;
}

interface PrizeConfigBaseCanvas extends PrizeConfigBase {
  name: string;
  bgColor: string;
  color: string;
}

interface PrizeConfigProbability extends PrizeConfigBase {
  probability: number;
}

interface PrizeConfigProbabilityCanvas extends PrizeConfigBaseCanvas {
  probability: number;
}

interface PrizeConfigWeight extends PrizeConfigBase {
  weight: number;
}

interface PrizeConfigWeightCanvas extends PrizeConfigBaseCanvas {
  weight: number;
}

export type PrizeConfig = PrizeConfigProbability | PrizeConfigWeight | PrizeConfigProbabilityCanvas | PrizeConfigWeightCanvas;

export interface CanvasConfig {
  radius?: number;
  textRadius?: number;
  textLength?: number;
  textDirection?: string;
  lineHeight?: number;
  borderWidth?: number;
  borderColor?: string;
  btnText?: string;
  btnWidth?: number;
  fontSize?: number;
}

export interface PropsType {
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
