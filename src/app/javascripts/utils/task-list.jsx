import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import * as Constants from '../renderer/components/constants';

export const getTaskListByDate = (date) => {
  return Raw.deserialize(ipcRenderer.sendSync('getTaskList', date), { terse: true })
}

export const getTaskCount = (taskList) => {
  let task = 0
  taskList.document.nodes.map((block) => {
    if (block.type == "task-list") task++
  })
  return task
}

export const getDoneTaskCount = (taskList) => {
  let taskDone = 0
  taskList.document.nodes.map((block) => {
    if (block.type == "task-list-done") taskDone++
  })
  return taskDone
}

export const getShowInTimelineTaskCount = (taskList) => {
  let taskCount = 0
  let breaker = false
  taskList.document.nodes.map((block) => {
    if (block.type == "separator") breaker = true
    if (breaker) return
    if (Constants.showInTimeline.includes(block.type) >= 0 && block.text != "") taskCount++
  })
  return taskCount
}
