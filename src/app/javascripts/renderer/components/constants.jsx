import _ from 'lodash';
import moment from 'moment';

export const Types = {
  TASK: "task"
}

export const showInTimeline = [
  "paragraph",
  "task-list",
  "task-list-done"
]

export const initialPositionTop = 450

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
