import _ from 'lodash';

interface NumberUtil {
  isNumber(value: any): boolean;
  isNumberStr(value: any): boolean;
  parseFloat(value: any, defaultValue: any): number | undefined;
  formatterMoney:() => Intl.NumberFormat;
  formatter: () =>Intl.NumberFormat;
  formatter1: Intl.NumberFormat;

}

const NumberUtil: NumberUtil = {
  isNumber(value: any) {
    return _.isNumber(value) && !_.isNaN(value);
  },
  isNumberStr(value: any) {
    return value !== '' && this.isNumber(+value);
  },
  parseFloat(value: any, defaultValue: any) {
    let result;
    if (value !== '' && typeof value !== 'undefined') {
      result = parseFloat(value);
    }
    if (_.isNaN(value)) {
      result = undefined;
    }
    return !_.isUndefined(result) ? result : defaultValue;
  },
  formatterMoney:() => new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }),
  formatter: () => new Intl.NumberFormat(),
  formatter1: new Intl.NumberFormat()
};

export default NumberUtil;
