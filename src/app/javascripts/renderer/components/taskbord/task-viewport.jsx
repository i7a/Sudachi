import React from 'react';
import TaskEditor from './task-editor';
import moment from 'moment';

const TaskViewport = class TaskViewport extends React.Component {

  constructor(props){
    super(props)
    this.state = { date: moment().format("YYYYMMDD") }
  }

  onClick(e){
    switch(e.target.className) {
      case "tomorrow":
        e.preventDefault()
        this.setState({date: moment(this.state.date).add('d', 1).format("YYYYMMDD")})
        break
      case "yesterday":
        e.preventDefault()
        this.setState({date: moment(this.state.date).add('d', -1).format("YYYYMMDD")})
        break
    }
  }

  render() {
    return (
      <div id="task-viewport" className="col-md-5 col-sm-6">
        <div className="ace-line"><span>{this.state.date}</span></div>
        <TaskEditor
          date={this.state.date}
          callbackToTv={this.props.callbackToTb}
          callbackClicktoTv={this.props.callbackClickToTb}
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
