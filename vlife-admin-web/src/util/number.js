import _ from 'lodash';
const NumberUtil = {};

// 是数值
NumberUtil.isNumber = value => {
  return _.isNumber(value) && !_.isNaN(value);
};

// 是数值字符串
NumberUtil.isNumberStr = value => {
  return value !== '' && NumberUtil.isNumber(+value);
};

// parseFloat
NumberUtil.parseFloat = (value, defaultValue) => {
  let result;
  if (value !== '' && typeof value !== 'undefined') {
    result = parseFloat(value);
  }
  if (_.isNaN(value)) {
    result = undefined;
  }
  return !_.isUndefined(result) ? result : defaultValue;
};
export default NumberUtil;
