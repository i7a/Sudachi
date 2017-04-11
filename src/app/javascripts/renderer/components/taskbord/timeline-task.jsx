import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from "react-dnd";
import * as Constants from '../constants'

const taskSource = {
  beginDrag(props) {
    return {
      taskKey: props.taskKey,
      block: props.block
    };
  }
  // endDrag(props, monitor) {
  //   const source = monitor.getItem()
  //   const target = monitor.getDropResult()
  //   if (target) props.dropAction(source.id, target.id)
  // }
}

const taskTarget = {
  hover(props, monitor, component) {
    const dragKey = monitor.getItem().taskKey
    const hoverKey = props.taskKey
    if (dragKey == hoverKey) return
    let clientOffsetY = Math.floor(monitor.getClientOffset().y) - 80
    let moveTo = clientOffsetY - (clientOffsetY % 25)
    props.moveTask(dragKey, moveTo)
  }
}

function sourceCollect(connect, monitor){
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function targetCollect(connect){
  return {
    connectDropTarget: connect.dropTarget()
  }
}

const timelineTask = class TimelineTask extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      style: {},
      class: ""
    }
  }

  setTaskClass(block) {
    let taskClass = this.state.class
    taskClass = "task"
    if ( block.data.get("done", false) == true) {
      taskClass += " done"
    } else if ( block.data.get("positionTop", 500) >= 925 ) {
      taskClass += " alert"
    }
    let top = block.data.get("positionTop", 500)
    let height = Constants.heightPerHour * block.data.get("requiredTime", 60) / 60
    if (this.props.nowMarkerTop > (top + height) && !block.data.get("done")) taskClass += " past"
    this.setState({class: taskClass})
  }

  setTaskStyle(block) {
    let top = block.data.get("positionTop", 500)
    let height = Constants.heightPerHour * block.data.get("requiredTime", 60) / 60
    let style = {
      top: top.toString() + 'px',
      height: height.toString() + 'px'
    };
    this.setState({style: style})
  }

  componentWillMount() {
    this.setTaskStyle(this.props.block)
    this.setTaskClass(this.props.block)
  }

  componentWillReceiveProps(nextProps) {
    this.setTaskStyle(nextProps.block)
    this.setTaskClass(nextProps.block)
  }

  onMouseOverTask() {
    this.setState({class: this.state.class += " over"})
  }

  onMouseOutTask() {
    this.setState({class: this.state.class.replace( /\ over/g , "")})
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget, text } = this.props

    return connectDragSource(connectDropTarget(
      <div
        className={this.state.class}
        style={this.state.style}
        onMouseOver={this.onMouseOverTask.bind(this)}
        onMouseOut={this.onMouseOutTask.bind(this)}>
        <span>{this.props.block.text}</span>
      </div>
    ))
  }
}

module.exports = DragSource(Constants.Types.TASK, taskSource, sourceCollect)(DropTarget(Constants.Types.TASK, taskTarget, targetCollect)(timelineTask));
