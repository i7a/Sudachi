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

  getClassNameForUl(node) {
    return classNames(
      { now: TaskEditorUtil.isCurrentTask(node) },
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
    const { attributes, children, node} = this.props
    return (
      <ul
        className={ this.getClassNameForUl(node) }
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
