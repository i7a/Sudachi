import React from 'react';
import _ from 'lodash';
import moment from 'moment'
import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import Howto from '../../../data/howto.json';
import taskListStorage from '../../modules/task-list-storage';
import Header from './header';
import Footer from './footer';
import TimelineViewport from './taskbord/timeline-viewport';
import CalendarViewport from './taskbord/calendar-viewport';
import TaskViewport from './taskbord/task-viewport';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const HowtoContents = Raw.deserialize(Howto, { terse: true })

const taskBoardReducer = (state = { date: "", taskList: {}, save: false}, action) => {
  switch (action.type) {
    case 'UPDATE_TASK':
      return { taskList: action.taskList, save: true };
    case 'UPDATE_DATE':
      return { taskList: action.taskList, date: action.date, save: true };
    case 'SHOW_HOWTO':
      return { taskList: HowtoContents, save: false };
    default:
      return state;
  }
}

class TaskBoard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      date: moment().format("YYYYMMDD"),
      taskList: Raw.deserialize(this.getStateSync(moment().format("YYYYMMDD")), { terse: true }),
      save: true
    };
    this.storage = new taskListStorage()
  }

  dispatch(action){
    this.setState(prevState => taskBoardReducer(prevState, action))
  }

  updateTask(taskList){
    this.dispatch({ type: 'UPDATE_TASK', taskList: taskList })
    if (this.state.save){
      this.storage.set(this.state.date, Raw.serialize(taskList).document)
    }
  }

  updateDate(date){
    this.dispatch({ type: 'UPDATE_DATE', date: date, taskList: this.getTaskListByDate(date) })
  }

  showHowto(){
    this.dispatch({ type: 'SHOW_HOWTO' })
  }

  // get state via main process in sync.
  getStateSync(date){
    return ipcRenderer.sendSync('getTaskList', date)
  }

  getTaskListByDate(date){
    return Raw.deserialize(this.getStateSync(date), { terse: true })
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport
              date={this.state.date}
              taskList={this.state.taskList}
              onUpdateDate={this.updateDate.bind(this)}
              showHowto={!this.state.save}
            />
            <TaskViewport
              date={this.state.date}
              taskList={this.state.taskList}
              onUpdateTask={this.updateTask.bind(this)}
              onUpdateDate={this.updateDate.bind(this)}
              onClickHowto={this.showHowto.bind(this)}
              showHowto={!this.state.save}
            />
            <TimelineViewport
              date={this.state.date}
              taskList={this.state.taskList}
              onUpdateTask={this.updateTask.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = class MainContent extends React.Component {
  render() {
    return(
      <div className="window">
        <div id="window-content" className="window-content">
          <Header></Header>
          <TaskBoard></TaskBoard>
          <Footer></Footer>
        </div>
      </div>
    );
  }
};
