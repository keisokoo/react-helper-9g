import LineGraph, {
  ChartDataType,
  ChartStringValue,
  DefaultStepType,
  ExtraChartData,
} from '../../helpers/LineGraph'
import { AdditionalCss, DivAttributes } from '../../themes/styles.type'

export type ChartStandardType = 'threshold' | 'variable' | 'fixed'

export const CHART_TYPES = {
  체온: {
    type: 'threshold',
    threshold: 0.5,
    defaultValue: {
      max: 38,
      min: 36,
      step: 4,
      toFixed: 1,
    },
  },
  맥박: {
    type: 'variable',
    defaultValue: {
      max: 105,
      min: 85,
      step: 4,
      toFixed: 0,
    },
  },
  산소포화도: {
    type: 'fixed',
    defaultValue: {
      max: 100,
      min: 95,
      step: 5,
      toFixed: 0,
    },
  },
  최고혈압: {
    type: 'variable',
    defaultValue: {
      max: 140,
      min: 120,
      step: 4,
      toFixed: 0,
    },
  },
  최저혈압: {
    type: 'variable',
    defaultValue: {
      max: 95,
      min: 75,
      step: 4,
      toFixed: 0,
    },
  },
  알코올농도: {
    type: 'fixed',
    defaultValue: {
      max: 0.08,
      min: 0,
      step: 4,
      toFixed: 2,
    },
  },
} as const

// 그래프의 카테고리(호흡,맥박..) 과 주어진 데이터값 ( ChartDataType[] ) 으로 y축 눈금의 설정 값 set
export const disposeChartType = (
  value: ChartDataType[],
  type: keyof typeof CHART_TYPES
): DefaultStepType => {
  const currentType = CHART_TYPES[type]
  if (currentType.type === 'fixed') {
    return currentType.defaultValue
  } else if (currentType.type === 'threshold') {
    return LineGraph.getYStandardByThreshold(
      value,
      currentType.threshold,
      currentType.defaultValue
    )
  } else {
    return LineGraph.getYVariableStandard(value, currentType.defaultValue)
  }
}

export interface LineChartProps extends DivAttributes {
  _css?: AdditionalCss
  _calibration?: number
  _positionUp?: number
  _chartData:
    | ChartDataType[] // 각 data의 x,y 좌표들의 배열
    | ChartStringValue
    | ((xValue: { [x: string]: number }) => ChartDataType[])
  _width: number
  _height: number
  _XChartType: '월간' | '주간' // 월간 차트인지, 주간 차트인지
  _YChartType: keyof typeof CHART_TYPES | DefaultStepType // Y축의 종류 (체온인지, 맥박인지, .. 또는 기본 값)
  _extraData?: ExtraChartData[]
}
