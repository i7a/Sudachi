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
import * as dateListUtil from '../../../utils/date-list.jsx'

const CalendarViewport = class CalendarViewport extends React.Component {

  updateDate(e) {
    let date = e.currentTarget.childNodes[0].childNodes[1].childNodes[3].innerHTML
    this.props.onUpdateDate(date)
    e.preventDefault()
  }

  clickMoreDown(e){
    let dateList = this.props.dateList
    let startDate = dateList[dateList.length - 1].date
    let date
    _.map(_.range(1, 5), (d, i) => {
      date = moment(startDate).add(+d, 'd').format("YYYYMMDD")
      dateList.push(dateListUtil.getDateWithTaskCount(date))
    })
    this.props.onUpdateDateList(dateList)
  }

  clickMoreUp(e){
    let dateList = this.props.dateList
    let startDate = dateList[0].date
    let date
    _.map(_.range(1, 5), (d, i) => {
      date = moment(startDate).add(-d, 'd').format("YYYYMMDD")
      dateList.unshift(dateListUtil.getDateWithTaskCount(date))
    })
    this.props.onUpdateDateList(dateList)
  }

  renderMenuItem() {
    let items = []
    let innerDivStyle = {}
    this.props.dateList.map((date, i) => {
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
      if (date.dateFull.substr(date.dateFull.length-3) == "Sun") {
        items.push(
          <Divider
            key={i+99999}
            style={{
              marginTop: "-2px",
              marginButtom: "0px",
              marginRight: "0px",
              marginLeft: "0px",
            }}
          />
        )
      }
    })
    // more button.
    items.unshift(
      <MenuItem
        key={_.last(items).key + 1}
        style={{minHeight: "25px", lineHeight: "25px"}}
        onTouchTap={this.clickMoreUp.bind(this)}>
        <div className="more up"/>
      </MenuItem>
    )
    items.push(
      <MenuItem
        key={_.last(items).key + 2}
        style={{minHeight: "25px", lineHeight: "25px"}}
        onTouchTap={this.clickMoreDown.bind(this)}>
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
            onTouchTap={this.props.showHistoryMenu.bind(this)}
          />
          <Drawer
            open={this.props.showHistory}
            containerStyle={{overflow: "hidden"}}>
            <div style={{textAlign: "right"}}>
              <FlatButton
                label="close ✕"
                onTouchTap={this.props.hideHistoryMenu.bind(this)}
              />
            </div>
            <div style={{overflow: "scroll", height: "calc(100% - 36px)"}}>
              {this.renderMenuItem()}
            </div>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

module.exports = CalendarViewport;
