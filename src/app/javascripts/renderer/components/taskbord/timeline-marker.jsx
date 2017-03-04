import React from 'react';
import { findDOMNode } from 'react-dom'
import { DropTarget } from "react-dnd";
import * as Constants from '../constants'

const markerTarget = {
  hover(props, monitor, component) {
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    let moveTo = hoverBoundingRect.top - 80
    props.moveTask(monitor.getItem().taskKey, moveTo)
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
      <div key={this.props.key} className={this.props.className}>{this.props.key}</div>
    )
  }
}

module.exports = DropTarget(Constants.Types.TASK, markerTarget, targetCollect)(timelineMarker)
