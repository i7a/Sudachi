import { Editor, Raw } from 'slate'
import React from 'react'
import classNames from 'classnames'

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
   * get className for check list item.
   *
   * @param {node} node
   * @return {String}
   */

  getClassName(node){
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
        className="ace-line task-line"
        onClick={this.onClickCheckListItem.bind(this)}
        {...attributes}
      >
        <li className={ this.getClassName(node) } >
          <div>
            {children}
          </div>
        </li>
      </ul>
    )
  }
}

module.exports = CheckListItem;
