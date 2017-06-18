import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import { Raw } from 'slate';
import { ipcRenderer } from 'electron';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaiseButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const CalendarViewport = class CalendarViewport extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      dateList: this.initialDateList()
    }
  }

  initialDateList() {
    let dateList = []
    _.map(_.range(1, 30), (d, i) => {
      dateList.push({
        date: moment().add(d - 15, 'd').format("YYYYMMDD"),
        dateFull: moment().add(d - 15, 'd').format("YYYY.M.D ddd"),
        task: 0,
        taskDone: 0,
        complete: false
      })
    })
    return dateList
  }

  nextDateList(taskList, date){
    let task = 0
    let taskDone = 0
    taskList.document.nodes.map((block) => {
      if (block.type == "task-list") {
        task++
      } else if (block.type == "task-list-done") {
        taskDone++
      }
    })
    let dateList = this.state.dateList
    let targetIndex = _.findIndex(this.state.dateList, {date: date})
    dateList[targetIndex] = {
      date: date,
      dateFull: this.state.dateList[targetIndex].dateFull,
      task: task,
      taskDone: taskDone,
      complete: (task + taskDone) == taskDone
    }
    return dateList
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  updateDate(e) {
    let date = e.currentTarget.childNodes[0].childNodes[1].childNodes[3].innerHTML
    this.props.onUpdateDate(date)
    e.preventDefault()
  }

  componentDidMount(){
    ipcRenderer.on('getTaskListAsync', (event, arg) => {
      let taskList = Raw.deserialize(arg.value, { terse: true })
      this.setState({
        dateList: this.nextDateList(taskList, arg.date)
      })
    })
    _.map(_.range(1, 30), (d, i) => {
      ipcRenderer.send('getTaskListAsync', moment().add(d - 15, 'd').format("YYYYMMDD"))
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showHowto) return
    if (nextProps.taskList !== this.props.taskList) {
      this.setState({
        dateList: this.nextDateList(nextProps.taskList, this.props.date)
      })
    }
  }

  renderMenuItem() {
    let items = []
    let innerDivStyle = {}
    this.state.dateList.map((date, i) => {
      innerDivStyle = date.date == this.props.date ? {fontWeight: "bold", backgroundColor: "rgba(123, 199, 175, 0.2)"} : {}
      let taskCount = date.task > 0 ? <div className="task-count"><span>{date.task}</span></div> : ""
      items.push(
        <MenuItem
          key={i}
          innerDivStyle={innerDivStyle}
          onTouchTap={this.updateDate.bind(this)}>
          {date.dateFull}
          <div style={{display: "none"}}>{date.date}</div>
          {taskCount}
        </MenuItem>
      )
      if (date.dateFull.substr(date.dateFull.length-3) == "Sun") {items.push(<Divider key={i+99999}/>)}
    })
    // more button.
    items.unshift(
      <MenuItem
        key={_.last(items).key + 1}
        style={{minHeight: "25px", lineHeight: "25px"}}>
        <div className="more up"/>
      </MenuItem>
    )
    items.push(
      <MenuItem
        key={_.last(items).key + 2}
        style={{minHeight: "25px", lineHeight: "25px"}}>
        <div className="more down"/>
      </MenuItem>
    )
    return items
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      {/* <MuiThemeProvider> */}
        <div id="calendar-viewport" className="col-md-2 hidden-sm hidden-xs">
          <RaiseButton
            label="history"
            onTouchTap={this.handleToggle.bind(this)}
          />
          <Drawer
            open={this.state.open}
            containerStyle={{overflow: "hidden"}}>
            <div style={{textAlign: "right"}}>
              <FlatButton
                label="close ✕"
                onTouchTap={this.handleToggle.bind(this)}
              />
            </div>
            <div style={{overflow: "scroll", overflowStyle: "auto 25px", height: "calc(100% - 36px)"}}>
              {this.renderMenuItem()}
            </div>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

module.exports = CalendarViewport;
