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
    props.sortTask(dragKey, hoverKey)
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
  render() {
    const { isDragging, connectDragSource, connectDropTarget, text } = this.props

    return connectDragSource(connectDropTarget(
      <div
        className={this.props.block.data.get("done", false) ? "task done" : "task"}
        style={this.props.style}>
        <span>{this.props.block.text}</span>
      </div>
    ))
  }
}

module.exports = DragSource(Constants.Types.TASK, taskSource, sourceCollect)(DropTarget(Constants.Types.TASK, taskTarget, targetCollect)(timelineTask));
