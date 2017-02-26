import React from 'react';
import _ from 'lodash';
import moment from 'moment'
import { Raw } from 'slate'
import { ipcRenderer } from 'electron'
import Header from './header';
import Footer from './footer';
import TimelineViewport from './taskbord/timeline-viewport';
import CalendarViewport from './taskbord/calendar-viewport';
import TaskViewport from './taskbord/task-viewport';

class TaskBoard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      date: moment().format("YYYYMMDD"),
      taskList: Raw.deserialize(this.getState(moment().format("YYYYMMDD")), { terse: true })
    };
  }

  // get state via main process.
  getState(date){
    return ipcRenderer.sendSync('getTaskList', date)
  }

  // called child component when task changed.
  onUpdateTask(state) {
    this.setState({taskList: state});
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport/>
            <TaskViewport
              date={this.state.date}
              taskList={this.state.taskList}
              callbackToTb={this.onUpdateTask.bind(this)}
            />
            <TimelineViewport
              taskList={this.state.taskList}
              callbackToTb={this.onUpdateTask.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = class MainContent extends React.Component {
  componentDidMount() {

  }
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
