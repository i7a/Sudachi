import React from 'react';
import _ from 'lodash';
import moment from 'moment';
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
import * as dateListUtil from '../../utils/date-list'
import * as taskListUtil from '../../utils/task-list'
injectTapEventPlugin();

const HowtoContents = Raw.deserialize(Howto, { terse: true })
const today = moment().format("YYYYMMDD")
const storage = new taskListStorage()
const taskBoardDefaultState = {
  date: today,
  taskList: taskListUtil.getTaskListByDate(moment().format("YYYYMMDD")),
  save: true,
  nextTaskPositionTop: Constants.initialPositionTop,
  markerPositionTop: Constants.markerPositionTop(),
  showHistory: false,
  dateList: dateListUtil.getDateListWithTaskCount(Constants.initialDateList())
}

const taskBoardReducer = (state = taskBoardDefaultState, action) => {
  switch (action.type) {
    case 'UPDATE_TASK':
      return {
        taskList: action.taskList,
        nextTaskPositionTop: action.nextTaskPositionTop,
        dateList: action.dateList
      };
    case 'UPDATE_DATE':
      return {
        date: action.date,
        taskList: action.taskList,
        nextTaskPositionTop: action.nextTaskPositionTop,
        dateList: action.dateList,
        save: true
      };
    case 'UPDATE_MARKER':
      return {
        markerPositionTop: Constants.markerPositionTop()
      };
    case 'UPDATE_DATE_LIST':
      return {
        dateList: action.dateList
      }
    case 'SHOW_HOWTO':
      return {
        taskList: HowtoContents,
        save: false
      };
    case 'SHOW_HISTORY':
      return {
        showHistory: true
      };
    case 'HIDE_HISTORY':
      return {
        showHistory: false
      };
    default:
      return state;
  }
}

class TaskBoard extends React.Component {

  constructor(props){
    super(props);
    this.state = taskBoardDefaultState;
  }

  dispatch(action){
    console.log(action.type)
    this.setState(prevState => taskBoardReducer(prevState, action))
  }

  updateTask(taskList){
    this.dispatch({
      type: 'UPDATE_TASK',
      taskList: taskList,
      nextTaskPositionTop: this.getNextTaskPositionTop(taskList, this.state.date),
      dateList: dateListUtil.getDateListWithTaskCountByDate(this.state.dateList, taskList, this.state.date)
    })
    if (this.state.save) storage.set(this.state.date, Raw.serialize(taskList).document)
  }

  updateDate(date){
    let nextTaskList = taskListUtil.getTaskListByDate(date)
    this.dispatch({
      type: 'UPDATE_DATE',
      date: date,
      taskList: nextTaskList,
      nextTaskPositionTop: this.getNextTaskPositionTop(nextTaskList, date),
      dateList: dateListUtil.getDateListWithTaskCountByDate(this.state.dateList, nextTaskList, date)
    })
  }

  updateDateList(dateList){
    this.dispatch({ type: 'UPDATE_DATE_LIST', dateList: dateList })
  }

  updateMarker(){
    this.dispatch({ type: 'UPDATE_MARKER' })
  }

  showHowto(){
    this.dispatch({ type: 'SHOW_HOWTO' })
  }

  showHistoryMenu(){
    this.dispatch({ type: 'SHOW_HISTORY' })
  }

  hideHistoryMenu(){
    this.dispatch({ type: 'HIDE_HISTORY' })
  }

  getNextTaskPositionTop(taskList, date){
    let bottom = 450
    let requiredTime = 0
    let breaker = false
    let showInTimelineTaskCount = taskListUtil.getShowInTimelineTaskCount(taskList)
    let prevShowInTimelineTaskCount = taskListUtil.getShowInTimelineTaskCount(this.state.taskList)
    if (showInTimelineTaskCount == 0) {
      return Constants.initialPositionTop
    } else if (showInTimelineTaskCount == prevShowInTimelineTaskCount && date == this.state.date) {
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
              onUpdateDateList={this.updateDateList.bind(this)}
              showHistoryMenu={this.showHistoryMenu.bind(this)}
              hideHistoryMenu={this.hideHistoryMenu.bind(this)}
              dateList={this.state.dateList}
              showHowto={!this.state.save}
              showHistory={this.state.showHistory}
            />
            <TaskViewport
              date={this.state.date}
              taskList={this.state.taskList}
              nextTaskPositionTop={this.state.nextTaskPositionTop}
              onUpdateTask={this.updateTask.bind(this)}
              onUpdateDate={this.updateDate.bind(this)}
              onClickHowto={this.showHowto.bind(this)}
              showHowto={!this.state.save}
              markerPositionTop={this.state.markerPositionTop}
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
