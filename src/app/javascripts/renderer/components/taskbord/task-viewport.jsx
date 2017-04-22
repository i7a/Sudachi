import React from 'react';
import TaskEditor from './task-editor';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

const TaskViewport = class TaskViewport extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      date: this.props.date,
      shouldCallFocus: false
    }
  }

  onClickYesterday(){
    this.props.onUpdateDate(moment(this.state.date).add(-1, 'd').format("YYYYMMDD"))
  }

  onClickTomorrow(){
    this.props.onUpdateDate(moment(this.state.date).add(1, 'd').format("YYYYMMDD"))
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.date !== this.props.date) {
      this.setState({ date: nextProps.date })
    }
  }

  onClickEditorArea(e){
    e.preventDefault()
    if (e.target.className == "editor-area") {
      this.setState(
        { shouldCallFocus: true },
        () => this.setState({ shouldCallFocus: false })
      )
    }
  }

  render() {
    return (
      <div id="task-viewport" className="col-md-5 col-sm-6">
        <div className="editor-area" onClick={this.onClickEditorArea.bind(this)}>
          <div className="ace-line"><span>{moment([this.state.date.slice(0,4), this.state.date.slice(4,6), this.state.date.slice(6,8)].join("-")).format("YYYY.M.D ddd")}</span></div>
          <TaskEditor
            date={this.state.date}
            taskList={this.props.taskList}
            callbackToTv={this.props.onUpdateTask}
            shouldCallFocus={this.state.shouldCallFocus}
          />
        </div>
        <div className="task-viewport-buttons">
          <MuiThemeProvider>
            <div>
              <FlatButton
                label="<Yesterday"
                className="yesterday"
                onTouchTap={this.onClickYesterday.bind(this)}
              />
              <FlatButton
                label="Tomorrow>"
                className="tomorrow"
                onTouchTap={this.onClickTomorrow.bind(this)}
              />
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

module.exports = TaskViewport;
