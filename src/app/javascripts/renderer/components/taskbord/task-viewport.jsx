import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';

const TaskViewport = class TaskViewport extends React.Component {
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

module.exports = TaskViewport;
