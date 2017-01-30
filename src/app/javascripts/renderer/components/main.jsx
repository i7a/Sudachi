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
    this.state = {taskList: []};
  }

  setClickEventForListObject() {
    let listObject = document.getElementsByClassName("public-DraftStyleDefault-unorderedListItem");
    let taskList = this.state.taskList;
    let _this = this;
    _.each(listObject, (lo, i) => {
      lo.addEventListener('click', function(){
        let offsetKey = this.dataset.offsetKey.substring(0, 5);
        _.each(taskList, (tl, i) => {
          if (offsetKey == taskList[i].key) {
            taskList[i].done = !(taskList[i].done);
          }
        });
        this.classList.toggle('done');
        _this.setState({taskList: taskList});
      }, false);
    });
  }

  onUpdateTask(state) {
    this.state.taskList = [];
    state.document.nodes.map((block) => {
      this.state.taskList.push({
        key: block.key,
        description: block.text,
        done: false
      });
    });
    let taskList = this.state.taskList;
    this.setState({taskList: taskList});
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport></CalendarViewport>
            <TaskViewport callbackToTb={this.onUpdateTask.bind(this)}></TaskViewport>
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
