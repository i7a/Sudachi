import _ from 'lodash';
import moment from 'moment';
import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import * as taskListUtil from './task-list';

export const getDateListWithTaskCount = (dateList) => {
  let taskList = {}
  let dateListWithTaskCount = dateList
  _.map(dateListWithTaskCount, (d, i) => {
    taskList = taskListUtil.getTaskListByDate(d.date)
    dateListWithTaskCount = getDateListWithTaskCountByDate(dateListWithTaskCount, taskList, d.date)
  })
  return dateListWithTaskCount
}

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
