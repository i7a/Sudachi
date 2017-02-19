import React from 'react';
import _ from 'lodash';
import TvTask from './timeline-task'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

const TimelineViewport = class TimelineViewport extends React.Component {
  render() {
    return (
      <div id="timeline-viewport" className="col-md-5 col-sm-6 hidden-xs">
        <table>
          <tbody>
            <tr height="1">
              <td className="tv-time"></td>
              <TvMarker></TvMarker>
            </tr>
            <tr className="">
              <TvTime></TvTime>
              <TvTask taskList={this.props.taskList}></TvTask>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class TvMarker extends React.Component {
  render() {
    return (
      <td className="tv-marker">
        {_.map(_.range(1, 14), (m, i) => {
          return <div key={i} className="markercell"></div>;
        })}
      </td>
    );
  }
}

class TvTime extends React.Component {
  render() {
    return (
      <td className="tv-time">
        {_.map(_.range(8, 21), (t, i) => {
          return <div key={i} className="time">{t + ":" + "00"}</div>
        })}
      </td>
    );
  }
}

module.exports = DragDropContext(HTML5Backend)(TimelineViewport);
