import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from "react-dnd";
import * as Constants from '../constants';
import Resizer from './timeline-resizer';

const taskSource = {
  beginDrag(props) {
    return {
      taskKey: props.taskKey,
      block: props.block
    };
  },
  endDrag(props, monitor) {
    props.resizeTimelineWidth()
  }
}

const taskTarget = {
  hover(props, monitor, component) {
    if (monitor.getItem().resize) {
      let taskKey = monitor.getItem().taskKey
      let initialClientOffsetY = monitor.getInitialClientOffset().y
      let clientOffsetY = monitor.getClientOffset().y
      let tmp = clientOffsetY - initialClientOffsetY
      if (tmp <= 0) tmp -= 25
      let nextRequiredTime = ((Math.floor(tmp / 25) + 1) * 30) + monitor.getItem().initialReqiredTime
      if (nextRequiredTime <= 0) nextRequiredTime = 30
      if (nextRequiredTime == props.block.data.get("requiredTime")) return
      props.resizeTask(taskKey, nextRequiredTime)
    } else {
      const dragKey = monitor.getItem().taskKey
      let clientOffsetY = Math.floor(monitor.getClientOffset().y) - 80 + props.scrollTop()
      let moveTo = clientOffsetY - (clientOffsetY % 25)
      if (moveTo == props.block.data.get("positionTop")) return
      props.moveTask(dragKey, moveTo)
    }
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

  setTaskClass(block) {
    let taskClass = "task"
    if ( block.data.get("done", false) == true) {
      taskClass += " done"
    } else if ( block.data.get("positionTop", 500) >= 925 ) {
      taskClass += " alert"
    }
    let top = block.data.get("positionTop", 500)
    let height = Constants.heightPerHour * block.data.get("requiredTime", 60) / 60
    if (this.props.nowMarkerTop > (top + height) && !block.data.get("done")) taskClass += " past"
    return taskClass
  }

  setTaskStyle(block) {
    let top = block.data.get("positionTop", 500)
    let height = Constants.heightPerHour * block.data.get("requiredTime", 60) / 60
    let width = block.data.get("width", 55)
    let marginLeft = block.data.get("marginLeft", 0)
    let taskStyle = {
      top: top.toString() + 'px',
      height: height.toString() + 'px',
      width: width.toString() + '%',
      marginLeft: marginLeft.toString() + '%'
    };
    return taskStyle
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget, text } = this.props

    return connectDragSource(connectDropTarget(
      <div
        className={this.setTaskClass(this.props.block)}
        style={this.setTaskStyle(this.props.block)}>
        <span>{this.props.block.text}</span>
        <Resizer
          taskKey={this.props.taskKey}
          block={this.props.block}
          resizeTask={this.props.resizeTask}
          resizeTimelineWidth={this.props.resizeTimelineWidth}
        />
      </div>
    ))
  }
}

module.exports = DragSource(Constants.Types.TASK, taskSource, sourceCollect)(DropTarget(Constants.Types.TASK, taskTarget, targetCollect)(timelineTask));
