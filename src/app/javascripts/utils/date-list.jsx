import _ from 'lodash';
import moment from 'moment';
import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import * as taskListUtil from './task-list';

/**
 * get array dateList with task count.
 *
 * @param  {Array} dateList
 * @return {Array} dateList with task count
 */

export const getDateListWithTaskCount = (dateList) => {
  let taskList = {}
  let dateListWithTaskCount = dateList
  _.map(dateListWithTaskCount, (d, i) => {
    taskList = taskListUtil.getTaskListByDate(d.date)
    dateListWithTaskCount = getDateListWithTaskCountByDate(dateListWithTaskCount, taskList, d.date)
  })
  return dateListWithTaskCount
}

/**
 * get array dateList with task count.
 * count task and doneTask of param taskList, and update task count of the day.
 *
 * @param  {Array} dateList
 * @param  {State} taskList
 * @param  {String} date     YYYYMMDD
 * @return {Array}
 */

export const getDateListWithTaskCountByDate = (dateList, taskList, date) => {
  let task = taskListUtil.getTaskCount(taskList)
  let taskDone = taskListUtil.getDoneTaskCount(taskList)
  let targetIndex = _.findIndex(dateList, {date: date})
  dateList[targetIndex] = {
    date: date,
    dateFull: dateList[targetIndex].dateFull,
    task: task,
    taskDone: taskDone,
    complete: (task + taskDone) == taskDone
  }
  return dateList
}

/**
 * get date with task count.
 *
 * @param  {String} date YYYYMMDD
 * @return {Onject}  date object with task info.
 */

export const getDateWithTaskCount = (date) => {
  let taskList = taskListUtil.getTaskListByDate(date)
  let task = taskListUtil.getTaskCount(taskList)
  let taskDone = taskListUtil.getDoneTaskCount(taskList)
  return {
    date: moment(date).format("YYYYMMDD"),
    dateFull: moment(date).format("YYYY.M.D ddd"),
    task: task,
    taskDone: taskDone,
    complete: (task + taskDone) == taskDone
  }
}
