import * as Constants from '../renderer/components/constants';

/**
 * caliculated time from position top
 * @param  {Number} positionTop
 * @return {String} hh:mm
 */
export const positionTopToTime = (positionTop) => {
  const heightForMin = positionTop % Constants.heightPerHour
  const hour = (positionTop - heightForMin) / Constants.heightPerHour
  const min = (heightForMin / Constants.heightPerHour) * 60
  return hour.toString() + ':' + ('00' + min.toString()).slice(-2)
}
