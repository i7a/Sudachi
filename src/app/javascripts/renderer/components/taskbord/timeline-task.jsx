import React, { PropTypes } from 'react';
import { DragSource } from "react-dnd";

const Types = {
  CARD: 'card'
}

const taskSource = {
  beginDrag(props) {
    return {
      text: "hoge"
    };
  }
  // endDrag(props, monitor) {
  //   const source = monitor.getItem()
  //   const target = monitor.getDropResult()
  //   if (target) props.dropAction(source.id, target.id)
  // }
}

function collect(connect, monitor){
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const propTypes = {
  text: PropTypes.string.isRequired,
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
}

const timelineTask = class TimelineTask extends React.Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props

    return connectDragSource(
      <div
        key={this.props.block.key}
        className={this.props.block.data.get("done", false) ? "task done" : "task"}
        style={this.props.style}>
        <span>{this.props.block.text}</span>
      </div>
    )
  }
}

module.exports = DragSource(Types.CARD, taskSource, collect)(timelineTask);
