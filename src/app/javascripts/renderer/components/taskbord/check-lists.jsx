import { Editor, Raw } from 'slate'
import React from 'react'
import classNames from 'classnames'
import * as TaskEditorUtil from '../../../utils/task-editor'

/**
 * Check list item.
 *
 * @type {Component}
 */

const CheckListItem = class CheckListItem extends React.Component {

  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} e
   */

  onClickCheckListItem(e) {
    const { editor, node } = this.props
    const state = editor
      .getState()
      .transform()
      .setBlock({
        data: node.data.set('done', ! node.data.get('done') )
      })
      .apply()

    editor.onChange(state)
  }

  /**
   * get className for ul dom.
   * @param  {block} node
   * @param  {String} focusKey focused block key.
   * @return {String}
   */

  getClassNameForUl(node, focusKey) {
    return classNames(
      {
        'current-task': TaskEditorUtil.isCurrentTask(node),
        'current-line': TaskEditorUtil.isFocusedTask(node.key, focusKey),
      },
      'ace-line',
      'task-line'
    )
  }

  /**
   * get className for check list item.
   *
   * @param {Block} node
   * @return {String}
   */

  getClassNameForLi(node){
    return classNames(
      { done: node.data.get('done') },
      'indent' + node.data.get('indent')
    )
  }

  /**
   * Render a check list item.
   *
   * @return {Element}
   */

  render () {
    const { attributes, children, node, state} = this.props
    return (
      <ul
        className={ this.getClassNameForUl(node, state.focusKey) }
        onClick={this.onClickCheckListItem.bind(this)}
        {...attributes}
      >
        <li className={ this.getClassNameForLi(node) } >
          <div>
            {children}
          </div>
        </li>
      </ul>
    )
  }
}

module.exports = CheckListItem;
