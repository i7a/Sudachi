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
import * as Constants from './constants'
injectTapEventPlugin();

const HowtoContents = Raw.deserialize(Howto, { terse: true })
const today = moment().format("YYYYMMDD")
const taskBoardDefaultState = {
  date: today,
  taskList: {},
  save: true,
  taskCount: 0,
  nextTaskPositionTop: Constants.initialPositionTop,
  markerPositionTop: Constants.markerPositionTop()
}

const taskBoardReducer = (state = taskBoardDefaultState, action) => {
  switch (action.type) {
    case 'UPDATE_TASK':
      return {
        taskList: action.taskList,
        taskCount: action.taskCount,
        nextTaskPositionTop: action.nextTaskPositionTop,
        save: true
      };
    case 'UPDATE_DATE':
      return {
        date: action.date,
        taskList: action.taskList,
        taskCount: action.taskCount,
        nextTaskPositionTop: action.nextTaskPositionTop,
        save: true
      };
    case 'UPDATE_MARKER':
      return {
        markerPositionTop: Constants.markerPositionTop()
      };
    case 'SHOW_HOWTO':
      return {
        taskList: HowtoContents,
        save: false
      };
    default:
      return state;
  }
}

class TaskBoard extends React.Component {

  constructor(props){
    super(props);
    this.state = taskBoardDefaultState;
    this.state.taskList = Raw.deserialize(this.getStateSync(moment().format("YYYYMMDD")), { terse: true });
    this.storage = new taskListStorage();
  }

  dispatch(action){
    this.setState(prevState => taskBoardReducer(prevState, action))
  }

  updateTask(taskList){
    let nextTaskCount = this.getTaskCount(taskList)
    this.dispatch({
      type: 'UPDATE_TASK',
      taskList: taskList,
      taskCount: nextTaskCount,
      nextTaskPositionTop: this.getNextTaskPositionTop(taskList, nextTaskCount, this.state.date)
    })
    if (this.state.save){
      this.storage.set(this.state.date, Raw.serialize(taskList).document)
    }
  }

  updateDate(date){
    let nextTaskList = this.getTaskListByDate(date)
    let nextTaskCount = this.getTaskCount(nextTaskList)
    this.dispatch({
      type: 'UPDATE_DATE',
      date: date,
      taskList: nextTaskList,
      taskCount: nextTaskCount,
      nextTaskPositionTop: this.getNextTaskPositionTop(nextTaskList, nextTaskCount, date)
    })
  }

  updateMarker(){
    this.dispatch({
      type: 'UPDATE_MARKER'
    })
  }

  showHowto(){
    this.dispatch({
      type: 'SHOW_HOWTO'
    })
  }

  getStateSync(date){
    return ipcRenderer.sendSync('getTaskList', date)
  }

  getTaskListByDate(date){
    return Raw.deserialize(this.getStateSync(date), { terse: true })
  }

  getTaskCount(taskList){
    let taskCount = 0
    let breaker = false
    taskList.document.nodes.map((block) => {
      if (block.type == "separator") breaker = true
      if (breaker) return
      if (Constants.showInTimeline.includes(block.type) >= 0 && block.text != "") taskCount++
    })
    return taskCount
  }

  getNextTaskPositionTop(taskList, taskCount, date){
    let bottom = 450
    let requiredTime = 0
    let breaker = false
    if (taskCount == 0) {
      return Constants.initialPositionTop
    } else if (taskCount == this.state.taskCount && date == this.state.date) {
      return this.state.nextTaskPositionTop
    } else {
      taskList.document.nodes.map((block) => {
        if (block.type == "separator") breaker = true
        if (breaker) return
        if (Constants.showInTimeline.includes(block.type) >= 0 && block.text != "") {
          if (block.data.get("positionTop") >= bottom) {
            bottom = block.data.get("positionTop")
            requiredTime = block.data.get("requiredTime")
          }
        }
      })
      if (bottom > 1200) bottom = 1200
    }
    return bottom + (Constants.heightPerHour * (requiredTime / 60))
  }

  componentDidMount(){
    setInterval(() => { this.updateMarker() }, 60000)
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
              nextTaskPositionTop={this.state.nextTaskPositionTop}
              onUpdateTask={this.updateTask.bind(this)}
              onUpdateDate={this.updateDate.bind(this)}
              onClickHowto={this.showHowto.bind(this)}
              showHowto={!this.state.save}
            />
            <TimelineViewport
              date={this.state.date}
              taskList={this.state.taskList}
              markerPositionTop={this.state.markerPositionTop}
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
