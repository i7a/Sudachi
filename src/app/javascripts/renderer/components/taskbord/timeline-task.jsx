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

const TimelineTask = class TvTask extends React.Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props
    let index = 1;
    let tasks = [];
    let top = 50

    this.props.taskList.document.nodes.map((block) => {
      if (block.text != "") {
        let height = 49 * block.data.get("requiredTime", 60) / 60
        let style = {
          top: top.toString() + 'px',
          height: height.toString() + 'px'
        };
        tasks.push(<div key={block.key} className={block.data.get("done", false) ? "task done" : "task"} style={style}><span>{block.text}</span></div>);
        top = top + height + 1
      }
    })

    if (tasks) {
      return connectDragSource(
        <td className="tv-task">
          {tasks}
          <div className="nowmarker"></div>
        </td>
      );
    } else {
      return null;
    }
  }
}

module.exports = DragSource(Types.CARD, taskSource, collect)(TimelineTask);
