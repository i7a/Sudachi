import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import * as Constants from '../renderer/components/constants';

/**
 * get taskList by date.
 *
 * @param  {String} date YYYYMMDD
 * @return {State}
 */

export const getTaskListByDate = (date) => {
  return Raw.deserialize(ipcRenderer.sendSync('getTaskList', date), { terse: true })
}

/**
 * get task count.
 *
 * @param  {State} taskList
 * @return {Number}
 */

export const getTaskCount = (taskList) => {
  let task = 0
  taskList.document.nodes.map((block) => {
    if (block.type == "task-list") task++
  })
  return task
}

/**
 * get done task count.
 *
 * @param  {State} taskList
 * @return {Number}
 */

export const getDoneTaskCount = (taskList) => {
  let taskDone = 0
  taskList.document.nodes.map((block) => {
    if (block.type == "task-list-done") taskDone++
  })
  return taskDone
}

/**
 * get task count which show in time line.
 * 
 * @param  {State} taskList
 * @return {Number}
 */

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
