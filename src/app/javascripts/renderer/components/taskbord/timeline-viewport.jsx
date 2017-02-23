import React from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Task from './timeline-task'

const TimelineViewport = class TimelineViewport extends React.Component {

  // make task panel html.
  renderTasks(){
    let tasks = [];
    let top = 50
    this.props.taskList.document.nodes.map((block) => {
      if (block.text != "") {
        let height = 49 * block.data.get("requiredTime", 60) / 60
        let style = {
          top: top.toString() + 'px',
          height: height.toString() + 'px'
        };
        tasks.push(<Task block={block} style={style}/>)
        top = top + height + 1
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
