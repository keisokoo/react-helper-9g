import styled from '@emotion/styled/macro'
import LineChart from './LineChart/LineChart'

const LineChartSampleWrap = styled.div``

interface LineChartSampleProps {}
const chartData = [
  { y: 99, x: 0 },
  { y: 95, x: 10 },
  { y: 88, x: 20 },
  { y: 98, x: 30 },
  { y: 86, x: 40 },
]
const LineChartSample = ({ ...props }: LineChartSampleProps) => {
  return (
    <>
      <LineChartSampleWrap>
        <LineChart
          _chartData={chartData}
          _width={257}
          _height={220}
          _YChartType={'맥박'}
          _XChartType={'주간'}
          _extraData={[
            { value: 90, color: '#F34040', title: '샘플1' },
            { value: 98, color: 'orange', title: '샘플2' },
          ]}
        />
      </LineChartSampleWrap>
    </>
  )
}
export default LineChartSample
