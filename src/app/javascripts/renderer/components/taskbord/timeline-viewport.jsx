import React from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Task from './timeline-task'

const TimelineViewport = class TimelineViewport extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      taskList: this.props.taskList
    }
  }

  // add top data and callback main component.
  moveTask(key, top){
    this.props.callbackToTb(state)
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
