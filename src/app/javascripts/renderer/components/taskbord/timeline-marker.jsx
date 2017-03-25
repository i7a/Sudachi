import React from 'react';
import { findDOMNode } from 'react-dom'
import { DropTarget } from "react-dnd";
import * as Constants from '../constants'

const markerTarget = {
  hover(props, monitor, component) {
    props.moveTask(monitor.getItem().taskKey, props.positionTop)
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
