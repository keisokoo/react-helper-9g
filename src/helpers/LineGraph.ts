import dayjs, { Dayjs } from 'dayjs'
require('dayjs/locale/ko')
dayjs.locale('ko')
const TODAY_DAYJS = dayjs()

type AxisLabel = { [key in string]: number }
type AxisType = {
  axis: number
  label: string
}
export type ChartDataType = {
  y: number
  x: number
}

export type ExtraChartData = {
  title: string
  value: number
  color: string
}
interface NumberStep {
  step: number
  max?: number
  min?: number
  toFixed?: number
}
export interface LabelStep {
  step: AxisLabel
  max?: number
  min?: number
}

export type ChartStringValue = { [key in string]: number }

type AxisStepType = NumberStep | LabelStep
type LineGraphConfigType = {
  width: number
  height: number
  yStep: NumberStep
  xStep: LabelStep
}
const INITIAL_CONFIG: LineGraphConfigType = {
  width: 400,
  height: 200,
  yStep: {
    step: 5,
    toFixed: 1,
  },
  xStep: {
    step: { '0': 0, '50': 50, '100': 100 },
  },
}
type GraphPointType = {
  y: number
  x: number
  original: ChartDataType
}

// y축 눈금들의 최대,최소, 간격들에 대한 설정 값
export type DefaultStepType = {
  max: number
  min: number
  step: number
  toFixed: number
}
class LineGraph {
  config: LineGraphConfigType
  xAxis: AxisType[] // x 축 라벨과 눈금값, 배열
  yAxis: AxisType[] // y 축 라벨과 눈금값, 배열
  chartValues: {
    chartPoint: GraphPointType[] // 차트에 표시될 점들의 좌표값
    chartLine: string
    yAverage: number
    extraData?: ExtraChartData[]
  }

  static responsive?: true | 'disableY'
  constructor(
    config: Partial<LineGraphConfigType>,
    chartData?: ChartDataType[],
    extraData?: ExtraChartData[],
    responsive?: true | 'disableY'
  ) {
    LineGraph.responsive = responsive
    this.config = { ...INITIAL_CONFIG, ...config }
    // x 축 눈금 config (size, 눈금간 간격, 최대, 최소)
    this.xAxis = this.createStandard({
      size: this.config.width,
      step: this.config.xStep.step,
      max: this.config.xStep.max,
      min: this.config.xStep.min,
    })
    // y 축 눈금 config (size, 눈금간 간격, 최대, 최소)
    this.yAxis = this.createStandard(
      {
        size: this.config.height,
        step: this.config.yStep.step,
        max: this.config.yStep.max,
        min: this.config.yStep.min,
      },
      this.config.yStep.toFixed
    )
    // 그래프 그릴 때 사용할 데이터
    this.chartValues = this.disposeChartData(
      { width: this.config.width, height: this.config.height },
      this.config.xStep,
      this.config.yStep,
      chartData,
      extraData
    )
  }
  /**
   * threshold 단위로 step 생성
   *
   * @static
   * @param {ChartDataType[]} value
   * @param {number} threshold
   * @memberof LineGraph
   */

  // 주어진 값들과 threshold를 기준으로 y축 눈금들의 config(최대,최소, 간격들)을 계산
  static getYStandardByThreshold = (
    value: ChartDataType[],
    threshold: number, // 연산의 결과를 위해 더해지거나 빼는 상수 값 ( 상수항 )
    defaultValue: DefaultStepType
  ): DefaultStepType => {
    // 주어진 값(y값)들 중 최대값
    let max = value.reduce((prev, curr) => {
      prev = prev === 0 ? curr.y : Math.max(prev, curr.y)
      return prev
    }, 0)
    // 주어진 값(y값)들 중 최소값
    let min = value.reduce((prev, curr) => {
      prev = prev === 0 ? curr.y : Math.min(prev, curr.y)
      return prev
    }, 0)
    max = Math.ceil(max)
    min = Math.floor(min)
    const diff = max - min
    // y축 눈금간의 간격 개수
    let nextStep = Math.ceil(diff ? diff : (2 * threshold) / threshold)
    // GB 쪽 요청사항 : 전체 y축 눈금은 최대 6개 까지만 표시
    if (nextStep > 6) {
      nextStep = 6
    }

    return {
      ...defaultValue,
      max: max + threshold,
      min: min - threshold,
      step: nextStep,
    }
  }
  /**
   * · 최대값-최소값 의 차이로 threadhold 계산시 기준 ( 지비 기획 요청 사항 )
   * · 최대값-최소값=10이하일 경우엔 2,±
   * · 최대값-최소값=15이하일 경우엔 3,±
   * · 최대값-최소값=20이하일 경우엔 4,±
   * · 그외엔5
   * @static
   * @param {ChartDataType[]} value
   * @param {{
   *       max: number
   *       min: number
   *       step: number
   *     }} defaultValue
   * @memberof LineGraph
   */
  // 주어진 값들과 기준으로 y축 눈금들의 config(최대,최소, 간격들)을 계산
  static getYVariableStandard = (
    value: ChartDataType[],
    defaultValue: DefaultStepType
  ): DefaultStepType => {
    // 주어진 값(y값)들 중 최대값
    let max = value.reduce((prev, curr) => {
      prev = prev === 0 ? curr.y : Math.max(prev, curr.y)
      return prev
    }, 0)
    // 주어진 값(y값)들 중 최소값
    let min = value.reduce((prev, curr) => {
      prev = prev === 0 ? curr.y : Math.min(prev, curr.y)
      return prev
    }, 0)
    max = Math.ceil(max)
    min = Math.floor(min)
    const diff = max - min

    // 최대, 최소 값들의 차이로 threshold 값을 정함 (기준은 지비 쪽 요청 사항에 따름)
    let threshold = 5
    if (diff <= 10) {
      threshold = 2
    } else if (diff <= 15) {
      threshold = 3
    } else if (diff <= 20) {
      threshold = 4
    }

    // y축 눈금간의 간격 개수
    let nextStep = Math.ceil(diff ? diff : (2 * threshold) / threshold)
    // GB 쪽 요청사항 : 전체 y축 눈금은 최대 6개 까지만 표시
    if (nextStep > 6) {
      nextStep = 6
    }
    return {
      ...defaultValue,
      max: max + threshold,
      min: min - threshold,
      step: nextStep,
    }
  }

