import storage from 'electron-storage';

const taskListStorage = class taskListStorage {
  constructor(data){
    this.taskList = data
  }

  // save task list json file to local storage.
  set(date, dailyTaskList){
    storage.set('taskList/' + date, dailyTaskList, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  // get task list json file from local storage.
  get(date){
    storage.get('taskList/' + date, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        // success.
        this.taskList = data
      }
    })
    return this.taskList
  }
}

module.exports = taskListStorage
