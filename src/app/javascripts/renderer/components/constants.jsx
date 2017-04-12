import _ from 'lodash';

export const Types = {
  TASK: "task"
}

export const showInTimeline = [
  "paragraph",
  "task-list",
  "task-list-done"
]

export const heightPerHour = 50

export const positionRange = () => {
  let range = []
  _.each(_.range(0, 48), (p, i) => {
    range.push([(p * 25), (p * 25) + 25])
  })
  return range
}
