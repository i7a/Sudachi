import React from 'react';
import _ from 'lodash';
import Header from './header';
import Footer from './footer';
import TimelineViewport from './taskbord/timeline-viewport';
import CalendarViewport from './taskbord/calendar-viewport';
import TaskViewport from './taskbord/task-viewport';

class TaskBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {taskList: {}};
  }

  onUpdateTask(state) {
    this.state.taskList = {};
    state.document.nodes.map((block) => {
      let done = block.type == 'task-list-done' ? true : false
      this.state.taskList[block.key] = {
        description: block.text,
        done: done
      };
    });
    this.setState({taskList: this.state.taskList});
  }

  onClickTask(state) {
    this.state.taskList[state.startBlock.key].done = !(this.state.taskList[state.startBlock.key].done)
    this.setState({taskList: this.state.taskList});
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport></CalendarViewport>
            <TaskViewport
              callbackToTb={this.onUpdateTask.bind(this)}
              callbackClickToTb={this.onClickTask.bind(this)}
            />
            <TimelineViewport taskList={this.state.taskList}></TimelineViewport>
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
