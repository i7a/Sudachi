import React from 'react';
import _ from 'lodash';
import moment from 'moment'
import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import taskListStorage from '../../modules/task-list-storage';
import Header from './header';
import Footer from './footer';
import TimelineViewport from './taskbord/timeline-viewport';
import CalendarViewport from './taskbord/calendar-viewport';
import TaskViewport from './taskbord/task-viewport';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class TaskBoard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      date: moment().format("YYYYMMDD"),
      taskList: Raw.deserialize(this.getState(moment().format("YYYYMMDD")), { terse: true })
    };
    this.storage = new taskListStorage()
  }

  // get state via main process.
  getState(date){
    return ipcRenderer.sendSync('getTaskList', date)
  }

  // called child component when task changed.
  onUpdateTask(state) {
    this.setState({taskList: state});
    this.storage.set(this.state.date, Raw.serialize(state).document)
  }

  // called child component when date changed.
  onUpdateDate(date) {
    this.setState({date: date})
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport
              onUpdateDate={this.onUpdateDate.bind(this)}
              date={this.state.date}
            />
            <TaskViewport
              date={this.state.date}
              taskList={this.state.taskList}
              onUpdateTask={this.onUpdateTask.bind(this)}
              onUpdateDate={this.onUpdateDate.bind(this)}
            />
            <TimelineViewport
              taskList={this.state.taskList}
              onUpdateTask={this.onUpdateTask.bind(this)}
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