  // 시작과 끝 날짜를 받아서 그 사이의 날짜들을 배열로 반환하는 함수
  static getPeriods = (start: Dayjs, end: Dayjs) => {
    return [start].concat(
      Array.from(Array(Math.ceil(Math.abs(start.diff(end, 'day')))).keys()).map(
        (key) => {
          let dayStandard = start.clone()
          return dayStandard.add(key + 1, 'day')
        }
      )
    )
  }
  // 주간 그래프에서 각 날짜들간 간격을 세팅하는 함수
  static getWeeks = () => {
    const daysInWeekArr = LineGraph.getPeriods(
      TODAY_DAYJS.startOf('week').add(1, 'day'),
      TODAY_DAYJS.endOf('week').add(1, 'day')
    )
    // 전체를 100으로 보았을 때, 각 날짜들간의 간격을 세팅 (ex. 오늘 : 0, 내일 : 1, ... 6일뒤 : 100)
    const daysGapInGraph = daysInWeekArr.reduce((prev, curr, index) => {
      const dayStr = curr.format('D') // 며칠
      const dayOfWeekStr = curr.format('ddd') // 무슨 요일
      prev[`${dayStr}/${dayOfWeekStr}`] = (index / 6) * 100
      return prev
    }, {} as { [key in string]: number })
    return daysGapInGraph
  }
  // 월간 그래프에서 각 날짜들간 간격을 세팅하는 함수
  static getMonthDays = () => {
    const currentMonthStr = TODAY_DAYJS.format('M')
    const numberOfDaysInMonth = TODAY_DAYJS.daysInMonth()
    const daysInMonthArr = Array.from(Array(numberOfDaysInMonth).keys()).map(
      (i) => i + 1
    )
    // 전체를 100으로 보았을 때, 각 날짜들간 간격 ( e.g : 1일 : 0, 2일 : 1, .... 30일 : 100)
    const daysGapInGraph = daysInMonthArr.reduce((prev, day) => {
      prev[`${currentMonthStr}/${day}`] =
        ((day - 1) / (numberOfDaysInMonth - 1)) * 100
      return prev
    }, {} as { [key in string]: number })

    return daysGapInGraph
  }

  // num이 없을 경우 0으로 처리
  static disposeUndef = (num?: number) => num ?? 0

  // 최대값, 최소값, 그 사이의 값들의 갯수
  static getStan = (max?: number, min?: number) =>
    Math.abs(this.disposeUndef(max) - this.disposeUndef(min))

  // 그래프 크기에 따른 사이즈 Percentage 값
  static getPerSize = (numberOfStep: number | AxisLabel, size: number) => {
    return typeof numberOfStep === 'number'
      ? size / numberOfStep
      : size / Object.keys(numberOfStep).length
  }

  // 최대값과 최소값을 받아서 그 값들을 기준으로 value의 percent를 구하는 함수
  static getPercent = (value: number, max: number = 100, min: number = 0) => {
    const range = this.getStan(max, min)
    const index = value - this.disposeUndef(min)
    return (index / range) * 100
  }
  static getYAxis = (percent: number, size: number) => {
    return size - (size / 100) * percent // y축 역방향
  }

