import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import _ from 'lodash';

class Header extends React.Component {
  render() {
    return (
      <header>
        <button className="btn btn-primary btn-google">Google Login</button>
      </header>
    );
  }
}

class TaskBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {taskList: []};
  }

  setClickEventForListObject() {
    let listObject = document.getElementsByClassName("public-DraftStyleDefault-unorderedListItem");
    let taskList = this.state.taskList;
    let _this = this;
    _.each(listObject, (lo, i) => {
      lo.addEventListener('click', function(){
        let offsetKey = this.dataset.offsetKey.substring(0, 5);
        _.each(taskList, (tl, i) => {
          console.log(tl);
          if (offsetKey == taskList[i].key) {
            taskList[i].done = !(taskList[i].done);
          }
        });
        this.classList.toggle('done');
        _this.setState({taskList: taskList});
      }, false);
    });
  }

  onUpdateTask(contentState) {
    let blockMap = contentState.getBlockMap();
    this.state.taskList = [];
    blockMap.map((bm) => {
      console.log(bm);
      this.state.taskList.push({
        key: bm.getKey(),
        description: bm.getText(),
        done: false
      });
    });
    let taskList = this.state.taskList;
    this.setState({taskList: taskList});
    this.setClickEventForListObject()
  }

  render() {
    return (
      <div id="task-board" className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <CalendarViewport></CalendarViewport>
            <TaskViewport callbackToTb={this.onUpdateTask.bind(this)}></TaskViewport>
            <TimelineViewport taskList={this.state.taskList}></TimelineViewport>
          </div>
        </div>
      </div>
    );
  }
}

class CalendarViewport extends React.Component {
  render() {
    return (
      <div id="calendar-viewport" className="col-md-2 hidden-sm hidden-xs"></div>
    );
  }
}

class TaskViewport extends React.Component {
  render() {
    return (
      <div id="task-viewport" className="col-md-5 col-sm-6">
        <div className="ace-line"><span>20161018</span></div>
        <TaskEditor callbackToTv={this.props.callbackToTb}></TaskEditor>
      </div>
    );
  }
}

class TaskEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: RichUtils.toggleBlockType(EditorState.createEmpty(), 'unordered-list-item')
    };
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  onChange(editorState) {
    this.setState({editorState});
    this.props.callbackToTv(editorState.getCurrentContent());
  }

  render() {
    const {editorState} = this.state;
    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange.bind(this)}
        ref="editor"
      />
    )
  }
}

class TimelineViewport extends React.Component {
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

class TvTask extends React.Component {
  render() {
    let index = 1;
    let tasks = [];

    let tasksList = this.props.taskList
    if (tasksList) {
      for(let index in tasksList) {
        if(tasksList[index].description != "") {
          let style = {top: (50*(parseInt(index) + 1)).toString() + 'px'};
          tasks.push(<div key={index} className={tasksList[index].done ? "task done" : "task"} style={style}><span>{tasksList[index].description}</span></div>);
        }
      }
    }

    if (tasks) {
      return (
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

class Footer extends React.Component {
  render() {
    return (
      <footer></footer>
    );
  }
}

module.exports = class MainContent extends React.Component {
  componentDidMount() {

  }
  render() {
    return(
      <div className="window">
        <div id="window-content" className="window-content">
          <Header></Header>
          <TaskBoard></TaskBoard>
          <Footer></Footer>
        </div>
      </div>
    );
  }
};
