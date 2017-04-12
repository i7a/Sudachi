import React from 'react';
import { DragSource, DropTarget } from "react-dnd";
import * as Constants from '../constants'

const resizerSource = {
  beginDrag(props) {
    return {
      taskKey: props.taskKey,
      block: props.block,
      resize: true,
      initialReqiredTime: props.block.data.get("requiredTime")
    };
  },
  endDrag(props, monitor) {
    props.resizeTimelineWidth()
  }
}

function sourceCollect(connect, monitor){
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const timelineResizer = class TimelineResizer extends React.Component {
  render() {
    const { isDragging, connectDragSource } = this.props

    return connectDragSource(
      <div className={this.props.className}>=</div>
    )
  }
}

module.exports = DragSource(Constants.Types.TASK, resizerSource, sourceCollect)(timelineResizer)