  static getXAxis = (percent: number, size: number, perWidth: number) => {
    const point = (size / 100) * percent
    return point + perWidth / 2
    // return point + 26 // x 축 0 포인트를 띄움
  }
  // 데이터들의 라벨과 이에 상응하는 값(ChartStringValue)를 받아 x,y 좌표의 배열로 파싱
  static parseChartData = (
    chartStringValue: ChartStringValue, // 데이터들의 라벨과 그의 상응하는 값 (ex : { '1/1': 10, '1/2': 20, ... }})
    xCalibration: { [x: string]: number } // 그래프 x좌표의 눈금
  ) => {
    return Object.keys(chartStringValue).reduce((prev, curr) => {
      if (xCalibration[curr] !== undefined) {
        prev = [...prev, { x: xCalibration[curr], y: chartStringValue[curr] }]
      }
      return prev
    }, [] as ChartDataType[])
  }
  // chartData 의 평균 값을 구하는 함수
  private getYAveragePercent = (value: ChartDataType[]) => {
    const total = value.reduce((prev, curr) => {
      prev += curr.y
      return prev
    }, 0)
    return LineGraph.getPercent(
      total / value.length,
      this.config.yStep.max,
      this.config.yStep.min
    )
  }
  // x,y축의 각 눈금 값
  private axisLabelByStepSize = (values: {
    step: number
    index: number
    max?: number
    min?: number
  }) => {
    const { step, index, max, min } = values
    const thisStep = step - index
    const stan = LineGraph.getStan(max, min)
    const stepValue = (thisStep / step) * stan
    return stepValue + LineGraph.disposeUndef(min)
  }

  // x, y축의 각 눈금 값 구하는 함수
  private createStandard = (
    values: {
      size: number
      step: number | AxisLabel
      max?: number
      min?: number
    } = {
      size: 0,
      step: 0,
      max: 100,
      min: 0,
    },
    toFixed: number = 0
  ): AxisType[] => {
    const { size, step, max, min } = values
    if (typeof step === 'number') {
      // 축의 눈금이 숫자로 주어졌을 경우
      const stepArray = Array.from(Array(step + 1).keys())
      return stepArray.map((_, index) => {
        return {
          axis: (size / step) * index,
          label: this.axisLabelByStepSize({ index, step, max, min }).toFixed(
            toFixed
          ),
        }
      })
    } else {
      // 축의 눈금이 AxisLabel 타입으로 주어졌을 경우
      const perWidth = LineGraph.getPerSize(step, size)
      return Object.keys(step).map((keyName) => {
        const xPercent = LineGraph.getPercent(step[keyName], max, min)
        return {
          axis: LineGraph.getXAxis(xPercent, size - perWidth, perWidth),
          label: keyName,
        }
      })
    }
  }
  // 그래프에 데이터를 실제로 그릴 때 사용되는 값들 구하는 함수
  disposeChartData = (
    chartSize: { width: number; height: number }, // 그래프 크기
    xStep: AxisStepType, // x축 눈금 config
    yStep: AxisStepType, // y축 눈금 config
    chartData?: ChartDataType[], // 그래프에 표기할 데이터
    extraData?: ExtraChartData[] // 발열 과 같이 평균값 외로 그래프에 표기할 데이터
  ): {
    chartPoint: GraphPointType[] // 그래프 상 좌표들 값
    chartLine: string // 그래프 좌표 점들 연결하는 선
    yAverage: number // 평균 값
    extraData?: ExtraChartData[] // 발열 과 같이 평균값 외로 그래프에 표기할 데이터
  } => {
    if (!chartData) return { chartPoint: [], chartLine: '', yAverage: 0 }

    // 그래프의 width 값
    let rebuildWidth = chartSize.width
    let rebuildHeight = chartSize.height

    const perWidth = LineGraph.getPerSize(xStep.step, chartSize.width)
    const perHeight = LineGraph.getPerSize(yStep.step, chartSize.height)

    // 그래프 양 옆에 여백(축의 눈금 간격 만큼)을 주기 위해 그려지는 그래프의 ㄴ길이 조정
    if (typeof xStep.step !== 'number') {
      rebuildWidth = chartSize.width - perWidth
    }
    // deprecated
    if (typeof yStep.step !== 'number') {
      rebuildHeight = chartSize.height - perHeight
    }

    // 그래프 상 좌표
    const chartPoint = chartData.map((obj) => {
      const yPercent = LineGraph.getPercent(obj.y, yStep.max, yStep.min)
      const yPoint = LineGraph.getYAxis(yPercent, rebuildHeight)
      const xPercent = LineGraph.getPercent(obj.x, xStep.max, xStep.min)
      const xPoint = LineGraph.getXAxis(xPercent, rebuildWidth, perWidth)
      return {
        y: yPoint,
        x: xPoint,
        original: obj,
      }
    })
    // 그래프 상 좌표들 연결하는 선
    const chartLine = chartPoint
      .map((obj, objIndex) => {
        if (objIndex === 0) {
          return `M${obj.x} ${obj.y}`
        } else {
          return `L${obj.x} ${obj.y}`
        }
      })
      .join(' ')
    return {
      chartPoint,
      chartLine,
      yAverage: this.getYAveragePercent(chartData),
      extraData:
        extraData && extraData.length > 0
          ? extraData.map((extra) => {
              return {
                ...extra,
                value: LineGraph.getPercent(
                  extra.value,
                  this.config.yStep.max,
                  this.config.yStep.min
                ),
              }
            })
          : undefined,
    }
  }
}
export default LineGraph
