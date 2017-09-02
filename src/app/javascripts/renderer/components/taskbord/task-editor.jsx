import React from 'react';
import { Editor, Raw, Data } from 'slate'
import moment from 'moment'
import { ipcRenderer } from 'electron'
import CheckListItem from './check-lists'
import * as Constants from '../constants'

const TaskEditor = class TaskEditor extends React.Component {

  /**
   * Get the schema.
   *
   * @return {Object} nodes
   */

  getSchema(){
    return {
      nodes: {
        'block-quote': props => <blockquote>{props.children}</blockquote>,
        'bulleted-list': props => <ul className="list-style-disc">{props.children}</ul>,
        'heading-one': props => <h1>{props.children}</h1>,
        'heading-two': props => <h2>{props.children}</h2>,
        'heading-three': props => <h3>{props.children}</h3>,
        'heading-four': props => <h4>{props.children}</h4>,
        'heading-five': props => <h5>{props.children}</h5>,
        'heading-six': props => <h6>{props.children}</h6>,
        'list-item': props => <li className={'indent' + props.node.data.get('indent')}>{props.children}</li>,
        'check-list-item': CheckListItem,
        'separator' : props => <div className="separator-line" contentEditable={false}><span className="separator"><span></span></span></div>
      }
    }
  }

  /**
   * Get the block type for a series of auto-markdown shortcut `chars`.
   *
   * @param {String} chars
   * @return {String} block
   */

  getType(chars){
    switch (true) {
      case /---/.test(chars): return 'separator'
      case /\*/.test(chars):
      case /-/.test(chars):
      case /\+/.test(chars): return 'list-item'
      case /\[\]/.test(chars): return 'check-list-item'
      case /\[X\]/.test(chars): return 'checked-list-item'
      case />/.test(chars): return 'block-quote'
      case /######/.test(chars): return 'heading-six'
      case /#####/.test(chars): return 'heading-five'
      case /####/.test(chars): return 'heading-four'
      case /###/.test(chars): return 'heading-three'
      case /##/.test(chars): return 'heading-two'
      case /#/.test(chars): return 'heading-one'
      default: return null
    }
  }

  /**
   *
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          className={"ace-line"}
          placeholder={"Time is an illusion..."}
          schema={this.getSchema()}
          state={this.props.taskList}
          onChange={this.onChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          ref='editor'
        />
      </div>
    )
  }

  // On change, update the app's React state with the new editor state.
  onChange(state){
    this.props.onUpdateTask(state);
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {Data} data
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown(e, data, state){
    switch (data.key) {
      case 'space': return this.onSpace(e, state)
      case 'backspace': return this.onBackspace(e, state)
      case 'enter': return this.onEnter(e, state)
      case 'tab': return this.onTab(e, data.isShift, state)
    }
  }

  /**
   * On space, if it was after an auto-markdown shortcut, convert the current
   * node into the shortcut's corresponding type.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onSpace(e, state) {
    if (state.isExpanded) return
    const { startBlock, startOffset } = state
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
    let type = this.getType(chars)

    if (!type) return
    if (type == 'list-item' && startBlock.type == 'list-item') return
    e.preventDefault()

    let time = 60
    if (type == 'check-list-item'){
      let inputTime = chars.match(/\d{1,3}/)
      if (inputTime !== null) time = Number(inputTime[0])
    }

    let data = Data.create({
      requiredTime: time,
      done: type == 'checked-list-item',
      indent: 1
    })

    if ( ! startBlock.data.has("positionTop")) {
      data = data.set("positionTop", this.props.nextTaskPositionTop)
    } else {
      data = data.set("positionTop", startBlock.data.get("positionTop"))
    }

    type = type == 'checked-list-item' ? 'check-list-item' : type
    let transform = state
      .transform()
      .setBlock(type)
      .setBlock({ data: data })

    if (type == 'list-item') transform.wrapBlock('bulleted-list')

    if (type == 'separator') {
      state =  transform
        .splitBlock()
        .setBlock('paragraph')
        .apply()
    } else {
      state = transform
        .extendToStartOf(startBlock)
        .delete()
        .apply()
    }
    return state
  }

  /**
   * On backspace, if at the start of a non-paragraph, convert it back into a
   * paragraph node.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onBackspace(e, state){
    if (state.isExpanded) return
    if (state.startOffset != 0) return
    const { startBlock } = state

    if (startBlock.type == 'paragraph') {
      let previousBlock = state.document.getPreviousBlock(state.startBlock)
      if (previousBlock !== null && previousBlock.type == 'separator') {
        let transform = state
          .transform()
          .removeNodeByKey(previousBlock.key)
        return transform.apply()
      }
      return
    }
    e.preventDefault()

    let transform = state
      .transform()
      .setBlock('paragraph')

    if (/list-item/.test(startBlock.type)) transform.unwrapBlock('bulleted-list')

    state = transform.apply()
    return state
  }

  /**
   * On return, if at the end of a node type that should not be extended,
   * create a new paragraph below it.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onEnter(e, state){
    if (state.isExpanded) return
    const { startBlock, startOffset, endOffset } = state
    if (startOffset == 0 && startBlock.length == 0) return this.onBackspace(e, state)
    if (endOffset != startBlock.length) return
    if (
      startBlock.type != 'heading-one' &&
      startBlock.type != 'heading-two' &&
      startBlock.type != 'heading-three' &&
      startBlock.type != 'heading-four' &&
      startBlock.type != 'heading-five' &&
      startBlock.type != 'heading-six' &&
      startBlock.type != 'block-quote' &&
      startBlock.type != 'list-item'
    ) {
      return
    }
    e.preventDefault()
    return state
      .transform()
      .splitBlock()
      .setBlock(startBlock.type)
      .setBlock({
        data: Data.create({
          positionTop: this.props.nextTaskPositionTop,
          requiredTime: startBlock.data.get("requiredTime"),
          done: false
        })
      })
      .apply()
  }

  /**
   * On tab, if block type is list-item,
   * create indented block.
   *
   * @param {Event} e
   * @param {Boolean} isSift
   * @param {State} state
   * @return {State or Null} state
   */

  onTab(e, isShift, state){
    e.preventDefault()
    let type = state.startBlock.type
    if (/list-item/.test(type)) {
      let indent = state.startBlock.data.get('indent')
      if (indent < 5 && ! isShift) indent++
      if (indent > 1 && isShift) indent--
      state = state
        .transform()
        .setBlock({
          data: state.startBlock.data.set('indent', indent)
        })
        .apply()
    }

    return state
  }

  componentDidMount() {
    this.props.onUpdateTask(this.props.focusLastBlock())
  }
}

module.exports = TaskEditor;
