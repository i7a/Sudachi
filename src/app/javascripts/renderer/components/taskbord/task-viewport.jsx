import React from 'react';
import TaskEditor from './task-editor';

const TaskViewport = class TaskViewport extends React.Component {
  render() {
    return (
      <div id="task-viewport" className="col-md-5 col-sm-6">
        <div className="ace-line"><span>20161018</span></div>
        <TaskEditor
          callbackToTv={this.props.callbackToTb}
          callbackClicktoTv={this.props.callbackClickToTb}
        />
      </div>
    );
  }
}

module.exports = TaskViewport;
