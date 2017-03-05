import React from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Raw, Block} from 'slate'
import * as Constants from '../constants'
import Task from './timeline-task'
import Marker from './timeline-marker'

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

  // when drag task and drop to timeline marker
  moveTask(dragKey, moveTo){
    let dragBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == dragKey) dragBlock = block
    })

    let dropBlock = Block.create({
      data: dragBlock.data.set("positionTop", moveTo),
      isVoid: dragBlock.isVoid,
      key: dragBlock.key,
      nodes: dragBlock.nodes,
      type: dragBlock.type
    })

    let transform = this.props.taskList.transform()
      .removeNodeByKey(dragKey)
      .insertNodeByKey(this.props.taskList.document.key, this.props.taskList.document.nodes.indexOf(dragBlock), dropBlock)

    // apply.
    this.props.onUpdateTask(transform.apply())
    this.setState({ taskList: transform.apply() })
  }

  // when drag task and drop to other task.
  sortTask(dragKey, hoverKey){
    let dragBlock
    let hoverBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == dragKey) dragBlock = block
      if (block.key == hoverKey) hoverBlock = block
    })

    let dragPositionTop = dragBlock.data.get("positionTop")
    let hoverPositionTop = hoverBlock.data.get("positionTop")
    let moveTargetList = []
    let operation

    if (dragPositionTop > hoverPositionTop) {
      operation = Operations.UP
    } else {
      operation = Operations.DOWN
    }

    // push target block list.
    this.props.taskList.document.nodes.map((block, i) => {
      let blockPositionTop = block.data.get("positionTop")
      if (operation == Operations.UP) {
        if (blockPositionTop < dragPositionTop && blockPositionTop >= hoverPositionTop) {
          moveTargetList.push({block: block, index: i})
        }
      }
      if (operation == Operations.DOWN) {
        if (blockPositionTop > dragPositionTop && blockPositionTop <= hoverPositionTop) {
          moveTargetList.push({block: block, index: i})
        }
      }
    })

    // move target blocks.
    let dragBlockHeight = (49 * dragBlock.data.get("requiredTime", 60) / 60) + 1
    let transform = this.props.taskList.transform()
    let targetEdge = operation == Operations.UP ? 9999999999999 : 0
    let dropPositionTop

    moveTargetList.forEach((target) => {
      let newPositionTop
      if (operation == Operations.UP) {
        newPositionTop = target.block.data.get("positionTop") + dragBlockHeight
        if (targetEdge > newPositionTop) {
          targetEdge = newPositionTop
          dropPositionTop = targetEdge - ((49 * dragBlock.data.get("requiredTime") / 60) + 1)
        }
      }
      if (operation == Operations.DOWN) {
        newPositionTop = target.block.data.get("positionTop") - dragBlockHeight
        if (targetEdge < newPositionTop) {
          targetEdge = newPositionTop
          dropPositionTop = targetEdge + ((49 * target.block.data.get("requiredTime") / 60) + 1)
        }
      }
      let targetBlock = Block.create({
        data: target.block.data.set("positionTop", newPositionTop),
        isVoid: target.block.isVoid,
        key: target.block.key,
        nodes: target.block.nodes,
        type: target.block.type
      })
      transform = transform
        .removeNodeByKey(target.block.key)
        .insertNodeByKey(this.props.taskList.document.key, target.index, targetBlock)
    })

    // move drop block.
    let dropBlock = Block.create({
      data: dragBlock.data.set("positionTop", dropPositionTop),
      isVoid: dragBlock.isVoid,
      key: dragBlock.key,
      nodes: dragBlock.nodes,
      type: dragBlock.type
    })
    transform = transform
      .removeNodeByKey(dragKey)
      .insertNodeByKey(this.props.taskList.document.key, this.props.taskList.document.nodes.indexOf(dragBlock), dropBlock)

    // apply.
    this.props.onUpdateTask(transform.apply())
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
    let breaker = false
    this.state.taskList.document.nodes.map((block, i) => {
      if (block.type == "separator") breaker = true;
      if (breaker) return
      if (Constants.showInTimeline.indexOf(block.type) >= 0 && block.text != "") {
        let height = 49 * block.data.get("requiredTime", 60) / 60
        let style = {
          top: block.data.get("positionTop").toString() + 'px',
          height: height.toString() + 'px'
        };
        tasks.push(<Task key={i} taskKey={block.key} block={block} style={style} sortTask={this.sortTask.bind(this)}/>)
      }
    })
    return tasks.length > 0 ? tasks : null
  }

  render() {
    return (
      <div id="timeline-viewport" className="col-md-5 col-sm-6 hidden-xs">
        <table>
          <tbody>
            <tr className="">
              <td className="tv-time">
                {_.map(_.range(8, 21), (t, i) => {
                  return <div key={i} className="time">{t + ":" + "00"}</div>
                })}
              </td>
              <td className="tv-task tv-marker">
                {_.map(_.range(1, 28), (m, i) => {
                  return (
                    <Marker
                      key={i}
                      className={i % 2 == 0 ? "markercell marker-border" : "markercell"}
                      moveTask={this.moveTask.bind(this)}
                    />
                  );
                })}
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
