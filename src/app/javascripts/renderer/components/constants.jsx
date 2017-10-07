import _ from 'lodash';
import moment from 'moment';

export const Types = {
  TASK: "task"
}

export const default_node = 'paragraph'

export const showInTimeline = [
  "paragraph",
  "check-list-item"
]

export const initialPositionTop = 450
export const initialDragTargetPositionTop = -99999

export const initialDateList = () => {
  let dateList = []
  _.map(_.range(1, 30), (d, i) => {
    dateList.push({
      date: moment().add(d - 15, 'd').format("YYYYMMDD"),
      dateFull: moment().add(d - 15, 'd').format("YYYY.M.D ddd"),
      task: 0,
      taskDone: 0,
      complete: false
    })
  })
  return dateList
}

export const minIndent = 1
export const maxIndent = 5

export const heightPerHour = 50

export const positionRange = () => {
  let range = []
  _.each(_.range(48, 0), (p, i) => {
    range.push([(p * 25), (p * 25) + 25])
  })
  return range
}

export const markerPositionTop = () => {
  return (parseInt(moment().format("H")) + parseFloat(moment().format("m") / 60)) * heightPerHour
}
