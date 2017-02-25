import React from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Raw, Block} from 'slate'
import Task from './timeline-task'

const Operations = {
  UP: 'up',
  DOWN: 'down'
}

const TimelineViewport = class TimelineViewport extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      taskList: this.props.taskList
    }
  }

  // transform task state and callback main component.
  moveTask(dragKey, hoverKey){
    let dragBlock
    let hoverBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == dragKey) dragBlock = block
      if (block.key == hoverKey) hoverBlock = block
    })

    let dragPositionTop = dragBlock.data.get("positionTop")
    let hoverPositionTop = hoverBlock.data.get("positionTop")
    let moveUpList = []
    let operation

    if (dragPositionTop > hoverPositionTop) {
      operation = Operations.UP
    } else {
      operation = Operations.DOWN
    }

    // push move block list.
    this.props.taskList.document.nodes.map((block) => {
      let blockPositionTop = block.data.get("positionTop")
      if (operation == Operations.UP) {
        if (blockPositionTop < dragPositionTop && blockPositionTop >= hoverPositionTop) {
          moveUpList.push(block)
        }
      }
      if (operation == Operations.DOWN) {
        if (blockPositionTop > dragPositionTop && blockPositionTop <= hoverPositionTop) {
          moveUpList.push(block)
        }
      }
    })

    // move down target blocks.
    let dragBlockHeight = 50 * dragBlock.data.get("requiredTime", 60) / 60
    let size = this.props.taskList.document.nodes.size
    let transform = this.props.taskList.transform()

    moveUpList.forEach((block) => {
      let newPositionTop
      if (operation == Operations.UP) {
        newPositionTop = block.data.get("positionTop") + dragBlockHeight
      }
      if (operation == Operations.DOWN) {
        newPositionTop = block.data.get("positionTop") - dragBlockHeight
      }
      let targetBlock = Block.create({
        data: block.data.set("positionTop", newPositionTop),
        isVoid: block.isVoid,
        key: block.key,
        nodes: block.nodes,
        type: block.type
      })
      transform = transform
        .removeNodeByKey(block.key)
        .insertNodeByKey(this.props.taskList.document.key, size - 1, targetBlock)
    })

    // move up drop block.
    let dropBlock = Block.create({
      data: dragBlock.data.set("positionTop", hoverPositionTop),
      isVoid: dragBlock.isVoid,
      key: dragBlock.key,
      nodes: dragBlock.nodes,
      type: dragBlock.type
    })
    transform = transform
      .removeNodeByKey(dragKey)
      .insertNodeByKey(this.props.taskList.document.key, size - 1, dropBlock)

    // apply.
    this.props.callbackToTb(transform.apply())
    this.setState({ taskList: transform.apply() })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.taskList !== this.props.taskList) {
      this.setState({ taskList: nextProps.taskList })
    }
  }

  // make task panel html.
  renderTasks(){
    let tasks = []
    this.state.taskList.document.nodes.map((block, i) => {
      if (block.text != "") {
        let height = 49 * block.data.get("requiredTime", 60) / 60
        let style = {
          top: block.data.get("positionTop").toString() + 'px',
          height: height.toString() + 'px'
        };
        tasks.push(<Task key={i} taskKey={block.key} block={block} style={style} moveTask={this.moveTask.bind(this)}/>)
      }
    })
    return tasks.length > 0 ? tasks : null
  }

  render() {
    return (
      <div id="timeline-viewport" className="col-md-5 col-sm-6 hidden-xs">
        <table>
          <tbody>
            <tr height="1">
              <td className="tv-time"></td>
              <td className="tv-marker">
                {_.map(_.range(1, 14), (m, i) => {
                  return <div key={i} className="markercell"></div>;
                })}
              </td>
            </tr>
            <tr className="">
              <td className="tv-time">
                {_.map(_.range(8, 21), (t, i) => {
                  return <div key={i} className="time">{t + ":" + "00"}</div>
                })}
              </td>
              <td className="tv-task">
                {this.renderTasks()}
                <div className="nowmarker"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
module.exports = DragDropContext(HTML5Backend)(TimelineViewport);
