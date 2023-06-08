import styled from '@emotion/styled/macro'
import { colors, typography } from '../../themes/styles'
import { addCssProps } from '../../themes/styles.helper'

const MiniCalendarWrap = styled.div`
  width: 100%;
  user-select: none;
  padding: 16px 0 20px;
  background-color: #ffffff;
  ${addCssProps}
`
const MiniCalendarBody = styled.div`
  user-select: none;
  padding: 16px 0;
  overflow: hidden;
  position: relative;
`
const MiniCalendarRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 4px;
`
const WeeksRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 4px;
  margin-bottom: 2px;
  border-radius: 16px;
  background-color: ${colors['Grayscale/Background Light']};
`
const Weeks = styled.div`
  flex: 1;
  text-align: center;
  padding: 4px 0;
  color: ${colors['Grayscale/Gray Dark']};
  ${typography['Menu/Bold']}
  // 일요일
&:first-of-type {
  }
  // 토요일
  &:last-of-type {
  }
`

const DayPart = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
  }
  span {
    ${typography['Menu/Regular']}
    color: ${colors['Grayscale/Black']};
  }
`
const SelectedBackground = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors['Primary/Default']};
`
const TodayBackground = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset 0px 0px 0px 1px ${colors['Primary/Default']};
`
const DayColumn = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  box-sizing: border-box;
  height: 24px;
  // 일요일
  &:first-of-type {
    border-left: none;
    span {
      color: ${colors['Danger/Default']};
    }
  }
  // 토요일
  &:last-of-type {
  }

  // 기간 선택일 경우 그 기간
  &.isBetweenTarget {
    border-radius: 0;
    &.isDayEnd {
      border-radius: 0 8px 8px 0;
    }
    &.isDayStart {
      border-radius: 8px 0 0 8px;
    }
  }

  // 기간 선택일 경우 선택 불가능한 기간
  &.isDisabled {
    opacity: 0.5;
    &:hover {
      border-color: transparent;
      cursor: not-allowed;
    }
    &.isGrayed {
    }
  }

  // 현재 월 외의 날짜
  &.isGrayed {
    span {
      color: ${colors['Grayscale/Gray Light']};
    }
  }
  .day-part {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    & > span {
      position: relative;
      top: -1px;
      z-index: 2;
    }
  }

  // 오늘
  &.isToday {
    span {
      color: ${colors['Primary/Default']};
      ${typography['Menu/Bold']}
    }
  }
  // 선택된 날짜
  &.isSelected {
    span {
      color: ${colors['White/White off']};
      ${typography['Menu/Bold']}
    }
  }
  &.isAfter {
    /* background-color: #fbffd9; */
  }
  &.isBefore {
    /* background-color: #ffc2c2; */
  }

  // hover
  &:hover {
  }
`
const ScheduleTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  img {
    cursor: pointer;
  }
`
const MiniCalendarDays = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  padding: 0 20px;
  &.center {
    &::before {
      content: '';
      position: absolute;
      left: -1px;
      top: 0;
      height: 100%;
      width: 1px;
      background-color: #ebedf1;
    }
    &::after {
      content: '';
      position: absolute;
      right: -1px;
      top: 0;
      height: 100%;
      width: 1px;
      background-color: #ebedf1;
    }
  }
`
const MonthTitle = styled.div`
  ${typography['Body/Small/Bold']}
  color: ${colors['Grayscale/Black']};
  &:hover {
    background-color: rgba(gray, 0.1);
  }
  &:active {
    background-color: rgba(gray, 0.2);
  }
`
const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const CalendarCarouselWrap = styled.div`
  display: block;
  width: 100%;
  height: 216px;
`
const CalendarCarouselInner = styled.div`
  display: flex;
  align-items: flex-start;
  transform: translateX(-100%);
  touch-action: none;
  & > div {
    min-width: 100%;
  }
`
const BottomBox = styled.div`
  padding: 0 20px;
`
const BottomControlBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const DescBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  ${typography['Body/Caption/Regular']}
  color: ${colors['Grayscale/Gray Default']};
`

const MiniCalendarStyle = {
  MiniCalendarWrap,
  MiniCalendarBody,
  MiniCalendarRow,
  WeeksRow,
  Weeks,
  DayPart,
  SelectedBackground,
  TodayBackground,
  DayColumn,
  ScheduleTop,
  MiniCalendarDays,
  MonthTitle,
  ButtonWrap,
  CalendarCarouselWrap,
  CalendarCarouselInner,
  BottomBox,
  BottomControlBox,
  DescBox,
}
export default MiniCalendarStyle
