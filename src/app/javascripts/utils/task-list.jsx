import { Raw } from 'slate';
import { ipcRenderer } from 'electron';

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
