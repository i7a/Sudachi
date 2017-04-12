import React from 'react';
import { findDOMNode } from 'react-dom'
import { DropTarget } from "react-dnd";
import * as Constants from '../constants'

const markerTarget = {
  hover(props, monitor, component) {
    let taskKey = monitor.getItem().taskKey
    if (monitor.getItem().resize) {
      let initialClientOffsetY = monitor.getInitialClientOffset().y
      let clientOffsetY = monitor.getClientOffset().y
      let tmp = clientOffsetY - initialClientOffsetY
      if (tmp <= 0) tmp -= 25
      let nextRequiredTime = ((Math.floor(tmp / 25) + 1) * 30) + monitor.getItem().initialReqiredTime
      if (nextRequiredTime <= 0) nextRequiredTime = 30
      props.resizeTask(taskKey, nextRequiredTime)
    } else {
      props.moveTask(taskKey, props.positionTop)
    }
  }
}

function targetCollect(connect){
  return {
    connectDropTarget: connect.dropTarget()
  }
}

const timelineMarker = class TimelineMarker extends React.Component {
  render() {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div
        key={this.props.key}
        className={this.props.className}
        style={this.props.style}
      />
    )
  }
}

module.exports = DropTarget(Constants.Types.TASK, markerTarget, targetCollect)(timelineMarker)
