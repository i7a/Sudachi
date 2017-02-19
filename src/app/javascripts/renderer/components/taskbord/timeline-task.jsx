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
    let taskList = this.props.taskList;
    let keys = Object.keys(taskList);
    let top = 50
    if (keys.length > 0) {
      keys.forEach((key, index) =>{
        if (taskList[key].description != "" ){
          let height = 49 * taskList[key].requiredTime / 60
          let style = {
            top: top.toString() + 'px',
            height: height.toString() + 'px'
          };
          tasks.push(<div key={key} className={taskList[key].done ? "task done" : "task"} style={style}><span>{taskList[key].description}</span></div>);
          top = top + height + 1
        }
      });
    }

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
