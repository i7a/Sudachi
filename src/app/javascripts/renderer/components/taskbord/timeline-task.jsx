import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from "react-dnd";

const Types = {
  TASK: 'task'
}

const taskSource = {
  beginDrag(props) {
    return {
      taskKey: props.taskKey
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
    const dragKey = monitor.getItem().key
    const hoverKey = props.taskKey
    console.log(hoverKey)
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

module.exports = DragSource(Types.TASK, taskSource, sourceCollect)(DropTarget(Types.TASK, taskTarget, targetCollect)(timelineTask));
