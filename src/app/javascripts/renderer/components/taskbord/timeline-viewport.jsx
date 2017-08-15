import React from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Raw, Block} from 'slate'
import * as Constants from '../constants'
import Task from './timeline-task'
import Marker from './timeline-marker'
import moment from 'moment'
import { findDOMNode } from 'react-dom';

const Operations = {
  UP: 'up',
  DOWN: 'down'
}

const PositionRange = Constants.positionRange()

const TimelineViewport = class TimelineViewport extends React.Component {

  // when drag task and drop to timeline marker
  moveTask(dragKey, moveTo){
    let dragBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == dragKey) dragBlock = block
    })

    if (dragBlock.data.get("positionTop") == moveTo) return

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
  }

  resizeTask(dragKey, requiredTime){
    let dragBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == dragKey) dragBlock = block
    })

    if (dragBlock.data.get("requiredTime") == requiredTime) return

    let resizedBlock = Block.create({
      data: dragBlock.data.set("requiredTime", requiredTime),
      isVoid: dragBlock.isVoid,
      key: dragBlock.key,
      nodes: dragBlock.nodes,
      type: dragBlock.type
    })

    let transform = this.props.taskList.transform()
      .removeNodeByKey(dragKey)
      .insertNodeByKey(this.props.taskList.document.key, this.props.taskList.document.nodes.indexOf(dragBlock), resizedBlock)

    // apply.
    this.props.onUpdateTask(transform.apply())
  }

  resizeTimelineWidth(){
    let displayTasks = []
    let breaker = false
    this.props.taskList.document.nodes.map((block, i) => {
      if (block.type == "separator") breaker = true;
      if (breaker) return
      if (Constants.showInTimeline.indexOf(block.type) >= 0 && block.text != "") displayTasks.push(block)
    })
    let taskPositionRange = {}
    _.each(displayTasks, (block, i) => {
      taskPositionRange[block.key] = [
        block.data.get("positionTop"),
        block.data.get("positionTop") + ((block.data.get("requiredTime") / 60) * Constants.heightPerHour)
      ]
    })
    let prTop, prBottom, tprTop, tprBottom
    _.each(PositionRange, (pr) => {
      let resizeWidthKeyList = []
      prTop = pr[0]
      prBottom = pr[1]
      _.map(taskPositionRange, (value, key) => {
        tprTop = value[0]
        tprBottom = value[1]
        if ((prTop > tprTop && prTop < tprBottom) || (prBottom > tprTop && prBottom < tprBottom)) {
          resizeWidthKeyList.push(key)
        }
      })
      if (resizeWidthKeyList.length >= 1) {
        _.each(resizeWidthKeyList, (key, i) => {
          this.resizeTaskWidth(key, 55/resizeWidthKeyList.length, i)
        })
      }
    })
  }

  resizeTaskWidth(taskKey, width, index) {
    let taskBlock
    this.props.taskList.document.nodes.map((block) => {
      if (block.key == taskKey) taskBlock = block
    })

    if (taskBlock.data.get("width", 0) == width) return

    let resizedBlock = Block.create({
      data: taskBlock.data.set("width", width).set("marginLeft", width * index),
      isVoid: taskBlock.isVoid,
      key: taskBlock.key,
      nodes: taskBlock.nodes,
      type: taskBlock.type
    })

    let transform = this.props.taskList.transform()
      .removeNodeByKey(taskKey)
      .insertNodeByKey(this.props.taskList.document.key, this.props.taskList.document.nodes.indexOf(taskBlock), resizedBlock)

    // apply.
    this.props.onUpdateTask(transform.apply())
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
    let dragBlockHeight = (Constants.heightPerHour * dragBlock.data.get("requiredTime", 60) / 60)
    let transform = this.props.taskList.transform()
    let targetEdge = operation == Operations.UP ? 9999999999999 : 0
    let dropPositionTop

    moveTargetList.forEach((target) => {
      let newPositionTop
      if (operation == Operations.UP) {
        newPositionTop = target.block.data.get("positionTop") + dragBlockHeight
        if (targetEdge > newPositionTop) {
          targetEdge = newPositionTop
          dropPositionTop = targetEdge - (Constants.heightPerHour * dragBlock.data.get("requiredTime") / 60)
        }
      }
      if (operation == Operations.DOWN) {
        newPositionTop = target.block.data.get("positionTop") - dragBlockHeight
        if (targetEdge < newPositionTop) {
          targetEdge = newPositionTop
          dropPositionTop = targetEdge + (Constants.heightPerHour * target.block.data.get("requiredTime") / 60)
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
  }

  isTodayTimeline(){
    return this.props.date == moment().format("YYYYMMDD")
  }

  scrollTop(){
    return findDOMNode(this.refs.timeline).scrollTop
  }

  // make task panel html.
  renderTasks(){
    let displayTasks = []
    let breaker = false
    this.props.taskList.document.nodes.map((block, i) => {
      if (block.type == "separator") breaker = true;
      if (breaker) return
      if (Constants.showInTimeline.indexOf(block.type) >= 0 && block.text != "") displayTasks.push(block)
    })
    displayTasks = _.sortBy(displayTasks, (task) => {
      return task.data.get("positionTop")
    })

    let taskComponents = []
    _.each(displayTasks, (block, i) => {
      taskComponents.push(
        <Task
          key={i}
          taskKey={block.key}
          block={block}
          nowMarkerTop={this.props.markerPositionTop}
          moveTask={this.moveTask.bind(this)}
          resizeTask={this.resizeTask.bind(this)}
          resizeTimelineWidth={this.resizeTimelineWidth.bind(this)}
          scrollTop={this.scrollTop.bind(this)}
        />
      )
    })
    return taskComponents.length > 0 ? taskComponents : null
  }

  render() {
    return (
      <div id="timeline-viewport" className="col-md-5 col-sm-6 hidden-xs" ref="timeline">
        <table>
          <tbody>
            <tr className="">
              <td className="tv-time">
                {_.map(_.range(0, 25), (t, i) => {
                  return <div key={i} className="time">{t + ":" + "00"}</div>
                })}
              </td>
              <td className="tv-task tv-marker">
                {_.map(_.range(1, 50), (m, i) => {
                  let style = (this.props.markerPositionTop > (i+1)*25) && this.isTodayTimeline() ? {backgroundColor: "rgba(250,250,250,0.7)"} : {}
                  return (
                    <Marker
                      key={i}
                      className={i % 2 == 0 ? "markercell marker-border" : "markercell"}
                      moveTask={this.moveTask.bind(this)}
                      resizeTask={this.resizeTask.bind(this)}
                      positionTop={i*25}
                      style={style}
                    />
                  );
                })}
                {this.renderTasks()}
                <div
                  className="nowmarker"
                  style={{
                    top: this.props.markerPositionTop.toString() + 'px',
                    display: this.isTodayTimeline() ? "inherit" : "none"
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
module.exports = DragDropContext(HTML5Backend)(TimelineViewport);
