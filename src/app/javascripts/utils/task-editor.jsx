import * as Constants from '../renderer/components/constants'

/**
 * get next Indent for list item or check list item.
 *
 * @param  {Number}  prevIndent prev Indent
 * @param  {Boolean} isShift    with shift or not
 * @return {Number}             next Indent
 */

export const getIndent = (prevIndent, isShift) => {
  let nextIndent = prevIndent || Constants.minIndent
  if (prevIndent < Constants.maxIndent && ! isShift) nextIndent++
  if (prevIndent > Constants.minIndent && isShift) nextIndent--
  return nextIndent
}

 /**
  * check whether current task or not.
  *
  * @param  {Block}  node
  * @return {Boolean}
  */

export const isCurrentTask = (node) => {
  const top = node.data.get("positionTop")
  const buttom = top + (Constants.heightPerHour * node.data.get("requiredTime") / 60)
  const markerPositionTop = Constants.markerPositionTop()
  return markerPositionTop >= top && markerPositionTop <= buttom
}
