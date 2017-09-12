import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import * as Constants from '../renderer/components/constants';

/**
 * whether is done task block or not.
 * @param  {Block}  block
 * @return {Boolean}
 */

export const isDoneTask = (block) => {
  return block.type == "check-list-item" && block.data.get('done')
}

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
    if (isDoneTask(block)) task++
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
    if (isDoneTask(block)) taskDone++
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

/**
 * get taskList without done task.
 * @param  {State} taskList target taskList
 * @return {State}          taskList without done task
 */

export const getTaskListWithoutDoneTask = (taskList) => {
  let transform = taskList.transform()
  taskList.document.nodes.map((block) => {
    if (isDoneTask(block)) {
      transform = transform.removeNodeByKey(block.key)
    }
  })
  return transform.apply()
}

/**
 * get taskList only done task.
 * @param  {State} taskList target taskList
 * @return {State}
 */

export const getTaskListOnlyDoneTask = (taskList) => {
  let transform = taskList.transform()
  taskList.document.nodes.map((block) => {
    if (! isDoneTask(block)) {
      transform = transform.removeNodeByKey(block.key)
    }
  })
  return transform.apply()
}
