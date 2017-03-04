import React from 'react';
import TaskEditor from './task-editor';
import moment from 'moment';

const TaskViewport = class TaskViewport extends React.Component {

  constructor(props){
    super(props)
    this.state = { date: this.props.date }
  }

  onClick(e){
    switch(e.target.className) {
      case "tomorrow":
        e.preventDefault()
        this.props.onUpdateDate(moment(this.state.date).add('d', 1).format("YYYYMMDD"))
        break
      case "yesterday":
        e.preventDefault()
        this.props.onUpdateDate(moment(this.state.date).add('d', -1).format("YYYYMMDD"))
        break
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.date !== this.props.date) {
      this.setState({ date: nextProps.date })
    }
  }

  render() {
    return (
      <div id="task-viewport" className="col-md-5 col-sm-6">
        <div className="ace-line"><span>{this.state.date}</span></div>
        <TaskEditor
          date={this.state.date}
          taskList={this.props.taskList}
          callbackToTv={this.props.onUpdateTask}
        />
        <div className="task-viewport-buttons">
          <div className="yesterday" onClick={this.onClick.bind(this)}>{"< Yesterday"}</div>
          <div className="tomorrow" onClick={this.onClick.bind(this)}>{"Tomorrow >"}</div>
        </div>
      </div>
    );
  }
}

module.exports = TaskViewport;
